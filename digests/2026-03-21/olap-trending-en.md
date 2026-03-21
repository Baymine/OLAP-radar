# OLAP & Data Infra Open Source Trends 2026-03-21

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-21 01:14 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
*Date: 2026-03-21*

## Step 1 — Filtered for OLAP / Data Infrastructure Relevance

From **Today’s Trending**, only these are clearly relevant:
- [opendataloader-project/opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — data extraction / ingestion for AI-ready documents
- [vas3k/TaxHacker](https://github.com/vas3k/TaxHacker) — accounting data processing / analytics app

Excluded as non-data-infra / non-OLAP:
- claude-hud, open-swe, superpowers, arnis, newton, TradingAgents, openrocket

From **Topic Search Results**, the OLAP/data-infra relevant set is broad and includes OLAP DBs, lakehouse/catalog projects, query engines, ETL/ingestion, observability/BI, and benchmark/tooling. Irrelevant or weakly relevant entries were omitted where the project is not meaningfully data infrastructure despite topic tagging.

---

## 1. Today's Highlights

Today’s strongest pure data-infra signal from the trending list is not a database engine but **AI-oriented data ingestion**, led by [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf), which added **+1812 stars today**. That suggests community attention is moving upstream: before analytics and agents can work well, they need better extraction from messy enterprise documents.  

In the broader GitHub topic landscape, the center of gravity remains with mature OLAP engines such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks), while newer systems increasingly position themselves as **AI-ready**, **object-storage-native**, or **hybrid search + analytics** platforms.  

A second notable pattern is the rise of **embedded and in-process analytics**: [DuckDB](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb), and newer lightweight engines like [arc](https://github.com/Basekick-Labs/arc) and [Rayforce](https://github.com/RayforceDB/rayforce) reflect continued demand for low-friction analytical compute.  

Finally, lakehouse infrastructure remains active around catalogs, streaming storage, and ingestion into Iceberg/Parquet, with projects like [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), [Apache Fluss](https://github.com/apache/fluss), and [OLake](https://github.com/datazip-inc/olake) standing out.

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines

- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — **⭐46,421**
  - Real-time analytical columnar DBMS and still the most visible open-source OLAP engine for production-scale analytics.
- [DuckDB](https://github.com/duckdb/duckdb) — **⭐36,815**
  - The leader in embedded OLAP; worth attention because in-process analytics keeps expanding into notebooks, apps, and local pipelines.
- [Apache Doris](https://github.com/apache/doris) — **⭐15,132**
  - Unified analytics database with strong adoption across real-time and interactive workloads.
- [StarRocks](https://github.com/StarRocks/starrocks) — **⭐11,496**
  - High-performance open query engine focused on sub-second analytics across data lakehouse and native storage.
- [Databend](https://github.com/databendlabs/databend) — **⭐9,202**
  - A modern warehouse built around object storage and increasingly AI/search-aware positioning.
- [QuestDB](https://github.com/questdb/questdb) — **⭐16,779**
  - Time-series oriented analytical database that remains highly relevant for real-time telemetry and market data use cases.
- [Rayforce](https://github.com/RayforceDB/rayforce) — **⭐113**
  - A small but interesting SIMD-accelerated pure-C analytical database, notable as a lightweight emerging columnar engine.
- [apache/cloudberry](https://github.com/apache/cloudberry) — **⭐1,191**
  - Mature MPP warehouse lineage from Greenplum, relevant for teams tracking open-source distributed SQL warehousing.

### 📦 Storage Formats & Lakehouse

- [facebookincubator/nimble](https://github.com/facebookincubator/nimble) — **⭐700**
  - A new file format for large columnar datasets; noteworthy because storage-format innovation remains rare and strategically important.
- [Apache Polaris](https://github.com/apache/polaris) — **⭐1,882**
  - Open source catalog for Apache Iceberg interoperability, central to the lakehouse control plane trend.
- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — **⭐1,223**
  - Rust-based Apache Iceberg REST catalog emphasizing security and operational simplicity.
- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — **⭐3,228**
  - End-to-end realtime lakehouse framework spanning ingestion, updates, and analytics.
- [Apache Fluss](https://github.com/apache/fluss) — **⭐1,827**
  - Streaming storage for real-time analytics, representing convergence between streaming systems and lakehouse storage layers.
- [Apache Gravitino](https://github.com/apache/gravitino) — **⭐2,924**
  - Federated metadata/catalog layer for geo-distributed open data architectures.
- [Pixels](https://github.com/pixelsdb/pixels) — **⭐895**
  - Storage and compute engine for cloud-native and on-prem analytics with lakehouse relevance.
- [YTsaurus](https://github.com/ytsaurus/ytsaurus) — **⭐2,142**
  - Large-scale big data platform that remains relevant for teams watching end-to-end lakehouse-adjacent infrastructure.

### ⚙️ Query & Compute

- [Apache DataFusion](https://github.com/apache/datafusion) — **⭐8,516**
  - One of the most important Rust-native analytical query engines and a core building block for new compute systems.
- [Trino](https://github.com/trinodb/trino) — **⭐12,653**
  - A top distributed SQL engine for federated analytics across data lakes and warehouses.
- [Presto](https://github.com/prestodb/presto) — **⭐16,665**
  - Still a major reference architecture for distributed SQL over heterogeneous storage.
- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — **⭐1,994**
  - Distributed execution layer for DataFusion, worth watching as modular query stacks mature.
- [chDB](https://github.com/chdb-io/chdb) — **⭐2,642**
  - In-process OLAP SQL powered by ClickHouse, important for embedded analytics and application-side analytical compute.
- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — **⭐2,617**
  - Storage-agnostic SQL engine showing continued interest in reusable query layers decoupled from storage.
- [QLever](https://github.com/ad-freiburg/qlever) — **⭐798**
  - High-performance RDF/SPARQL engine, relevant as specialized query engines continue to push scale boundaries.
- [arc](https://github.com/Basekick-Labs/arc) — **⭐563**
  - Analytical DB packaging DuckDB SQL + Parquet + Arrow into a simple Go-native binary, reflecting practical compute assembly.

### 🔗 Data Integration & ETL

- [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) — **⭐0 (+1812 today)**
  - Today’s breakout project: PDF parsing for AI-ready data, highlighting explosive demand for extraction from unstructured enterprise documents.
- [dlt](https://github.com/dlt-hub/dlt) — **⭐5,073**
  - Developer-friendly Python loading framework and one of the clearest open-source data ingestion success stories.
- [OLake](https://github.com/datazip-inc/olake) — **⭐1,311**
  - Real-time replication from databases, Kafka, and S3 into Iceberg or Parquet; directly aligned with modern lakehouse ingestion patterns.
- [rudder-server](https://github.com/rudderlabs/rudder-server) — **⭐4,376**
  - Segment alternative focused on event collection and warehouse delivery.
- [Multiwoven](https://github.com/Multiwoven/multiwoven) — **⭐1,643**
  - Reverse ETL platform reflecting continuing demand for activating warehouse data into SaaS systems.
- [versatile-data-kit](https://github.com/vmware/versatile-data-kit) — **⭐477**
  - Workflow framework for developing and operating SQL/Python data jobs.
- [Transformalize](https://github.com/dalenewman/Transformalize) — **⭐161**
  - Configurable ETL engine, smaller in profile but directly relevant for pipeline builders.
- [TaxHacker](https://github.com/vas3k/TaxHacker) — **⭐0 (+137 today)**
  - A niche but interesting AI accounting workflow tool showing applied demand for structured extraction and categorization of financial records.

### 🧰 Data Tooling

- [Apache Superset](https://github.com/apache/superset) — **⭐71,029**
  - Leading open-source BI and exploration platform, still a standard companion to OLAP stacks.
- [Metabase](https://github.com/metabase/metabase) — **⭐46,484**
  - Widely adopted self-service BI tool with strong relevance for open analytics deployments.
- [Grafana](https://github.com/grafana/grafana) — **⭐72,751**
  - Core observability and visualization platform increasingly used alongside analytical backends.
- [Elementary](https://github.com/elementary-data/elementary) — **⭐2,279**
  - dbt-native observability tooling, important as data quality and pipeline monitoring remain central concerns.
- [ClickBench](https://github.com/ClickHouse/ClickBench) — **⭐973**
  - Influential benchmark suite for analytical databases and useful for tracking engine competitiveness.
- [Wren Engine](https://github.com/Canner/wren-engine) — **⭐586**
  - Open context engine for AI agents, relevant where semantic/data access layers are converging with analytics infrastructure.
- [Redash](https://github.com/getredash/redash) — **⭐28,291**
  - Mature SQL dashboarding layer still relevant for lightweight analytics use cases.

---

## 3. Trend Signal Analysis

The clearest short-term community spike is around **data ingestion for AI workflows**, not classic warehouse engines. [opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf) gaining **+1812 stars today** indicates strong demand for turning hard-to-use business documents into structured or model-ready data. This fits a broader market shift: the bottleneck for analytics and agentic systems is increasingly not SQL execution itself, but reliable extraction, normalization, and accessibility of source data.

Among core infrastructure projects, the strongest continuing signal is toward **hybrid analytical platforms** that combine OLAP with search, vector retrieval, or AI-native positioning. [Databend](https://github.com/databendlabs/databend), [SeekDB](https://github.com/oceanbase/seekdb), [MatrixOne](https://github.com/matrixorigin/matrixone), and [uni-db](https://github.com/rustic-ai/uni-db) all point to a design direction where one engine is expected to serve structured analytics plus newer retrieval patterns. That is a meaningful departure from earlier generations of specialized warehouses.

On the storage side, [facebookincubator/nimble](https://github.com/facebookincubator/nimble) is notable because genuinely new **columnar file format** work is relatively uncommon; most innovation recently has focused on catalogs and table abstractions rather than base format design. Meanwhile, projects like [Apache Polaris](https://github.com/apache/polaris), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [OLake](https://github.com/datazip-inc/olake) show the lakehouse stack continuing to mature around **open catalogs + open table targets + replication into Iceberg/Parquet**.

Overall, today’s signals connect strongly to recent lakehouse and cloud-warehouse developments: object storage remains the default substrate, query engines are becoming modular and embeddable, and ingestion/catalog layers are where much of the new open-source energy is forming.

---

## 4. Community Hot Spots

- **[opendataloader-pdf](https://github.com/opendataloader-project/opendataloader-pdf)**  
  Breakout momentum today suggests document-to-structured-data tooling is becoming a major upstream layer for analytics and AI systems.

- **[facebookincubator/nimble](https://github.com/facebookincubator/nimble)**  
  A new columnar file format is a rare and important signal; worth watching for performance and ecosystem implications.

- **[Apache Polaris](https://github.com/apache/polaris) / [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Catalog infrastructure is becoming strategic as teams standardize around Iceberg-based, multi-engine lakehouse architectures.

- **[Apache DataFusion](https://github.com/apache/datafusion) / [chDB](https://github.com/chdb-io/chdb)**  
  Embedded and composable query compute remains a high-value direction for application-integrated analytics.

- **AI-native hybrid engines: [Databend](https://github.com/databendlabs/databend), [SeekDB](https://github.com/oceanbase/seekdb), [MatrixOne](https://github.com/matrixorigin/matrixone)**  
  These projects reflect the emerging expectation that data platforms should unify analytics, search, and AI-oriented access patterns in one stack.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*