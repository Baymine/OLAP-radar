# agents-radar

English | [中文](./README.zh.md)

`agents-radar` is a bilingual daily digest generator for the OLAP and data-infrastructure open-source ecosystem. GitHub Actions runs the pipeline every day at 00:00 UTC (08:00 CST), collects project activity and ecosystem signals, generates Chinese and English reports with an LLM, publishes them as GitHub Issues, and commits the Markdown outputs to this repo.

## Web UI

**[https://duanyytop.github.io/agents-radar](https://duanyytop.github.io/agents-radar)**

Browse historical reports in a lightweight GitHub Pages UI. The sidebar is driven by `manifest.json`, and each report is rendered directly from the Markdown files in `digests/YYYY-MM-DD/`.

## RSS Feed

**[https://duanyytop.github.io/agents-radar/feed.xml](https://duanyytop.github.io/agents-radar/feed.xml)**

The feed contains the latest 30 report entries across all report types.

## MCP Server

**`https://agents-radar-mcp.duanyytop.workers.dev`**

The hosted [Model Context Protocol](https://modelcontextprotocol.io) server exposes recent report history as MCP tools.

Available tools:

| Tool           | Description                              |
| -------------- | ---------------------------------------- |
| `list_reports` | List available dates and report types    |
| `get_latest`   | Fetch the latest report for a given type |
| `get_report`   | Fetch a specific report by date and type |
| `search`       | Search recent reports by keyword         |

Example prompts:

- "What's new in the OLAP ecosystem today?"
- "Search recent reports for ClickHouse"
- "Show me the OLAP trends report for 2026-03-05"

Claude Desktop setup:

```json
{
  "mcpServers": {
    "agents-radar": {
      "url": "https://agents-radar-mcp.duanyytop.workers.dev"
    }
  }
}
```

OpenClaw setup:

```bash
openclaw mcp add --transport http agents-radar https://agents-radar-mcp.duanyytop.workers.dev
```

Self-hosting:

```bash
cd mcp
pnpm install
wrangler deploy
```

## Telegram Channel

**[t.me/agents_radar](https://t.me/agents_radar)**

Daily notifications include links to the latest reports, the Web UI, and the RSS feed.

## Tracked Sources

### Primary engine

| Project      | Repository                                      |
| ------------ | ----------------------------------------------- |
| Apache Doris | [apache/doris](https://github.com/apache/doris) |

### Peer OLAP engines

| Project        | Repository                                                            |
| -------------- | --------------------------------------------------------------------- |
| ClickHouse     | [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)     |
| DuckDB         | [duckdb/duckdb](https://github.com/duckdb/duckdb)                     |
| StarRocks      | [StarRocks/StarRocks](https://github.com/StarRocks/StarRocks)         |
| Apache Iceberg | [apache/iceberg](https://github.com/apache/iceberg)                   |
| Delta Lake     | [delta-io/delta](https://github.com/delta-io/delta)                   |
| Databend       | [databendlabs/databend](https://github.com/databendlabs/databend)     |
| Velox          | [facebookincubator/velox](https://github.com/facebookincubator/velox) |
| Apache Gluten  | [apache/incubator-gluten](https://github.com/apache/incubator-gluten) |
| Apache Arrow   | [apache/arrow](https://github.com/apache/arrow)                       |

### OLAP ecosystem index repos

| Project      | Repository                                                          |
| ------------ | ------------------------------------------------------------------- |
| dbt-core     | [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core)           |
| Apache Spark | [apache/spark](https://github.com/apache/spark)                     |
| Substrait    | [substrait-io/substrait](https://github.com/substrait-io/substrait) |

### GitHub trending and search

Two sources are fetched in parallel:

| Source                                                         | Details                                                                                                                                   |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [github.com/trending](https://github.com/trending?since=daily) | Daily GitHub Trending HTML scrape                                                                                                         |
| GitHub Search API                                              | Repositories active in the last 7 days matching `olap`, `data-warehouse`, `lakehouse`, `query-engine`, `columnar`, and `analytics` topics |

### Hacker News

The pipeline queries the [Algolia HN Search API](https://hn.algolia.com/api) with `OLAP`, `ClickHouse`, `DuckDB`, `Apache Doris`, `lakehouse`, and `data warehouse`, deduplicates the results, and keeps the top 30 stories by points.

### Official web content

The codebase still contains the old sitemap fetcher, but the OLAP web report is currently disabled until real OLAP vendor official-content sources are configured. When no OLAP web sources are configured, the `olap-web` step is skipped instead of generating a mislabeled report.

## Features

- Fetches recent GitHub issues, pull requests, and releases for the configured OLAP projects
- Generates a dedicated daily report for the broader OLAP index repos
- Generates a dedicated daily report for the primary engine and peer engine ecosystem
- Produces GitHub trends and Hacker News reports using OLAP/data-infrastructure inputs
- Produces weekly and monthly rollups from the highest-priority available `olap-*` report for each date plus prior weekly reports
- Publishes GitHub Issues and writes Markdown files to `digests/YYYY-MM-DD/`
- Builds `manifest.json` for the Web UI and `feed.xml` for RSS
- Supports multiple LLM backends through `LLM_PROVIDER`

## Setup

### 1. Fork the repository

### 2. Customize `config.yml` (optional)

The repo list is configured in `config.yml` and loaded on every run.

```yaml
primary_repo:
  id: doris
  repo: apache/doris
  name: Apache Doris

peer_repos:
  - id: clickhouse
    repo: ClickHouse/ClickHouse
    name: ClickHouse

index_repos:
  - id: dbt-core
    repo: dbt-labs/dbt-core
    name: dbt-core
```

### 3. Add GitHub Actions secrets

| Secret               | Required                  | Description                                                                    |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `LLM_PROVIDER`       | optional                  | `anthropic` (default), `openai`, `github-copilot`, `openrouter`, or `aigocode` |
| `ANTHROPIC_API_KEY`  | if `anthropic`            | Anthropic API key                                                              |
| `ANTHROPIC_BASE_URL` | optional                  | Anthropic-compatible endpoint override                                         |
| `OPENAI_API_KEY`     | if `openai` or `aigocode` | OpenAI API key or fallback key for AigoCode                                    |
| `OPENAI_BASE_URL`    | optional                  | OpenAI endpoint override                                                       |
| `OPENROUTER_API_KEY` | if `openrouter`           | OpenRouter API key                                                             |
| `AIGOCODE_API_KEY`   | optional for `aigocode`   | Preferred API key for AigoCode                                                 |
| `AIGOCODE_BASE_URL`  | optional                  | AigoCode endpoint override                                                     |
| `TELEGRAM_BOT_TOKEN` | optional                  | Telegram bot token                                                             |
| `TELEGRAM_CHAT_ID`   | optional                  | Telegram destination chat/channel ID                                           |

`GITHUB_TOKEN` is provided automatically by GitHub Actions and is also used when `LLM_PROVIDER=github-copilot`.

### 4. Enable workflows

The repo includes daily, weekly, and monthly workflows under `.github/workflows/`.

## LLM Providers

| Provider       | `LLM_PROVIDER`   | Required env vars                      | Default model or endpoint               |
| -------------- | ---------------- | -------------------------------------- | --------------------------------------- |
| Anthropic      | `anthropic`      | `ANTHROPIC_API_KEY`                    | `claude-sonnet-4-6`                     |
| OpenAI         | `openai`         | `OPENAI_API_KEY`                       | `gpt-4o`                                |
| GitHub Copilot | `github-copilot` | `GITHUB_TOKEN`                         | `gpt-4o`                                |
| OpenRouter     | `openrouter`     | `OPENROUTER_API_KEY`                   | `anthropic/claude-sonnet-4`             |
| AigoCode       | `aigocode`       | `AIGOCODE_API_KEY` or `OPENAI_API_KEY` | `https://api.aigocode.com/v1/responses` |

Model overrides:

- `ANTHROPIC_MODEL`
- `OPENAI_MODEL`
- `GITHUB_COPILOT_MODEL`
- `OPENROUTER_MODEL`

## Running Locally

```bash
pnpm install

export GITHUB_TOKEN=ghp_xxxxx
export DIGEST_REPO=owner/repo

# Option A: Anthropic
export LLM_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-xxxxx

# Option B: OpenAI
# export LLM_PROVIDER=openai
# export OPENAI_API_KEY=sk-xxxxx

# Option C: GitHub Copilot
# export LLM_PROVIDER=github-copilot

# Option D: OpenRouter
# export LLM_PROVIDER=openrouter
# export OPENROUTER_API_KEY=sk-or-xxxxx

# Option E: AigoCode
# export LLM_PROVIDER=aigocode
# export AIGOCODE_API_KEY=sk-xxxxx

pnpm start
```

Useful commands:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm weekly
pnpm monthly
pnpm manifest
```

## Output Files

Reports are written to `digests/YYYY-MM-DD/`:

| File               | Description                                                                  | Issue label      |
| ------------------ | ---------------------------------------------------------------------------- | ---------------- |
| `olap-index.md`    | OLAP ecosystem index digest                                                  | `digest`         |
| `olap-engines.md`  | Primary engine deep dive + peer engine comparison                            | `primary-engine` |
| `olap-web.md`      | Official content report; currently skipped until OLAP sources are configured | `web`            |
| `olap-trending.md` | GitHub trends report for OLAP/data-infra repos                               | `trending`       |
| `olap-hn.md`       | Hacker News data-infrastructure digest                                       | `hn`             |
| `olap-weekly.md`   | Weekly OLAP rollup                                                           | `weekly`         |
| `olap-monthly.md`  | Monthly OLAP rollup                                                          | `monthly`        |

Each daily, weekly, and monthly report also has an English variant with `-en` in the filename.

## Report Shapes

- `olap-index*`: ecosystem overview, repo-by-repo summaries, comparison analysis
- `olap-engines*`: Apache Doris deep dive, peer engine summaries, cross-engine comparison
- `olap-trending*`: GitHub Trending + Search API trend analysis for OLAP/data infrastructure
- `olap-hn*`: top HN stories, discussion themes, and sentiment for data infrastructure topics
- `olap-weekly*`: 7-day rollup generated from the first available daily report in the priority order `olap-index` -> `olap-engines` -> `olap-trending` -> `olap-hn` -> `olap-web`
- `olap-monthly*`: month-level rollup generated from weekly reports or sampled daily reports using the same priority-based daily source fallback

## Schedule

| Workflow       | Cron        | UTC              | CST              |
| -------------- | ----------- | ---------------- | ---------------- |
| Daily digest   | `0 0 * * *` | 00:00 daily      | 08:00 daily      |
| Weekly rollup  | `0 1 * * 1` | 01:00 Monday     | 09:00 Monday     |
| Monthly rollup | `0 2 1 * *` | 02:00 on the 1st | 10:00 on the 1st |

## Historical Data

Historical reports live in [`digests/`](./digests/). The Web UI and manifest still understand some legacy `ai-*` report IDs so older archived reports remain browsable.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=duanyytop/agents-radar&type=Date)](https://star-history.com/#duanyytop/agents-radar&Date)
