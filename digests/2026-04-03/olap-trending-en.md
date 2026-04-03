# OLAP & Data Infra Open Source Trends 2026-04-03

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-04-03 01:27 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
Date: 2026-04-03

## Step 1 — Filtered Scope
The **GitHub Today’s Trending list contains no clearly relevant OLAP/data-infrastructure repositories today**; all 4 trending repos are unrelated to analytics databases, lakehouse, ETL, BI, or query engines, so they are excluded.

This report therefore focuses on the **data-infra topic search results**, filtering for projects clearly tied to OLAP, analytics, lakehouse, query execution, ingestion, observability, and BI/tooling.

---

## 1. Today's Highlights

Today’s signal is less about a breakout newcomer on the general GitHub trending page and more about the **continued strength of the established open-source analytics stack** across OLAP engines, lakehouse infrastructure, and query frameworks. The strongest repos by community gravity remain engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks), while the ecosystem around them keeps expanding.

A notable pattern is the **continued rise of embedded and composable analytics**: projects like [chDB](https://github.com/chdb-io/chdb), [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake), and [arc](https://github.com/Basekick-Labs/arc) show demand for analytical execution inside applications, Postgres environments, and lightweight deployments. On the lakehouse side, **catalog and metadata infrastructure** remains a major investment area, led by [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper).

Another strong signal is the blending of **analytics + AI/search workloads**. Repos such as [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), [SeekDB](https://github.com/oceanbase/seekdb), and [Wren Engine](https://github.com/Canner/wren-engine) increasingly position themselves as unified engines for SQL, search, vector, and agent-facing workloads.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐ 46,671  
  Real-time analytical DBMS and still the most visible open-source OLAP engine for sub-second analytics at scale.
- [DuckDB](https://github.com/duckdb/duckdb) — ⭐ 37,145  
  In-process analytical database that continues to define the embedded OLAP category and influence modern analytical execution design.
- [Apache Doris](https://github.com/apache/doris) — ⭐ 15,169  
  A unified analytics database with broad adoption in real-time reporting and lakehouse-adjacent deployments.
- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐ 11,536  
  High-performance query engine for real-time and lakehouse analytics, worth attention for hybrid warehouse/lake patterns.
- [Databend](https://github.com/databendlabs/databend) — ⭐ 9,223  
  A cloud-native warehouse architecture rebuilt around object storage, with growing AI/search positioning.
- [QuestDB](https://github.com/questdb/questdb) — ⭐ 16,816  
  A high-performance time-series database with OLAP characteristics, especially relevant for operational analytics workloads.
- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐ 1,197  
  MPP analytics database and a notable open-source path for teams wanting Greenplum-style warehouse architecture.

### 📦 Storage Formats & Lakehouse
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐ 706  
  A new extensible file format for large columnar datasets, making it one of the more interesting format-layer experiments in the ecosystem.
- [Apache Polaris](https://github.com/apache/polaris) — ⭐ 1,889  
  Open-source Apache Iceberg catalog infrastructure, central to interoperable lakehouse control planes.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐ 1,239  
  Rust-based Iceberg REST catalog that reflects demand for lightweight, secure, cloud-native catalog services.
- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐ 3,226  
  End-to-end realtime lakehouse framework focused on concurrent updates and cloud-native analytics.
- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐ 2,934  
  Federated metadata lake/catalog project, notable for multi-engine governance and geo-distributed data architectures.
- [Apache Fluss](https://github.com/apache/fluss) — ⭐ 1,837  
  Streaming storage for real-time analytics, signaling tighter convergence between streaming and lakehouse storage layers.
- [pixelsdb/pixels](https://github.com/pixelsdb/pixels) — ⭐ 901  
  Storage and compute engine for cloud and on-prem analytics, relevant as a vertically integrated data layout effort.

### ⚙️ Query & Compute
- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐ 8,555  
  One of the most important modular SQL query engines in the ecosystem, increasingly used as infrastructure rather than an end product.
- [Trino](https://github.com/trinodb/trino) — ⭐ 12,686  
  Distributed SQL query engine with strong relevance for federated lakehouse and warehouse access patterns.
- [Presto](https://github.com/prestodb/presto) — ⭐ 16,677  
  Still a major engine in the distributed SQL space and a reference point for interactive analytics on large datasets.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐ 2,004  
  Distributed execution layer for DataFusion, important for teams tracking Rust-native scale-out query stacks.
- [chDB](https://github.com/chdb-io/chdb) — ⭐ 2,653  
  In-process OLAP SQL powered by ClickHouse, standing out in the embedded analytics movement.
- [Mooncake Labs / pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) — ⭐ 1,946  
  Real-time analytics on Postgres tables, reflecting demand for analytical acceleration without abandoning Postgres.
- [firebolt-core](https://github.com/firebolt-db/firebolt-core) — ⭐ 196  
  Self-hosted distributed query engine from Firebolt, notable as a performance-oriented warehouse core becoming more accessible.
- [XiangpengHao/liquid-cache](https://github.com/XiangpengHao/liquid-cache) — ⭐ 396  
  Pushdown cache for DataFusion, interesting as optimization shifts toward composable execution primitives.

### 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — ⭐ 5,167  
  Python-native loading framework that continues to gain mindshare for developer-friendly ingestion into analytical destinations.
- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐ 4,382  
  Event pipeline and Segment alternative with strong relevance to warehouse-first architectures.
- [OLake](https://github.com/datazip-inc/olake) — ⭐ 1,313  
  Replication into Apache Iceberg or Parquet from databases, Kafka, and S3; highly aligned with modern lakehouse ingestion needs.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐ 1,648  
  Open-source reverse ETL, notable for operationalizing warehouse data back into downstream tools.
- [Transformalize](https://github.com/dalenewman/Transformalize) — ⭐ 161  
  Configurable ETL framework, smaller in reach but still relevant for practical pipeline construction.
- [walkerOS](https://github.com/elbwalker/walkerOS) — ⭐ 332  
  Open-source tag manager useful at the analytics data collection edge rather than warehouse core.

### 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐ 72,190  
  Mature open-source BI and exploration layer, still one of the default front ends for OLAP engines and lakehouse backends.
- [Metabase](https://github.com/metabase/metabase) — ⭐ 46,725  
  Widely adopted self-service BI tool, important because ease-of-use remains a decisive factor in data stack adoption.
- [Grafana](https://github.com/grafana/grafana) — ⭐ 72,938  
  Though broader than analytics, it remains critical for operational analytics, observability, and metrics-heavy data platforms.
- [Elementary](https://github.com/elementary-data/elementary) — ⭐ 2,295  
  dbt-native data observability, reflecting ongoing investment in warehouse reliability and data quality workflows.
- [Hue](https://github.com/cloudera/hue) — ⭐ 1,446  
  SQL assistant layer for databases and warehouses, still relevant in mixed-enterprise data environments.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐ 981  
  Benchmark suite for analytical databases; important as performance claims across OLAP and lakehouse systems intensify.
- [Wren Engine](https://github.com/Canner/wren-engine) — ⭐ 630  
  Context engine for AI agents over 15+ data sources, notable for bridging semantic/data access layers with agent workflows.

---

## 3. Trend Signal Analysis

The clearest signal today is that **open-source data infrastructure attention is concentrating around composable analytics engines and lakehouse control-plane components**, even without a data project appearing on the general GitHub trending page. Community gravity remains strongest around proven OLAP systems—especially ClickHouse, DuckDB, Doris, StarRocks, and Trino-class engines—but the more interesting directional shift is in the surrounding ecosystem.

First, **embedded and in-process analytics** is becoming a durable pattern. DuckDB established the modern baseline, and now projects like chDB, pg_mooncake, and arc are extending the idea into Python, Postgres, and lightweight binary deployments. This suggests developers increasingly want analytical power inside application runtimes, not only in separate warehouse clusters.

Second, there is ongoing experimentation at the **storage and metadata layer**. Nimble stands out as a newer columnar format effort, while Polaris, Gravitino, and Lakekeeper show that Iceberg-era lakehouse adoption is driving investment into catalogs, governance, and interoperability rather than only raw storage. This matches the broader market shift from “build a table format” to “operate a multi-engine lakehouse safely.”

Third, **AI-native positioning is now deeply embedded in data infrastructure messaging**. Databend, MatrixOne, SeekDB, and Wren Engine all emphasize combinations of analytics, search, vector, or agent-facing workflows. This does not yet represent a fully new query paradigm, but it does indicate convergence: analytical databases are being repackaged as the execution and memory substrate for AI applications.

Overall, today’s ecosystem points toward a stack where **object storage, open table/catalog standards, embedded execution, and AI-facing semantics** increasingly meet.

---

## 4. Community Hot Spots

- **[DuckDB](https://github.com/duckdb/duckdb) + embedded analytics derivatives**  
  The in-process OLAP model keeps expanding into adjacent tools and architectures, making this one of the most important design patterns to watch.

- **[Apache DataFusion](https://github.com/apache/datafusion) ecosystem**  
  DataFusion, Ballista, liquid-cache, and downstream integrations show growing momentum for Rust-native, modular query execution infrastructure.

- **[Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino)**  
  Catalog and metadata services are becoming strategic control points in lakehouse deployments, especially for multi-engine interoperability.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  New columnar file-format work is rare and worth attention; if it matures, it could influence future storage/scan optimization choices.

- **[Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [SeekDB](https://github.com/oceanbase/seekdb)**  
  These projects reflect the strongest “analytics + search/vector/AI” convergence signal in the current open-source data ecosystem.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*