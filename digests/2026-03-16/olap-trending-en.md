# OLAP & Data Infra Open Source Trends 2026-03-16

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-16 01:28 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
**Date:** 2026-03-16

## Step 1 — Filtered Projects Relevant to OLAP / Data Infrastructure / Analytics

From **today’s trending list**, only these are clearly data-relevant:
- [volcengine/OpenViking](https://github.com/volcengine/OpenViking) — “context database” for AI agents; adjacent to data infrastructure / metadata / memory systems
- [topoteretes/cognee](https://github.com/topoteretes/cognee) — knowledge engine / memory layer; adjacent to data infra
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — browser-side knowledge graph / Graph RAG engine; data tooling adjacent

Most other trending repos are AI coding tools, browsers, or general utilities and are **excluded**.

From the **topic search results**, the clearly relevant set includes OLAP engines, query engines, lakehouse/catalog/storage systems, ETL/ingestion, observability, BI, and related tooling.

---

## 1. Today's Highlights

Today’s GitHub signal is **not dominated by classic OLAP engines breaking out on the trending page**, but by **AI-adjacent data infrastructure**: context databases, knowledge engines, and graph-backed memory systems such as [OpenViking](https://github.com/volcengine/OpenViking), [cognee](https://github.com/topoteretes/cognee), and [GitNexus](https://github.com/abhigyanpatwari/GitNexus). This suggests community attention is expanding from analytics databases toward **data layers for AI agents**, especially systems that structure memory, metadata, and retrieval.

In the broader data-infra ecosystem, the strongest foundational projects remain familiar leaders like [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [Trino](https://github.com/trinodb/trino), and [StarRocks](https://github.com/StarRocks/starrocks). At the same time, lakehouse catalogs and real-time ingestion continue to deepen through projects like [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Gravitino](https://github.com/apache/gravitino), and [OLake](https://github.com/datazip-inc/olake).

A notable emerging theme is **embedded and lightweight analytics infrastructure**: [chDB](https://github.com/chdb-io/chdb), [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm), [rayforce](https://github.com/RayforceDB/rayforce), and [arc](https://github.com/Basekick-Labs/arc) reflect demand for fast, deployable analytics engines outside traditional warehouse clusters.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐46,344**
  - Real-time columnar analytics DBMS and still one of the most important open-source OLAP reference points for performance and ecosystem gravity.
- [DuckDB](https://github.com/duckdb/duckdb) — **⭐36,678**
  - In-process analytical SQL database powering embedded analytics, local lakehouse workflows, and increasingly browser/edge analytics patterns.
- [Apache Doris](https://github.com/apache/doris) — **⭐15,111**
  - Unified analytics database with strong MPP positioning; worth attention as it continues bridging warehouse and interactive analytics use cases.
- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐11,479**
  - High-performance open query engine for real-time and lakehouse analytics, increasingly relevant for sub-second BI workloads.
- [OceanBase](https://github.com/oceanbase/oceanbase) — **⭐10,014**
  - Distributed HTAP database signaling continued convergence of transactional and analytical systems.
- [QuestDB](https://github.com/questdb/questdb) — **⭐16,764**
  - Time-series OLAP engine with strong developer adoption for high-ingest real-time analytics.
- [chDB](https://github.com/chdb-io/chdb) — **⭐2,639**
  - In-process OLAP SQL engine powered by ClickHouse, notable for bringing warehouse-class execution into lightweight application contexts.
- [crate](https://github.com/crate/crate) — **⭐4,368**
  - Distributed SQL analytics database for near-real-time analysis, especially relevant where operational data and analytics overlap.

### 📦 Storage Formats & Lakehouse
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐697**
  - New file format for large columnar datasets; worth watching as format-level innovation is relatively rare and strategically important.
- [Apache Polaris](https://github.com/apache/polaris) — **⭐1,877**
  - Open source catalog for Apache Iceberg, reflecting the centrality of open table metadata layers in modern lakehouse stacks.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐1,221**
  - Rust-based Apache Iceberg REST catalog, notable for performance-oriented and cloud-native catalog implementations.
- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐2,907**
  - Federated open data catalog aimed at geo-distributed metadata management across engines and regions.
- [Apache Fluss](https://github.com/apache/fluss) — **⭐1,819**
  - Streaming storage for real-time analytics, representing tighter fusion between streaming data and analytical serving.
- [Databend](https://github.com/databendlabs/databend) — **⭐9,200**
  - S3-native warehouse/lakehouse architecture increasingly positioned around analytics, search, and AI-ready data access.
- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — **⭐2,134**
  - Large-scale data platform with lakehouse relevance for teams needing integrated storage and compute primitives.

### ⚙️ Query & Compute
- [Trino](https://github.com/trinodb/trino) — **⭐12,640**
  - Distributed SQL query engine and still a cornerstone for federated analytics across files, lakes, and databases.
- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐8,504**
  - Fast-rising Rust SQL engine core, important as a reusable execution layer embedded across modern data systems.
- [Presto](https://github.com/prestodb/presto) — **⭐16,670**
  - Foundational distributed SQL engine whose continued relevance underscores the durability of federated query architectures.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐1,993**
  - Distributed compute extension for DataFusion, worth watching as Rust-native analytics stacks mature beyond single-node execution.
- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — **⭐2,617**
  - Storage-agnostic MySQL-compatible query engine demonstrating continued interest in embeddable SQL compute layers.
- [opteryx](https://github.com/mabel-dev/opteryx) — **⭐112**
  - SQL-on-everything engine aimed at querying data in place, aligned with lightweight federation and local analytics trends.
- [rayforce](https://github.com/RayforceDB/rayforce) — **⭐112**
  - SIMD-accelerated pure-C columnar database signaling ongoing experimentation in compact high-performance analytical kernels.
- [duckdb-wasm](https://github.com/duckdb/duckdb-wasm) — **⭐1,941**
  - WebAssembly DuckDB variant, important for browser-native analytics and edge-local query execution.

### 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — **⭐5,047**
  - Python data loading framework with strong momentum as teams seek simpler ingestion into warehouses and lakehouses.
- [OLake](https://github.com/datazip-inc/olake) — **⭐1,307**
  - High-speed replication from databases, Kafka, and S3 into Iceberg or Parquet, directly aligned with real-time lakehouse ingestion demand.
- [rudder-server](https://github.com/rudderlabs/rudder-server) — **⭐4,374**
  - Event pipeline and CDP alternative that remains relevant for customer and product data movement into analytics systems.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — **⭐1,643**
  - Open-source Reverse ETL platform reflecting the continued need to operationalize warehouse data into business tools.
- [Transformalize](https://github.com/dalenewman/Transformalize) — **⭐161**
  - Configurable ETL framework, smaller but useful as a representative of practical pipeline tooling.
- [Tuva](https://github.com/tuva-health/tuva) — **⭐289**
  - Domain-specific analytics model and quality toolkit showing verticalized warehouse ecosystems remain active.

### 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — **⭐70,975**
  - Leading open-source BI and exploration platform, still central to SQL-native analytics stacks.
- [Metabase](https://github.com/metabase/metabase) — **⭐46,411**
  - Self-service BI favorite with broad adoption across teams wanting quick analytics access without heavy modeling.
- [Grafana](https://github.com/grafana/grafana) — **⭐72,677**
  - Observability and visualization platform increasingly important where metrics, logs, and analytical querying converge.
- [Elementary](https://github.com/elementary-data/elementary) — **⭐2,273**
  - dbt-native observability tool highlighting quality monitoring as a standard part of analytics engineering.
- [Hue](https://github.com/cloudera/hue) — **⭐1,449**
  - SQL query assistant UI for databases and warehouses, relevant as user-facing productivity layers remain sticky in data platforms.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐971**
  - Widely referenced benchmark suite for analytical databases, especially useful amid intensifying performance claims.
- [PostHog](https://github.com/PostHog/posthog) — **⭐32,042**
  - Product analytics platform with growing warehouse and CDP footprint, blurring application analytics and data platform boundaries.
- [Wren Engine](https://github.com/Canner/wren-engine) — **⭐563**
  - Semantic engine for MCP clients and AI agents, notable as semantic/metadata layers increasingly intersect with analytics stacks.

### AI-Adjacent Data Infra Worth Noting Today
- [OpenViking](https://github.com/volcengine/OpenViking) — **⭐0 (+1,870 today)**
  - A “context database” for AI agents; while not OLAP, its breakout suggests strong demand for structured memory and metadata infrastructure.
- [cognee](https://github.com/topoteretes/cognee) — **⭐0 (+270 today)**
  - Agent memory/knowledge engine that reflects a broader shift toward retrieval-structured data substrates.
- [GitNexus](https://github.com/abhigyanpatwari/GitNexus) — **⭐0 (+451 today)**
  - Client-side knowledge graph and Graph RAG engine, showing graph/query interfaces remain attractive for developer-facing data access.

---

## 3. Trend Signal Analysis

The clearest signal today is that **explosive community attention is shifting toward AI-oriented data substrates rather than traditional BI or warehouse engines themselves**. The breakout of [OpenViking](https://github.com/volcengine/OpenViking) in particular suggests strong interest in systems that position themselves as a **database for agent context**, combining file-system-like organization, memory management, and structured retrieval. Alongside [cognee](https://github.com/topoteretes/cognee) and [GitNexus](https://github.com/abhigyanpatwari/GitNexus), this points to a fast-emerging category: **metadata- and memory-centric data infrastructure for autonomous applications**.

On the more classical data-engineering side, the ecosystem remains anchored by mature open engines—[ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [Trino](https://github.com/trinodb/trino), and [StarRocks](https://github.com/StarRocks/starrocks)—but the innovation frontier is moving into **catalogs, embedded execution, and real-time lakehouse ingestion**. Projects like [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino) show how control-plane metadata is becoming just as strategic as the query layer. Meanwhile, [OLake](https://github.com/datazip-inc/olake) and [Apache Fluss](https://github.com/apache/fluss) reflect demand for lower-latency ingestion into open table formats.

A noteworthy low-level signal is the appearance of newer format and kernel work such as [nimble](https://github.com/facebookincubator/nimble), [rayforce](https://github.com/RayforceDB/rayforce), and [duckdb-wasm](https://github.com/duckdb/duckdb-wasm). Together, these indicate continued experimentation in **columnar storage design, SIMD/vectorized execution, and browser/edge deployment**, all consistent with recent lakehouse and cloud-warehouse trends toward openness, portability, and composability.

---

## 4. Community Hot Spots

- **[OpenViking](https://github.com/volcengine/OpenViking)**  
  Breakout momentum today makes it the most important “new” data-adjacent signal; data engineers should watch how agent-context databases borrow from metadata catalogs and object-store abstractions.

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper) / [Apache Gravitino](https://github.com/apache/gravitino)**  
  Open catalog infrastructure is becoming a strategic control plane for Iceberg-centric lakehouses and multi-engine data access.

- **[DuckDB](https://github.com/duckdb/duckdb), [duckdb-wasm](https://github.com/duckdb/duckdb-wasm), and [chDB](https://github.com/chdb-io/chdb)**  
  Embedded analytics continues to expand from laptops into browsers, apps, and developer tools, creating a major deployment shift for OLAP.

- **[OLake](https://github.com/datazip-inc/olake) and [Apache Fluss](https://github.com/apache/fluss)**  
  Real-time ingestion and streaming storage remain high-value areas as teams push lakehouse architectures closer to operational latency.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  New columnar file formats are rare and consequential; if Nimble gains adoption, it could influence the next generation of storage-performance tradeoffs.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*