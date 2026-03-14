# OLAP & Data Infra Open Source Trends 2026-03-14

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-14 01:15 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
_Date: 2026-03-14_

## Step 1 — Filtered Projects Relevant to OLAP / Data Infrastructure / Analytics

From **today’s trending list**, the clearly relevant projects are:
- [dolthub/dolt](https://github.com/dolthub/dolt)
- [langflow-ai/openrag](https://github.com/langflow-ai/openrag) — relevant as data/search infrastructure rather than classic OLAP

From the **topic search results**, the relevant OLAP/data-infra projects include:
- OLAP / analytics DBs and engines: [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse), [duckdb/duckdb](https://github.com/duckdb/duckdb), [apache/doris](https://github.com/apache/doris), [StarRocks/starrocks](https://github.com/StarRocks/starrocks), [questdb/questdb](https://github.com/questdb/questdb), [apache/datafusion](https://github.com/apache/datafusion), [trinodb/trino](https://github.com/trinodb/trino), [prestodb/presto](https://github.com/prestodb/presto), [apache/cloudberry](https://github.com/apache/cloudberry), [chdb-io/chdb](https://github.com/chdb-io/chdb), [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase), [crate/crate](https://github.com/crate/crate), [databendlabs/databend](https://github.com/databendlabs/databend), [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- Lakehouse / storage / catalog: [apache/polaris](https://github.com/apache/polaris), [apache/gravitino](https://github.com/apache/gravitino), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), [apache/fluss](https://github.com/apache/fluss), [facebookincubator/nimble](https://github.com/facebookincubator/nimble), [datazip-inc/olake](https://github.com/datazip-inc/olake)
- Integration / ETL / warehouse ops: [dlt-hub/dlt](https://github.com/dlt-hub/dlt), [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server), [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven), [elementary-data/elementary](https://github.com/elementary-data/elementary), [cloudera/hue](https://github.com/cloudera/hue)
- BI / tooling / benchmark: [apache/superset](https://github.com/apache/superset), [metabase/metabase](https://github.com/metabase/metabase), [getredash/redash](https://github.com/getredash/redash), [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)

Excluded as not core OLAP/data-infra for this report: general AI agent repos, browsers, prompt tools, TTS, general observability/web analytics products unless strongly tied to analytical infrastructure.

---

## Step 2 — Categorization

### 🗄️ OLAP Engines
Primary focus: analytical databases, columnar engines, MPP systems
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [questdb/questdb](https://github.com/questdb/questdb)
- [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)

### 📦 Storage Formats & Lakehouse
Primary focus: table/storage layers, metadata/catalog, streaming storage, file formats
- [apache/polaris](https://github.com/apache/polaris)
- [apache/gravitino](https://github.com/apache/gravitino)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [apache/fluss](https://github.com/apache/fluss)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [databendlabs/databend](https://github.com/databendlabs/databend)

### ⚙️ Query & Compute
Primary focus: federated/distributed query engines and embedded compute
- [trinodb/trino](https://github.com/trinodb/trino)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)
- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)

### 🔗 Data Integration & ETL
Primary focus: ingestion, replication, loading, reverse ETL, event delivery
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- [dolthub/dolt](https://github.com/dolthub/dolt)
- [langflow-ai/openrag](https://github.com/langflow-ai/openrag)

### 🧰 Data Tooling
Primary focus: BI, SQL tooling, observability, benchmarks
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [getredash/redash](https://github.com/getredash/redash)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [cloudera/hue](https://github.com/cloudera/hue)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)

---

## 1. Today’s Highlights

Today’s data-infra signal is less about classic OLAP engines suddenly trending on the front page, and more about continued depth in the surrounding stack: lakehouse catalogs, embedded analytics engines, and data-to-AI retrieval infrastructure. The only directly relevant repo on the real-time trending list is [Dolt](https://github.com/dolthub/dolt), reinforcing continued interest in Git-like data versioning and reproducible data workflows. In the broader active topic set, the strongest concentration remains around high-performance analytical engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks). A second notable pattern is the maturation of the lakehouse control plane: [Apache Polaris](https://github.com/apache/polaris), [Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) show that catalog/interoperability is now a major open-source battleground. Finally, AI-adjacent data systems such as [OpenRAG](https://github.com/langflow-ai/openrag) and “agent-ready warehouse” positioning from [Databend](https://github.com/databendlabs/databend) indicate that analytical infrastructure is increasingly being packaged for retrieval, semantic access, and agent workflows.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,321  
  Real-time columnar analytics DBMS and still the clearest open-source reference point for fast operational OLAP and benchmark leadership.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,645  
  In-process analytical SQL database that remains highly relevant as embedded OLAP becomes standard in notebooks, apps, and local analytics workflows.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,105  
  Unified analytics database with strong momentum in real-time and lakehouse-style query scenarios, especially where easy operations matter.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,475  
  A high-performance open query engine for sub-second analytics on and off the lakehouse, worth attention for converged serving and BI workloads.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,756  
  Time-series-first OLAP engine that continues to represent the real-time analytics segment within the broader OLAP landscape.

- [OceanBase](https://github.com/oceanbase/oceanbase) — ⭐10,015  
  Distributed HTAP-oriented database increasingly positioned for mixed transactional, analytical, and AI workloads.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,639  
  In-process OLAP SQL engine powered by ClickHouse, notable for bringing high-performance analytics directly into embedded Python workflows.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,191  
  Mature MPP warehouse alternative in the Greenplum lineage, relevant for teams still preferring classic shared-nothing warehouse architecture.

### 📦 Storage Formats & Lakehouse

- [Databend](https://github.com/databendlabs/databend) — ⭐9,197  
  A cloud-native warehouse on object storage with strong “analytics + search + AI” positioning, reflecting convergence across data modalities.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,905  
  Federated open data catalog focused on geo-distributed metadata, an important sign that metadata federation is becoming strategic infrastructure.

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,872  
  Open catalog for Apache Iceberg and one of the clearest signals that Iceberg interoperability remains central to the lakehouse stack.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,816  
  Streaming storage for real-time analytics, representing the growing overlap between stream systems and analytical table/storage layers.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,221  
  Rust-based Iceberg REST catalog emphasizing secure and fast metadata services, notable for lightweight modern implementation choices.

- [Nimble](https://github.com/facebookincubator/nimble) — ⭐696  
  A new file format for large columnar datasets, worth watching as a possible early-stage challenge to established columnar storage assumptions.

### ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — ⭐12,635  
  The leading open distributed SQL query engine for federated analytics across data lakes, warehouses, and operational systems.

- [Presto](https://github.com/prestodb/presto) — ⭐16,668  
  Still an important distributed query engine in the ecosystem and useful as a barometer for the enduring SQL-on-anything model.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,499  
  A fast Rust SQL engine that has become foundational infrastructure for next-generation analytical systems and custom compute stacks.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  Distributed execution layer for DataFusion, signaling continued interest in composable Rust-native distributed query infrastructure.

- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,940  
  WebAssembly port of DuckDB that underscores browser and edge-native analytics as a real deployment pattern, not just a demo idea.

- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
  Storage-agnostic MySQL-compatible query engine, valuable for builders creating programmable SQL layers over custom backends.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐193  
  Self-hosted distributed query engine from Firebolt, worth monitoring as proprietary cloud warehouse ideas continue to open-source selectively.

### 🔗 Data Integration & ETL

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,307  
  Replication and ingestion tool to Iceberg or Parquet from databases, Kafka, and S3, highly aligned with real-time lakehouse ingestion needs.

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,041  
  Python-native data loading framework that keeps gaining relevance as engineers prefer code-first ingestion over heavyweight ETL platforms.

- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — ⭐4,374  
  Event pipeline and warehouse delivery system, representing the continuing importance of customer/event data pipelines in warehouse-centric stacks.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,643  
  Reverse ETL alternative that reflects demand for pushing warehouse data back into operational SaaS tools.

- [Dolt](https://github.com/dolthub/dolt) — ⭐0 (+60 today)  
  Git for data, and today’s only directly trending data-infra repo; its presence signals sustained interest in data versioning and reproducibility.

- [OpenRAG](https://github.com/langflow-ai/openrag) — ⭐0 (+905 today)  
  RAG platform built on OpenSearch and document tooling, relevant because retrieval infrastructure is increasingly overlapping with analytical/search data stacks.

### 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — ⭐70,950  
  Leading open-source BI and exploration layer, still central wherever teams want warehouse-native dashboards without SaaS lock-in.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,394  
  Widely adopted BI tool focused on accessibility, indicating continued demand for easy analytics interfaces on top of modern warehouses.

- [Redash](https://github.com/getredash/redash) — ⭐28,276  
  SQL-first dashboards and visualizations; despite ecosystem age, it remains a durable part of the open analytics tooling stack.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,273  
  dbt-native observability platform that reflects the shift from just building pipelines to continuously validating data quality and freshness.

- [Hue](https://github.com/cloudera/hue) — ⭐1,449  
  SQL query assistant for databases and warehouses, relevant as lightweight multi-engine query UX continues to matter in heterogeneous environments.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐969  
  Benchmark suite for analytical databases and especially important today as performance claims across open OLAP engines intensify.

---

## 3. Trend Signal Analysis

The strongest signal today is not a sudden breakout of a new OLAP engine on GitHub Trending, but the continued expansion of the **data infrastructure surface area around analytics**. Core engines such as ClickHouse, DuckDB, Doris, StarRocks, Trino, and DataFusion remain the gravitational center, yet the most interesting movement is happening in adjacent layers: **catalogs, embedded execution, streaming storage, and AI-connected retrieval/query workflows**.

Among tool types, **lakehouse control-plane projects** are showing especially strong structural relevance. [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) all point to the same industry priority: open metadata, Iceberg interoperability, and federated governance across engines. This aligns closely with recent cloud-warehouse and lakehouse developments, where the catalog increasingly becomes the durable integration point rather than any single query engine.

A second signal is **composable compute**. Rust-based infrastructure such as [Apache DataFusion](https://github.com/apache/datafusion), [Databend](https://github.com/databendlabs/databend), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) suggests that performance-focused, modular systems are still gaining mindshare. [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) and [chDB](https://github.com/chdb-io/chdb) further reinforce embedded and local-first analytics as an active direction.

The most novel direction is the blending of **analytics, search, and AI retrieval**. [OpenRAG](https://github.com/langflow-ai/openrag) on today’s trending page and Databend’s “agent-ready warehouse” positioning suggest that analytical infrastructure is being repackaged for AI agents, semantic retrieval, and hybrid search. This does not replace OLAP; it expands the consumption layer sitting on top of lakehouse and warehouse backends.

---

## 4. Community Hot Spots

- **[Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Watch this cluster closely: open catalog and metadata interoperability is becoming a core competitive layer in the lakehouse stack.

- **[DuckDB](https://github.com/duckdb/duckdb), [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm), [chDB](https://github.com/chdb-io/chdb)**  
  Embedded analytics is accelerating beyond desktop notebooks into browser, app, and library-level deployment models.

- **[Apache DataFusion](https://github.com/apache/datafusion) and [Ballista](https://github.com/apache/datafusion-ballista)**  
  These are key building blocks for teams assembling custom analytical systems rather than adopting monolithic databases.

- **[OLake](https://github.com/datazip-inc/olake) and [dlt](https://github.com/dlt-hub/dlt)**  
  Code-first ingestion into Iceberg/Parquet and modern warehouses remains a practical hotspot for data engineering teams modernizing pipelines.

- **[Databend](https://github.com/databendlabs/databend) and [OpenRAG](https://github.com/langflow-ai/openrag)**  
  The analytics/search/AI convergence trend is becoming concrete, especially where object storage, retrieval, and SQL need to work together.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*