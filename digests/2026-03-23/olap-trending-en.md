# OLAP & Data Infra Open Source Trends 2026-03-23

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-23 01:23 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
**Date:** 2026-03-23

## Step 1 — Filtered Relevant Projects

From the provided data, the repositories clearly relevant to **OLAP / data infrastructure / analytics** are:

**From Today’s Trending**
- [HKUDS/LightRAG](https://github.com/HKUDS/LightRAG) — adjacent relevance only; retrieval/data access layer, not core OLAP
- No strongly core OLAP/data-infra repos appeared on today’s general trending list.

**From Topic Search**
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)
- [prestodb/presto](https://github.com/prestodb/presto)
- [apache/doris](https://github.com/apache/doris)
- [StarRocks/starrocks](https://github.com/StarRocks/starrocks)
- [duckdb/duckdb](https://github.com/duckdb/duckdb)
- [questdb/questdb](https://github.com/questdb/questdb)
- [timescale/timescaledb](https://github.com/timescale/timescaledb)
- [apache/datafusion](https://github.com/apache/datafusion)
- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista)
- [trinodb/trino](https://github.com/trinodb/trino)
- [databendlabs/databend](https://github.com/databendlabs/databend)
- [apache/cloudberry](https://github.com/apache/cloudberry)
- [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone)
- [crate/crate](https://github.com/crate/crate)
- [chdb-io/chdb](https://github.com/chdb-io/chdb)
- [roapi/roapi](https://github.com/roapi/roapi)
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul)
- [apache/gravitino](https://github.com/apache/gravitino)
- [apache/polaris](https://github.com/apache/polaris)
- [apache/fluss](https://github.com/apache/fluss)
- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)
- [datazip-inc/olake](https://github.com/datazip-inc/olake)
- [dlt-hub/dlt](https://github.com/dlt-hub/dlt)
- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server)
- [elementary-data/elementary](https://github.com/elementary-data/elementary)
- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench)
- [apache/superset](https://github.com/apache/superset)
- [metabase/metabase](https://github.com/metabase/metabase)
- [getredash/redash](https://github.com/getredash/redash)
- [grafana/grafana](https://github.com/grafana/grafana)

Excluded as non-core for this report: consumer analytics tools, general web analytics, Excel libraries, unrelated utilities, games, agent frameworks, and most AI-only repos unless materially tied to data infra.

---

## 1. Today's Highlights

Today’s general GitHub trending page is overwhelmingly dominated by **AI agents and application-layer tooling**, with **very little direct OLAP or core data-infrastructure presence**. That absence is itself a signal: data infrastructure innovation is currently surfacing more through **topic ecosystems and sustained platform development** than through one-day viral spikes. The strongest momentum remains around **real-time analytics databases**, **lakehouse catalogs/storage layers**, and **Rust-based query/compute engines**. A secondary but important signal is the growing convergence between **analytics systems and AI-facing data access**, visible in projects like Databend, Gravitino, Polaris, and ROAPI.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐46,463**
  - Real-time analytical DBMS and still the benchmark name in open-source OLAP; worth attention as the reference point for high-performance columnar analytics.

- [DuckDB](https://github.com/duckdb/duckdb) — **⭐36,847**
  - In-process analytical SQL database; important because embedded OLAP continues to reshape local analytics, notebooks, and application-integrated querying.

- [Apache Doris](https://github.com/apache/doris) — **⭐15,136**
  - Unified analytics database with strong real-time and interactive query positioning; notable as part of the rising “lakehouse-meets-warehouse” class.

- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐11,499**
  - Fast open query engine for sub-second analytics on and off the lakehouse; highly relevant for hybrid warehouse/lake deployments.

- [QuestDB](https://github.com/questdb/questdb) — **⭐16,784**
  - High-performance time-series database; worth watching because operational analytics and event/time-series workloads remain a major OLAP growth area.

- [Databend](https://github.com/databendlabs/databend) — **⭐9,202**
  - Cloud-native analytics warehouse on object storage with AI/search positioning; stands out for aggressively modern warehouse architecture.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — **⭐1,193**
  - Mature MPP analytical database lineage from Greenplum; relevant for teams seeking classic shared-nothing warehouse architecture in open source.

## 📦 Storage Formats & Lakehouse

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — **⭐3,228**
  - End-to-end real-time lakehouse framework focused on ingestion, concurrent updates, and incremental analytics; notable for blending BI and AI use cases.

- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐2,924**
  - Federated open data catalog for geo-distributed metadata lakes; important as metadata control planes become strategic in lakehouse stacks.

- [Apache Polaris](https://github.com/apache/polaris) — **⭐1,884**
  - Open source catalog for Apache Iceberg; highly relevant because catalog standardization is becoming central to interoperable lakehouse architectures.

- [Apache Fluss](https://github.com/apache/fluss) — **⭐1,828**
  - Streaming storage built for real-time analytics; significant as storage layers increasingly target low-latency analytical consumption, not just batch.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐1,224**
  - Rust-based Apache Iceberg REST catalog; worth attention as lightweight, secure catalog implementations gain traction.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐701**
  - New file format for large columnar datasets; an early but notable signal of experimentation below the table-format layer.

## ⚙️ Query & Compute

- [Trino](https://github.com/trinodb/trino) — **⭐12,656**
  - Distributed SQL query engine for big data; continues to anchor federated query and open lakehouse compute patterns.

- [Presto](https://github.com/prestodb/presto) — **⭐16,664**
  - Established distributed SQL engine; still relevant for the long-running split between federated SQL execution ecosystems.

- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐8,520**
  - Rust-native SQL query engine; one of the clearest signals that modular query execution in Rust is becoming foundational infrastructure.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐1,994**
  - Distributed query engine built on DataFusion; important as execution frameworks evolve from embedded libraries to scale-out runtimes.

- [chDB](https://github.com/chdb-io/chdb) — **⭐2,644**
  - In-process OLAP SQL engine powered by ClickHouse; notable for pushing analytical SQL directly into application/runtime environments.

- [ROAPI](https://github.com/roapi/roapi) — **⭐3,416**
  - API layer over columnar/static datasets with no-code setup; worth attention because data access is increasingly exposed as service endpoints, not just SQL.

## 🔗 Data Integration & ETL

- [OLake](https://github.com/datazip-inc/olake) — **⭐1,311**
  - Replication from databases, Kafka, and S3 into Iceberg or Parquet; highly relevant for real-time ingestion into open lakehouse storage.

- [dlt](https://github.com/dlt-hub/dlt) — **⭐5,092**
  - Python data loading framework; useful because developer-first ingestion tooling remains one of the fastest-growing practical areas in analytics engineering.

- [Rudder Server](https://github.com/rudderlabs/rudder-server) — **⭐4,376**
  - Event pipeline and warehouse-first customer data infrastructure; relevant for activation pipelines and product analytics ingestion.

- [Dinky](https://github.com/DataLinkDC/dinky) — **⭐3,711**
  - Flink-based real-time data development platform; important for stream processing and operational analytics workflows.

## 🧰 Data Tooling

- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐973**
  - Benchmark suite for analytical databases; worth attention as performance claims across OLAP engines continue to intensify.

- [Elementary](https://github.com/elementary-data/elementary) — **⭐2,281**
  - dbt-native data observability; important because trust, testing, and monitoring are now core parts of warehouse operations.

- [Apache Superset](https://github.com/apache/superset) — **⭐71,056**
  - Open-source BI and data exploration platform; remains a standard visualization layer on top of modern analytical backends.

- [Metabase](https://github.com/metabase/metabase) — **⭐46,509**
  - Accessible BI and embedded analytics tool; still a major adoption on-ramp for open data stacks.

- [Redash](https://github.com/getredash/redash) — **⭐28,296**
  - Querying and dashboarding platform; relevant as lightweight SQL-first interfaces retain strong operational utility.

- [Grafana](https://github.com/grafana/grafana) — **⭐72,800**
  - Observability and visualization platform; increasingly overlaps with analytics for time-series, logs, and operational OLAP use cases.

---

## 3. Trend Signal Analysis

The strongest signal today is somewhat indirect: **core OLAP and data-infrastructure projects are not the center of GitHub’s viral daily trending cycle**, while AI-agent repos dominate attention. For data engineers, this suggests that infrastructure momentum is currently accumulating in **platform depth rather than hype spikes**. Within the data ecosystem itself, the highest-energy areas are **real-time analytics engines**, **open lakehouse metadata/catalog layers**, and **modular query execution frameworks**.

Among engine types, **ClickHouse, DuckDB, Doris, StarRocks, and Databend** represent the main gravitational centers. They reflect three converging patterns: ultra-fast columnar execution, object-storage-native architectures, and support for mixed analytical workloads spanning BI, logs, search, and increasingly AI-connected retrieval. On the storage side, the notable movement is not a brand-new dominant table format, but the growing strategic importance of **catalogs and metadata planes**—seen in **Apache Polaris, Gravitino, and Lakekeeper**. This mirrors enterprise lakehouse evolution, where interoperability and governance are now as important as raw file storage.

A fresh technical direction appears in **lower-layer format and engine modularity**: projects like **Nimble** hint at continued file-format experimentation, while **DataFusion** and **chDB** show a strong push toward embeddable, composable compute. That aligns with recent lakehouse/cloud-warehouse trends: instead of one monolithic warehouse, teams increasingly assemble stacks from **object storage + open table/catalog standards + separable query engines + ingestion pipelines**. The ecosystem is becoming more open, more Rust-influenced, and more service-composable.

---

## 4. Community Hot Spots

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**
  - Iceberg catalog infrastructure is becoming a key control point for interoperable lakehouse deployments.

- **[Apache DataFusion](https://github.com/apache/datafusion)**
  - Rust-based query execution is emerging as foundational technology for embedded engines, custom compute, and next-gen data services.

- **[Databend](https://github.com/databendlabs/databend)**
  - Strong signal around unified analytics warehouse designs that combine lakehouse storage, cloud-native execution, and AI-oriented access patterns.

- **[OLake](https://github.com/datazip-inc/olake)**
  - Real-time ingestion into Iceberg/Parquet highlights sustained demand for open-format replication pipelines.

- **[ClickBench](https://github.com/ClickHouse/ClickBench) plus [ClickHouse](https://github.com/ClickHouse/ClickHouse), [StarRocks](https://github.com/StarRocks/starrocks), [Apache Doris](https://github.com/apache/doris)**
  - Competitive benchmarking and performance positioning remain a major community focus in the OLAP database race.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*