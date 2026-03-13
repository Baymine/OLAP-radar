/**
 * olap-radar: daily digest for OLAP storage engines and data infrastructure.
 *
 * Env vars:
 *   LLM_PROVIDER        - "anthropic" | "openai" | "github-copilot" | "openrouter" (default: anthropic)
 *   GITHUB_TOKEN        - GitHub token for API access and issue creation
 *   DIGEST_REPO         - owner/repo where digest issues are posted (optional)
 *
 * Provider-specific env vars — see src/providers/ for full list.
 */

import { type RepoFetch, fetchRecentItems, fetchRecentReleases, createGitHubIssue } from "./github.ts";
import {
  type RepoDigest,
  buildIndexPrompt,
  buildPeerPrompt,
  buildComparisonPrompt,
  buildPeersComparisonPrompt,
  buildWebReportPrompt,
  buildTrendingPrompt,
  buildHnPrompt,
  buildArxivPrompt,
} from "./prompts.ts";
import { callLlm, saveFile, autoGenFooter, LLM_TOKENS_WEB, LLM_TOKENS_TRENDING } from "./report.ts";
import { buildIndexReportContent, buildPrimaryEngineReportContent } from "./report-builders.ts";
import { loadWebState, saveWebState, type WebFetchResult, type WebState } from "./web.ts";
import { fetchTrendingData, type TrendingData } from "./trending.ts";
import { fetchHnData, type HnData } from "./hn.ts";
import { fetchArxivData, type ArxivData } from "./arxiv.ts";
import { loadConfig } from "./config.ts";
import { toCstDateStr, toUtcStr } from "./date.ts";

// ---------------------------------------------------------------------------
// Repo config — loaded from config.yml, falls back to built-in defaults
// ---------------------------------------------------------------------------

const { indexRepos: INDEX_REPOS, primaryRepo: PRIMARY_REPO, peerRepos: PEER_REPOS } = loadConfig();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// ---------------------------------------------------------------------------
// Phase 1: Fetch
// ---------------------------------------------------------------------------

async function fetchAllData(
  since: Date,
  webState: WebState,
): Promise<{
  fetched: RepoFetch[];
  webResults: WebFetchResult[];
  trendingData: TrendingData;
  hnData: HnData;
  arxivData: ArxivData;
}> {
  const allConfigs = [...INDEX_REPOS, PRIMARY_REPO, ...PEER_REPOS];
  console.log(`  Tracking: ${allConfigs.map((r) => r.id).join(", ")}, hn, arxiv`);

  const [fetched, trendingData, hnData, arxivData] = await Promise.all([
    Promise.all(
      allConfigs.map(async (cfg) => {
        const [issuesRaw, prs, releases] = await Promise.all([
          fetchRecentItems(cfg, "issues", since),
          fetchRecentItems(cfg, "pulls", since),
          fetchRecentReleases(cfg.repo, since),
        ]);
        const issues = issuesRaw.filter((i) => !i.pull_request);
        console.log(
          `  [${cfg.id}] issues: ${issues.length}, prs: ${prs.length}, releases: ${releases.length}`,
        );
        return { cfg, issues, prs, releases };
      }),
    ),
    fetchTrendingData().catch(
      (): TrendingData => ({
        trendingRepos: [],
        searchRepos: [],
        trendingFetchSuccess: false,
      }),
    ),
    fetchHnData().catch((): HnData => ({ stories: [], fetchSuccess: false })),
    fetchArxivData().catch((): ArxivData => ({ papers: [], fetchSuccess: false, query: "" })),
  ]);

  void webState;

  return { fetched, webResults: [], trendingData, hnData, arxivData };
}

// ---------------------------------------------------------------------------
// Phase 2: LLM summaries
// ---------------------------------------------------------------------------

/** Call LLM with logging and error fallback. */
async function summarize(id: string, prompt: string, failMsg: string, maxTokens?: number): Promise<string> {
  console.log(`  [${id}] Calling LLM for summary...`);
  try {
    return await callLlm(prompt, maxTokens);
  } catch (err) {
    console.error(`  [${id}] LLM call failed: ${err}`);
    return failMsg;
  }
}

/** Summarize a repo's activity, returning a RepoDigest. Skips LLM if no data. */
async function summarizeRepo(
  { cfg, issues, prs, releases }: RepoFetch,
  prompt: string,
  noActivityMsg: string,
  failMsg: string,
): Promise<RepoDigest> {
  if (!issues.length && !prs.length && !releases.length) {
    console.log(`  [${cfg.id}] No activity, skipping LLM call`);
    return { config: cfg, issues, prs, releases, summary: noActivityMsg };
  }
  const summary = await summarize(cfg.id, prompt, failMsg);
  return { config: cfg, issues, prs, releases, summary };
}

async function generateSummaries(
  fetchedIndex: RepoFetch[],
  fetchedPrimary: RepoFetch,
  fetchedPeers: RepoFetch[],
  trendingData: TrendingData,
  dateStr: string,
  lang: "zh" | "en" = "zh",
): Promise<{
  indexDigests: RepoDigest[];
  primarySummary: string;
  peerDigests: RepoDigest[];
  trendingSummary: string;
}> {
  const noActivity = lang === "en" ? "No activity in the last 24 hours." : "过去24小时无活动。";
  const fail = lang === "en" ? "⚠️ Summary generation failed." : "⚠️ 摘要生成失败。";

  const [indexDigests, primarySummary, peerDigests, trendingSummary] = await Promise.all([
    Promise.all(
      fetchedIndex.map((f) =>
        summarizeRepo(
          f,
          buildIndexPrompt(f.cfg, f.issues, f.prs, f.releases, dateStr, lang),
          noActivity,
          fail,
        ),
      ),
    ),
    summarizeRepo(
      fetchedPrimary,
      buildPeerPrompt(
        fetchedPrimary.cfg,
        fetchedPrimary.issues,
        fetchedPrimary.prs,
        fetchedPrimary.releases,
        dateStr,
        50,
        30,
        lang,
      ),
      noActivity,
      fail,
    ).then((d) => d.summary),
    Promise.all(
      fetchedPeers.map((f) =>
        summarizeRepo(
          f,
          buildPeerPrompt(f.cfg, f.issues, f.prs, f.releases, dateStr, undefined, undefined, lang),
          noActivity,
          fail,
        ),
      ),
    ),
    (async () => {
      const hasData = trendingData.trendingRepos.length > 0 || trendingData.searchRepos.length > 0;
      if (!hasData) {
        return lang === "en"
          ? "⚠️ Trending data unavailable, unable to generate report."
          : "⚠️ 今日趋势数据获取失败，无法生成报告。";
      }
      return summarize(
        "trending",
        buildTrendingPrompt(trendingData, dateStr, lang),
        lang === "en" ? "⚠️ Trending report generation failed." : "⚠️ 趋势报告生成失败。",
        LLM_TOKENS_TRENDING,
      );
    })(),
  ]);

  return { indexDigests, primarySummary, peerDigests, trendingSummary };
}

// ---------------------------------------------------------------------------
// Report savers (LLM call + file save + optional GitHub issue)
// ---------------------------------------------------------------------------

async function saveWebReport(
  webResults: WebFetchResult[],
  webState: WebState,
  utcStr: string,
  dateStr: string,
  digestRepo: string,
  footer: string,
  lang: "zh" | "en" = "zh",
): Promise<void> {
  if (webResults.length === 0) {
    console.log(`  [web/${lang}] No OLAP official web sources configured, skipping report.`);
    return;
  }

  const hasNewContent = webResults.some((r) => r.newItems.length > 0);

  if (hasNewContent) {
    console.log(`  [web/${lang}] Calling LLM for web content report...`);
    try {
      const webSummary = await callLlm(buildWebReportPrompt(webResults, dateStr, lang), LLM_TOKENS_WEB);
      const isFirstRun = webResults.some((r) => r.isFirstRun);
      const totalNew = webResults.reduce((sum, r) => sum + r.newItems.length, 0);

      const fileName = lang === "en" ? "olap-web-en.md" : "olap-web.md";

      const t =
        lang === "en"
          ? {
              title: `# OLAP Official Content Report ${dateStr}\n\n`,
              meta: `> ${isFirstRun ? "First full crawl" : "Today's update"} | New content: ${totalNew} articles | Generated: ${utcStr} UTC\n\n`,
            }
          : {
              title: `# OLAP 官方内容追踪报告 ${dateStr}\n\n`,
              meta: `> ${isFirstRun ? "首次全量" : "今日更新"} | 新增内容: ${totalNew} 篇 | 生成时间: ${utcStr} UTC\n\n`,
            };

      const webContent = t.title + t.meta + `---\n\n` + webSummary + footer;

      console.log(`  Saved ${saveFile(webContent, dateStr, fileName)}`);

      if (digestRepo) {
        const webTitle =
          lang === "en"
            ? `🌐 OLAP Official Content Report ${dateStr}${isFirstRun ? " (First Crawl)" : ""}`
            : `🌐 OLAP 官方内容追踪报告 ${dateStr}${isFirstRun ? "（首次全量）" : ""}`;
        const webLabel = lang === "en" ? "web-en" : "web";
        const webUrl = await createGitHubIssue(webTitle, webContent, webLabel);
        console.log(`  Created web issue (${lang}): ${webUrl}`);
      }
    } catch (err) {
      console.error(`  [web/${lang}] Report generation failed: ${err}`);
    }
  } else {
    console.log(`  [web/${lang}] No new content detected, skipping report.`);
  }

  if (lang === "zh") {
    saveWebState(webState);
    console.log("  [web] State saved.");
  }
}

async function saveTrendingReport(
  trendingData: TrendingData,
  trendingSummary: string,
  utcStr: string,
  dateStr: string,
  digestRepo: string,
  footer: string,
  lang: "zh" | "en" = "zh",
): Promise<void> {
  const hasData = trendingData.trendingRepos.length > 0 || trendingData.searchRepos.length > 0;
  if (!hasData) {
    console.log(`  [trending/${lang}] No data available, skipping report.`);
    return;
  }

  const fileName = lang === "en" ? "olap-trending-en.md" : "olap-trending.md";
  const header =
    lang === "en"
      ? `# OLAP & Data Infra Open Source Trends ${dateStr}\n\n> Sources: GitHub Trending + GitHub Search API | Generated: ${utcStr} UTC\n\n---\n\n`
      : `# OLAP & 数据基础设施开源趋势日报 ${dateStr}\n\n> 数据来源: GitHub Trending + GitHub Search API | 生成时间: ${utcStr} UTC\n\n---\n\n`;

  const trendingContent = header + trendingSummary + footer;

  console.log(`  Saved ${saveFile(trendingContent, dateStr, fileName)}`);

  if (digestRepo) {
    const trendingTitle =
      lang === "en"
        ? `📈 OLAP & Data Infra Open Source Trends ${dateStr}`
        : `📈 OLAP & 数据基础设施开源趋势日报 ${dateStr}`;
    const trendingLabel = lang === "en" ? "trending-en" : "trending";
    const trendingUrl = await createGitHubIssue(trendingTitle, trendingContent, trendingLabel);
    console.log(`  Created trending issue (${lang}): ${trendingUrl}`);
  }
}

async function saveHnReport(
  hnData: HnData,
  utcStr: string,
  dateStr: string,
  digestRepo: string,
  footer: string,
  lang: "zh" | "en" = "zh",
): Promise<void> {
  if (!hnData.fetchSuccess) {
    console.log(`  [hn/${lang}] No data available, skipping report.`);
    return;
  }

  console.log(`  [hn/${lang}] Calling LLM for HN report...`);
  try {
    const hnSummary = await callLlm(buildHnPrompt(hnData, dateStr, lang));
    const fileName = lang === "en" ? "olap-hn-en.md" : "olap-hn.md";
    const header =
      lang === "en"
        ? `# Hacker News Data Infrastructure Community Digest ${dateStr}\n\n` +
          `> Source: [Hacker News](https://news.ycombinator.com/) | ` +
          `${hnData.stories.length} stories | Generated: ${utcStr} UTC\n\n` +
          `---\n\n`
        : `# Hacker News 数据基础设施社区动态日报 ${dateStr}\n\n` +
          `> 数据来源: [Hacker News](https://news.ycombinator.com/) | ` +
          `共 ${hnData.stories.length} 条 | 生成时间: ${utcStr} UTC\n\n` +
          `---\n\n`;

    const hnContent = header + hnSummary + footer;

    console.log(`  Saved ${saveFile(hnContent, dateStr, fileName)}`);

    if (digestRepo) {
      const hnTitle =
        lang === "en"
          ? `📰 Hacker News Data Infra Digest ${dateStr}`
          : `📰 Hacker News 数据基础设施社区动态日报 ${dateStr}`;
      const hnLabel = lang === "en" ? "hn-en" : "hn";
      const hnUrl = await createGitHubIssue(hnTitle, hnContent, hnLabel);
      console.log(`  Created HN issue (${lang}): ${hnUrl}`);
    }
  } catch (err) {
    console.error(`  [hn/${lang}] Report generation failed: ${err}`);
  }
}

async function saveArxivReport(
  arxivData: ArxivData,
  utcStr: string,
  dateStr: string,
  digestRepo: string,
  footer: string,
  lang: "zh" | "en" = "zh",
): Promise<void> {
  if (!arxivData.fetchSuccess) {
    console.log(`  [arxiv/${lang}] No data available, skipping report.`);
    return;
  }

  console.log(`  [arxiv/${lang}] Calling LLM for arXiv report...`);
  try {
    const arxivSummary = await callLlm(buildArxivPrompt(arxivData, dateStr, lang));
    const fileName = lang === "en" ? "olap-arxiv-en.md" : "olap-arxiv.md";
    const header =
      lang === "en"
        ? `# OLAP Daily Top Paper from arXiv ${dateStr}\n\n` +
          `> Source: [arXiv](https://arxiv.org/) | ${arxivData.papers.length} candidate papers | Generated: ${utcStr} UTC\n\n` +
          `---\n\n`
        : `# OLAP 每日论文精选（arXiv） ${dateStr}\n\n` +
          `> 数据来源: [arXiv](https://arxiv.org/) | 共 ${arxivData.papers.length} 篇候选论文 | 生成时间: ${utcStr} UTC\n\n` +
          `---\n\n`;

    const arxivContent = header + arxivSummary + footer;

    console.log(`  Saved ${saveFile(arxivContent, dateStr, fileName)}`);

    if (digestRepo) {
      const arxivTitle =
        lang === "en"
          ? `📚 OLAP Daily Top Paper from arXiv ${dateStr}`
          : `📚 OLAP 每日论文精选（arXiv） ${dateStr}`;
      const arxivLabel = lang === "en" ? "arxiv-en" : "arxiv";
      const arxivUrl = await createGitHubIssue(arxivTitle, arxivContent, arxivLabel);
      console.log(`  Created arXiv issue (${lang}): ${arxivUrl}`);
    }
  } catch (err) {
    console.error(`  [arxiv/${lang}] Report generation failed: ${err}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  requireEnv("GITHUB_TOKEN");

  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dateStr = toCstDateStr(now);
  const utcStr = toUtcStr(now);
  const digestRepo = process.env["DIGEST_REPO"] ?? "";

  const providerName = process.env["LLM_PROVIDER"] ?? "anthropic";
  console.log(`[${now.toISOString()}] Starting OLAP digest | provider: ${providerName}`);
  console.log(
    `  Primary engine: ${PRIMARY_REPO.name} | Peers: ${PEER_REPOS.length} | Index: ${INDEX_REPOS.length}`,
  );

  // 1. Fetch all data in parallel
  const webState = loadWebState();
  const { fetched, webResults, trendingData, hnData, arxivData } = await fetchAllData(since, webState);

  const peerIds = new Set(PEER_REPOS.map((p) => p.id));
  const fetchedIndex = fetched.filter((f) => f.cfg.id !== PRIMARY_REPO.id && !peerIds.has(f.cfg.id));
  const fetchedPrimary = fetched.find((f) => f.cfg.id === PRIMARY_REPO.id)!;
  const fetchedPeers = fetched.filter((f) => peerIds.has(f.cfg.id));

  // 2. Generate per-repo LLM summaries in parallel (zh + en simultaneously)
  console.log("  Generating summaries in ZH and EN in parallel...");
  const [zhSummaries, enSummaries] = await Promise.all([
    generateSummaries(fetchedIndex, fetchedPrimary, fetchedPeers, trendingData, dateStr, "zh"),
    generateSummaries(fetchedIndex, fetchedPrimary, fetchedPeers, trendingData, dateStr, "en"),
  ]);

  // 3. Generate cross-repo comparisons in parallel (zh + en)
  console.log("  Calling LLM for comparative analyses (ZH + EN)...");
  const primaryDigest: RepoDigest = {
    config: PRIMARY_REPO,
    issues: fetchedPrimary.issues,
    prs: fetchedPrimary.prs,
    releases: fetchedPrimary.releases,
    summary: zhSummaries.primarySummary,
  };
  const enPrimaryDigest: RepoDigest = {
    config: PRIMARY_REPO,
    issues: fetchedPrimary.issues,
    prs: fetchedPrimary.prs,
    releases: fetchedPrimary.releases,
    summary: enSummaries.primarySummary,
  };
  const [comparison, peersComparison, enComparison, enPeersComparison] = await Promise.all([
    callLlm(buildComparisonPrompt(zhSummaries.indexDigests, dateStr, "zh")),
    callLlm(buildPeersComparisonPrompt(primaryDigest, zhSummaries.peerDigests, dateStr, "zh")),
    callLlm(buildComparisonPrompt(enSummaries.indexDigests, dateStr, "en")),
    callLlm(buildPeersComparisonPrompt(enPrimaryDigest, enSummaries.peerDigests, dateStr, "en")),
  ]);

  const footer = autoGenFooter("zh");
  const enFooter = autoGenFooter("en");

  // 4. Build + save all reports
  const indexContent = buildIndexReportContent(
    zhSummaries.indexDigests,
    comparison,
    utcStr,
    dateStr,
    footer,
    "zh",
  );
  const primaryContent = buildPrimaryEngineReportContent(
    fetchedPrimary,
    zhSummaries.peerDigests,
    zhSummaries.primarySummary,
    peersComparison,
    utcStr,
    dateStr,
    footer,
    PRIMARY_REPO,
    PEER_REPOS,
    "zh",
  );
  const enIndexContent = buildIndexReportContent(
    enSummaries.indexDigests,
    enComparison,
    utcStr,
    dateStr,
    enFooter,
    "en",
  );
  const enPrimaryContent = buildPrimaryEngineReportContent(
    fetchedPrimary,
    enSummaries.peerDigests,
    enSummaries.primarySummary,
    enPeersComparison,
    utcStr,
    dateStr,
    enFooter,
    PRIMARY_REPO,
    PEER_REPOS,
    "en",
  );

  console.log(`  Saved ${saveFile(indexContent, dateStr, "olap-index.md")}`);
  console.log(`  Saved ${saveFile(primaryContent, dateStr, "olap-engines.md")}`);
  console.log(`  Saved ${saveFile(enIndexContent, dateStr, "olap-index-en.md")}`);
  console.log(`  Saved ${saveFile(enPrimaryContent, dateStr, "olap-engines-en.md")}`);

  // Web report: zh saves state, en skips state save
  await saveWebReport(webResults, webState, utcStr, dateStr, digestRepo, footer, "zh");
  await saveWebReport(webResults, webState, utcStr, dateStr, digestRepo, enFooter, "en");

  await Promise.all([
    saveTrendingReport(trendingData, zhSummaries.trendingSummary, utcStr, dateStr, digestRepo, footer, "zh"),
    saveTrendingReport(
      trendingData,
      enSummaries.trendingSummary,
      utcStr,
      dateStr,
      digestRepo,
      enFooter,
      "en",
    ),
    saveHnReport(hnData, utcStr, dateStr, digestRepo, footer, "zh"),
    saveHnReport(hnData, utcStr, dateStr, digestRepo, enFooter, "en"),
    saveArxivReport(arxivData, utcStr, dateStr, digestRepo, footer, "zh"),
    saveArxivReport(arxivData, utcStr, dateStr, digestRepo, enFooter, "en"),
  ]);

  // 5. Create GitHub issues for index + primary engine reports (zh + en)
  if (digestRepo) {
    const indexUrl = await createGitHubIssue(`📊 OLAP 生态索引日报 ${dateStr}`, indexContent, "digest");
    console.log(`  Created index issue (zh): ${indexUrl}`);

    const indexEnUrl = await createGitHubIssue(
      `📊 OLAP Ecosystem Index Digest ${dateStr}`,
      enIndexContent,
      "digest-en",
    );
    console.log(`  Created index issue (en): ${indexEnUrl}`);

    const primaryUrl = await createGitHubIssue(
      `🗄️ ${PRIMARY_REPO.name} 生态日报 ${dateStr}`,
      primaryContent,
      "primary-engine",
    );
    console.log(`  Created primary engine issue (zh): ${primaryUrl}`);

    const primaryEnUrl = await createGitHubIssue(
      `🗄️ ${PRIMARY_REPO.name} Ecosystem Digest ${dateStr}`,
      enPrimaryContent,
      "primary-engine-en",
    );
    console.log(`  Created primary engine issue (en): ${primaryEnUrl}`);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
