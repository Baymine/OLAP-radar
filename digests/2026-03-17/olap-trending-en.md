# OLAP & Data Infra Open Source Trends 2026-03-17

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-17 01:25 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-17

## Step 1 — Filtered Relevant Projects

From **today’s GitHub Trending**, only these are clearly relevant to OLAP / data infrastructure / analytics:

- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — browser-side knowledge graph / code intelligence engine
- [volcengine/OpenViking](https://github.com/volcengine/OpenViking) — context database for AI agents

All other trending repos are primarily agent tooling, browser/dev tools, or unrelated utilities rather than data infrastructure.

From the **topic search results**, the clearly relevant OLAP/data-infra projects include engines, lakehouse/catalogs, query layers, ingestion tools, BI/observability, and benchmarks. I excluded obviously non-core items for this report such as generic learning lists and unrelated domain-specific tools.

---

## 1. Today's Highlights

Today’s GitHub signal is relatively light on classic OLAP engines in the real-time trending list, but strong in an adjacent direction: **data systems for AI-native retrieval, memory, and semantic context management**. The two standout trending repos, [GitNexus](https://github.com/abhigyanpatwari/GitNexus) and [OpenViking](https://github.com/volcengine/OpenViking), suggest growing interest in **knowledge-graph and context-database infrastructure** as a new layer next to traditional analytics stacks.

In the broader topic data, established analytical engines remain dominant: [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino) continue to anchor open-source OLAP attention. Lakehouse governance and interoperability also remain active, especially around [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino).

A notable pattern is the convergence of **OLAP, search, AI, and catalog layers**. Projects like [Databend](https://github.com/databendlabs/databend), [SeekDB](https://github.com/oceanbase/seekdb), and [Wren Engine](https://github.com/Canner/wren-engine) reflect a market moving toward unified analytical platforms rather than isolated SQL engines.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐46,360**
  - A leading real-time analytical DBMS; still one of the strongest open-source OLAP references for high-performance columnar analytics.

- [DuckDB](https://github.com/duckdb/duckdb) — **⭐36,706**
  - The dominant embedded analytical database; worth attention as the center of in-process analytics and local/laptop data workflows.

- [Apache Doris](https://github.com/apache/doris) — **⭐15,114**
  - A unified analytics database with strong real-time and interactive query positioning; important in the MPP OLAP space.

- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐11,480**
  - A fast query engine for both internal storage and lakehouse data; notable for sub-second analytics over mixed storage layers.

- [QuestDB](https://github.com/questdb/questdb) — **⭐16,766**
  - High-performance time-series OLAP engine; relevant as observability and event analytics workloads continue growing.

- [OceanBase](https://github.com/oceanbase/oceanbase) — **⭐10,016**
  - A distributed HTAP database pushing transactional + analytical + AI workload convergence.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — **⭐1,191**
  - Mature MPP data warehouse technology in open source; relevant for teams wanting Greenplum-style warehouse architecture.

- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc) — **⭐557**
  - A newer lightweight analytical database combining DuckDB SQL, Parquet, and Arrow in a single binary; interesting for edge and embedded analytics.

---

### 📦 Storage Formats & Lakehouse

- [Apache Polaris](https://github.com/apache/polaris) — **⭐1,879**
  - An open Iceberg catalog focused on interoperability; important as catalog neutrality becomes strategic in lakehouse adoption.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐1,221**
  - A Rust-based Iceberg REST catalog; worth watching as lightweight, high-performance catalog services gain traction.

- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐2,910**
  - Federated metadata lake/catalog infrastructure; significant for multi-region and multi-engine governance.

- [Apache Fluss](https://github.com/apache/fluss) — **⭐1,822**
  - Streaming storage for real-time analytics; notable because storage engines are increasingly optimized for streaming-to-OLAP paths.

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — **⭐1,309**
  - Real-time replication into Iceberg or Parquet; highly relevant to operationalizing open lakehouse ingestion.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐698**
  - A new file format for large columnar datasets; one of the more interesting storage-format experiments in the ecosystem.

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐973**
  - Benchmark suite rather than a format, but increasingly important as lakehouse and OLAP vendors compete on reproducible analytical performance.

- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — **⭐2,135**
  - A large-scale fault-tolerant big data platform; relevant where storage, compute, and data platform concerns are tightly integrated.

---

### ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — **⭐12,643**
  - The standard-bearer for distributed SQL across heterogeneous data systems; central to the open lakehouse compute layer.

- [Presto](https://github.com/prestodb/presto) — **⭐16,670**
  - Still a major distributed query engine in production ecosystems; remains relevant for federation and interactive SQL at scale.

- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐8,507**
  - A fast Rust query engine and execution framework; increasingly influential as a composable compute substrate.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐1,993**
  - Distributed execution on top of DataFusion; worth watching as modular Rust-native analytics stacks mature.

- [Databend](https://github.com/databendlabs/databend) — **⭐9,201**
  - A cloud-warehouse-style engine rebuilt for unified analytics, search, and AI; notable for its “agent-ready warehouse” positioning.

- [chDB](https://github.com/chdb-io/chdb) — **⭐2,640**
  - In-process OLAP powered by ClickHouse; compelling for embedded analytics, Python-native workflows, and low-friction deployment.

- [duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — **⭐1,941**
  - DuckDB in WebAssembly; a strong signal that analytical compute is moving into browser and edge environments.

- [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx) — **⭐112**
  - SQL-on-everything query engine; small but aligned with demand for lightweight federated querying.

---

### 🔗 Data Integration & ETL

- [dlt](https://github.com/dlt-hub/dlt) — **⭐5,052**
  - A Python-first data loading framework; relevant because pragmatic ingestion remains a bottleneck in modern analytics stacks.

- [rudder-server](https://github.com/rudderlabs/rudder-server) — **⭐4,374**
  - Event pipeline/CDP infrastructure; important for routing product and behavioral data into warehouses and lakehouses.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — **⭐1,641**
  - Open-source reverse ETL; significant as warehouse activation remains a fast-growing data engineering use case.

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — **⭐1,309**
  - Replication from databases, Kafka, and S3 into Iceberg/Parquet; directly aligned with real-time lakehouse ingestion trends.

- [Dinky](https://github.com/DataLinkDC/dinky) — **⭐3,707**
  - Flink-based real-time data development platform; relevant for teams standardizing around streaming ETL.

- [Transformalize](https://github.com/dalenewman/Transformalize) — **⭐161**
  - Configurable ETL engine; smaller project, but still useful as a long-tail OSS integration option.

---

### 🧰 Data Tooling

- [GitNexus](https://github.com/abhigyanpatwari/GitNexus) — **⭐0 (+1,860 today)**
  - A browser-native knowledge graph and Graph RAG engine for codebases; noteworthy because graph-style data tooling is attracting immediate community attention.

- [OpenViking](https://github.com/volcengine/OpenViking) — **⭐0 (+2,012 today)**
  - A context database for AI agents; while adjacent to analytics, it signals rising interest in structured context stores as a new data infrastructure class.

- [Apache Superset](https://github.com/apache/superset) — **⭐70,985**
  - One of the leading open BI and data exploration platforms; still a key front-end layer for open analytics stacks.

- [Metabase](https://github.com/metabase/metabase) — **⭐46,421**
  - Widely adopted self-service BI; relevant for organizations pairing OSS OLAP engines with accessible analytics UX.

- [Elementary](https://github.com/elementary-data/elementary) — **⭐2,275**
  - dbt-native data observability; important as trust, freshness, and quality become first-class operational concerns.

- [Cloudera Hue](https://github.com/cloudera/hue) — **⭐1,449**
  - SQL assistant for databases and warehouses; notable as query UX and AI-assisted SQL interfaces continue improving.

- [Apache Doris MCP Server](https://github.com/apache/doris-mcp-server) — **⭐266**
  - MCP integration for Doris; an early signal that analytics systems are being exposed directly to agentic tooling.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐973**
  - Benchmarking infrastructure for analytical databases; crucial as performance marketing and objective comparisons intensify.

---

## 3. Trend Signal Analysis

The strongest fresh signal today is not a new warehouse or OLAP engine, but the rise of **AI-adjacent data infrastructure**: systems that store, organize, query, and retrieve context for agents and code intelligence workflows. The rapid breakout of [OpenViking](https://github.com/volcengine/OpenViking) and [GitNexus](https://github.com/abhigyanpatwari/GitNexus) indicates that the community is treating “context databases,” browser-native knowledge graphs, and semantic retrieval layers as legitimate infrastructure categories rather than application features.

In the more established OSS data stack, the center of gravity remains with **open analytical engines plus interoperable lakehouse metadata layers**. [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino) continue to define the runtime and query plane, while [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino) reflect continued investment in open catalogs and federation.

A secondary signal is the broadening of analytical engines into **search, vector, and AI-native workloads**. [Databend](https://github.com/databendlabs/databend), [SeekDB](https://github.com/oceanbase/seekdb), and [Wren Engine](https://github.com/Canner/wren-engine) show a direction where warehouse, semantic layer, search engine, and agent interface begin to blur. That aligns with recent lakehouse/cloud-warehouse developments: open table formats are stabilizing, so differentiation is moving up-stack toward metadata, semantics, low-latency serving, and AI-facing access patterns rather than raw storage alone.

---

## 4. Community Hot Spots

- **[OpenViking](https://github.com/volcengine/OpenViking)**  
  High daily star velocity suggests strong appetite for “context database” infrastructure, a likely emerging category adjacent to vector DBs and metadata stores.

- **[GitNexus](https://github.com/abhigyanpatwari/GitNexus)**  
  Its browser-side knowledge graph approach is notable for lightweight, client-local semantic indexing and retrieval without centralized infra.

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper) / [Apache Gravitino](https://github.com/apache/gravitino)**  
  Catalog interoperability remains a strategic lakehouse battleground, especially as teams avoid lock-in and standardize on Iceberg-centric architectures.

- **[Databend](https://github.com/databendlabs/databend) and [SeekDB](https://github.com/oceanbase/seekdb)**  
  These projects reflect the convergence of analytics, search, and AI execution inside a single engine or platform.

- **[DuckDB](https://github.com/duckdb/duckdb), [duckdb-wasm](https://github.com/duckdb/duckdb-wasm), and [chDB](https://github.com/chdb-io/chdb)**  
  Embedded and in-process analytics remain one of the most important long-term shifts, especially for local, edge, notebook, and application-embedded OLAP use cases.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*