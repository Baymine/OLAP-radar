# OLAP & Data Infra Open Source Trends 2026-04-05

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-04-05 01:44 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
_Date: 2026-04-05_

## Step 1 — Filtered Relevant Projects

### From Today’s GitHub Trending
Only **1 repository** is clearly relevant to OLAP/data infrastructure/analytics:

- [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx) — relevant at the edge of data infrastructure because it is an open-source AI/data access platform that connects enterprise knowledge and data sources for search/chat workflows.

All other trending repos are primarily AI agents, desktop apps, demos, or general utilities and are **excluded** from this OLAP/data report.

### From Topic Search
Relevant repositories were selected across OLAP, lakehouse, query engines, analytics, storage, and ETL/tooling. Clearly unrelated entries were excluded, e.g. IFC viewer, shell file lister, generic data-science list, spreadsheet library, etc.

---

## 1. Today's Highlights

Today’s strongest data-infra signal is not from a classic OLAP engine on the trending page, but from [Onyx](https://github.com/onyx-dot-app/onyx), which reflects how fast **AI-facing data access layers** are becoming part of the broader analytics stack. In the topic results, the center of gravity remains with mature analytical engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino).  

A second clear theme is the continued rise of **embedded and composable analytics infrastructure**, represented by [chDB](https://github.com/chdb-io/chdb), [Apache DataFusion](https://github.com/apache/datafusion), [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake), and lightweight warehouse projects like [arc](https://github.com/Basekick-Labs/arc). Third, the lakehouse layer continues to thicken around **catalogs, streaming storage, and Iceberg-oriented ingestion**, with projects such as [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Fluss](https://github.com/apache/fluss), and [OLake](https://github.com/datazip-inc/olake).  

Overall, the ecosystem is moving toward **unified engines that combine analytics, search, vector retrieval, and agent-ready interfaces** rather than keeping those capabilities separate.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,702  
  Real-time analytical DBMS and still one of the strongest open-source reference points for high-performance columnar OLAP.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐37,177  
  In-process analytical SQL database that continues to matter because embedded analytics is reshaping how data products are built.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,176  
  Unified analytics database focused on low-latency OLAP and operational simplicity, relevant as enterprises keep consolidating workloads.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,541  
  High-performance analytics engine for real-time and lakehouse query scenarios, notable for hybrid warehouse/lake execution.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,232  
  Cloud-native warehouse with a strong “analytics + search + AI” positioning, reflecting the shift toward multipurpose analytical platforms.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,825  
  Time-series OLAP database that remains relevant as observability and event analytics continue to overlap with mainstream analytics.

- [MatrixOne](https://github.com/matrixorigin/matrixone) — ⭐1,867  
  HTAP-oriented database with vector search and AI-native framing, worth watching for convergence of transactional, analytical, and retrieval workloads.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,655  
  In-process OLAP SQL engine powered by ClickHouse, notable for bringing warehouse-grade execution into application runtimes.

---

## 📦 Storage Formats & Lakehouse

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐707  
  An extensible file format for large columnar datasets, interesting as storage-format innovation remains relatively rare and high impact.

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,227  
  Realtime lakehouse framework aimed at BI and AI use cases, highlighting demand for mutable and streaming-friendly lake architectures.

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,891  
  Open source catalog for Apache Iceberg, important because open metadata/catalog control is becoming a strategic layer in lakehouse stacks.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,240  
  Rust-based Iceberg REST catalog, notable for performance and operational simplicity in modern lake deployments.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,843  
  Streaming storage for real-time analytics, representing the ongoing merge of stream processing and lakehouse storage.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,934  
  Federated metadata lake/catalog project, relevant as organizations increasingly need cross-region and cross-engine governance.

- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,149  
  Scalable big-data platform with lakehouse relevance, worth attention for large-scale storage/compute unification.

---

## ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — ⭐12,686  
  Distributed SQL query engine that remains central to open data federation and lakehouse query layers.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,560  
  Modular Rust SQL query engine, increasingly influential as a foundation for embedded, extensible, and custom analytical systems.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,005  
  Distributed execution layer for DataFusion, relevant as the Rust data stack expands from libraries into cluster-scale compute.

- [Presto](https://github.com/prestodb/presto) — ⭐16,677  
  Still a major distributed query engine in the lakehouse ecosystem, especially for large-scale SQL federation patterns.

- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,623  
  Storage-agnostic MySQL-compatible query engine, notable for composable database building blocks.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐196  
  Self-hosted distributed query engine edition, interesting because it brings commercial warehouse architecture ideas into open source.

- [liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐396  
  Pushdown cache for DataFusion, worth attention as caching and acceleration are becoming first-class parts of open query execution.

- [qlever](https://github.com/ad-freiburg/qlever) — ⭐810  
  High-performance RDF/SPARQL engine, signaling that specialized analytical query models beyond SQL still have active innovation.

---

## 🔗 Data Integration & ETL

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,169  
  Python-first data loading framework that remains highly relevant as teams seek simpler ingestion into modern warehouses and lakehouses.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,314  
  Replication pipeline from databases, Kafka, and S3 into Iceberg or Parquet, directly aligned with current lakehouse ingestion demand.

- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — ⭐4,384  
  Event pipeline and CDP alternative that continues to matter where product data and warehouse pipelines converge.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,648  
  Open-source Reverse ETL, notable because activation of warehouse data remains an important complement to ingestion.

- [Versatile Data Kit](https://github.com/vmware/versatile-data-kit) — ⭐479  
  Workflow framework for Python and SQL data jobs, useful for teams standardizing lightweight orchestrated pipelines.

- [Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  Configurable ETL toolkit, smaller project but relevant in the long tail of practical integration tooling.

---

## 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — ⭐72,214  
  Leading open-source BI and exploration platform, still a bellwether for SQL-native analytics interfaces.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,743  
  Widely adopted BI tool that remains important because self-service analytics demand is still expanding.

- [Grafana](https://github.com/grafana/grafana) — ⭐72,976  
  Observability and analytics visualization platform, increasingly relevant as metrics/logs/traces intersect with OLAP-style analysis.

- [PostHog](https://github.com/PostHog/posthog) — ⭐32,391  
  Product analytics platform with warehouse and CDP ambitions, showing continued convergence of application telemetry and analytics infra.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,297  
  dbt-native data observability tool, important as reliability and trust remain top concerns in analytics engineering.

- [Hue](https://github.com/cloudera/hue) — ⭐1,445  
  SQL query assistant for databases and warehouses, still relevant where broad warehouse access and SQL UX matter.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐981  
  Benchmark suite for analytical databases, useful because performance claims across OLAP engines are increasingly benchmark-driven.

- [Onyx](https://github.com/onyx-dot-app/onyx) — ⭐0 (+1,197 today)  
  Open-source AI platform for chat over connected enterprise data, worth attention because AI-native data access is emerging as a new front end to analytics infrastructure.

---

## 3. Trend Signal Analysis

The strongest community attention today is around **AI-native interfaces to data**, rather than around a newly trending OLAP database itself. [Onyx](https://github.com/onyx-dot-app/onyx) stands out because it reflects a rapidly growing layer in the stack: systems that sit above warehouses, search indexes, and document stores to make enterprise data queryable through chat, retrieval, and agents. This does not replace OLAP, but it changes how users access it.

At the core engine level, the ecosystem remains anchored by established analytical systems such as ClickHouse, DuckDB, Doris, StarRocks, and Trino. What is changing is the **shape of the surrounding platform**. Newer projects increasingly describe themselves as serving analytics, search, vector retrieval, and agent workflows in one engine or one architecture. Examples include Databend, MatrixOne, SeekDB, and Wren Engine. This suggests that the old boundaries between OLAP database, search engine, feature store, and semantic layer are eroding.

On the storage side, there is continued momentum around **open lakehouse control planes**: Iceberg catalogs, federated metadata services, and streaming-aware storage layers. Projects like Apache Polaris, Lakekeeper, Apache Gravitino, and Apache Fluss fit squarely into this pattern. The appearance of [Nimble](https://github.com/facebookincubator/nimble) is also notable because genuinely new columnar storage-format work is less common and can influence the stack for years if adopted.

In short, the market is moving toward **open, composable, cloud-object-storage-native analytics stacks** where compute engines, catalogs, ingestion, and AI-facing query surfaces are increasingly modular but tightly integrated.

---

## 4. Community Hot Spots

- [Onyx](https://github.com/onyx-dot-app/onyx)  
  Strongest same-day momentum in the filtered set; signals rising demand for AI/chat interfaces over enterprise data and knowledge sources.

- [Apache DataFusion](https://github.com/apache/datafusion)  
  One of the most important building blocks in the Rust analytical stack, increasingly used as embedded compute infrastructure.

- [Apache Polaris](https://github.com/apache/polaris) and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)  
  Catalog-layer projects are becoming strategically important as Iceberg standardization and multi-engine interoperability expand.

- [Databend](https://github.com/databendlabs/databend) and [MatrixOne](https://github.com/matrixorigin/matrixone)  
  Both represent the “AI-native warehouse” direction, where OLAP is merging with search, vectors, and application-facing intelligence.

- [OLake](https://github.com/datazip-inc/olake) and [Apache Fluss](https://github.com/apache/fluss)  
  Realtime ingestion plus streaming-aware storage is a key operational priority for lakehouse teams pursuing fresher analytics with lower pipeline complexity.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*