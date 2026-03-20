# OLAP & Data Infra Open Source Trends 2026-03-20

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-20 01:18 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-20

## Step 1 — Filtered for OLAP / Data Infrastructure Relevance

### Relevant from Today’s Trending
Only **1** repo from today’s GitHub trending list is clearly relevant to data infrastructure / analytics workflows:

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — PDF parsing for AI-ready data extraction; relevant as an ingestion/data prep component.

All other trending repos are primarily coding agents, UI/plugins, mobile testing, simulation, gaming, or general automation and are **not core OLAP/data infra** projects.

### Relevant from Topic Search
The topic-search dataset contains the main signal for today’s OLAP/data ecosystem. Strongly relevant projects include engines, lakehouse/catalog systems, ETL/ingestion tools, and analytics tooling such as:

- OLAP / analytical databases: [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), [QuestDB](https://github.com/questdb/questdb), [CrateDB](https://github.com/crate/crate), [Apache Cloudberry](https://github.com/apache/cloudberry), [Databend](https://github.com/databendlabs/databend)
- Query engines / compute: [Trino](https://github.com/trinodb/trino), [Presto](https://github.com/prestodb/presto), [Apache DataFusion](https://github.com/apache/datafusion), [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista), [go-mysql-server](https://github.com/dolthub/go-mysql-server), [liquid-cache](https://github.com/XiangpengHao/liquid-cache)
- Lakehouse / metadata / storage systems: [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [LakeSoul](https://github.com/lakesoul-io/LakeSoul), [Apache Fluss](https://github.com/apache/fluss), [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Integration / ETL: [dlt](https://github.com/dlt-hub/dlt), [OLake](https://github.com/datazip-inc/olake), [Rudder Server](https://github.com/rudderlabs/rudder-server), [Multiwoven](https://github.com/Multiwoven/multiwoven)
- Tooling / BI / benchmarking / observability: [Apache Superset](https://github.com/apache/superset), [Metabase](https://github.com/metabase/metabase), [Grafana](https://github.com/grafana/grafana), [ClickBench](https://github.com/ClickHouse/ClickBench), [Elementary](https://github.com/elementary-data/elementary), [Redash](https://github.com/getredash/redash)

---

## Step 2 — Categorization

## 1. Today’s Highlights

The strongest pure data-infra signal on today’s GitHub trending page is **[opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**, which suggests community attention is shifting upstream toward **unstructured-to-structured ingestion** rather than only core warehouses and SQL engines. In the broader topic-search data, the ecosystem remains dominated by mature analytical engines such as **ClickHouse, DuckDB, Apache Doris, Trino, and StarRocks**, showing that high-performance SQL over lakehouse and real-time workloads is still the center of gravity. A second major signal is the continued rise of **catalog and lakehouse control-plane projects** like **Apache Polaris, Apache Gravitino, and Lakekeeper**, reflecting a market transition from “storage format wars” to **interoperability and governance layers**. Finally, Rust-based systems such as **Databend, DataFusion, Lakekeeper, and ParadeDB** continue to gain visibility, reinforcing the trend toward modern, embeddable, cloud-native analytical infrastructure.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,412  
  Real-time analytical DBMS and still one of the most important open-source references for fast OLAP at scale.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,793  
  In-process analytical SQL database with outsized ecosystem influence in local analytics, notebooks, and embedded compute.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,128  
  Unified analytics database positioned strongly for easy-to-operate, high-performance OLAP and lakehouse querying.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,491  
  Sub-second analytics engine bridging classic MPP OLAP and open data lakehouse access.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,200  
  Cloud-native warehouse built around object storage, increasingly notable for combining analytics with AI/search positioning.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,775  
  High-performance time-series OLAP engine, relevant as real-time analytics use cases continue expanding.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,191  
  Open-source MPP database continuing the Greenplum-style warehouse lineage for large-scale enterprise analytics.

- [CrateDB](https://github.com/crate/crate) — ⭐4,368  
  Distributed SQL analytics database optimized for near-real-time querying across large datasets.

## 📦 Storage Formats & Lakehouse
- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,881  
  Open-source Apache Iceberg catalog; important because catalog interoperability is becoming strategic lakehouse infrastructure.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,922  
  Federated metadata lake/catalog project reflecting demand for cross-engine governance and multi-region metadata management.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,222  
  Rust-based Iceberg REST catalog worth watching as lightweight and secure catalog implementations gain interest.

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,228  
  End-to-end realtime lakehouse framework combining ingestion, updates, and incremental analytics.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,825  
  Streaming storage for real-time analytics, notable for converging stream processing and analytical serving.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐700  
  New columnar file format effort and a rare sign of continued experimentation below the table-format layer.

- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,142  
  Big data platform with storage and compute characteristics relevant to broader lakehouse-scale deployments.

## ⚙️ Query & Compute
- [Trino](https://github.com/trinodb/trino) — ⭐12,650  
  The leading open distributed SQL query engine for federated analytics across data lakes and heterogeneous systems.

- [Presto](https://github.com/prestodb/presto) — ⭐16,666  
  Still an important engine in the federated query landscape and relevant in large established deployments.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,516  
  A major Rust-native SQL query engine and one of the clearest signals for modular embedded analytics infrastructure.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  Distributed compute layer for DataFusion, useful as the ecosystem explores scalable Rust-based execution.

- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,617  
  Storage-agnostic MySQL-compatible query engine, notable for embeddability and custom engine use cases.

- [liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐390  
  Pushdown cache for DataFusion, interesting because performance work is increasingly happening in auxiliary query layers.

- [QLever](https://github.com/ad-freiburg/qlever) — ⭐798  
  High-performance RDF/SPARQL engine showing that specialized analytical query models remain active.

## 🔗 Data Integration & ETL
- [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — ⭐0 (+1,416 today)  
  Today’s standout trending data repo; AI-ready PDF parsing reflects demand for turning unstructured enterprise documents into usable analytical inputs.

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,064  
  Developer-friendly open-source loading framework, relevant as teams prefer code-first ingestion over heavyweight ETL suites.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,310  
  Replication pipeline into Iceberg or Parquet, closely aligned with lakehouse-native ingestion trends.

- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,376  
  Event and customer-data pipeline infrastructure that remains relevant to warehouse-fed product analytics architectures.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,643  
  Reverse ETL system reflecting the ongoing “warehouse to operational tools” loop in modern data stacks.

## 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐71,029  
  The leading open-source BI/exploration platform and still one of the most widely adopted front ends for analytical warehouses.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,471  
  Broadly adopted self-service analytics tool, important for democratized querying on top of modern OLAP backends.

- [Grafana](https://github.com/grafana/grafana) — ⭐72,735  
  While observability-first, it remains a major analytics surface for time-series and operational data infrastructure.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐973  
  Benchmark suite increasingly important as engine vendors compete on reproducible analytical performance claims.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,278  
  Data observability for analytics engineers, reflecting growing attention to warehouse reliability and testability.

- [Redash](https://github.com/getredash/redash) — ⭐28,286  
  A durable SQL dashboarding and sharing tool with continued relevance in lightweight BI deployments.

---

## 3. Trend Signal Analysis

Today’s strongest immediate community spike is not a warehouse or SQL engine, but **data ingestion for unstructured sources**: [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) gained **+1,416 stars today**, indicating strong demand for tools that convert PDFs and documents into AI-ready, structured data. That matters for data engineers because the modern analytics stack is increasingly expected to unify **BI data, lakehouse tables, and unstructured enterprise content**.

Within the broader ecosystem, the most important ongoing trend is the shift from standalone databases toward **composable data planes**. Engines like [Trino](https://github.com/trinodb/trino), [Apache DataFusion](https://github.com/apache/datafusion), [DuckDB](https://github.com/duckdb/duckdb), [ClickHouse](https://github.com/ClickHouse/ClickHouse), and [StarRocks](https://github.com/StarRocks/starrocks) occupy different layers—federation, embedded execution, real-time OLAP, and lakehouse serving—but they increasingly interoperate rather than compete in isolation.

A second clear signal is that **catalogs and metadata control planes** are becoming first-class open-source battlegrounds. [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper) show how lakehouse evolution is moving from storage-format standardization toward **governance, interoperability, and multi-engine access**. This closely tracks recent cloud-warehouse developments, where managed catalogs, open table formats, and cross-engine metadata sharing are now strategic.

Finally, on the systems side, Rust continues to strengthen its position in analytical infrastructure through projects like [Databend](https://github.com/databendlabs/databend), [DataFusion](https://github.com/apache/datafusion), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper). The pattern suggests the next wave of OLAP infrastructure is being built for **cloud-native execution, embeddability, and modularity**, not just monolithic database deployments.

---

## 4. Community Hot Spots

- **[opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**  
  Strongest new-star signal today; worth watching as unstructured document extraction becomes part of mainstream analytics ingestion.

- **[Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Catalog/control-plane infrastructure is emerging as a high-value layer in the open lakehouse stack.

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  One of the clearest indicators of momentum behind modular Rust-based query execution and embeddable analytics engines.

- **[Databend](https://github.com/databendlabs/databend)**  
  Represents the convergence of warehouse, object-storage-native architecture, and AI/search-oriented positioning.

- **[ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [StarRocks](https://github.com/StarRocks/starrocks)**  
  These remain the core engines to track for performance, deployment-model diversity, and the evolution of real-time + lakehouse OLAP.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*