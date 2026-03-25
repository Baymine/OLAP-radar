# OLAP & Data Infra Open Source Trends 2026-03-25

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-25 01:21 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-25

## Step 1 — Filtered OLAP / Data Infrastructure Relevant Projects

### From Today’s GitHub Trending
Only **[aquasecurity/trivy](https://github.com/aquasecurity/trivy)** is meaningfully adjacent to data infrastructure tooling today, mainly as infra/security tooling used in platform engineering.  
The rest of the trending repos are primarily AI agents, consumer apps, finance-agent demos, or unrelated utilities, and are **excluded** from this OLAP/data report.

### From Data Infra Topic Search
Clearly relevant projects include engines, lakehouse/catalog, ingestion, observability, BI, benchmarks, and SQL/data tooling such as:
[ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), [Trino](https://github.com/trinodb/trino), [Presto](https://github.com/prestodb/presto), [Apache DataFusion](https://github.com/apache/datafusion), [Databend](https://github.com/databendlabs/databend), [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [LakeSoul](https://github.com/lakesoul-io/LakeSoul), [Apache Fluss](https://github.com/apache/fluss), [OLake](https://github.com/datazip-inc/olake), [dlt](https://github.com/dlt-hub/dlt), [Rudder Server](https://github.com/rudderlabs/rudder-server), [Elementary](https://github.com/elementary-data/elementary), [Superset](https://github.com/apache/superset), [Metabase](https://github.com/metabase/metabase), [Cube](https://github.com/cube-js/cube), [ClickBench](https://github.com/ClickHouse/ClickBench), [chDB](https://github.com/chdb-io/chdb), [QuestDB](https://github.com/questdb/questdb), [TimescaleDB](https://github.com/timescale/timescaledb), [Cloudberry](https://github.com/apache/cloudberry), [Gravitino](https://github.com/apache/gravitino), and others.

---

## Step 2 — Categorization

### 🗄️ OLAP Engines
Primary analytical databases, MPP systems, and OLAP runtimes:
- [ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [DuckDB](https://github.com/duckdb/duckdb)
- [Apache Doris](https://github.com/apache/doris)
- [StarRocks](https://github.com/StarRocks/starrocks)
- [QuestDB](https://github.com/questdb/questdb)
- [TimescaleDB](https://github.com/timescale/timescaledb)
- [Apache Cloudberry](https://github.com/apache/cloudberry)
- [chDB](https://github.com/chdb-io/chdb)

### 📦 Storage Formats & Lakehouse
Lakehouse frameworks, catalogs, columnar/storage formats:
- [Databend](https://github.com/databendlabs/databend)
- [LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [Apache Polaris](https://github.com/apache/polaris)
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [Apache Gravitino](https://github.com/apache/gravitino)
- [Apache Fluss](https://github.com/apache/fluss)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [roapi/roapi](https://github.com/roapi/roapi)

### ⚙️ Query & Compute
Distributed SQL, embedded query engines, vectorized execution:
- [Trino](https://github.com/trinodb/trino)
- [Presto](https://github.com/prestodb/presto)
- [Apache DataFusion](https://github.com/apache/datafusion)
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista)
- [go-mysql-server](https://github.com/dolthub/go-mysql-server)
- [Firebolt Core](https://github.com/firebolt-db/firebolt-core)
- [KiteSQL](https://github.com/KipData/KiteSQL)
- [QLever](https://github.com/ad-freiburg/qlever)

### 🔗 Data Integration & ETL
Replication, ingestion, reverse ETL, workflow tooling:
- [OLake](https://github.com/datazip-inc/olake)
- [dlt](https://github.com/dlt-hub/dlt)
- [Rudder Server](https://github.com/rudderlabs/rudder-server)
- [Multiwoven](https://github.com/Multiwoven/multiwoven)
- [Versatile Data Kit](https://github.com/vmware/versatile-data-kit)
- [Dinky](https://github.com/DataLinkDC/dinky)
- [dataall](https://github.com/data-dot-all/dataall)

### 🧰 Data Tooling
BI, observability, benchmarks, SQL/UI, platform support:
- [Apache Superset](https://github.com/apache/superset)
- [Metabase](https://github.com/metabase/metabase)
- [Grafana](https://github.com/grafana/grafana)
- [Cube](https://github.com/cube-js/cube)
- [Elementary](https://github.com/elementary-data/elementary)
- [ClickBench](https://github.com/ClickHouse/ClickBench)
- [Hue](https://github.com/cloudera/hue)
- [Trivy](https://github.com/aquasecurity/trivy)

---

## 1. Today’s Highlights

Today’s GitHub trending list is unusually weak for pure OLAP/database projects, suggesting that **general developer attention is currently concentrated on AI agent frameworks rather than core analytics engines**. Within the data-infrastructure lens, the strongest signals come not from the hot list but from the topic search results, where **lakehouse catalogs, Rust-based query stacks, and real-time analytics systems remain highly active**.  

The ecosystem continues to cluster around a few major themes: **real-time analytical databases** ([ClickHouse](https://github.com/ClickHouse/ClickHouse), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks)), **portable/embedded analytics** ([DuckDB](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb)), and **open lakehouse control planes** ([Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Gravitino](https://github.com/apache/gravitino)).  

A notable architectural trend is the continued rise of **Rust in core data infrastructure**, especially in [Apache DataFusion](https://github.com/apache/datafusion), [Databend](https://github.com/databendlabs/databend), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Cube](https://github.com/cube-js/cube). Meanwhile, ingestion and interoperability remain hot operational priorities, reflected in projects like [OLake](https://github.com/datazip-inc/olake) and [dlt](https://github.com/dlt-hub/dlt).

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- **[ClickHouse](https://github.com/ClickHouse/ClickHouse)** — ⭐46,513  
  Real-time analytical DBMS and still one of the strongest anchors in open OLAP, especially relevant as embedded and cloud-native analytics patterns keep expanding around it.

- **[DuckDB](https://github.com/duckdb/duckdb)** — ⭐36,931  
  In-process analytical SQL database that continues to define the embedded analytics movement and influence modern local-first OLAP workflows.

- **[Apache Doris](https://github.com/apache/doris)** — ⭐15,147  
  High-performance unified analytics database worth attention for converging interactive analytics, ingestion, and lakehouse-facing workloads.

- **[StarRocks](https://github.com/StarRocks/starrocks)** — ⭐11,510  
  Sub-second analytics engine with strong lakehouse query positioning, increasingly relevant for hybrid internal/external table analytics.

- **[QuestDB](https://github.com/questdb/questdb)** — ⭐16,788  
  High-performance time-series database that remains a leading open choice for real-time telemetry and financial analytics use cases.

- **[TimescaleDB](https://github.com/timescale/timescaledb)** — ⭐22,194  
  Postgres-based time-series analytics engine that stays important for teams wanting OLAP-like time-series performance without leaving the Postgres ecosystem.

- **[Apache Cloudberry](https://github.com/apache/cloudberry)** — ⭐1,194  
  Open-source MPP warehouse alternative with relevance for users seeking a mature distributed SQL analytics stack outside cloud-vendor lock-in.

- **[chDB](https://github.com/chdb-io/chdb)** — ⭐2,644  
  In-process OLAP SQL engine powered by ClickHouse, notable as demand grows for embedded analytics inside Python and application runtimes.

---

### 📦 Storage Formats & Lakehouse

- **[Databend](https://github.com/databendlabs/databend)** — ⭐9,204  
  A unified warehouse/lakehouse architecture on object storage that is increasingly notable for blending analytics, search, AI, and cloud-native compute.

- **[LakeSoul](https://github.com/lakesoul-io/LakeSoul)** — ⭐3,226  
  Real-time cloud-native lakehouse framework with strong positioning around concurrent updates and incremental analytics.

- **[Apache Polaris](https://github.com/apache/polaris)** — ⭐1,885  
  Open catalog for Apache Iceberg interoperability, important because open catalog control planes are becoming central to multi-engine lakehouse design.

- **[Lakekeeper](https://github.com/lakekeeper/lakekeeper)** — ⭐1,224  
  Rust-based Iceberg REST catalog that is gaining relevance as lightweight, secure catalog implementations become strategic infra primitives.

- **[Apache Gravitino](https://github.com/apache/gravitino)** — ⭐2,926  
  Federated metadata lake and catalog layer, worth watching as governance and multi-region metadata become harder problems in heterogeneous data estates.

- **[Apache Fluss](https://github.com/apache/fluss)** — ⭐1,831  
  Streaming storage built for real-time analytics, reflecting the push to blur lines between streaming systems and analytical storage.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)** — ⭐702  
  New file format for large columnar datasets, an early signal that storage-layer innovation is still active below the SQL engine layer.

- **[roapi/roapi](https://github.com/roapi/roapi)** — ⭐3,416  
  Generates APIs over static/slowly-changing columnar data, showing continued demand for lightweight access layers on top of files and object storage.

---

### ⚙️ Query & Compute

- **[Trino](https://github.com/trinodb/trino)** — ⭐12,657  
  Distributed SQL query engine that remains foundational for federated analytics across data lakes, warehouses, and operational stores.

- **[Presto](https://github.com/prestodb/presto)** — ⭐16,663  
  Still a major distributed SQL engine with enduring relevance for large-scale interactive analytics and lakehouse federation.

- **[Apache DataFusion](https://github.com/apache/datafusion)** — ⭐8,532  
  Rust SQL query engine that has become one of the clearest building blocks for next-generation analytical systems and composable compute layers.

- **[Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista)** — ⭐1,998  
  Distributed execution layer for DataFusion, notable as more vendors and startups assemble modular query stacks instead of monolithic databases.

- **[go-mysql-server](https://github.com/dolthub/go-mysql-server)** — ⭐2,618  
  Storage-agnostic MySQL-compatible engine, relevant for developers embedding SQL execution into applications and custom data systems.

- **[Firebolt Core](https://github.com/firebolt-db/firebolt-core)** — ⭐195  
  Self-hosted distributed query engine that is worth attention as cloud-warehouse architectures increasingly open selected core components.

- **[KiteSQL](https://github.com/KipData/KiteSQL)** — ⭐686  
  Embedded relational database in Rust, reflecting continued interest in lightweight programmable query runtimes.

- **[QLever](https://github.com/ad-freiburg/qlever)** — ⭐800  
  Fast RDF/SPARQL engine that signals continued specialization in graph-oriented analytical query processing.

---

### 🔗 Data Integration & ETL

- **[OLake](https://github.com/datazip-inc/olake)** — ⭐1,312  
  Replication from databases, Kafka, and S3 into Iceberg or Parquet, directly aligned with today’s demand for lakehouse-native ingestion.

- **[dlt](https://github.com/dlt-hub/dlt)** — ⭐5,106  
  Python data loading framework that keeps gaining traction among engineering teams seeking simpler programmable ELT.

- **[Rudder Server](https://github.com/rudderlabs/rudder-server)** — ⭐4,377  
  Privacy-focused event pipeline and Segment alternative, relevant as analytics pipelines increasingly require first-party data control.

- **[Multiwoven](https://github.com/Multiwoven/multiwoven)** — ⭐1,644  
  Open-source reverse ETL platform, highlighting the continued operational importance of activating warehouse data in downstream tools.

- **[Versatile Data Kit](https://github.com/vmware/versatile-data-kit)** — ⭐478  
  Framework for building and operating Python/SQL workflows, useful for platform teams standardizing production data jobs.

- **[Dinky](https://github.com/DataLinkDC/dinky)** — ⭐3,711  
  Real-time data development platform around Apache Flink, showing sustained momentum behind streaming-centric engineering platforms.

- **[dataall](https://github.com/data-dot-all/dataall)** — ⭐251  
  Data marketplace/collaboration layer on AWS, relevant as governance and self-service remain key enterprise bottlenecks.

---

### 🧰 Data Tooling

- **[Apache Superset](https://github.com/apache/superset)** — ⭐71,092  
  Widely adopted open-source BI and exploration platform, still one of the most visible consumption layers for modern OLAP stacks.

- **[Metabase](https://github.com/metabase/metabase)** — ⭐46,540  
  Easy-to-use BI tool that continues to matter for broad analytics adoption beyond specialized data teams.

- **[Grafana](https://github.com/grafana/grafana)** — ⭐72,793  
  Observability and visualization platform whose multi-source model keeps it central to operational analytics and time-series dashboards.

- **[Cube](https://github.com/cube-js/cube)** — ⭐19,681  
  Semantic layer for BI and AI, increasingly important as organizations standardize metric definitions across apps, dashboards, and agents.

- **[Elementary](https://github.com/elementary-data/elementary)** — ⭐2,287  
  dbt-native observability platform, notable because monitoring trust and lineage in analytics pipelines is now a first-class platform concern.

- **[ClickBench](https://github.com/ClickHouse/ClickBench)** — ⭐973  
  Benchmark suite for analytical databases, important because performance claims across OLAP engines are increasingly benchmark-driven.

- **[Hue](https://github.com/cloudera/hue)** — ⭐1,450  
  SQL assistant/UI for databases and warehouses, still relevant as query access ergonomics remain a barrier in multi-engine environments.

- **[Trivy](https://github.com/aquasecurity/trivy)** — ⭐0 (+104 today)  
  Security scanner for containers, code, and cloud infrastructure; while not an OLAP tool directly, it is relevant for securing modern data platform supply chains and deployment pipelines.

---

## 3. Trend Signal Analysis

The clearest signal from today’s dataset is that **core OLAP engines are not dominating GitHub’s general trending feed**, but the **data-infra topic layer remains structurally strong**, especially around lakehouse metadata, embedded analytics, and composable query engines. In other words, community attention is shifting from “new database hype” toward **platform architecture pieces**: catalogs, query runtimes, ingestion layers, and semantic/observability tools.

Among project types, the strongest ongoing momentum appears in **real-time and hybrid analytics infrastructure**. [ClickHouse](https://github.com/ClickHouse/ClickHouse), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), [QuestDB](https://github.com/questdb/questdb), and [Apache Fluss](https://github.com/apache/fluss) reflect sustained demand for systems that can combine fast ingest with low-latency query. This aligns closely with recent warehouse trends where batch-vs-stream boundaries are collapsing.

A second important direction is the rise of **open lakehouse control planes**. Projects such as [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino) suggest that interoperability around Iceberg-style architectures is now a strategic battleground. The catalog is becoming as important as the engine.

There are also early signals of continued lower-layer innovation: [facebookincubator/nimble](https://github.com/facebookincubator/nimble) indicates interest in **new columnar file formats**, while [Apache DataFusion](https://github.com/apache/datafusion) and related projects show that **Rust-based modular compute stacks** are increasingly the foundation for next-generation analytics products. This fits broader cloud-warehouse evolution: object storage as substrate, open table/catalog standards for interoperability, and pluggable compute above them.

---

## 4. Community Hot Spots

- **[Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Gravitino](https://github.com/apache/gravitino)**  
  Watch the catalog layer closely: open metadata/control planes are becoming crucial for multi-engine lakehouse interoperability and governance.

- **[Apache DataFusion](https://github.com/apache/datafusion) and [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista)**  
  These are increasingly important as building blocks for composable analytics systems, especially in Rust-native data infrastructure.

- **[ClickHouse](https://github.com/ClickHouse/ClickHouse), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks)**  
  The competitive center of open OLAP remains real-time, sub-second analytics over large datasets and mixed lake/warehouse architectures.

- **[DuckDB](https://github.com/duckdb/duckdb) and [chDB](https://github.com/chdb-io/chdb)**  
  Embedded OLAP continues to expand, especially for local analytics, notebooks, application-side SQL, and lightweight analytical services.

- **[OLake](https://github.com/datazip-inc/olake) and [dlt](https://github.com/dlt-hub/dlt)**  
  Ingestion into open lakehouse formats is a practical hot spot, reflecting how teams increasingly optimize for Iceberg/Parquet-native pipelines rather than warehouse-proprietary loading paths.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*