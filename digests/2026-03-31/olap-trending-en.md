# OLAP & Data Infra Open Source Trends 2026-03-31

> Sources: GitHub Trending + GitHub Search API | Generated: 2026-03-31 01:28 UTC

---

# OLAP & Data Infrastructure Open Source Trends Report
**Date:** 2026-03-31

## Step 1 — Filtered Relevant Projects
From today’s trending list, only these are clearly relevant to OLAP / data infrastructure / analytics:

- [OpenBB-finance/OpenBB](https://github.com/OpenBB-finance/OpenBB)
- [apache/superset](https://github.com/apache/superset)

From the topic-search dataset, the clearly relevant OLAP/data-infra projects include analytical databases, lakehouse/catalog systems, query engines, ETL/ingestion tools, BI/observability, and related tooling. Unrelated repos were excluded.

---

## 1. Today's Highlights
Today’s real-time GitHub trending list is not dominated by core OLAP engines, but it does show continued visibility for analytics consumption layers: [Apache Superset](https://github.com/apache/superset) appeared on the hot list, while [OpenBB](https://github.com/OpenBB-finance/OpenBB) gained strong daily attention as a data platform for analysts and AI agents. In the broader topic search results, the center of gravity remains with high-performance analytical databases and open lakehouse infrastructure, led by [ClickHouse](https://github.com/ClickHouse/ClickHouse), [DuckDB](https://github.com/duckdb/duckdb), [Apache Doris](https://github.com/apache/doris), and [StarRocks](https://github.com/StarRocks/starrocks).

A second strong signal is the continued rise of metadata/catalog and Iceberg-oriented infrastructure such as [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper). Finally, several projects are explicitly repositioning around AI-native analytics and agent-facing data systems, notably [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), [MindsDB](https://github.com/mindsdb/mindsdb), and [Wren Engine](https://github.com/Canner/wren-engine).

---

## 2. Top Projects by Category

### 🗄️ OLAP Engines
- [ClickHouse](https://github.com/ClickHouse/ClickHouse) — ⭐46,602  
  A leading real-time analytical DBMS with strong momentum as the default open-source choice for fast OLAP at scale.

- [DuckDB](https://github.com/duckdb/duckdb) — ⭐37,073  
  The in-process analytics database continues to define the embedded/local OLAP pattern for developers and data apps.

- [Apache Doris](https://github.com/apache/doris) — ⭐15,162  
  A unified analytics database with strong lakehouse positioning, worth attention for converged real-time and batch analytics.

- [StarRocks](https://github.com/StarRocks/starrocks) — ⭐11,521  
  A high-performance analytics engine pushing sub-second query performance across internal and lakehouse data.

- [QuestDB](https://github.com/questdb/questdb) — ⭐16,804  
  A high-performance time-series database showing that OLAP and TSDB use cases continue to converge.

- [OceanBase](https://github.com/oceanbase/oceanbase) — ⭐10,043  
  An HTAP-oriented distributed database attracting attention as transactional and analytical workloads merge.

- [chDB](https://github.com/chdb-io/chdb) — ⭐2,646  
  An in-process OLAP SQL engine powered by ClickHouse, notable for bringing analytical execution into app-native workflows.

- [Apache Cloudberry](https://github.com/apache/cloudberry) — ⭐1,195  
  An open-source MPP warehouse alternative in the Greenplum lineage, relevant for teams wanting classic scale-out SQL analytics.

### 📦 Storage Formats & Lakehouse
- [Apache Polaris](https://github.com/apache/polaris) — ⭐1,887  
  An open-source catalog for Apache Iceberg, important as interoperable catalog layers become strategic lakehouse infrastructure.

- [Apache Gravitino](https://github.com/apache/gravitino) — ⭐2,924  
  A federated metadata lake/catalog project reflecting the growing importance of multi-engine metadata governance.

- [Lakekeeper](https://github.com/lakekeeper/lakekeeper) — ⭐1,232  
  A Rust-based Iceberg REST catalog, notable for the push toward lightweight, cloud-native catalog services.

- [LakeSoul](https://github.com/lakesoul-io/LakeSoul) — ⭐3,225  
  A real-time lakehouse framework focused on ingestion, updates, and incremental analytics for BI and AI workloads.

- [Facebook Nimble](https://github.com/facebookincubator/nimble) — ⭐706  
  A new extensible columnar file format project, worth watching as format innovation remains active beneath the lakehouse stack.

- [Apache Fluss](https://github.com/apache/fluss) — ⭐1,834  
  A streaming storage system for real-time analytics, signaling tighter integration of streaming data into analytical storage layers.

- [ClickBench](https://github.com/ClickHouse/ClickBench) — ⭐979  
  Not a format itself, but a crucial benchmark suite shaping how analytical engines and storage designs are compared.

### ⚙️ Query & Compute
- [Trino](https://github.com/trinodb/trino) — ⭐12,672  
  A flagship distributed SQL query engine still central to federated analytics and lakehouse compute.

- [Presto](https://github.com/prestodb/presto) — ⭐16,672  
  The original Presto engine remains highly relevant in large-scale distributed SQL environments.

- [Apache DataFusion](https://github.com/apache/datafusion) — ⭐8,546  
  A fast-growing Rust SQL engine increasingly used as a foundation for composable analytics products.

- [Apache DataFusion Ballista](https://github.com/apache/datafusion-ballista) — ⭐2,001  
  The distributed execution counterpart to DataFusion, relevant for teams betting on modular Rust-native compute.

- [Databend](https://github.com/databendlabs/databend) — ⭐9,218  
  A cloud warehouse/lakehouse engine reframed around analytics, search, AI, and object-storage-native architecture.

- [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm) — ⭐1,957  
  WebAssembly-based OLAP compute points to browser and edge analytics becoming practical deployment targets.

- [Firebolt Core](https://github.com/firebolt-db/firebolt-core) — ⭐195  
  A self-hosted distributed query engine from a commercial cloud warehouse lineage, significant for warehouse-grade execution becoming more open.

- [Wren Engine](https://github.com/Canner/wren-engine) — ⭐619  
  An MCP-native semantic/context engine built on DataFusion, notable for the intersection of query layers and AI agents.

### 🔗 Data Integration & ETL
- [dlt](https://github.com/dlt-hub/dlt) — ⭐5,150  
  A developer-friendly Python loading framework that fits the modern pattern of lightweight ingestion into warehouses and lakehouses.

- [OLake](https://github.com/datazip-inc/olake) — ⭐1,313  
  A replication and ingestion tool targeting Iceberg and Parquet, directly aligned with real-time lakehouse data movement.

- [RudderStack Server](https://github.com/rudderlabs/rudder-server) — ⭐4,380  
  A Segment alternative that remains relevant as event pipelines feed product analytics and warehouse-centric stacks.

- [Multiwoven](https://github.com/Multiwoven/multiwoven) — ⭐1,645  
  An open reverse ETL platform reflecting continued demand for activation workflows out of the warehouse.

- [dataall](https://github.com/data-dot-all/dataall) — ⭐251  
  A data marketplace/collaboration layer on AWS, relevant for operationalizing shared lakehouse datasets.

### 🧰 Data Tooling
- [Apache Superset](https://github.com/apache/superset) — ⭐71,938, **+49 today**  
  A leading open-source BI and exploration platform, and the only core analytics tool on today’s GitHub trending list.

- [Metabase](https://github.com/metabase/metabase) — ⭐46,671  
  A widely adopted BI tool that continues to matter for self-service analytics and embedded dashboards.

- [OpenBB](https://github.com/OpenBB-finance/OpenBB) — ⭐0, **+502 today**  
  A financial data platform for analysts, quants, and AI agents, notable today for strong daily traction and agent-oriented positioning.

- [Redash](https://github.com/getredash/redash) — ⭐28,312  
  A long-standing SQL-first BI/query tool that still represents the lightweight analytics interface category.

- [Elementary](https://github.com/elementary-data/elementary) — ⭐2,289  
  A dbt-native observability tool reflecting the normalization of monitoring and data quality in analytics engineering.

- [Cloudera Hue](https://github.com/cloudera/hue) — ⭐1,444  
  A SQL query assistant for databases and warehouses, relevant as UX around warehouse access remains important.

- [roapi](https://github.com/roapi/roapi) — ⭐3,414  
  A practical tool for turning static datasets into APIs, increasingly useful for serving analytical data products.

---

## 3. Trend Signal Analysis
Today’s strongest community attention inside data infrastructure is not centered on a brand-new OLAP database launch, but on the broader analytics access layer and AI-aware data platforms. The appearance of [Apache Superset](https://github.com/apache/superset) on GitHub Trending shows that BI and data exploration remain visible entry points for open-source adoption, while [OpenBB](https://github.com/OpenBB-finance/OpenBB) suggests rising demand for domain-specific data platforms that combine analytics workflows with agent-friendly interfaces.

Across the topic results, the most powerful structural trend is the continued consolidation of the open lakehouse stack around interoperable metadata and object-storage-native compute. Projects such as [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), [Lakekeeper](https://github.com/lakekeeper/lakekeeper), and [OLake](https://github.com/datazip-inc/olake) indicate that catalogs, replication, and table-layer interoperability are now as strategically important as query speed. This mirrors recent cloud-warehouse evolution, where governance, open formats, and multi-engine access are becoming table stakes.

A second notable direction is composable query execution. [Apache DataFusion](https://github.com/apache/datafusion), [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm), [chDB](https://github.com/chdb-io/chdb), and [Wren Engine](https://github.com/Canner/wren-engine) show analytics compute moving into libraries, browsers, embedded runtimes, and AI-facing context layers. On the storage side, [facebookincubator/nimble](https://github.com/facebookincubator/nimble) is an early signal that file-format innovation is still alive, even as Iceberg-style table abstraction dominates architecture conversations.

---

## 4. Community Hot Spots
- **Iceberg catalog and metadata control planes** — Watch [Apache Polaris](https://github.com/apache/polaris), [Apache Gravitino](https://github.com/apache/gravitino), and [Lakekeeper](https://github.com/lakekeeper/lakekeeper); open catalog infrastructure is becoming a key battleground in lakehouse architecture.

- **Composable Rust-based analytics stacks** — [Apache DataFusion](https://github.com/apache/datafusion), [DataFusion Ballista](https://github.com/apache/datafusion-ballista), and [Wren Engine](https://github.com/Canner/wren-engine) point to a modular future for query execution and semantic layers.

- **Embedded and edge OLAP** — [DuckDB](https://github.com/duckdb/duckdb), [DuckDB-Wasm](https://github.com/duckdb/duckdb-wasm), and [chDB](https://github.com/chdb-io/chdb) continue to expand where analytics can run: app processes, browsers, notebooks, and local runtimes.

- **Real-time lakehouse ingestion** — [OLake](https://github.com/datazip-inc/olake), [Apache Fluss](https://github.com/apache/fluss), and [LakeSoul](https://github.com/lakesoul-io/LakeSoul) are worth following as the ecosystem pushes toward lower-latency pipelines into open table formats.

- **AI-native analytics and agent-facing data systems** — [Databend](https://github.com/databendlabs/databend), [MatrixOne](https://github.com/matrixorigin/matrixone), [MindsDB](https://github.com/mindsdb/mindsdb), and [OpenBB](https://github.com/OpenBB-finance/OpenBB) show a clear shift toward systems designed for both humans and AI agents to query, reason over, and operationalize data.

---
*This digest is auto-generated by [agents-radar](https://github.com/Baymine/OLAP-radar).*