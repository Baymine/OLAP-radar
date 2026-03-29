# OLAP & Data Infra Open Source Trends 2026-03-29

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-29 01:43 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-29

## Step 1 — Filtered Relevant Projects

From **GitHub Today’s Trending**, only these are clearly relevant to OLAP / data infrastructure / analytics:
- [apache/superset](https://github.com/apache/superset)

From **Topic Search Results**, the clearly relevant OLAP/data infrastructure/analytics projects include:
- OLAP/DB/query layer: [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse), [duckdb/duckdb](https://github.com/duckdb/duckdb), [questdb/questdb](https://github.com/questdb/questdb), [apache/doris](https://github.com/apache/doris), [StarRocks/starrocks](https://github.com/StarRocks/starrocks), [oceanbase/oceanbase](https://github.com/oceanbase/oceanbase), [databendlabs/databend](https://github.com/databendlabs/databend), [apache/datafusion](https://github.com/apache/datafusion), [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista), [crate/crate](https://github.com/crate/crate), [chdb-io/chdb](https://github.com/chdb-io/chdb), [matrixorigin/matrixone](https://github.com/matrixorigin/matrixone), [trinodb/trino](https://github.com/trinodb/trino), [prestodb/presto](https://github.com/prestodb/presto), [apache/cloudberry](https://github.com/apache/cloudberry), [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc), [Mooncake-Labs/pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake), [firebolt-db/firebolt-core](https://github.com/firebolt-db/firebolt-core)
- Lakehouse/storage/catalog/benchmark: [lakesoul-io/LakeSoul](https://github.com/lakesoul-io/LakeSoul), [apache/gravitino](https://github.com/apache/gravitino), [apache/polaris](https://github.com/apache/polaris), [apache/fluss](https://github.com/apache/fluss), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench), [facebookincubator/nimble](https://github.com/facebookincubator/nimble)
- Integration/ETL: [dlt-hub/dlt](https://github.com/dlt-hub/dlt), [datazip-inc/olake](https://github.com/datazip-inc/olake), [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server), [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven)
- Tooling/BI/observability/SQL UX: [apache/superset](https://github.com/apache/superset), [metabase/metabase](https://github.com/metabase/metabase), [grafana/grafana](https://github.com/grafana/grafana), [elementary-data/elementary](https://github.com/elementary-data/elementary), [cloudera/hue](https://github.com/cloudera/hue), [roapi/roapi](https://github.com/roapi/roapi)

---

## 1. Today's Highlights

The only data-infra project breaking into GitHub’s broad daily trending list today is [Apache Superset](https://github.com/apache/superset), signaling continued demand for open BI and SQL-native analytics interfaces even amid an AI-heavy GitHub cycle. In the wider OLAP topic landscape, the strongest incumbents remain [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks), confirming that analytical SQL engines are still the core gravity center of open-source data infrastructure.  

A notable secondary trend is the rise of “AI-native” positioning inside database and warehouse projects such as [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [OceanBase SeekDB](https://github.com/oceanbase/seekdb), blending OLAP, search, vector, and agent-oriented workflows. Lakehouse-adjacent catalog and streaming-storage projects like [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Apache Fluss](https://github.com/apache/fluss) also point to ongoing convergence between open table formats, federated metadata, and real-time analytics.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,585  
  A leading real-time analytical DBMS and still one of the strongest community anchors for columnar OLAP at scale.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐37,028  
  The in-process analytics database continues to define the embedded OLAP pattern for local, notebook, app, and edge analytics.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,165  
  A unified analytics database worth watching for its balanced positioning across interactive BI, lakehouse access, and operational simplicity.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,514  
  A high-performance analytics engine focused on sub-second queries across both internal storage and data lake environments.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,209  
  A modern Rust-based warehouse engine pushing unified analytics/search/AI messaging on top of object storage.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,795  
  A high-performance time-series database relevant for teams with market data, telemetry, or industrial analytics workloads.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  An MPP warehouse alternative in the Greenplum lineage, notable for users still valuing classic shared-nothing SQL warehousing.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,646  
  An in-process OLAP engine powered by ClickHouse, reflecting the broader move toward embedded analytical execution.

### 📦 Storage Formats & Lakehouse

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,225  
  A real-time lakehouse framework emphasizing ingestion, concurrent updates, and analytics for both BI and AI scenarios.

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,887  
  An open Iceberg catalog project worth attention as interoperable metadata becomes central to lakehouse portability.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,928  
  A federated open data catalog aimed at multi-engine, geo-distributed metadata management across modern lakehouse stacks.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,833  
  A streaming storage system built for real-time analytics, representing the push to collapse streaming and analytical serving layers.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,230  
  A Rust-based Iceberg REST catalog showing continued ecosystem investment around open table management infrastructure.

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐704  
  A new extensible file format for large columnar datasets, interesting as format innovation remains comparatively rare.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐976  
  Not a storage engine itself, but an important benchmark suite shaping how analytical databases are compared in practice.

### ⚙️ Query & Compute

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,545  
  A fast-growing Rust SQL query engine that increasingly serves as foundational compute infrastructure for many newer data systems.

- [Trino](https://github.com/trinodb/trino) — ⭐12,669  
  The leading federated distributed SQL engine remains central for querying across heterogeneous lakehouse and warehouse backends.

- [Presto](https://github.com/prestodb/presto) — ⭐16,668  
  Still a major open distributed SQL project and relevant wherever mature large-scale interactive query layers are required.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  The distributed execution counterpart to DataFusion, notable as Rust-native compute stacks mature beyond embedded use cases.

- [Mooncake pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐1,945  
  Brings real-time analytics to Postgres tables, highlighting the strong market pull toward OLAP capabilities inside existing OLTP estates.

- [roapi](https://github.com/roapi/roapi) — ⭐3,416  
  Exposes APIs over static datasets without custom code, fitting lightweight analytical serving and data product use cases.

- [firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  A self-hosted distributed query engine that may attract interest from teams evaluating modern warehouse-style compute outside SaaS.

### 🔗 Data Integration & ETL

- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,135  
  A popular Python-first data loading framework that aligns well with the continuing shift toward developer-centric ingestion.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,311  
  An ingestion tool focused on replicating databases, Kafka, and S3 into Iceberg or Parquet for real-time analytics pipelines.

- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — ⭐4,379  
  A Segment alternative that remains relevant for event ingestion, routing, and warehouse-first customer data architectures.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  An open-source reverse ETL system reflecting continued demand for activation layers on top of warehouse data.

### 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — ⭐71,477, **+31 today**  
  The only clearly data-infra project on today’s general trending list, reinforcing open-source BI as a durable, visible category.

- [Grafana](https://github.com/grafana/grafana) — ⭐72,827  
  Though observability-first, Grafana remains a major analytics surface for operational and time-series data exploration.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,640  
  A widely adopted BI tool that continues to represent the self-service analytics layer for broad internal business use.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  A dbt-native observability tool aligned with the growing importance of reliability and monitoring in warehouse pipelines.

- [Hue](https://github.com/cloudera/hue) — ⭐1,450  
  A mature SQL assistant and warehouse UI that still matters for multi-engine enterprise query workflows.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐976  
  Benchmarking remains important today because comparative performance claims are central to database adoption decisions.

---

## 3. Trend Signal Analysis

Today’s strongest signal is not a sudden breakout of a brand-new OLAP engine on the public trending page, but rather the **durability of the analytics access layer**, represented by [Apache Superset](https://github.com/apache/superset). In a GitHub environment dominated by AI agents and application-layer tools, the data project that still surfaced was BI/query exploration, suggesting that open analytics interfaces remain a persistent entry point for community adoption.

Across the broader topic results, the center of gravity is clearly **analytical SQL engines plus lakehouse interoperability**. Projects like [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino) show that performance, federated access, and low-friction SQL remain the primary buying criteria in open data infrastructure. At the same time, several projects now explicitly combine analytics with **AI/search/vector** capabilities—especially [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [oceanbase/seekdb](https://github.com/oceanbase/seekdb). That marks a meaningful directional shift: not just warehouse + BI, but warehouse + retrieval + agent runtime adjacency.

On the storage side, the most important development is continued investment in **open catalog and streaming-lakehouse control planes**, including [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Apache Fluss](https://github.com/apache/fluss), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper). This aligns tightly with recent lakehouse and cloud-warehouse trends: decoupled storage/compute, Iceberg-centered interoperability, and real-time ingestion becoming a first-class requirement rather than an add-on.

---

## 4. Community Hot Spots

- **[Apache Superset](https://github.com/apache/superset)**  
  The only data project on the general daily trending list today; strong signal that open BI remains strategically relevant and visible.

- **[DuckDB](https://github.com/duckdb/duckdb) + [chDB](https://github.com/chdb-io/chdb)**  
  Embedded/in-process analytics continues to expand, pointing to a future where OLAP increasingly ships inside applications, notebooks, services, and local tools.

- **[Apache DataFusion](https://github.com/apache/datafusion)**  
  Its growing ecosystem role suggests Rust-native query execution is becoming a serious substrate for next-generation analytical systems.

- **[Apache Polaris](https://github.com/apache/polaris) / [Apache Gravitino](https://github.com/apache/gravitino) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Open catalogs are becoming strategic infrastructure as teams standardize around Iceberg and multi-engine lakehouse access.

- **AI-native analytical databases: [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), [SeekDB](https://github.com/oceanbase/seekdb)**  
  These indicate a rising design pattern: one engine serving SQL analytics, search, and AI-facing retrieval workflows together.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*