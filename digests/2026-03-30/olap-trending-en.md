# OLAP & Data Infra Open Source Trends 2026-03-30

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-30 01:45 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
_Date: 2026-03-30_

## Step 1 — Filtered Relevant Projects

From **today’s trending list**, only these are clearly relevant to OLAP / data infrastructure / analytics:

- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB) — financial data platform
- [twentyhq/twenty](https://github.com/twentyhq/twenty) — application/data platform relevance is adjacent, but not core OLAP/data infra  
- I **exclude** the rest of the daily trending repos as primarily AI agents, voice, devtools, utilities, or consumer apps rather than data infra.

From the **topic search results**, the clearly relevant OLAP / analytics / data infra projects include engines, lakehouse/catalog, ingestion, BI, observability, and query systems such as:
[ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), [QuestDB](https://github.com/questdb/questdb), [Databend](https://github.com/databendlabs/databend), [Apache DataFusion](https://github.com/apache/datafusion), [Trino](https://github.com/trinodb/trino), [Presto](https://github.com/prestodb/presto), [Apache Superset](https://github.com/apache/superset), [Metabase](https://github.com/metabase/metabase), [Grafana](https://github.com/grafana/grafana), [PostHog](https://github.com/PostHog/posthog), [dlt](https://github.com/dlt-hub/dlt), [Rudder Server](https://github.com/rudderlabs/rudder-server), [OLake](https://github.com/datazip-inc/olake), [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Fluss](https://github.com/apache/fluss), [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake), [chDB](https://github.com/chdb-io/chdb), [Cloudberry](https://github.com/apache/cloudberry), [Arc](https://github.com/Basekick-Labs/arc), and others.

---

## 1. Today's Highlights

Today’s GitHub signal is not a broad-based spike across classic OLAP engines, but there is still a meaningful data point: [OpenBB](https://github.com/OpenBB-finance/OpenBB) is the only clearly data-relevant project on the daily hot list, indicating continued appetite for platforms that package data access, analytics workflows, and AI-facing interfaces together. In the broader topic dataset, mature analytical databases remain dominant by installed community base, led by [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks). A second notable pattern is the growing density of “data engine for AI agents” positioning, visible in projects like [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [Wren Engine](https://github.com/Canner/wren-engine). Finally, the lakehouse control plane continues to deepen: catalogs, streaming storage, and Iceberg-oriented infrastructure such as [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Fluss](https://github.com/apache/fluss) are increasingly central to the open-source stack.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,591  
  Real-time analytical DBMS and still one of the strongest anchors in open-source OLAP, especially for low-latency event and log analytics.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐37,041  
  In-process analytical SQL database that remains highly relevant as embedded OLAP increasingly becomes the default for local and app-integrated analytics.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,161  
  Unified analytics database with strong momentum in real-time and interactive analytics use cases, especially as users seek simpler MPP deployments.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,515  
  High-performance query engine for real-time analytics and lakehouse workloads, worth attention for sub-second analytics on mixed storage.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,797  
  Time-series-focused OLAP database that continues to represent the specialized real-time analytics segment.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,215  
  Cloud-native warehouse/analytics engine with explicit AI and agent positioning, reflecting where modern warehouse projects are heading.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,646  
  An in-process OLAP SQL engine powered by ClickHouse, notable for the broader shift toward embedded analytical execution.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  Mature MPP database lineage in open source, relevant as teams revisit Greenplum-style warehouse architectures.

### 📦 Storage Formats & Lakehouse

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,887  
  Open source Iceberg catalog that matters because metadata interoperability is becoming a strategic control point in lakehouse stacks.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,930  
  Federated metadata/catalog layer, important for organizations managing multi-engine and multi-region data estates.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,231  
  Rust-based Iceberg REST catalog showing the ecosystem’s move toward lighter, performance-oriented catalog services.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,834  
  Streaming storage for real-time analytics, signaling convergence between streaming systems and lakehouse infrastructure.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,312  
  Replication pipeline to Iceberg or Parquet, worth watching because operational ingestion into open table/lake formats is a high-demand layer.

- [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  Real-time analytics on Postgres tables, interesting as PostgreSQL ecosystems absorb lakehouse-like analytical capabilities.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐977  
  Not a storage framework itself, but increasingly important as open benchmark culture shapes storage-engine and lakehouse credibility.

### ⚙️ Query & Compute

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,545  
  Rust SQL query engine that remains one of the clearest building blocks for the next generation of composable analytics systems.

- [Trino](https://github.com/trinodb/trino) — ⭐12,669  
  Distributed SQL engine and still a core layer for lakehouse query federation across heterogeneous data systems.

- [Presto](https://github.com/prestodb/presto) — ⭐16,669  
  A foundational distributed SQL engine whose continued relevance reflects the durability of federation-based analytics architecture.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  Distributed execution for DataFusion, notable as the Rust analytics stack matures beyond embedded use cases.

- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,954  
  Browser/WebAssembly analytics execution, reinforcing the rise of client-side and edge OLAP.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  Self-hosted distributed query engine that suggests renewed interest in warehouse-grade execution layers outside SaaS-only delivery.

- [Arc](https://github.com/Basekick-Labs/arc) — ⭐567  
  DuckDB + Parquet + Arrow analytical database in a single Go binary, reflecting demand for operational simplicity and embedded analytics packaging.

- [Wren Engine](https://github.com/Canner/wren-engine) — ⭐613  
  Context/query engine for AI agents built on DataFusion, notable as semantic and agent-facing query layers become a new subcategory.

### 🔗 Data Integration & ETL

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,145  
  Python-first loading framework that continues to gain relevance as teams prefer code-centric ELT over heavyweight orchestration.

- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,380  
  Segment alternative focused on event routing and warehouse delivery, important in the composable CDP/data pipeline space.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,645  
  Reverse ETL project worth attention as warehouse-to-application activation remains a practical growth area.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,312  
  Fast replication into Iceberg/Parquet, relevant because open lakehouse adoption depends on easy incremental ingestion.

- [OpenBB](https://github.com/OpenBB-finance/OpenBB) — ⭐0 (+137 today)  
  Financial data platform with strong data-access and analytics workflow value, and today’s only clearly hot data project from the trending feed.

### 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — ⭐71,641  
  Leading open-source BI and data exploration platform, still the default dashboarding/UI layer for many modern analytics stacks.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,665  
  Accessible BI tool that remains strong because simplicity and self-service continue to matter as much as engine performance.

- [Grafana](https://github.com/grafana/grafana) — ⭐72,835  
  Observability and visualization platform whose multi-source model keeps it highly relevant to analytics-adjacent infrastructure teams.

- [PostHog](https://github.com/PostHog/posthog) — ⭐32,269  
  Product analytics plus warehouse and CDP capabilities, representing the continued fusion of analytics tooling with platform workflows.

- [Langfuse](https://github.com/langfuse/langfuse) — ⭐24,021  
  LLM observability rather than classical BI, but increasingly data-infra relevant as telemetry, evaluation, and analytics converge.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  dbt-native observability tooling, useful because warehouse reliability remains a top operational concern.

- [Hue](https://github.com/cloudera/hue) — ⭐1,450  
  SQL query assistant/UI for databases and warehouses, noteworthy as lightweight SQL frontends continue to find a place beside BI suites.

---

## 3. Trend Signal Analysis

The strongest community signal today is **not a breakout in core OLAP databases themselves**, but in **data platforms that sit closer to users, analysts, and AI-driven workflows**. [OpenBB](https://github.com/OpenBB-finance/OpenBB) appearing on the daily trending list suggests that “data access + packaged analytics + agent-ready interface” is currently easier to excite developers around than a new standalone warehouse engine. This aligns with a broader ecosystem trend: infrastructure is being rediscovered through end-user workflows rather than through storage internals alone.

From the topic results, the center of gravity remains split across three durable layers. First, **analytical engines** such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks) continue to dominate open-source mindshare. Second, **query substrates** like [Apache DataFusion](https://github.com/apache/datafusion), [Trino](https://github.com/trinodb/trino), and [Presto](https://github.com/prestodb/presto) show that composable execution layers remain strategic. Third, **catalog and lakehouse control planes**—notably [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)—are becoming more visible, which is consistent with the recent shift from “just store data in open formats” to “govern and coordinate open formats across engines.”

A noteworthy newer direction is the explicit **AI-native warehouse / analytics engine** narrative. Projects like [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [Wren Engine](https://github.com/Canner/wren-engine) indicate that agent-facing query semantics, context layers, and hybrid analytical/search workloads are becoming part of the OLAP roadmap. This is tightly connected to lakehouse and cloud-warehouse evolution: open storage is table stakes, while the next battleground is intelligent compute, metadata interoperability, and embedded analytical execution.

---

## 4. Community Hot Spots

- **[OpenBB](https://github.com/OpenBB-finance/OpenBB)**  
  Today’s clearest live GitHub signal for data-related interest; worth watching as an example of analytics platforms becoming AI- and workflow-friendly.

- **[Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg/catalog infrastructure is increasingly strategic because multi-engine interoperability is now a first-class requirement.

- **[Apache DataFusion](https://github.com/apache/datafusion) and [Wren Engine](https://github.com/Canner/wren-engine)**  
  The Rust/composable query-engine stack is maturing and increasingly powering new semantic and agent-facing data systems.

- **[DuckDB](https://github.com/duckdb/duckdb), [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm), and [chDB](https://github.com/chdb-io/chdb)**  
  Embedded analytics is no longer niche; in-process and browser-side OLAP are becoming normal deployment patterns.

- **[Databend](https://github.com/databendlabs/databend), [StarRocks](https://github.com/StarRocks/starrocks), and [Apache Doris](https://github.com/apache/doris)**  
  These represent the active frontier where warehouse, lakehouse, and real-time analytics capabilities are converging into unified systems.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*