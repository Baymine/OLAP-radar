# OLAP & Data Infra Open Source Trends 2026-03-18

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-18 02:04 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
Date: 2026-03-18

## Step 1 — Filtered Relevant Projects

From **Today’s Trending**, only these are clearly relevant to OLAP / data infrastructure / analytics:
- [cloudflare/workerd](https://github.com/cloudflare/workerd) — relevant as execution/runtime infrastructure increasingly used for edge data services, though not a pure OLAP project
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — adjacent to data tooling via client-side knowledge graph / Graph RAG over repositories, but not core OLAP
- The rest of the trending list is **not data-infra/OLAP relevant** and is excluded.

From **Topic Search Results**, the clearly relevant OLAP/data projects include:
- OLAP/analytics databases: [ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse), [duckdb/duckdb](https://github.com/duckdb/duckdb), [apache/doris](https://github.com/apache/doris), [StarRocks/starrocks](https://github.com/StarRocks/starrocks), [questdb/questdb](https://github.com/questdb/questdb), [databendlabs/databend](https://github.com/databendlabs/databend), [apache/cloudberry](https://github.com/apache/cloudberry), [chdb-io/chdb](https://github.com/chdb-io/chdb), [crate/crate](https://github.com/crate/crate), [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce), [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)
- Storage/lakehouse: [facebookincubator/nimble](https://github.com/facebookincubator/nimble), [apache/polaris](https://github.com/apache/polaris), [lakekeeper/lakekeeper](https://github.com/lakekeeper/lakekeeper), [apache/gravitino](https://github.com/apache/gravitino), [apache/fluss](https://github.com/apache/fluss), [ytsaurus/ytsaurus](https://github.com/ytsaurus/ytsaurus)
- Query/compute: [trinodb/trino](https://github.com/trinodb/trino), [prestodb/presto](https://github.com/prestodb/presto), [apache/datafusion](https://github.com/apache/datafusion), [apache/datafusion-ballista](https://github.com/apache/datafusion-ballista), [dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server), [mabel-dev/opteryx](https://github.com/mabel-dev/opteryx)
- Integration/ETL: [datazip-inc/olake](https://github.com/datazip-inc/olake), [dlt-hub/dlt](https://github.com/dlt-hub/dlt), [rudderlabs/rudder-server](https://github.com/rudderlabs/rudder-server), [Multiwoven/multiwoven](https://github.com/Multiwoven/multiwoven), [DataLinkDC/dinky](https://github.com/DataLinkDC/dinky)
- Tooling/BI/benchmarking/observability: [apache/superset](https://github.com/apache/superset), [metabase/metabase](https://github.com/metabase/metabase), [getredash/redash](https://github.com/getredash/redash), [grafana/grafana](https://github.com/grafana/grafana), [ClickHouse/ClickBench](https://github.com/ClickHouse/ClickBench), [cloudera/hue](https://github.com/cloudera/hue), [elementary-data/elementary](https://github.com/elementary-data/elementary)

---

## 1. Today's Highlights

The pure GitHub trending list is not dominated by classic OLAP projects today, which itself is a signal: data infrastructure attention is currently surfacing more through **runtime, agentic, and knowledge-layer tooling** than through core engines. Within the broader data-infra topic set, momentum remains strongest around **analytical databases and lakehouse-adjacent metadata/catalog systems**, with ClickHouse, DuckDB, Doris, StarRocks, and Databend continuing to define the center of gravity. A notable emerging thread is the rise of **embedded and lightweight analytical engines** such as [chDB](https://github.com/chdb-io/chdb), [RayforceDB](https://github.com/RayforceDB/rayforce), and [arc](https://github.com/Basekick-Labs/arc), reflecting demand for local-first and developer-friendly analytics. Another important signal is the continued buildout of the **Iceberg/open catalog layer**, represented by [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino).

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,375  
  Real-time analytical DBMS and still one of the strongest anchors in open-source OLAP, especially relevant as in-process and lake-adjacent derivatives expand around it.
- [DuckDB](https://github.com/duckdb/duckdb) — ⭐36,724  
  In-process analytical SQL database that continues to shape the embedded analytics movement across notebooks, apps, and local data workflows.
- [Apache Doris](https://github.com/apache/doris) — ⭐15,119  
  Unified analytics database with strong positioning for interactive OLAP and lakehouse-style access, worth attention as “easy high performance” remains a key adoption theme.
- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,481  
  Sub-second analytics engine for multidimensional and real-time workloads, reflecting continued demand for high-concurrency cloud OLAP.
- [Databend](https://github.com/databendlabs/databend) — ⭐9,199  
  Modern warehouse architecture on object storage with explicit AI/search positioning, notable for blending analytics warehouse and agent-ready messaging.
- [QuestDB](https://github.com/questdb/questdb) — ⭐16,769  
  High-performance time-series OLAP database, relevant as real-time observability and event analytics remain key workloads.
- [chDB](https://github.com/chdb-io/chdb) — ⭐2,641  
  In-process OLAP engine powered by ClickHouse, notable for making analytical SQL easier to embed directly into Python-centric workflows.
- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,191  
  MPP analytical database and open Greenplum-style option, worth watching as mature warehouse architectures regain attention in open data stacks.

### 📦 Storage Formats & Lakehouse
- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — ⭐699  
  A new file format for large columnar datasets, making it one of the clearest storage-format innovation signals in this dataset.
- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,879  
  Open source catalog for Apache Iceberg, important because the catalog layer is becoming strategic in interoperable lakehouse deployments.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,222  
  Rust-based Iceberg REST catalog, notable as a lightweight and modern implementation in a fast-growing part of the lakehouse control plane.
- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,915  
  Federated open data catalog focused on geo-distributed and multi-engine metadata management, aligned with open lakehouse governance trends.
- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,824  
  Streaming storage for real-time analytics, representing convergence between streaming systems and analytical storage.
- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — ⭐2,135  
  Big data platform spanning storage and compute, relevant as broader lakehouse platforms continue to compete with narrower SQL engines.

### ⚙️ Query & Compute
- [Trino](https://github.com/trinodb/trino) — ⭐12,642  
  Distributed SQL query engine and still a core backbone for federated analytics across lakes, warehouses, and heterogeneous sources.
- [Presto](https://github.com/prestodb/presto) — ⭐16,666  
  Mature distributed SQL engine whose ongoing relevance reflects continued enterprise demand for large-scale interactive query layers.
- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,508  
  Rust SQL query engine gaining ecosystem importance as a reusable execution core for modern data systems.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐1,993  
  Distributed compute extension for DataFusion, showing the continued push from embedded/vectorized local engines toward scalable cluster execution.
- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,616  
  Storage-agnostic MySQL-compatible query engine, useful as composable SQL layers become more attractive to builders.
- [Opteryx](https://github.com/mabel-dev/opteryx) — ⭐112  
  SQL-on-everything engine for querying data in place across formats and databases, directly aligned with lightweight federation demand.
- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,941  
  WebAssembly DuckDB port, significant because browser and edge execution continue expanding where analytics can run.

### 🔗 Data Integration & ETL
- [OLake](https://github.com/datazip-inc/olake) — ⭐1,310  
  Replication and ingestion into Iceberg or Parquet with real-time analytics focus, strongly aligned with open lakehouse operational adoption.
- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,059  
  Python-native data loading library that remains attractive for developer-first ingestion pipelines.
- [Rudder Server](https://github.com/rudderlabs/rudder-server) — ⭐4,374  
  Segment-like event pipeline infrastructure, relevant as product and customer data continue flowing into analytics warehouses.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,641  
  Open source reverse ETL, reflecting the continued operationalization of warehouse data back into business systems.
- [Dinky](https://github.com/DataLinkDC/dinky) — ⭐3,707  
  Flink-based real-time data development platform, worth attention as streaming data engineering remains tightly tied to analytical systems.

### 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐71,004  
  Widely adopted open-source BI and data exploration platform, still central to the analytics consumption layer.
- [Metabase](https://github.com/metabase/metabase) — ⭐46,433  
  Easy-to-use BI tool that remains a strong default for self-service analytics and embedded dashboards.
- [Grafana](https://github.com/grafana/grafana) — ⭐72,693  
  Observability and multi-source visualization platform, increasingly overlapping with analytics for metrics, logs, and SQL-based operational insights.
- [Redash](https://github.com/getredash/redash) — ⭐28,281  
  SQL query and dashboarding tool with enduring relevance for lightweight warehouse access and reporting.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐973  
  Analytical database benchmark suite, important because performance comparability remains a major driver of engine evaluation.
- [Hue](https://github.com/cloudera/hue) — ⭐1,449  
  SQL query assistant for databases and warehouses, showing continued demand for thin access layers over complex analytical backends.
- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,276  
  dbt-native data observability tool, notable because trust, testing, and monitoring are now standard parts of analytics engineering.

---

## 3. Trend Signal Analysis

The strongest signal in this dataset is that **community attention remains concentrated on analytics engines that lower deployment friction**: embedded OLAP, object-storage-native warehouses, and flexible query layers. While the raw GitHub trending page today is dominated by agent-related projects rather than databases, the data-infra topic set shows sustained gravity around [DuckDB](https://github.com/duckdb/duckdb), [ClickHouse](https://github.com/ClickHouse/ClickHouse), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Databend](https://github.com/databendlabs/databend). That combination suggests users still want high performance, but increasingly in forms that are easier to embed, run locally, or point at cloud object storage.

A second important signal is the continued emergence of **open metadata and catalog infrastructure** as a strategic layer in the lakehouse stack. Projects such as [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Gravitino](https://github.com/apache/gravitino) indicate that interoperability around Iceberg and federated metadata is no longer peripheral—it is becoming a core battleground.

On the innovation front, [facebookincubator/nimble](https://github.com/facebookincubator/nimble) stands out as a rare **new file-format signal** in this snapshot, while [Apache Fluss](https://github.com/apache/fluss) points to convergence between streaming storage and analytical serving. Finally, multiple repositories are explicitly positioning for **AI-native analytics/search hybrids**—notably [Databend](https://github.com/databendlabs/databend) and [oceanbase/seekdb](https://github.com/oceanbase/seekdb)—which connects directly to recent cloud warehouse moves toward unifying SQL analytics, vector retrieval, and agent-facing data access.

---

## 4. Community Hot Spots

- **[DuckDB](https://github.com/duckdb/duckdb) + [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm)**  
  Embedded analytics keeps expanding from local notebooks into browser and application runtimes, making DuckDB’s footprint especially strategic.

- **[Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Gravitino](https://github.com/apache/gravitino)**  
  The open catalog/control plane for Iceberg and federated metadata is becoming a key architectural layer for modern lakehouse stacks.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  New columnar format work is relatively rare and often precedes broader ecosystem shifts in storage efficiency and execution design.

- **[Databend](https://github.com/databendlabs/databend), [chDB](https://github.com/chdb-io/chdb), [RayforceDB/rayforce](https://github.com/RayforceDB/rayforce), [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc)**  
  Developer-friendly, lightweight, and embedded analytical engines are a clear growth area beyond traditional large-cluster OLAP.

- **[OLake](https://github.com/datazip-inc/olake) and [dlt](https://github.com/dlt-hub/dlt)**  
  Ingestion into open table/file formats is still a practical bottleneck, so simpler open-source pipeline tooling remains highly relevant for data teams.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*