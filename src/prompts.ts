/**
 * LLM prompt builders and item formatting.
 * Domain: OLAP & advanced analytical storage engines.
 */

import type { RepoConfig, GitHubItem, GitHubRelease } from "./github.ts";
import type { WebFetchResult } from "./web.ts";
import type { TrendingData } from "./trending.ts";
import type { HnData } from "./hn.ts";
import type { ArxivData } from "./arxiv.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RepoDigest {
  config: RepoConfig;
  issues: GitHubItem[];
  prs: GitHubItem[];
  releases: GitHubRelease[];
  summary: string;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatItem(item: GitHubItem, lang: "zh" | "en" = "zh"): string {
  const labels = item.labels.map((l) => l.name).join(", ");
  const labelStr = labels ? ` [${labels}]` : "";
  const body = (item.body ?? "").replace(/\n/g, " ").trim().slice(0, 300);
  const ellipsis = (item.body ?? "").length > 300 ? "..." : "";
  const t =
    lang === "en"
      ? {
          author: "Author",
          created: "Created",
          updated: "Updated",
          comments: "Comments",
          url: "URL",
          summary: "Summary",
        }
      : { author: "作者", created: "创建", updated: "更新", comments: "评论", url: "链接", summary: "摘要" };
  // Extract "owner/repo" from html_url to avoid full GitHub URLs that trigger cross-references
  const repoSlug = item.html_url.replace(/^https:\/\/github\.com\//, "").replace(/\/(issues|pull)\/\d+$/, "");
  const itemKind = item.html_url.includes("/pull/") ? "PR" : "Issue";
  const refStr = `${repoSlug} ${itemKind} #${item.number}`;
  return [
    `#${item.number} [${item.state.toUpperCase()}]${labelStr} ${item.title}`,
    `  ${t.author}: @${item.user.login} | ${t.created}: ${item.created_at.slice(0, 10)} | ${t.updated}: ${item.updated_at.slice(0, 10)} | ${t.comments}: ${item.comments} | 👍: ${item.reactions?.["+1"] ?? 0}`,
    `  ${t.url}: ${refStr}`,
    `  ${t.summary}: ${body}${ellipsis}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Sampling helpers (shared)
// ---------------------------------------------------------------------------

const INDEX_ISSUE_LIMIT = 30;
const INDEX_PR_LIMIT = 20;

/** Sort by comment count desc, take top N. */
export function topN(items: GitHubItem[], n: number): GitHubItem[] {
  return [...items].sort((a, b) => b.comments - a.comments).slice(0, n);
}

export function sampleNote(total: number, sampled: number, lang: "zh" | "en" = "zh"): string {
  if (lang === "en") {
    return total > sampled
      ? `(Total: ${total} items; showing top ${sampled} by comment count)`
      : `(Total: ${total} items)`;
  }
  return total > sampled ? `（共 ${total} 条，以下展示评论数最多的 ${sampled} 条）` : `（共 ${total} 条）`;
}

// ---------------------------------------------------------------------------
// Index repo prompt (broad OLAP ecosystem pulse: dbt, Spark, Substrait…)
// ---------------------------------------------------------------------------

export function buildIndexPrompt(
  cfg: RepoConfig,
  issues: GitHubItem[],
  prs: GitHubItem[],
  releases: GitHubRelease[],
  dateStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const sampledIssues = topN(issues, INDEX_ISSUE_LIMIT);
  const sampledPrs = topN(prs, INDEX_PR_LIMIT);

  const issuesText =
    sampledIssues.map((i) => formatItem(i, lang)).join("\n") || (lang === "en" ? "None" : "无");
  const prsText = sampledPrs.map((p) => formatItem(p, lang)).join("\n") || (lang === "en" ? "None" : "无");
  const releasesText = releases.length
    ? releases.map((r) => `- ${r.tag_name}: ${r.name}\n  ${(r.body ?? "").slice(0, 300)}`).join("\n")
    : lang === "en"
      ? "None"
      : "无";

  const issueNote = sampleNote(issues.length, sampledIssues.length, lang);
  const prNote = sampleNote(prs.length, sampledPrs.length, lang);

  if (lang === "en") {
    return `You are a technical analyst focused on the OLAP and data infrastructure ecosystem. Based on the following GitHub data, generate the ${cfg.name} community digest for ${dateStr}.

# Data source: github.com/${cfg.repo}

## Latest Releases (last 24h)
${releasesText}

## Latest Issues (updated in last 24h)${issueNote}
${issuesText}

## Latest Pull Requests (updated in last 24h)${prNote}
${prsText}

---

Generate a structured English digest with the following sections:

1. **Today's Highlights** - 2-3 sentences summarizing the most important updates
2. **Releases** - If new versions exist, summarize changes; omit if none
3. **Hot Issues** - Pick 10 noteworthy Issues, explain why they matter and community reaction
4. **Key PR Progress** - Pick 10 important PRs, describe features or fixes
5. **Feature Request Trends** - Distill the most-requested feature directions from all Issues
6. **Developer Pain Points** - Summarize recurring developer frustrations or high-frequency requests

Style: concise and professional, suited for data engineers and database developers. Include GitHub links for each item.
`;
  }

  return `你是一位专注于 OLAP 与数据基础设施生态的技术分析师。请根据以下 GitHub 数据，生成 ${dateStr} 的 ${cfg.name} 社区动态日报。

# 数据来源: github.com/${cfg.repo}

## 最新 Releases（过去24小时）
${releasesText}

## 最新 Issues（过去24小时内更新）${issueNote}
${issuesText}

## 最新 Pull Requests（过去24小时内更新）${prNote}
${prsText}

---

请生成一份结构清晰的中文日报，包含以下部分：

1. **今日速览** - 用2-3句话概括今天最重要的动态
2. **版本发布** - 如有新版本，总结更新内容；无则省略
3. **社区热点 Issues** - 挑选 10 个最值得关注的 Issue，说明为什么重要、社区反应如何
4. **重要 PR 进展** - 挑选 10 个重要的 PR，说明功能或修复内容
5. **功能需求趋势** - 从所有 Issues 中提炼出社区最关注的功能方向（如查询优化、存储格式、兼容性等）
6. **开发者关注点** - 总结开发者反馈中的痛点或高频需求

语言要求：简洁专业，适合数据工程师和数据库开发者阅读。每个条目附上 GitHub 链接。
`;
}

// ---------------------------------------------------------------------------
// Peer / Primary engine prompt (ClickHouse, DuckDB, StarRocks, Doris…)
// ---------------------------------------------------------------------------

const PEER_ISSUE_LIMIT = 30;
const PEER_PR_LIMIT = 20;

export function buildPeerPrompt(
  cfg: RepoConfig,
  issues: GitHubItem[],
  prs: GitHubItem[],
  releases: GitHubRelease[],
  dateStr: string,
  issueLimit = PEER_ISSUE_LIMIT,
  prLimit = PEER_PR_LIMIT,
  lang: "zh" | "en" = "zh",
): string {
  const totalIssues = issues.length;
  const totalPrs = prs.length;

  const sampledIssues = topN(issues, issueLimit);
  const sampledPrs = topN(prs, prLimit);

  const noneStr = lang === "en" ? "None" : "无";
  const issuesText = sampledIssues.map((i) => formatItem(i, lang)).join("\n") || noneStr;
  const prsText = sampledPrs.map((p) => formatItem(p, lang)).join("\n") || noneStr;
  const releasesText = releases.length
    ? releases.map((r) => `- ${r.tag_name}: ${r.name}\n  ${(r.body ?? "").slice(0, 300)}`).join("\n")
    : noneStr;

  const openIssues = issues.filter((i) => i.state === "open").length;
  const closedIssues = issues.filter((i) => i.state === "closed").length;
  const openPrs = prs.filter((p) => p.state === "open").length;
  const mergedPrs = prs.filter((p) => p.state === "closed").length;

  const issueSampleNote = sampleNote(totalIssues, sampledIssues.length, lang);
  const prSampleNote = sampleNote(totalPrs, sampledPrs.length, lang);

  if (lang === "en") {
    return `You are an analyst of OLAP databases and analytical storage engine open-source projects. Based on the following GitHub data from ${cfg.name} (github.com/${cfg.repo}), generate a project digest for ${dateStr}.

# Data Overview
- Issues updated in last 24h: ${totalIssues} (open/active: ${openIssues}, closed: ${closedIssues})
- PRs updated in last 24h: ${totalPrs} (open: ${openPrs}, merged/closed: ${mergedPrs})
- New releases: ${releases.length}

## Latest Releases
${releasesText}

## Latest Issues ${issueSampleNote}
${issuesText}

## Latest Pull Requests ${prSampleNote}
${prsText}

---

Generate a structured English ${cfg.name} project digest with the following sections:

1. **Today's Overview** - 3-5 sentences summarizing project status, including activity assessment
2. **Releases** - If new versions exist, detail changes, breaking changes, migration notes; omit if none
3. **Project Progress** - Merged/closed PRs today: what query engine features, storage optimizations, or SQL compatibility fixes were advanced
4. **Community Hot Topics** - Most active Issues/PRs with most comments/reactions (with links), analyze underlying technical needs
5. **Bugs & Stability** - Bugs, crashes, query correctness issues, or regressions reported today, ranked by severity, note if fix PRs exist
6. **Feature Requests & Roadmap Signals** - User-requested features (e.g. new SQL functions, storage formats, connectors), predict which might be in next version
7. **User Feedback Summary** - Real user pain points, use cases, performance/compatibility satisfaction feedback
8. **Backlog Watch** - Long-unanswered important Issues or PRs needing maintainer attention

Style: objective, data-driven, highlighting project health. Include GitHub links for each item.
`;
  }

  return `你是一位 OLAP 数据库与分析型存储引擎开源项目分析师。请根据以下来自 ${cfg.name} (github.com/${cfg.repo}) 的 GitHub 数据，生成 ${dateStr} 的项目动态日报。

# 数据概览
- 过去24小时 Issues 更新：${totalIssues} 条（新开/活跃: ${openIssues}，已关闭: ${closedIssues}）
- 过去24小时 PR 更新：${totalPrs} 条（待合并: ${openPrs}，已合并/关闭: ${mergedPrs}）
- 新版本发布：${releases.length} 个

## 最新 Releases
${releasesText}

## 最新 Issues ${issueSampleNote}
${issuesText}

## 最新 Pull Requests ${prSampleNote}
${prsText}

---

请生成一份结构清晰的 ${cfg.name} 项目日报，包含以下部分：

1. **今日速览** - 用3-5句话概括项目今日整体状态，包括活跃度评估
2. **版本发布** - 如有新版本，详细说明更新内容、破坏性变更、迁移注意事项；无则省略
3. **项目进展** - 今日合并/关闭的重要 PR，说明推进了哪些查询引擎功能、存储优化或 SQL 兼容性修复
4. **社区热点** - 今日讨论最活跃、评论最多、反应最多的 Issues/PRs（附链接），分析背后的技术诉求
5. **Bug 与稳定性** - 今日报告的 Bug、崩溃、查询正确性问题或回归，按严重程度排列，标注是否已有 fix PR
6. **功能请求与路线图信号** - 用户提出的新功能需求（如新 SQL 函数、存储格式、连接器等），结合已有 PR 判断哪些可能被纳入下一版本
7. **用户反馈摘要** - 从 Issues 评论中提炼真实用户痛点、使用场景、性能/兼容性满意度
8. **待处理积压** - 长期未响应的重要 Issue 或 PR，提醒维护者关注

语言要求：客观专业，数据驱动，突出项目健康度。每个条目附上 GitHub 链接。
`;
}

// ---------------------------------------------------------------------------
// Peers comparison prompt
// ---------------------------------------------------------------------------

export function buildPeersComparisonPrompt(
  primaryDigest: RepoDigest,
  peerDigests: RepoDigest[],
  dateStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const noActivityStr = lang === "en" ? "No activity in the last 24 hours." : "过去24小时无活动。";

  const primarySection =
    lang === "en"
      ? `## ${primaryDigest.config.name} (primary focus, github.com/${primaryDigest.config.repo})\n${primaryDigest.summary}`
      : `## ${primaryDigest.config.name}（核心参照，github.com/${primaryDigest.config.repo}）\n${primaryDigest.summary}`;

  const peerSections = peerDigests
    .map((d) => {
      const hasData = d.issues.length || d.prs.length || d.releases.length;
      if (!hasData) return `## ${d.config.name} (github.com/${d.config.repo})\n${noActivityStr}`;
      return `## ${d.config.name} (github.com/${d.config.repo})\n${d.summary}`;
    })
    .join("\n\n---\n\n");

  if (lang === "en") {
    return `You are a senior analyst of the OLAP and analytical storage engine open-source ecosystem. The following are ${dateStr} community digest summaries for each project.

${primarySection}

---

${peerSections}

---

Generate a cross-engine comparison report in English with these sections:

1. **Ecosystem Overview** - 3-5 sentences on the overall OLAP / analytical storage engine open-source landscape
2. **Activity Comparison** - Table comparing Issues count, PR count, Release status, and health score for each engine
3. **${primaryDigest.config.name}'s Position** - Advantages vs peers, technical approach differences, community size comparison
4. **Shared Technical Focus Areas** - Requirements emerging across multiple engines (note which engines, specific needs)
5. **Differentiation Analysis** - Key differences in storage format, query engine design, target workloads, SQL compatibility
6. **Community Momentum & Maturity** - Activity tiers, which engines are rapidly iterating, which are stabilizing
7. **Trend Signals** - Industry trends extracted from community feedback, value for data engineers and architects

Style: concise and professional, data-backed, suited for technical decision-makers and data engineers.
`;
  }

  return `你是一位专注于 OLAP 与分析型存储引擎开源生态的资深技术分析师。以下是 ${dateStr} 各开源项目的社区动态摘要。

${primarySection}

---

${peerSections}

---

请基于上述各项目的动态，生成一份横向对比分析报告，包含以下部分：

1. **生态全景** - 用3-5句话概括 OLAP/分析型存储引擎开源生态整体态势
2. **各项目活跃度对比** - 以表格形式汇总各项目今日的 Issues 数、PR 数、Release 情况及健康度评估
3. **${primaryDigest.config.name} 在生态中的定位** - 与同类相比的优势、技术路线差异、社区规模对比
4. **共同关注的技术方向** - 多项目共同涌现的需求（注明涉及哪些项目、具体诉求）
5. **差异化定位分析** - 存储格式、查询引擎设计、目标负载类型、SQL 兼容性的关键差异
6. **社区热度与成熟度** - 活跃度分层，哪些处于快速迭代阶段，哪些在质量巩固阶段
7. **值得关注的趋势信号** - 从社区反馈中提炼行业趋势，对数据工程师和架构师的参考价值

语言要求：简洁专业，有数据支撑，适合技术决策者和数据工程师阅读。
`;
}

// ---------------------------------------------------------------------------
// Cross-index comparison prompt (dbt, Spark, Substrait…)
// ---------------------------------------------------------------------------

export function buildComparisonPrompt(
  digests: RepoDigest[],
  dateStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const noActivityStr = lang === "en" ? "No activity in the last 24 hours." : "过去24小时无活动。";

  const sections = digests
    .map((d) => {
      const hasData = d.issues.length || d.prs.length || d.releases.length;
      if (!hasData) return `## ${d.config.name} (github.com/${d.config.repo})\n${noActivityStr}`;
      return `## ${d.config.name} (github.com/${d.config.repo})\n${d.summary}`;
    })
    .join("\n\n---\n\n");

  if (lang === "en") {
    return `You are a senior technical analyst of the OLAP data infrastructure ecosystem. The following are ${dateStr} community digest summaries for key OLAP index projects (dbt, Spark, Substrait, etc.):

${sections}

---

Generate a cross-project comparison report in English with these sections:

1. **Ecosystem Overview** - 3-5 sentences on the overall OLAP data infrastructure development landscape
2. **Activity Comparison** - Table comparing Issues count, PR count, Release status for each project today
3. **Shared Feature Directions** - Requirements appearing across multiple project communities (note which projects, specific needs)
4. **Differentiation Analysis** - Differences in scope, target users, and technical approach
5. **Community Momentum & Maturity** - Which projects have more active communities, which are rapidly iterating
6. **Trend Signals** - Industry trends from community feedback, reference value for data engineers

Style: concise and professional, data-backed, suited for technical decision-makers and data engineers.
`;
  }

  return `你是一位专注于 OLAP 数据基础设施生态的资深技术分析师。以下是 ${dateStr} OLAP 生态关键项目（dbt、Spark、Substrait 等）的社区动态摘要：

${sections}

---

请基于上述各项目的动态，生成一份横向对比分析报告，包含以下部分：

1. **生态全景** - 用3-5句话概括当前 OLAP 数据基础设施整体发展态势
2. **各项目活跃度对比** - 以表格形式汇总各项目今日的 Issues 数、PR 数、Release 情况
3. **共同关注的功能方向** - 多个项目社区都在关注的需求（说明哪些项目、具体诉求）
4. **差异化定位分析** - 各项目在功能侧重、目标用户、技术路线上的差异
5. **社区热度与成熟度** - 哪些项目社区更活跃，哪些处于快速迭代阶段
6. **值得关注的趋势信号** - 从社区反馈中提炼出的行业趋势，对数据工程师有何参考价值

语言要求：简洁专业，有数据支撑，适合技术决策者和数据工程师阅读。
`;
}

// ---------------------------------------------------------------------------
// GitHub Trending prompt (OLAP/data-infra focused)
// ---------------------------------------------------------------------------

export function buildTrendingPrompt(data: TrendingData, dateStr: string, lang: "zh" | "en" = "zh"): string {
  const trendingSection =
    data.trendingFetchSuccess && data.trendingRepos.length > 0
      ? data.trendingRepos
          .map(
            (r) =>
              `- [${r.fullName}](${r.url})` +
              (r.language ? ` [${r.language}]` : "") +
              ` ⭐${r.totalStars.toLocaleString()}` +
              (r.todayStars > 0 ? ` (+${r.todayStars} today)` : "") +
              (r.forks > 0 ? ` 🍴${r.forks.toLocaleString()}` : "") +
              (r.description ? `\n  ${r.description}` : ""),
          )
          .join("\n")
      : lang === "en"
        ? "(Unable to fetch today's GitHub Trending list)"
        : "（未能抓取今日 GitHub Trending 榜单）";

  const searchSection =
    data.searchRepos.length > 0
      ? data.searchRepos
          .map(
            (r) =>
              `- [${r.fullName}](${r.url})` +
              (r.language ? ` [${r.language}]` : "") +
              ` ⭐${r.stargazersCount.toLocaleString()}` +
              ` [topic:${r.searchQuery}]` +
              (r.description ? `\n  ${r.description}` : ""),
          )
          .join("\n")
      : lang === "en"
        ? "(No search results)"
        : "（无搜索结果）";

  if (lang === "en") {
    return `You are a technical analyst focused on the OLAP and data infrastructure open-source ecosystem. The following is ${dateStr} GitHub data-engineering-related trending repository data. Please filter for OLAP/data relevance, categorize, and analyze trends.

## Data Sources
- **Trending List** (github.com/trending, today's stars most reliable): Real-time hot list with today's new stars
- **Topic Search** (GitHub Search API, topic tags): OLAP/data-infra related projects active in last 7 days, grouped by topic

---

## GitHub Today's Trending (${data.trendingRepos.length} repositories)
${trendingSection}

---

## Data Infra Topic Search Results (${data.searchRepos.length} repositories, deduplicated)
${searchSection}

---

Generate a structured OLAP & Data Infrastructure Open Source Trends Report in English:

**Step 1 (Filter)**: From the above data, select projects clearly related to OLAP / data infrastructure / analytics (exclude unrelated frontend, games, general utilities). Skip non-data trending repos.

**Step 2 (Categorize)**: Group filtered projects into these categories (a project can belong to multiple; pick the primary one):
- 🗄️ OLAP Engines (columnar databases, analytical query engines, MPP systems)
- 📦 Storage Formats & Lakehouse (table formats, file formats, lakehouse frameworks)
- ⚙️ Query & Compute (query engines, vectorized execution, query optimization)
- 🔗 Data Integration & ETL (connectors, pipelines, ingestion tools)
- 🧰 Data Tooling (monitoring, benchmarking, SQL tools, BI integrations)

**Step 3 (Output Report)** with these sections:

1. **Today's Highlights** — 3-5 sentences on the most noteworthy OLAP/data open-source developments today

2. **Top Projects by Category** — For each category, list 3-8 representative projects, each with:
   - Project name (with link)
   - Stars data (total + today's new, if available)
   - One sentence: what it is and why it's worth attention today

3. **Trend Signal Analysis** — 200-300 words, distill from today's hot list:
   - Which type of data tool is getting explosive community attention?
   - Any new storage formats, query paradigms, or directions appearing for the first time?
   - Connection to recent lakehouse / cloud-warehouse developments

4. **Community Hot Spots** — Bullet list of 3-5 specific projects or directions worth data engineer focus, with brief reasoning

Style: English, professional and concise, must include GitHub links for every project.
`;
  }

  return `你是一位专注于 OLAP 与数据基础设施开源生态的技术分析师。以下是 ${dateStr} 的 GitHub 数据工程相关热门仓库数据，请进行 OLAP/数据相关性筛选、分类和趋势分析。

## 数据说明
- **Trending 榜单**（github.com/trending，今日 stars 数最可信）：今日实时热榜，含今日新增 stars
- **主题搜索**（GitHub Search API，topic 标签）：7天内活跃的 OLAP/数据基础设施相关项目，按主题分类

---

## GitHub 今日 Trending 榜单（共 ${data.trendingRepos.length} 个仓库）
${trendingSection}

---

## 数据基础设施主题搜索结果（共 ${data.searchRepos.length} 个仓库，已去重）
${searchSection}

---

请生成一份结构清晰的《OLAP & 数据基础设施开源趋势日报》，要求：

**第一步（过滤）**：从以上数据中筛选出与 OLAP/数据基础设施/分析引擎明确相关的项目（排除前端框架、游戏、通用工具等），对于 Trending 榜单中的非数据项目直接略去。

**第二步（分类）**：将筛选后的项目按以下维度分类（一个项目可归入多类，优先归入最主要类别）：
- 🗄️ OLAP 引擎（列式数据库、分析型查询引擎、MPP 系统）
- 📦 存储格式与湖仓（表格格式、文件格式、湖仓框架）
- ⚙️ 查询与计算（查询引擎、向量化执行、查询优化）
- 🔗 数据集成与 ETL（连接器、数据管道、写入工具）
- 🧰 数据工具（监控、基准测试、SQL 工具、BI 集成）

**第三步（输出报告）**，包含以下部分：

1. **今日速览** — 3~5 句话概括今日 OLAP/数据开源领域最值得关注的动向

2. **各维度热门项目** — 每个维度列出 3~8 个代表项目，每项包含：
   - 项目名（附链接）
   - stars 数据（总量 + 今日新增，如有）
   - 一句话说明：这个项目是什么，为什么今天值得关注

3. **趋势信号分析** — 200~300 字，从今日热榜中提炼：
   - 哪类数据工具正在获得社区爆发性关注？
   - 有无新兴存储格式、查询范式或方向首次登榜？
   - 与近期湖仓/云数仓发展的关联

4. **社区关注热点** — 以 bullet 形式列出 3~5 个值得数据工程师重点关注的具体项目或方向，给出简短理由

语言要求：中文，专业简洁，每个项目必须附 GitHub 链接。
`;
}

// ---------------------------------------------------------------------------
// Web report prompt (kept for optional vendor blog crawl in future)
// ---------------------------------------------------------------------------

export function buildWebReportPrompt(
  results: WebFetchResult[],
  dateStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const isAnyFirstRun = results.some((r) => r.isFirstRun);

  const siteSections = results
    .map(({ siteName, isFirstRun, newItems, totalDiscovered }) => {
      const mode =
        lang === "en"
          ? isFirstRun
            ? `First full crawl (sitemap total ${totalDiscovered} URLs, showing latest ${newItems.length} articles)`
            : `Incremental update, ${newItems.length} new articles today`
          : isFirstRun
            ? `首次全量抓取（sitemap 共 ${totalDiscovered} 条 URL，以下为最新 ${newItems.length} 篇正文内容）`
            : `今日增量更新，共 ${newItems.length} 篇新内容`;

      if (newItems.length === 0) return `## ${siteName}\n\n（${mode}，暂无可供分析的内容。）`;

      const unableToExtract = lang === "en" ? "(Unable to extract text content)" : "（无法提取文本内容）";
      const itemsText = newItems
        .map((item) =>
          [
            `### [${item.title || item.url}](${item.url})`,
            `- 分类: ${item.category} | 发布/更新: ${item.lastmod.slice(0, 10) || "未知"}`,
            `- 内容节选: ${item.content || unableToExtract}`,
          ].join("\n"),
        )
        .join("\n\n");

      return `## ${siteName}（${mode}）\n\n${itemsText}`;
    })
    .join("\n\n---\n\n");

  const firstRunNote =
    lang === "en"
      ? isAnyFirstRun
        ? "This is the first full crawl. Please focus on the overall content landscape, historical context, and core themes of each site, rather than individual articles."
        : "This is an incremental update. Please focus on today's new content and assess its strategic significance in context."
      : isAnyFirstRun
        ? "本次为首次全量抓取，请重点梳理各站点的内容格局、历史脉络与核心主题，而非仅关注单篇文章。"
        : "本次为增量更新，请聚焦今日新增内容，并结合上下文判断其战略意义。";

  if (lang === "en") {
    return `You are a deep content analyst focused on the data infrastructure and OLAP ecosystem, skilled at extracting strategic signals from official announcements, technical blogs, research papers, and product documentation.

The following content was crawled on ${dateStr} from data infrastructure vendor sites. ${firstRunNote}

${siteSections}

---

Generate a detailed Official Content Tracking Report in English with these sections:

1. **Today's Highlights** — 3-5 sentences on the most important new releases or developments

2. **Content Highlights by Vendor** — Organize important content by category (releases / engineering / benchmarks / use cases):
   - For each piece, 2-4 sentences extracting core insights, technical details, or business significance
   - Note publication date and original link

3. **Strategic Signal Analysis** — Based on release cadence and content focus, analyze:
   - Each vendor's recent technical priorities (query performance / storage / SQL compatibility / ecosystem)
   - Competitive dynamics and potential impact on data engineers

4. **Notable Details** — Extract hidden signals from titles, phrasing, and timing

${isAnyFirstRun ? "5. **Content Landscape Overview** — First full crawl only: summarize the content category distribution and content strategy style\n\n" : ""}Style: English, professional and detailed, suited for data engineers, architects, and technical decision-makers.
`;
  }

  return `你是一位专注于数据基础设施与 OLAP 生态的深度内容分析师，擅长从官方公告、技术博客、研究论文和产品文档中提炼战略信号。

以下是 ${dateStr} 从数据基础设施厂商官网抓取的内容，${firstRunNote}

${siteSections}

---

请生成一份详实的《OLAP 官方内容追踪报告》，包含以下部分：

1. **今日速览** — 3~5 句话概括最重要的新发布或动向

2. **各厂商内容精选** — 按分类（releases / engineering / benchmarks / use cases 等）逐条整理：
   - 每篇用2~4句话提炼核心观点、技术细节或业务意义
   - 标注发布日期和原文链接

3. **战略信号解读** — 基于发布节奏和内容重点，分析：
   - 各厂商近期技术优先级（查询性能 / 存储 / SQL 兼容性 / 生态）
   - 竞争态势与对数据工程师的潜在影响

4. **值得关注的细节** — 从标题、措辞、发布时机中提取隐含信号

${isAnyFirstRun ? "5. **内容格局总览** — 首次全量独有：汇总各厂商内容类别分布并说明内容运营风格\n\n" : ""}语言要求：中文，专业深入，适合数据工程师、架构师和技术决策者阅读。
`;
}

// ---------------------------------------------------------------------------
// Weekly digest prompt
// ---------------------------------------------------------------------------

export function buildWeeklyPrompt(
  dailyDigests: Record<string, string>,
  weekStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const digestEntries = Object.entries(dailyDigests)
    .map(([date, content]) => `## ${date}\n\n${content}`)
    .join("\n\n---\n\n");

  if (lang === "en") {
    return `You are a technical analyst focused on the OLAP and data infrastructure open-source ecosystem. The following are daily digest summaries from the past 7 days (${weekStr}) of OLAP engine and data tooling community activity. Generate a comprehensive weekly recap.

${digestEntries}

---

Generate an OLAP Ecosystem Weekly Report with these sections:

1. **Week's Top Stories** - 5-8 most important events, releases, and community developments this week, each with date
2. **Primary Engine Progress** - Key developments from Apache Doris this week
3. **OLAP Engine Ecosystem** - Notable changes from peer engines (ClickHouse, DuckDB, StarRocks, etc.)
4. **Data Infra Trends** - Most notable technical directions from GitHub Trending and OLAP community this week
5. **HN Community Highlights** - Core data engineering discussion topics and community sentiment on Hacker News this week
6. **Next Week's Signals** - Based on this week's data, predict trends and upcoming events worth watching

Style: English, concise and professional, helping data engineers quickly grasp the week's developments.
`;
  }

  return `你是一位专注于 OLAP 与数据基础设施开源生态的技术分析师。以下是过去 7 天（${weekStr}）的 OLAP 引擎和数据工具社区每日动态摘要，请生成本周综合回顾报告。

${digestEntries}

---

请生成《OLAP 生态周报》，包含以下部分：

1. **本周要闻** - 5-8 条本周最重要的事件、版本发布、社区动向，每条附日期
2. **核心引擎进展** - Apache Doris 本周重要进展与关键变化
3. **OLAP 引擎生态** - 同赛道引擎（ClickHouse、DuckDB、StarRocks 等）的本周重要进展
4. **数据基础设施趋势** - 本周 GitHub Trending 和 OLAP 社区最关注的技术方向
5. **HN 社区热议** - 本周 Hacker News 数据工程讨论的核心话题与社区情绪
6. **下周信号** - 基于本周数据，预判值得关注的趋势或即将到来的事件

语言要求：中文，简洁专业，适合数据工程师快速掌握一周动态。
`;
}

// ---------------------------------------------------------------------------
// Monthly digest prompt
// ---------------------------------------------------------------------------

export function buildMonthlyPrompt(
  sourceDigests: Record<string, string>,
  monthStr: string,
  lang: "zh" | "en" = "zh",
): string {
  const digestEntries = Object.entries(sourceDigests)
    .map(([key, content]) => `## ${key}\n\n${content}`)
    .join("\n\n---\n\n");

  if (lang === "en") {
    return `You are a technical analyst focused on the OLAP and data infrastructure open-source ecosystem. The following are ${monthStr} OLAP community digest summaries (${Object.keys(sourceDigests).length} reports total). Generate a comprehensive monthly review.

${digestEntries}

---

Generate an OLAP Ecosystem Monthly Report with these sections:

1. **Month's Top Stories** - 5-10 most important events and milestones this month, in chronological order
2. **Primary Engine Monthly Progress** - Apache Doris: overall development trajectory, major releases, and community growth
3. **OLAP Engine Ecosystem Monthly Review** - Ecosystem landscape shifts, emerging engines, notable signals this month
4. **Technical Trend Summary** - Most significant technical directions and paradigm shifts in OLAP open-source this month
5. **Community Health Assessment** - Monthly activity comparison across major engines, developer engagement evaluation
6. **Next Month's Outlook** - Based on this month's trends, predict key directions and potential events to watch

Style: English, in-depth analysis, data-driven, suited for monthly retrospectives and strategic decision-making.
`;
  }

  return `你是一位专注于 OLAP 与数据基础设施开源生态的技术分析师。以下是 ${monthStr} 月的 OLAP 社区动态汇总（共 ${Object.keys(sourceDigests).length} 份报告），请生成本月综合回顾报告。

${digestEntries}

---

请生成《OLAP 生态月报》，包含以下部分：

1. **月度要闻** - 本月最重要的 5-10 条事件和里程碑，按时间排列
2. **核心引擎月度进展** - Apache Doris 本月整体发展轨迹、重要版本、社区规模变化
3. **OLAP 引擎生态月报** - 本月生态格局变化、新兴引擎、值得关注的信号
4. **技术趋势总结** - 本月 OLAP 开源领域最显著的技术方向与范式变化
5. **社区生态健康度** - 各主要引擎月度活跃度对比、开发者参与度评估
6. **下月展望** - 基于本月趋势，预判值得重点关注的方向和潜在事件

语言要求：中文，深度分析，数据驱动，适合月度复盘和战略决策参考。
`;
}

// ---------------------------------------------------------------------------
// Hacker News prompt (data-infra focused filter)
// ---------------------------------------------------------------------------

export function buildHnPrompt(data: HnData, dateStr: string, lang: "zh" | "en" = "zh"): string {
  const storiesText = data.stories
    .map((s, i) =>
      lang === "en"
        ? `${i + 1}. **${s.title}**\n` +
          `   Link: ${s.url}\n` +
          `   Discussion: ${s.hnUrl}\n` +
          `   Score: ${s.points} | Comments: ${s.comments} | Author: @${s.author} | Time: ${s.createdAt.slice(0, 16)}`
        : `${i + 1}. **${s.title}**\n` +
          `   链接: ${s.url}\n` +
          `   讨论: ${s.hnUrl}\n` +
          `   分数: ${s.points} | 评论: ${s.comments} | 作者: @${s.author} | 时间: ${s.createdAt.slice(0, 16)}`,
    )
    .join("\n\n");

  if (lang === "en") {
    return `You are a data infrastructure and OLAP industry news analyst. The following are data-engineering-related top posts from Hacker News in the past 24 hours as of ${dateStr} (sorted by score, ${data.stories.length} total):

---

${storiesText}

---

Generate a structured Hacker News Data Infrastructure Community Digest in English:

1. **Today's Highlights** — 3-5 sentences on the hottest data engineering / OLAP discussion topics and community sentiment on HN today

2. **Top News & Discussions** — Organized by category, select the 2-5 most representative items per category, each with:
   - Title (with original link) + HN discussion link
   - Score and comment count
   - One sentence: why this matters, what the community's typical reaction is

   Categories:
   - 🗄️ Databases & OLAP (new releases, query engines, storage formats)
   - ⚙️ Data Engineering (pipelines, ETL, orchestration, lakehouse)
   - 🏢 Industry News (company news, funding, product launches)
   - 💬 Opinions & Debates (notable Ask HN, Show HN, or hot discussion threads)

3. **Community Sentiment Signal** — 100-200 words analyzing today's HN data-infra discussion mood and focus:
   - Which topics are most active (high score + high comments)?
   - Any clear points of controversy or consensus?
   - Compared to last cycle, any notable shift in focus?

4. **Worth Deep Reading** — List 2-3 pieces most worth data engineers/architects reading in depth, with brief reasoning

Style: English, concise and professional, preserve all original links.
`;
  }

  return `你是数据基础设施与 OLAP 行业资讯分析师。以下是 ${dateStr} 从 Hacker News 抓取的过去 24 小时内数据工程相关热门帖子（按分数降序，共 ${data.stories.length} 条）：

---

${storiesText}

---

请生成一份结构清晰的《Hacker News 数据基础设施社区动态日报》，要求：

1. **今日速览** — 3~5 句话，概括今日 HN 社区围绕数据工程/OLAP 最热门的讨论方向和情绪

2. **热门新闻与讨论** — 按以下分类整理，每类选取最具代表性的 2~5 条，每条包含：
   - 标题（附原文链接）+ HN 讨论链接
   - 分数和评论数
   - 一句话说明：这条内容为什么值得关注，社区有何典型反应

   分类：
   - 🗄️ 数据库与 OLAP（新版本发布、查询引擎、存储格式）
   - ⚙️ 数据工程（数据管道、ETL、编排、湖仓）
   - 🏢 产业动态（公司新闻、融资、产品发布）
   - 💬 观点与争议（值得关注的 Ask HN、Show HN 或热议帖子）

3. **社区情绪信号** — 100~200 字，分析今日 HN 数据基础设施讨论的整体情绪和关注重点：
   - 社区对哪类话题最活跃（高分 + 高评论）？
   - 有无明显的争议点或共识？
   - 与上周期相比，关注方向有无明显变化？

4. **值得深读** — 列出 2~3 条今日最值得数据工程师/架构师深入阅读的内容，简述理由

语言要求：中文，简洁专业，保留所有原文链接。
`;
}

export function buildArxivPrompt(data: ArxivData, dateStr: string, lang: "zh" | "en" = "zh"): string {
  const papersText = data.papers
    .map((paper, index) => {
      const authors = paper.authors.join(", ") || (lang === "en" ? "Unknown" : "未知");
      const categories = paper.categories.join(", ") || (lang === "en" ? "None" : "无");
      return lang === "en"
        ? `${index + 1}. **${paper.title}**\n` +
            `   Authors: ${authors}\n` +
            `   Published: ${paper.published.slice(0, 10)} | Updated: ${paper.updated.slice(0, 10)}\n` +
            `   Categories: ${categories}\n` +
            `   Abstract: ${paper.summary}\n` +
            `   arXiv: ${paper.absUrl}\n` +
            `   PDF: ${paper.pdfUrl}`
        : `${index + 1}. **${paper.title}**\n` +
            `   作者: ${authors}\n` +
            `   发布时间: ${paper.published.slice(0, 10)} | 更新时间: ${paper.updated.slice(0, 10)}\n` +
            `   分类: ${categories}\n` +
            `   摘要: ${paper.summary}\n` +
            `   arXiv: ${paper.absUrl}\n` +
            `   PDF: ${paper.pdfUrl}`;
    })
    .join("\n\n");

  const paperNote = sampleNote(data.papers.length, data.papers.length, lang);

  if (lang === "en") {
    return `You are a technical research analyst focused on OLAP and data infrastructure. The following are recent arXiv papers collected on ${dateStr} from OLAP-related search queries.

Search query: ${data.query}

Candidate papers ${paperNote}
${papersText}

---

Generate an English report titled "OLAP Daily Top Paper from arXiv" with these sections:

1. **Today's Top Paper** — choose the single most important paper for today's OLAP audience and explain why in 3-5 sentences
2. **Paper Snapshot** — title, authors, publication date, research problem, and core method
3. **Why It Matters for OLAP** — connect it to query engines, storage, lakehouse systems, optimization, benchmarking, or analytical workloads
4. **Worth Watching** — 1-2 concise notes on promising secondary papers if any stand out

Style: English, concise and technical, useful for data engineers and database researchers.`;
  }

  return `你是一位专注于 OLAP 与数据基础设施方向的技术研究分析师。以下是 ${dateStr} 从 arXiv 的 OLAP 相关搜索中抓取到的近期论文候选。

搜索条件: ${data.query}

论文候选${paperNote}
${papersText}

---

请生成一份《OLAP 每日论文精选（arXiv）》，包含以下部分：

1. **今日 Top 论文** — 选择今天最值得 OLAP 读者关注的一篇论文，用 3~5 句话说明原因
2. **论文速览** — 标题、作者、发布时间、研究问题、核心方法
3. **与 OLAP 的关系** — 说明它对查询引擎、存储、Lakehouse、优化器、Benchmark 或分析型负载的意义
4. **值得继续关注** — 如果其他候选也值得看，补充 1~2 条简短说明

语言要求：中文，技术向、简洁、适合数据工程师和数据库研究者阅读。`;
}
