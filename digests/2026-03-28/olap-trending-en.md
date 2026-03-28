# OLAP & Data Infra Open Source Trends 2026-03-28

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-28 01:21 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report  
**Date:** 2026-03-28

## Step 1 — Filtered Projects Relevant to OLAP / Data Infrastructure / Analytics

### From Today’s GitHub Trending
Only **1 repository** is clearly data-relevant:
- [datalab-to/chandra](https://github.com/datalab-to/chandra) — OCR for complex tables/forms/layouts; relevant as a **data extraction / ingestion-adjacent** project

All other trending repos are primarily AI agents, voice, CRM, CAD, or media tools and are **excluded** from OLAP/data-infra analysis.

### From Topic Search
Relevant projects include OLAP databases, lakehouse/catalog systems, query engines, ETL/warehouse tooling, BI/observability, and benchmarking/SQL tooling. Irrelevant or weakly related items such as generic awesome-lists, BIM viewers, shell utilities, and non-data general projects are omitted from the core analysis.

---

## 1. Today’s Highlights

Today’s strongest signal is that **core analytical databases and distributed SQL engines remain the center of gravity** in open-source data infrastructure, led by projects such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Trino](https://github.com/trinodb/trino), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks).  
A second notable theme is the continued rise of the **lakehouse control plane**: catalogs, metadata, streaming storage, and Iceberg-oriented ingestion are increasingly visible through projects like [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [OLake](https://github.com/datazip-inc/olake).  
We also see more projects positioning themselves as **AI-ready analytics infrastructure**, blending warehouse, search, context, or agent-facing access layers, such as [Databend](https://github.com/databendlabs/databend), [Wren Engine](https://github.com/Canner/wren-engine), and [MatrixOne](https://github.com/matrixorigin/matrixone).  
The only data-relevant repo on today’s trending list, [Chandra](https://github.com/datalab-to/chandra), suggests adjacent momentum around **turning messy documents into structured analytical data**.

---

## 2. Top Projects by Category

## 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,578  
  Real-time columnar analytics DBMS; still one of the most important open-source anchors for fast OLAP and operational analytics.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐37,011  
  In-process analytical SQL engine; worth watching because embedded/local analytics keeps expanding into notebooks, apps, and edge use cases.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,160  
  Unified analytics database for interactive queries and real-time workloads; notable for converging warehouse and serving patterns.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,512  
  High-performance analytics engine for lakehouse and real-time scenarios; attention-worthy for sub-second SQL on mixed storage layers.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,793  
  Time-series OLAP database; remains highly relevant where streaming metrics and market/event data require SQL with strong ingest performance.

- [OceanBase](https://github.com/oceanbase/oceanbase) — ⭐10,041  
  Distributed HTAP database; important as transactional and analytical convergence continues.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,647  
  In-process OLAP SQL engine powered by ClickHouse; notable for bringing analytical execution into application runtimes.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  Mature open-source MPP database lineage; relevant for teams still seeking warehouse-style scale-out systems outside proprietary clouds.

## 📦 Storage Formats & Lakehouse
- [Databend](https://github.com/databendlabs/databend) — ⭐9,206  
  Cloud-native warehouse/lakehouse system on object storage; notable for its “one architecture on S3” positioning and AI/search adjacency.

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,226  
  Realtime cloud-native lakehouse framework; worth attention for incremental analytics and BI/AI-oriented data flows.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,927  
  Federated open data catalog; increasingly important as multi-engine governance becomes central in lakehouse deployments.

- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,886  
  Open source catalog for Apache Iceberg; a strong signal that the Iceberg control layer is becoming strategic infrastructure.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,228  
  Rust-based Iceberg REST catalog; worth watching as lightweight, secure catalog implementations gain momentum.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,832  
  Streaming storage for real-time analytics; relevant because lakehouse architectures increasingly need native streaming persistence.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  Replication to Apache Iceberg or Parquet from databases/Kafka/S3; important for practical real-time lakehouse ingestion.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐976  
  Benchmark suite for analytical databases; not a storage format itself, but central to how modern OLAP systems are being evaluated.

## ⚙️ Query & Compute
- [Trino](https://github.com/trinodb/trino) — ⭐12,665  
  Distributed SQL query engine; still a key federated compute layer across lakehouse, warehouse, and object storage environments.

- [Presto](https://github.com/prestodb/presto) — ⭐16,669  
  Distributed SQL engine for big data; remains influential in the long-running open query layer ecosystem.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,542  
  Rust SQL query engine; increasingly important as a composable execution substrate for new databases and data services.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,002  
  Distributed compute layer for DataFusion; notable for extending modular Rust analytics into cluster execution.

- [go-mysql-server](https://github.com/dolthub/go-mysql-server) — ⭐2,621  
  Storage-agnostic MySQL-compatible query engine; relevant for embedded and custom data platform use cases.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  Self-hosted distributed query engine; worth attention as warehouse-grade execution becomes more open and portable.

- [Basekick-Labs/arc](https://github.com/Basekick-Labs/arc) — ⭐565  
  Analytical database combining DuckDB SQL, Parquet, and Arrow; interesting as a lightweight modern compute/storage packaging model.

## 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,130  
  Python-first data loading library; notable for making ingestion into modern warehouses and lakes easier for application engineers.

- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — ⭐4,379  
  Event pipeline and CDP alternative; highly relevant to warehouse-native product and customer analytics stacks.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,644  
  Reverse ETL platform; reflects continuing demand to activate warehouse data back into operational tools.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  Real-time replication to Iceberg/Parquet; especially important given the current shift from batch ETL to near-real-time lakehouse ingestion.

- [Transformalize](https://github.com/dalenewman/Transformalize) — ⭐161  
  Configurable ETL framework; smaller project, but still relevant for practical integration workloads.

- [Chandra](https://github.com/datalab-to/chandra) — ⭐0 (+912 today)  
  OCR model for tables, forms, and handwriting; worth attention today because document-to-structured-data extraction is becoming a meaningful ingestion frontier.

## 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐71,187  
  Data exploration and visualization platform; remains a core OSS BI layer on top of OLAP engines and warehouses.

- [Grafana](https://github.com/grafana/grafana) — ⭐72,817  
  Observability and visualization platform; important because metrics/logs/traces increasingly intersect with analytical storage backends.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,604  
  Self-service BI tool; continues to matter for broadening access to analytical databases across business teams.

- [PostHog](https://github.com/PostHog/posthog) — ⭐32,254  
  Product analytics platform with warehouse/CDP features; notable for the convergence of analytics, data pipelines, and developer workflows.

- [Plausible Analytics](https://github.com/plausible/analytics) — ⭐24,480  
  Lightweight privacy-focused analytics; shows continued demand for simpler analytics stacks.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,288  
  dbt-native data observability; worth watching as quality monitoring becomes table-stakes in warehouse engineering.

- [Hue](https://github.com/cloudera/hue) — ⭐1,450  
  SQL assistant for databases and warehouses; relevant as query UX and warehouse accessibility continue to improve.

- [Wren Engine](https://github.com/Canner/wren-engine) — ⭐605  
  Open context engine for AI agents over data sources; notable for bridging semantic/query layers with agent workflows.

---

## 3. Trend Signal Analysis

The strongest community signal remains **high-performance analytical compute**, especially engines that sit close to object storage, Parquet/Arrow, or embedded execution environments. Projects such as [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), [StarRocks](https://github.com/StarRocks/starrocks), and [Trino](https://github.com/trinodb/trino) show that the open-source market is still rewarding systems that improve price-performance, latency, and deployment flexibility for analytics.

A newer pattern is the rise of the **lakehouse control plane** as a first-class category. Instead of only focusing on engines, more projects now target catalogs, metadata federation, and streaming-aware storage: [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [Apache Fluss](https://github.com/apache/fluss) fit this direction. This aligns with broader industry movement toward Iceberg-centered interoperability and decoupled storage/compute architectures.

Another visible shift is the emergence of **AI-facing data infrastructure**. Repos like [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), [SeekDB](https://github.com/oceanbase/seekdb), and [Wren Engine](https://github.com/Canner/wren-engine) increasingly describe themselves not just as analytical systems, but as foundations for search, agents, vector workflows, and context serving. That does not yet represent a wholly new storage format, but it does point to a new query paradigm: analytical engines evolving into **multimodal retrieval and reasoning backends**.

Finally, today’s trending appearance of [Chandra](https://github.com/datalab-to/chandra) is a reminder that ingestion is broadening upstream: extracting structured data from messy documents may become an important feeder layer into warehouses and lakehouses.

---

## 4. Community Hot Spots

- **[Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper)**  
  Iceberg and open catalog infrastructure are becoming strategic; data engineers should watch which control-plane standards gain the broadest engine support.

- **[DuckDB](https://github.com/duckdb/duckdb), [chDB](https://github.com/chdb-io/chdb), and [duckdb-wasm](https://github.com/duckdb/duckdb-wasm)**  
  Embedded OLAP is maturing quickly, enabling analytics inside apps, notebooks, browsers, and lightweight services.

- **[Apache DataFusion](https://github.com/apache/datafusion) and [Wren Engine](https://github.com/Canner/wren-engine)**  
  The modular Rust query stack is becoming a substrate for new execution engines, semantic layers, and agent-facing data access.

- **[OLake](https://github.com/datazip-inc/olake) and [Apache Fluss](https://github.com/apache/fluss)**  
  Real-time ingestion into lakehouse storage is heating up, especially where Iceberg and streaming analytics intersect.

- **[Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), and [SeekDB](https://github.com/oceanbase/seekdb)**  
  “AI-native” positioning is spreading into the database layer, suggesting future competition around unified SQL + vector + search + agent context workloads.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*