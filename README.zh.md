# agents-radar

[English](./README.md) | 中文

`agents-radar` 是一个面向 OLAP 与数据基础设施开源生态的双语日报生成器。GitHub Actions 每天在 00:00 UTC（08:00 CST）运行，抓取项目动态与生态信号，调用 LLM 生成中英文报告，发布为 GitHub Issues，并将 Markdown 输出提交到仓库。

## Web UI

**[https://duanyytop.github.io/agents-radar](https://duanyytop.github.io/agents-radar)**

可通过 GitHub Pages 浏览历史报告。侧边栏由 `manifest.json` 驱动，正文直接渲染 `digests/YYYY-MM-DD/` 下的 Markdown 文件。

## RSS 订阅

**[https://duanyytop.github.io/agents-radar/feed.xml](https://duanyytop.github.io/agents-radar/feed.xml)**

RSS Feed 会聚合最新 30 条报告条目。

## MCP Server

**`https://agents-radar-mcp.duanyytop.workers.dev`**

托管的 [Model Context Protocol](https://modelcontextprotocol.io) 服务可把最近报告历史暴露为 MCP 工具。

可用工具：

| 工具           | 说明                     |
| -------------- | ------------------------ |
| `list_reports` | 列出可用日期与报告类型   |
| `get_latest`   | 获取某类报告的最新一期   |
| `get_report`   | 按日期和类型获取指定报告 |
| `search`       | 按关键词搜索最近报告     |

示例提问：

- “今天 OLAP 生态有什么新动态？”
- “搜索最近报告里关于 ClickHouse 的内容”
- “给我看 2026-03-05 的 OLAP 趋势报告”

Claude Desktop 配置：

```json
{
  "mcpServers": {
    "agents-radar": {
      "url": "https://agents-radar-mcp.duanyytop.workers.dev"
    }
  }
}
```

OpenClaw 配置：

```bash
openclaw mcp add --transport http agents-radar https://agents-radar-mcp.duanyytop.workers.dev
```

自托管：

```bash
cd mcp
pnpm install
wrangler deploy
```

## Telegram 频道

**[t.me/agents_radar](https://t.me/agents_radar)**

每日通知会附带最新报告链接、Web UI 和 RSS Feed。

## 追踪来源

### 核心主项目

| 项目         | 仓库                                            |
| ------------ | ----------------------------------------------- |
| Apache Doris | [apache/doris](https://github.com/apache/doris) |

### OLAP 引擎对比项目

| 项目           | 仓库                                                                  |
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

### OLAP 生态索引项目

| 项目         | 仓库                                                                |
| ------------ | ------------------------------------------------------------------- |
| dbt-core     | [dbt-labs/dbt-core](https://github.com/dbt-labs/dbt-core)           |
| Apache Spark | [apache/spark](https://github.com/apache/spark)                     |
| Substrait    | [substrait-io/substrait](https://github.com/substrait-io/substrait) |

### GitHub 趋势与搜索

每天并行抓取两个来源：

| 来源                                                           | 说明                                                                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [github.com/trending](https://github.com/trending?since=daily) | GitHub Trending 日榜 HTML 抓取                                                                                    |
| GitHub Search API                                              | 搜索最近 7 天活跃、匹配 `olap`、`data-warehouse`、`lakehouse`、`query-engine`、`columnar`、`analytics` 主题的仓库 |

### Hacker News

通过 [Algolia HN Search API](https://hn.algolia.com/api) 并行查询 `OLAP`、`ClickHouse`、`DuckDB`、`Apache Doris`、`lakehouse`、`data warehouse`，去重后按 points 排序，保留前 30 条。

### 官网内容

仓库中仍保留旧的 sitemap 抓取器，但在真正配置 OLAP 官方站点前，OLAP 网页报告默认禁用。当前没有 OLAP 官网来源时，会跳过 `olap-web` 步骤，而不是生成错误标注的报告。

## 功能特性

- 抓取配置中的 OLAP 项目近期 Issues、PR 和 Releases
- 生成 OLAP 生态索引日报
- 生成主项目深度日报与 OLAP 引擎横向对比日报
- 基于 OLAP / 数据基础设施输入生成 GitHub 趋势与 Hacker News 报告
- 基于每个日期按优先级选中的单份 `olap-*` 日报与既有周报继续生成周报和月报
- 发布 GitHub Issues，并将 Markdown 写入 `digests/YYYY-MM-DD/`
- 生成 Web UI 所需的 `manifest.json` 与 RSS 所需的 `feed.xml`
- 通过 `LLM_PROVIDER` 支持多种模型后端

## 部署配置

### 1. Fork 本仓库

### 2. 自定义 `config.yml`（可选）

仓库追踪列表由 `config.yml` 配置，并在每次运行时自动加载。

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

### 3. 添加 GitHub Actions Secrets

| Secret               | 必填                      | 说明                                                                        |
| -------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `LLM_PROVIDER`       | 可选                      | `anthropic`（默认）、`openai`、`github-copilot`、`openrouter` 或 `aigocode` |
| `ANTHROPIC_API_KEY`  | `anthropic` 时            | Anthropic API Key                                                           |
| `ANTHROPIC_BASE_URL` | 可选                      | Anthropic 兼容接口覆盖                                                      |
| `OPENAI_API_KEY`     | `openai` 或 `aigocode` 时 | OpenAI API Key，或 AigoCode 的兜底 Key                                      |
| `OPENAI_BASE_URL`    | 可选                      | OpenAI 接口覆盖                                                             |
| `OPENROUTER_API_KEY` | `openrouter` 时           | OpenRouter API Key                                                          |
| `AIGOCODE_API_KEY`   | `aigocode` 时可选         | AigoCode 首选 API Key                                                       |
| `AIGOCODE_BASE_URL`  | 可选                      | AigoCode 接口覆盖                                                           |
| `TELEGRAM_BOT_TOKEN` | 可选                      | Telegram bot token                                                          |
| `TELEGRAM_CHAT_ID`   | 可选                      | Telegram 目标频道 / 群组 / 用户 ID                                          |

`GITHUB_TOKEN` 由 GitHub Actions 自动提供；当 `LLM_PROVIDER=github-copilot` 时也会被用于 LLM 调用。

### 4. 启用工作流

仓库包含日、周、月三个工作流，位于 `.github/workflows/`。

## LLM Provider

| Provider       | `LLM_PROVIDER`   | 所需环境变量                           | 默认模型或接口                          |
| -------------- | ---------------- | -------------------------------------- | --------------------------------------- |
| Anthropic      | `anthropic`      | `ANTHROPIC_API_KEY`                    | `claude-sonnet-4-6`                     |
| OpenAI         | `openai`         | `OPENAI_API_KEY`                       | `gpt-4o`                                |
| GitHub Copilot | `github-copilot` | `GITHUB_TOKEN`                         | `gpt-4o`                                |
| OpenRouter     | `openrouter`     | `OPENROUTER_API_KEY`                   | `anthropic/claude-sonnet-4`             |
| AigoCode       | `aigocode`       | `AIGOCODE_API_KEY` 或 `OPENAI_API_KEY` | `https://api.aigocode.com/v1/responses` |

可选模型覆盖：

- `ANTHROPIC_MODEL`
- `OPENAI_MODEL`
- `GITHUB_COPILOT_MODEL`
- `OPENROUTER_MODEL`

## 本地运行

```bash
pnpm install

export GITHUB_TOKEN=ghp_xxxxx
export DIGEST_REPO=owner/repo

# 方式 A: Anthropic
export LLM_PROVIDER=anthropic
export ANTHROPIC_API_KEY=sk-ant-xxxxx

# 方式 B: OpenAI
# export LLM_PROVIDER=openai
# export OPENAI_API_KEY=sk-xxxxx

# 方式 C: GitHub Copilot
# export LLM_PROVIDER=github-copilot

# 方式 D: OpenRouter
# export LLM_PROVIDER=openrouter
# export OPENROUTER_API_KEY=sk-or-xxxxx

# 方式 E: AigoCode
# export LLM_PROVIDER=aigocode
# export AIGOCODE_API_KEY=sk-xxxxx

pnpm start
```

常用命令：

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm weekly
pnpm monthly
pnpm manifest
```

## 输出文件

报告写入 `digests/YYYY-MM-DD/`：

| 文件               | 说明                                           | Issue 标签       |
| ------------------ | ---------------------------------------------- | ---------------- |
| `olap-index.md`    | OLAP 生态索引日报                              | `digest`         |
| `olap-engines.md`  | 主项目深度报告 + 引擎横向对比                  | `primary-engine` |
| `olap-web.md`      | 官网内容报告；目前在未配置 OLAP 来源时跳过     | `web`            |
| `olap-trending.md` | 面向 OLAP / 数据基础设施项目的 GitHub 趋势报告 | `trending`       |
| `olap-hn.md`       | Hacker News 数据基础设施社区日报               | `hn`             |
| `olap-weekly.md`   | OLAP 周报                                      | `weekly`         |
| `olap-monthly.md`  | OLAP 月报                                      | `monthly`        |

每类日报、周报、月报均有对应的 `-en` 英文版本。

## 报告结构

- `olap-index*`：生态概览、索引项目逐项摘要、横向比较分析
- `olap-engines*`：Apache Doris 深度报告、对比引擎摘要、跨引擎分析
- `olap-trending*`：GitHub Trending 与 Search API 驱动的 OLAP / 数据基础设施趋势分析
- `olap-hn*`：HN 热门帖子、讨论主题与社区情绪
- `olap-weekly*`：基于近 7 天中按 `olap-index` -> `olap-engines` -> `olap-trending` -> `olap-hn` -> `olap-web` 优先级选中的单份日报生成的周报
- `olap-monthly*`：基于周报或采样日报生成的月报，采样日报同样使用上述优先级回退规则

## 定时计划

| 工作流 | Cron        | UTC             | CST             |
| ------ | ----------- | --------------- | --------------- |
| 日报   | `0 0 * * *` | 每天 00:00      | 每天 08:00      |
| 周报   | `0 1 * * 1` | 周一 01:00      | 周一 09:00      |
| 月报   | `0 2 1 * *` | 每月 1 日 02:00 | 每月 1 日 10:00 |

## 历史数据

历史报告保存在 [`digests/`](./digests/) 中。为了兼容旧归档，Web UI 和 manifest 仍可识别部分历史 `ai-*` 报告 ID。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=duanyytop/agents-radar&type=Date)](https://star-history.com/#duanyytop/agents-radar&Date)
