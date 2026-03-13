# OLAP & Data Infra Open Source Trends 2026-03-13

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-13 01:55 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
**Date:** 2026-03-13

## Step 1 — Filtered Relevant Projects

From today’s trending list, only **[langflow-ai/openrag](https://github.com/langflow-ai/openrag)** is clearly adjacent to data infrastructure because it packages retrieval infrastructure on top of **OpenSearch** and document pipelines. The rest of the daily trending repos are primarily AI agents, TTS, edge ML, or general application tooling and are **not core OLAP/data infra**.

From topic search results, the clearly relevant projects include OLAP databases, query engines, lakehouse/catalog/storage projects, ETL/load tools, and analytics/observability/BI tooling. The strongest signals come from:
- OLAP/analytics engines: ClickHouse, DuckDB, Doris, StarRocks, QuestDB, Databend, chDB, Cloudberry, Arc
- Query/compute: DataFusion, Trino, Presto, Ballista, go-mysql-server, Opteryx
- Storage/lakehouse: Nimble, Polaris, Fluss, Lakekeeper, Gravitino, OLake, ClickBench
- Integration/ETL: dlt, Rudder Server, Dinky, Multiwoven
- Tooling/BI/observability: Superset, Metabase, Grafana, Redash, Elementary

---

## 1. Today’s Highlights

Today’s GitHub data-infra signal is **not broad-based across OLAP**, but there is one notable crossover project: **[OpenRAG](https://github.com/langflow-ai/openrag)**, which reflects how search, document ingestion, and retrieval stacks are increasingly converging with data infrastructure.  
Outside the daily trending page, the strongest durable open-source gravity remains with **core OLAP engines** such as **[ClickHouse](https://github.com/ClickHouse/ClickHouse)** and **[DuckDB](https://github.com/duckdb/duckdb)**, while **query-layer and lakehouse-catalog projects** continue to deepen the ecosystem around them.  
A notable theme in the topic results is the rise of **“embedded / in-process / single-binary analytics”**—seen in **[DuckDB](https://github.com/duckdb/duckdb)**, **[chDB](https://github.com/chdb-io/chdb)**, and **[arc](https://github.com/Basekick-Labs/arc)**.  
Another visible trend is **hybridization**: projects increasingly combine analytics with **search, vector, streaming, or AI-oriented access patterns**, as seen in **[Databend](https://github.com/databendlabs/databend)**, **[SeekDB](https://github.com/oceanbase/seekdb)**, and **[OpenRAG](https://github.com/langflow-ai/openrag)**.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines

- **[ClickHouse](https://github.com/ClickHouse/ClickHouse)** — ⭐46,305  
  Real-time analytical DBMS and still one of the strongest centers of gravity in open-source OLAP, especially for high-concurrency and low-latency analytics.

- **[DuckDB](https://github.com/duckdb/duckdb)** — ⭐36,613  
  In-process analytical SQL database that continues to define the embedded OLAP category for local, notebook, and app-integrated analytics.

- **[QuestDB](https://github.com/questdb/questdb)** — ⭐16,752  
  High-performance time-series database worth attention because real-time analytics and observability workloads remain a major OLAP growth segment.

- **[Apache Doris](https://github.com/apache/doris)** — ⭐15,102  
  Unified analytics database with broad adoption in interactive analytics and lakehouse-adjacent workloads.

- **[StarRocks](https://github.com/StarRocks/starrocks)** — ⭐11,471  
  Fast query engine for sub-second analytics across internal storage and data lakes, reflecting demand for hybrid warehouse/lakehouse performance.

- **[Databend](https://github.com/databendlabs/databend)** — ⭐9,195  
  Cloud-native warehouse architecture on object storage with strong “analytics + search + AI” positioning, making it particularly relevant today.

- **[chDB](https://github.com/chdb-io/chdb)** — ⭐2,633  
  In-process OLAP SQL engine powered by ClickHouse; notable because embedded analytics continues gaining mindshare.

- **[apache/cloudberry](https://github.com/apache/cloudberry)** — ⭐1,191  
  Mature open-source MPP database alternative to Greenplum, relevant for teams that still need classic distributed warehouse architecture.

---

## 📦 Storage Formats & Lakehouse

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)** — ⭐696  
  A new file format for large columnar datasets and one of the clearest signs of ongoing innovation below the table-format layer.

- **[apache/polaris](https://github.com/apache/polaris)** — ⭐1,871  
  Open source catalog for Apache Iceberg, important because the catalog layer is becoming strategic in multi-engine lakehouse stacks.

- **[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)** — ⭐1,220  
  Rust-based Apache Iceberg REST catalog, notable as lightweight and cloud-native metadata services gain adoption.

- **[apache/gravitino](https://github.com/apache/gravitino)** — ⭐2,904  
  Federated open data catalog aimed at geo-distributed metadata management, matching the direction of multi-region and multi-engine data platforms.

- **[apache/fluss](https://github.com/apache/fluss)** — ⭐1,814  
  Streaming storage for real-time analytics, reflecting the push to blur boundaries between streaming systems and lakehouse storage.

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)** — ⭐1,306  
  Replication to Apache Iceberg or Parquet for analytics pipelines, relevant because ingestion directly into lakehouse formats is becoming standard.

- **[ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)** — ⭐968  
  Benchmark suite rather than storage format, but increasingly important as comparative performance claims across lakehouse/OLAP systems intensify.

---

## ⚙️ Query & Compute

- **[apache/datafusion](https://github.com/apache/datafusion)** — ⭐8,495  
  Rust SQL query engine that has become one of the most important reusable compute substrates in modern analytical systems.

- **[trinodb/trino](https://github.com/trinodb/trino)** — ⭐12,634  
  Distributed SQL query engine for big data, still central to federated analytics across heterogeneous storage systems.

- **[prestodb/presto](https://github.com/prestodb/presto)** — ⭐16,668  
  A foundational distributed SQL engine whose continued presence shows the durability of the decoupled query-layer model.

- **[apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)** — ⭐1,990  
  Distributed execution framework for DataFusion, worth watching as Rust-native distributed query stacks mature.

- **[duckdb/duckdb-wasm](https://github.com/duckdb/duckdb-wasm)** — ⭐1,937  
  WebAssembly version of DuckDB, notable for browser-native analytics and local-first data applications.

- **[dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server)** — ⭐2,617  
  Storage-agnostic MySQL-compatible query engine that highlights ongoing demand for embeddable SQL execution layers.

- **[mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)** — ⭐112  
  SQL-on-everything engine querying across file formats and databases, aligned with the growing “query where data lives” model.

- **[RayforceDB/rayforce](https://github.com/RayforceDB/rayforce)** — ⭐111  
  SIMD-accelerated pure-C columnar analytics database, interesting as low-level performance-oriented OLAP experimentation continues.

---

## 🔗 Data Integration & ETL

- **[dlt-hub/dlt](https://github.com/dlt-hub/dlt)** — ⭐5,036  
  Python-first data loading framework that remains highly relevant as engineers seek simpler ingestion into warehouses and lakehouses.

- **[rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)** — ⭐4,372  
  Segment alternative for event collection and routing, important for product data pipelines and warehouse-centric architectures.

- **[DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)** — ⭐3,706  
  Flink-based real-time data development platform that reflects continuing demand for operational streaming ETL.

- **[Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)** — ⭐1,644  
  Open-source Reverse ETL project, relevant because operationalizing warehouse data into SaaS tools remains a growing stack component.

- **[datazip-inc/olake](https://github.com/datazip-inc/olake)** — ⭐1,306  
  Fast replication from databases, Kafka, and S3 into Iceberg or Parquet, bridging ingestion and lakehouse storage.

- **[langflow-ai/openrag](https://github.com/langflow-ai/openrag)** — ⭐0 (+322 today)  
  RAG platform built on Langflow, Docling, and OpenSearch; worth attention today because retrieval pipelines are becoming part of the broader data platform conversation.

---

## 🧰 Data Tooling

- **[apache/superset](https://github.com/apache/superset)** — ⭐70,943  
  Leading open-source BI and exploration platform, still a key front-end layer for warehouse and lakehouse adoption.

- **[grafana/grafana](https://github.com/grafana/grafana)** — ⭐72,670  
  Observability and visualization platform relevant to analytics engineers because metrics, logs, and traces increasingly intersect with OLAP-style querying.

- **[metabase/metabase](https://github.com/metabase/metabase)** — ⭐46,383  
  Accessible BI tool with broad adoption, notable for self-service analytics in smaller and mid-size data teams.

- **[getredash/redash](https://github.com/getredash/redash)** — ⭐28,276  
  Mature SQL visualization and dashboarding project that remains useful in lightweight analytics setups.

- **[elementary-data/elementary](https://github.com/elementary-data/elementary)** — ⭐2,272  
  dbt-native data observability tool, important because monitoring and trust are increasingly first-class parts of the analytics stack.

- **[ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)** — ⭐968  
  Benchmarking project that matters because performance comparability is central to engine selection across OLAP and lakehouse systems.

- **[Canner/wren-engine](https://github.com/Canner/wren-engine)** — ⭐563  
  Semantic engine for MCP clients and AI agents, notable as semantic layers begin to serve both BI and agentic query use cases.

---

## 3. Trend Signal Analysis

The strongest community attention in today’s hot list is **not toward classical OLAP databases themselves**, but toward **AI-adjacent data access layers**—especially retrieval, search-backed knowledge access, and agent-facing infrastructure. The clearest example is **[OpenRAG](https://github.com/langflow-ai/openrag)**, which packages document processing and retrieval over **OpenSearch** into a single platform. This suggests that, at least on the daily GitHub surface, the most explosive energy is moving toward **systems that sit on top of data infrastructure rather than core database kernels**.

In the broader topic results, however, the structural trend remains familiar: open-source data infra continues consolidating around a few powerful patterns. First, **embedded analytics** is becoming mainstream, with **DuckDB**, **chDB**, and newer single-binary systems like **Arc** lowering deployment friction. Second, the ecosystem is shifting from monolithic warehouses toward **composable lakehouse stacks** built from independent catalogs, storage layers, ingestion tools, and compute engines—seen in **Polaris**, **Lakekeeper**, **Gravitino**, **Fluss**, and **OLake**. Third, there is growing evidence of **hybrid query paradigms**: analytics engines increasingly add text, vector, graph, and AI workflow support, as seen in **Databend**, **SeekDB**, and smaller experiments like **uni-db** or **uqa**.

A particularly interesting signal is the continued appearance of **new lower-level storage and file-format work**, such as **[Nimble](https://github.com/facebookincubator/nimble)**. That matters because recent lakehouse development has mostly focused on table metadata and interoperability; renewed file-format experimentation hints that the next optimization wave may return to **physical layout, encoding, and execution efficiency** on object storage and memory-constrained environments.

---

## 4. Community Hot Spots

- **[langflow-ai/openrag](https://github.com/langflow-ai/openrag)**  
  Worth watching because retrieval infrastructure is becoming a practical extension of the modern data platform, especially where search and analytics converge.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  A rare fresh signal in columnar file formats; data engineers should watch whether it influences next-generation storage efficiency and scan performance.

- **[apache/datafusion](https://github.com/apache/datafusion)** and **[apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)**  
  The Rust query-engine ecosystem continues to expand and may become the most important reusable compute foundation outside the JVM/C++ world.

- **[apache/polaris](https://github.com/apache/polaris)** and **[lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Catalogs are becoming strategic control planes in Iceberg-centric lakehouse deployments; these projects sit close to that shift.

- **[chdb-io/chdb](https://github.com/chdb-io/chdb)** and **[Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)**  
  Embedded OLAP is increasingly attractive for local analytics, edge use cases, developer tools, and application-integrated data products.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*