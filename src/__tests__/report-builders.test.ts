import { describe, it, expect } from "vitest";
import { buildIndexReportContent, buildPrimaryEngineReportContent } from "../report-builders.ts";
import type { RepoDigest } from "../prompts.ts";
import type { GitHubItem, GitHubRelease } from "../github.ts";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeDigest(overrides: Partial<RepoDigest> = {}): RepoDigest {
  return {
    config: { id: "test-engine", repo: "org/test-engine", name: "TestEngine" },
    issues: [],
    prs: [],
    releases: [],
    summary: "Test summary content",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// buildIndexReportContent
// ---------------------------------------------------------------------------

describe("buildIndexReportContent", () => {
  it("includes title, meta, and all sections (zh)", () => {
    const digests = [
      makeDigest({ config: { id: "dbt-core", repo: "dbt-labs/dbt-core", name: "dbt-core" } }),
      makeDigest({ config: { id: "apache-spark", repo: "apache/spark", name: "Apache Spark" } }),
    ];
    const result = buildIndexReportContent(
      digests,
      "Comparison content",
      "2026-03-09 00:00",
      "2026-03-09",
      "\n---\nfooter",
      "zh",
    );

    expect(result).toContain("# OLAP 生态索引日报 2026-03-09");
    expect(result).toContain("覆盖项目: 2 个");
    expect(result).toContain("[dbt-core](https://github.com/dbt-labs/dbt-core)");
    expect(result).toContain("[Apache Spark](https://github.com/apache/spark)");
    expect(result).toContain("横向对比");
    expect(result).toContain("Comparison content");
    expect(result).toContain("footer");
  });

  it("includes title and meta in English", () => {
    const digests = [makeDigest()];
    const result = buildIndexReportContent(digests, "Comparison", "2026-03-09 00:00", "2026-03-09", "", "en");
    expect(result).toContain("# OLAP Ecosystem Index Digest 2026-03-09");
    expect(result).toContain("Cross-Project Comparison");
  });
});

// ---------------------------------------------------------------------------
// buildPrimaryEngineReportContent
// ---------------------------------------------------------------------------

describe("buildPrimaryEngineReportContent", () => {
  it("includes all sections (zh)", () => {
    const primaryRepo = { id: "doris", repo: "apache/doris", name: "Apache Doris" };
    const peers = [{ id: "clickhouse", repo: "ClickHouse/ClickHouse", name: "ClickHouse" }];
    const peerDigests = [makeDigest({ config: peers[0] })];
    const fetchedPrimary = {
      cfg: primaryRepo,
      issues: [{ number: 1 } as unknown as GitHubItem],
      prs: [] as GitHubItem[],
      releases: [] as GitHubRelease[],
    };

    const result = buildPrimaryEngineReportContent(
      fetchedPrimary,
      peerDigests,
      "Doris summary",
      "Peers comparison",
      "2026-03-09 00:00",
      "2026-03-09",
      "\nfooter",
      primaryRepo,
      peers,
      "zh",
    );

    expect(result).toContain("# Apache Doris 生态日报 2026-03-09");
    expect(result).toContain("Issues: 1");
    expect(result).toContain("覆盖项目: 2 个");
    expect(result).toContain("[Apache Doris](https://github.com/apache/doris)");
    expect(result).toContain("[ClickHouse](https://github.com/ClickHouse/ClickHouse)");
    expect(result).toContain("Apache Doris 项目深度报告");
    expect(result).toContain("横向引擎对比");
    expect(result).toContain("同赛道引擎详细报告");
    expect(result).toContain("footer");
  });

  it("renders in English", () => {
    const primaryRepo = { id: "doris", repo: "apache/doris", name: "Apache Doris" };
    const result = buildPrimaryEngineReportContent(
      { cfg: primaryRepo, issues: [], prs: [], releases: [] },
      [],
      "summary",
      "comparison",
      "",
      "2026-03-09",
      "",
      primaryRepo,
      [],
      "en",
    );
    expect(result).toContain("# Apache Doris Ecosystem Digest 2026-03-09");
    expect(result).toContain("Apache Doris Deep Dive");
    expect(result).toContain("Cross-Engine Comparison");
  });
});
