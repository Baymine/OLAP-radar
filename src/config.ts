/**
 * Loads and validates olap-radar configuration from config.yml.
 * Falls back to built-in defaults if the file is missing or a section is absent.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { RepoConfig } from "./github.ts";

// ---------------------------------------------------------------------------
// Schema types
// ---------------------------------------------------------------------------

interface RawRepoEntry {
  id: string;
  repo: string;
  name: string;
  paginated?: boolean;
}

interface RawConfig {
  index_repos?: RawRepoEntry[];
  primary_repo?: RawRepoEntry;
  peer_repos?: RawRepoEntry[];
}

export interface RadarConfig {
  indexRepos: RepoConfig[];
  primaryRepo: RepoConfig;
  peerRepos: RepoConfig[];
}

// ---------------------------------------------------------------------------
// Defaults (mirrors the original hard-coded values)
// ---------------------------------------------------------------------------

const DEFAULT_INDEX_REPOS: RepoConfig[] = [
  { id: "dbt-core", repo: "dbt-labs/dbt-core", name: "dbt-core" },
  { id: "apache-spark", repo: "apache/spark", name: "Apache Spark", paginated: true },
  { id: "substrait", repo: "substrait-io/substrait", name: "Substrait" },
];

const DEFAULT_PRIMARY_REPO: RepoConfig = {
  id: "doris",
  repo: "apache/doris",
  name: "Apache Doris",
  paginated: true,
};

const DEFAULT_PEER_REPOS: RepoConfig[] = [
  { id: "clickhouse", repo: "ClickHouse/ClickHouse", name: "ClickHouse", paginated: true },
  { id: "duckdb", repo: "duckdb/duckdb", name: "DuckDB", paginated: true },
  { id: "starrocks", repo: "StarRocks/StarRocks", name: "StarRocks", paginated: true },
  { id: "apache-iceberg", repo: "apache/iceberg", name: "Apache Iceberg" },
  { id: "delta-io", repo: "delta-io/delta", name: "Delta Lake" },
  { id: "databend", repo: "databendlabs/databend", name: "Databend" },
  { id: "velox", repo: "facebookincubator/velox", name: "Velox" },
  { id: "gluten", repo: "apache/incubator-gluten", name: "Apache Gluten" },
  { id: "apache-arrow", repo: "apache/arrow", name: "Apache Arrow" },
];

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export function toRepoConfig(e: RawRepoEntry): RepoConfig {
  return { id: e.id, repo: e.repo, name: e.name, ...(e.paginated ? { paginated: true } : {}) };
}

export function loadConfig(configPath = "config.yml"): RadarConfig {
  const resolved = path.resolve(configPath);

  if (!fs.existsSync(resolved)) {
    console.log(`[config] ${configPath} not found — using built-in defaults.`);
    return {
      indexRepos: DEFAULT_INDEX_REPOS,
      primaryRepo: DEFAULT_PRIMARY_REPO,
      peerRepos: DEFAULT_PEER_REPOS,
    };
  }

  const raw = yaml.load(fs.readFileSync(resolved, "utf-8")) as RawConfig;

  const indexRepos =
    Array.isArray(raw?.index_repos) && raw.index_repos.length > 0
      ? raw.index_repos.map(toRepoConfig)
      : DEFAULT_INDEX_REPOS;

  const primaryRepo =
    raw?.primary_repo?.id && raw.primary_repo.repo ? toRepoConfig(raw.primary_repo) : DEFAULT_PRIMARY_REPO;

  const peerRepos =
    Array.isArray(raw?.peer_repos) && raw.peer_repos.length > 0
      ? raw.peer_repos.map(toRepoConfig)
      : DEFAULT_PEER_REPOS;

  console.log(
    `[config] Loaded from ${configPath}: ` +
      `${indexRepos.length} index repos, ${peerRepos.length} peer engines`,
  );

  return { indexRepos, primaryRepo, peerRepos };
}
