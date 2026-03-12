/**
 * Report content builders — extracted from index.ts for testability.
 */

import type { RepoConfig, RepoFetch } from "./github.ts";
import type { RepoDigest } from "./prompts.ts";

// ---------------------------------------------------------------------------
// Index Report (broad OLAP ecosystem: dbt, Spark, Substrait…)
// ---------------------------------------------------------------------------

export function buildIndexReportContent(
  indexDigests: RepoDigest[],
  comparison: string,
  utcStr: string,
  dateStr: string,
  footer: string,
  lang: "zh" | "en" = "zh",
): string {
  const repoLinks = indexDigests
    .map((d) => `- [${d.config.name}](https://github.com/${d.config.repo})`)
    .join("\n");

  const t =
    lang === "en"
      ? {
          title: `# OLAP Ecosystem Index Digest ${dateStr}\n\n`,
          meta: `> Generated: ${utcStr} UTC | Projects covered: ${indexDigests.length}\n\n`,
          comparison: `## Cross-Project Comparison\n\n`,
          detail: `## Per-Project Reports\n\n`,
        }
      : {
          title: `# OLAP 生态索引日报 ${dateStr}\n\n`,
          meta: `> 生成时间: ${utcStr} UTC | 覆盖项目: ${indexDigests.length} 个\n\n`,
          comparison: `## 横向对比\n\n`,
          detail: `## 各项目详细报告\n\n`,
        };

  const toolSections = indexDigests
    .map((d) => {
      return [
        `<details>`,
        `<summary><strong>${d.config.name}</strong> — <a href="https://github.com/${d.config.repo}">${d.config.repo}</a></summary>`,
        ``,
        d.summary,
        ``,
        `</details>`,
      ].join("\n");
    })
    .join("\n\n");

  return (
    t.title +
    t.meta +
    `${repoLinks}\n\n` +
    `---\n\n` +
    t.comparison +
    comparison +
    `\n\n---\n\n` +
    t.detail +
    toolSections +
    footer
  );
}

// ---------------------------------------------------------------------------
// Primary Engine Report (Apache Doris deep dive + peer comparison)
// ---------------------------------------------------------------------------

export function buildPrimaryEngineReportContent(
  fetchedPrimary: RepoFetch,
  peerDigests: RepoDigest[],
  primarySummary: string,
  peersComparison: string,
  utcStr: string,
  dateStr: string,
  footer: string,
  primaryRepo: RepoConfig,
  peerRepos: RepoConfig[],
  lang: "zh" | "en" = "zh",
): string {
  const { issues, prs } = fetchedPrimary;

  const peersRepoLinks =
    `- [${primaryRepo.name}](https://github.com/${primaryRepo.repo})\n` +
    peerRepos.map((p) => `- [${p.name}](https://github.com/${p.repo})`).join("\n");

  const peerDetailSections = peerDigests
    .map((d) =>
      [
        `<details>`,
        `<summary><strong>${d.config.name}</strong> — <a href="https://github.com/${d.config.repo}">${d.config.repo}</a></summary>`,
        ``,
        d.summary,
        ``,
        `</details>`,
      ].join("\n"),
    )
    .join("\n\n");

  const t =
    lang === "en"
      ? {
          title: `# ${primaryRepo.name} Ecosystem Digest ${dateStr}\n\n`,
          meta: `> Issues: ${issues.length} | PRs: ${prs.length} | Projects covered: ${1 + peerRepos.length} | Generated: ${utcStr} UTC\n\n`,
          deepDive: `## ${primaryRepo.name} Deep Dive\n\n`,
          comparison: `## Cross-Engine Comparison\n\n`,
          peers: `## Peer Engine Reports\n\n`,
        }
      : {
          title: `# ${primaryRepo.name} 生态日报 ${dateStr}\n\n`,
          meta: `> Issues: ${issues.length} | PRs: ${prs.length} | 覆盖项目: ${1 + peerRepos.length} 个 | 生成时间: ${utcStr} UTC\n\n`,
          deepDive: `## ${primaryRepo.name} 项目深度报告\n\n`,
          comparison: `## 横向引擎对比\n\n`,
          peers: `## 同赛道引擎详细报告\n\n`,
        };

  return (
    t.title +
    t.meta +
    `${peersRepoLinks}\n\n` +
    `---\n\n` +
    t.deepDive +
    primarySummary +
    `\n\n---\n\n` +
    t.comparison +
    peersComparison +
    `\n\n---\n\n` +
    t.peers +
    peerDetailSections +
    footer
  );
}
