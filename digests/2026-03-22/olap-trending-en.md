# OLAP & Data Infra Open Source Trends 2026-03-22

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-22 01:22 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-22

## Step 1 — Filtered Projects

### Relevant from Today’s GitHub Trending
Only **2 of 9** trending repositories are clearly relevant to OLAP / data infrastructure:

- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — PDF parsing / document-to-structured-data ingestion
- [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf) — foundational data interchange format widely used in data systems

Excluded as non-data/OLAP: MoneyPrinterV2, systemd, trivy, project-nomad, claude-hud, vllm-omni, arnis.

### Relevant from Topic Search
The topic search set is strongly data-relevant. After filtering out weakly related or misleading topic matches, the most relevant projects include:

- OLAP / analytical databases: [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse), [duckdb/duckdb](https://github.com/duckdb/duckdb), [apache/doris](https://github.com/apache/doris), [StarRocks/starrocks](https://github.com/StarRocks/starrocks), [questdb/questdb](https://github.com/questdb/questdb), [databendlabs/databend](https://github.com/databendlabs/databend), [timescale/timescaledb](https://github.com/timescale/timescaledb), [apache/cloudberry](https://github.com/apache/cloudberry)
- Query / compute: [apache/datafusion](https://github.com/apache/datafusion), [trinodb/trino](https://github.com/trinodb/trino), [prestodb/presto](https://github.com/prestodb/presto), [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista), [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server), [chdb-io/chdb](https://github.com/chdb-io/chdb)
- Storage / lakehouse: [facebookincubator/nimble](https://github.com/facebookincubator/nimble), [apache/polaris](https://github.com/apache/polaris), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul), [apache/gravitino](https://github.com/apache/gravitino), [apache/fluss](https://github.com/apache/fluss)
- Integration / ETL: [dlt-hub/dlt](https://github.com/dlt-hub/dlt), [datazip-inc/olake](https://github.com/datazip-inc/olake), [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server), [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven), [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky), [vmware/versatile-data-kit](https://github.com/vmware/versatile-data-kit)
- Tooling / BI / benchmarks / observability: [apache/superset](https://github.com/apache/superset), [metabase/metabase](https://github.com/metabase/metabase), [getredash/redash](https://github.com/getredash/redash), [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench), [elementary-data/elementary](https://github.com/elementary-data/elementary), [grafana/grafana](https://github.com/grafana/grafana)

---

## 1. Today’s Highlights

Today’s strongest direct signal from GitHub Trending is not a new OLAP engine, but **data ingestion and data representation**: [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) surged with **+950 today**, indicating strong demand for turning messy documents into analytics- and AI-ready structured data. Meanwhile, [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf) appearing on the daily trending list reinforces continued interest in efficient, portable serialization layers that underpin modern data pipelines and query services.  

From the broader topic activity, the center of gravity remains with mature analytical engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks), but there is also notable momentum around **lakehouse catalogs, streaming storage, and embedded analytics**. In short, today’s ecosystem signal points to a stack where **ingestion + open storage/catalog layers + flexible query engines** matter as much as the warehouse itself.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines
- [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse) — **46,440★**  
  Real-time analytical DBMS and still one of the most important reference points for high-performance open-source OLAP.

- [duckdb/duckdb](https://github.com/duckdb/duckdb) — **36,837★**  
  In-process analytical SQL database that continues to define the embedded OLAP pattern for local, app-embedded, and notebook analytics.

- [apache/doris](https://github.com/apache/doris) — **15,133★**  
  A unified analytics database with strong traction in real-time and interactive SQL workloads, worth watching as enterprises seek simpler OLAP stacks.

- [StarRocks/starrocks](https://github.com/StarRocks/starrocks) — **11,496★**  
  Fast distributed analytics engine focused on sub-second lakehouse and multidimensional analytics, aligned with the shift toward hybrid warehouse-lake deployments.

- [questdb/questdb](https://github.com/questdb/questdb) — **16,783★**  
  High-performance time-series OLAP engine; notable because time-series analytics remains a resilient subsegment of the OLAP market.

- [databendlabs/databend](https://github.com/databendlabs/databend) — **9,202★**  
  Cloud-native warehouse on object storage with an increasingly explicit AI/agent positioning, reflecting where next-gen warehouse products are moving.

- [apache/cloudberry](https://github.com/apache/cloudberry) — **1,192★**  
  Open-source MPP database in the Greenplum lineage, important for teams still valuing mature scale-out SQL warehouse architectures.

## 📦 Storage Formats & Lakehouse
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **701★**  
  A new file format for large columnar datasets; significant because storage innovation remains rare and high-leverage in analytics infrastructure.

- [apache/polaris](https://github.com/apache/polaris) — **1,883★**  
  Open-source catalog for Apache Iceberg, representing the growing strategic importance of interoperable metadata control planes.

- [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper) — **1,224★**  
  Rust-based Iceberg REST catalog that reflects demand for leaner, cloud-native lakehouse metadata services.

- [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul) — **3,228★**  
  End-to-end real-time lakehouse framework focused on ingestion plus incremental analytics for BI and AI use cases.

- [apache/gravitino](https://github.com/apache/gravitino) — **2,924★**  
  Federated metadata lake project that shows how catalogs are evolving into broader data governance and cross-engine coordination layers.

- [apache/fluss](https://github.com/apache/fluss) — **1,828★**  
  Streaming storage for real-time analytics, notable because streaming-native storage is becoming a first-class lakehouse building block.

## ⚙️ Query & Compute
- [apache/datafusion](https://github.com/apache/datafusion) — **8,518★**  
  Rust SQL query engine increasingly central to the composable analytics stack and one of the clearest signals of modular query infrastructure.

- [trinodb/trino](https://github.com/trinodb/trino) — **12,656★**  
  Distributed SQL query engine that remains core to federated analytics across object stores, warehouses, and operational systems.

- [prestodb/presto](https://github.com/prestodb/presto) — **16,665★**  
  Still a major presence in large-scale distributed SQL, especially where legacy and long-running deployments matter.

- [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista) — **1,994★**  
  Distributed execution layer for DataFusion, important as DataFusion expands from library engine to broader compute platform.

- [chdb-io/chdb](https://github.com/chdb-io/chdb) — **2,642★**  
  In-process OLAP SQL engine powered by ClickHouse; worth attention as embedded analytics increasingly competes with service-based databases.

- [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server) — **2,617★**  
  Storage-agnostic MySQL-compatible query engine, interesting for builders creating custom analytical or hybrid SQL systems.

## 🔗 Data Integration & ETL
- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — **0★ (+950 today)**  
  PDF parser for AI-ready data; today’s clearest breakout project in data infra, signaling intense interest in unstructured-to-structured ingestion.

- [dlt-hub/dlt](https://github.com/dlt-hub/dlt) — **5,085★**  
  Python-first data loading framework that continues to resonate with teams wanting simpler modern ELT tooling.

- [datazip-inc/olake](https://github.com/datazip-inc/olake) — **1,311★**  
  Replication and ingestion into Iceberg or Parquet, directly aligned with real-time lakehouse adoption.

- [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server) — **4,376★**  
  Event/data pipeline platform and Segment alternative, relevant as product and warehouse pipelines continue converging.

- [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven) — **1,643★**  
  Open-source Reverse ETL, reflecting demand to activate warehouse data operationally, not just analyze it.

- [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky) — **3,711★**  
  Flink-based real-time data development platform, showing continued interest in operationalizing streaming SQL pipelines.

## 🧰 Data Tooling
- [protocolbuffers/protobuf](https://github.com/protocolbuffers/protobuf) — **0★ (+7 today)**  
  Foundational serialization format; trending visibility today highlights the enduring importance of efficient schema-driven interchange in data systems.

- [apache/superset](https://github.com/apache/superset) — **71,047★**  
  Leading open-source BI and data exploration platform, still the default analytics UI in many OSS data stacks.

- [metabase/metabase](https://github.com/metabase/metabase) — **46,501★**  
  Widely adopted self-service BI tool, important for its persistent traction with engineering-led analytics deployments.

- [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench) — **973★**  
  Benchmark suite for analytical databases, increasingly relevant as engine vendors compete on reproducible performance claims.

- [elementary-data/elementary](https://github.com/elementary-data/elementary) — **2,281★**  
  dbt-native data observability tool, reflecting the maturation of analytics engineering quality and monitoring practices.

- [grafana/grafana](https://github.com/grafana/grafana) — **72,781★**  
  While broader than analytics, Grafana remains key data tooling for observability-driven analytics workflows and operational dashboards.

---

## 3. Trend Signal Analysis

The sharpest community attention today is going toward **data ingestion for messy and unstructured sources**, not just core database engines. The breakout of [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) suggests that document parsing, accessibility extraction, and turning PDFs into structured tables are becoming mainstream infrastructure concerns. This fits a broader shift: modern analytics stacks increasingly need to absorb not only tables and logs, but also documents and semi-structured enterprise content for both BI and AI workloads.

A second clear signal is that **open, modular data stack components** continue gaining strategic weight. Projects like [apache/polaris](https://github.com/apache/polaris), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), and [apache/gravitino](https://github.com/apache/gravitino) show that catalogs and metadata planes are now a major battleground in the lakehouse ecosystem. Meanwhile, [facebookincubator/nimble](https://github.com/facebookincubator/nimble) stands out as an early indicator of renewed experimentation in **columnar storage formats**, a relatively rare but consequential direction.

On compute, the ecosystem remains split between **large distributed engines** like [trinodb/trino](https://github.com/trinodb/trino), [apache/doris](https://github.com/apache/doris), and [StarRocks/starrocks](https://github.com/StarRocks/starrocks), and **embedded/in-process analytics** represented by [duckdb/duckdb](https://github.com/duckdb/duckdb) and [chdb-io/chdb](https://github.com/chdb-io/chdb). This maps directly to recent lakehouse and cloud-warehouse developments: object storage is the default substrate, catalogs are becoming control planes, and query execution is becoming more composable, embeddable, and app-facing. The net result is an ecosystem moving from monolithic warehouse products toward **interoperable analytics layers built from specialized OSS components**.

---

## 4. Community Hot Spots

- **[opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**  
  Breakout momentum today suggests document-to-structured-data pipelines are rapidly becoming core data infra.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  New columnar file format work is rare and potentially high impact; worth watching for storage-layer innovation.

- **[apache/polaris](https://github.com/apache/polaris) / [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg catalog implementations are emerging as critical lakehouse interoperability infrastructure.

- **[apache/datafusion](https://github.com/apache/datafusion)**  
  Strong signal for the rise of modular Rust-based query engines powering custom and embedded analytics systems.

- **[duckdb/duckdb](https://github.com/duckdb/duckdb) and [chdb-io/chdb](https://github.com/chdb-io/chdb)**  
  Embedded OLAP remains one of the most important architectural shifts, especially for local analytics, apps, and AI tooling.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*