import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import { toRepoConfig, loadConfig } from "../config.ts";

// ---------------------------------------------------------------------------
// toRepoConfig
// ---------------------------------------------------------------------------

describe("toRepoConfig", () => {
  it("converts a basic entry", () => {
    const result = toRepoConfig({ id: "test", repo: "org/test", name: "Test" });
    expect(result).toEqual({ id: "test", repo: "org/test", name: "Test" });
  });

  it("includes paginated when true", () => {
    const result = toRepoConfig({ id: "test", repo: "org/test", name: "Test", paginated: true });
    expect(result).toEqual({ id: "test", repo: "org/test", name: "Test", paginated: true });
  });

  it("omits paginated when false", () => {
    const result = toRepoConfig({ id: "test", repo: "org/test", name: "Test", paginated: false });
    expect(result).not.toHaveProperty("paginated");
  });
});

// ---------------------------------------------------------------------------
// loadConfig
// ---------------------------------------------------------------------------

describe("loadConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns defaults when config file does not exist", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    const config = loadConfig("/nonexistent/config.yml");
    expect(config.indexRepos.length).toBeGreaterThan(0);
    expect(config.primaryRepo.id).toBe("doris");
    expect(config.peerRepos.length).toBeGreaterThan(0);
  });

  it("loads index_repos from valid YAML", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`
index_repos:
  - id: custom
    repo: org/custom
    name: Custom Tool
`);
    const config = loadConfig("test.yml");
    expect(config.indexRepos).toHaveLength(1);
    expect(config.indexRepos[0]!.id).toBe("custom");
  });

  it("falls back to defaults for empty index_repos", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("index_repos: []");
    const config = loadConfig("test.yml");
    expect(config.indexRepos.length).toBeGreaterThan(0);
    expect(config.indexRepos[0]!.id).toBe("dbt-core");
  });

  it("parses primary_repo from YAML", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`
primary_repo:
  id: clickhouse
  repo: ClickHouse/ClickHouse
  name: ClickHouse
  paginated: true
`);
    const config = loadConfig("test.yml");
    expect(config.primaryRepo).toEqual({
      id: "clickhouse",
      repo: "ClickHouse/ClickHouse",
      name: "ClickHouse",
      paginated: true,
    });
  });

  it("falls back to default primary_repo when incomplete", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("primary_repo:\n  id: partial\n");
    const config = loadConfig("test.yml");
    expect(config.primaryRepo.id).toBe("doris"); // default
  });

  it("loads peer_repos from valid YAML", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue(`
peer_repos:
  - id: duckdb
    repo: duckdb/duckdb
    name: DuckDB
`);
    const config = loadConfig("test.yml");
    expect(config.peerRepos).toHaveLength(1);
    expect(config.peerRepos[0]!.id).toBe("duckdb");
  });

  it("falls back to defaults for empty peer_repos", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue("peer_repos: []");
    const config = loadConfig("test.yml");
    expect(config.peerRepos.length).toBeGreaterThan(0);
  });
});
