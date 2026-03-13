export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  published: string;
  updated: string;
  authors: string[];
  categories: string[];
  absUrl: string;
  pdfUrl: string;
}

export interface ArxivData {
  papers: ArxivPaper[];
  fetchSuccess: boolean;
  query: string;
}

const ARXIV_API_URL = "https://export.arxiv.org/api/query";
const MAX_RESULTS = 15;
const TOPIC_TERMS = [
  "all:olap",
  'all:"data warehouse"',
  "all:lakehouse",
  'all:"query engine"',
  "all:clickhouse",
  "all:duckdb",
  'all:"apache doris"',
  'all:"columnar database"',
  'all:"database benchmark"',
];
const SEARCH_QUERY = `(${TOPIC_TERMS.join(" OR ")}) AND (cat:cs.DB OR cat:cs.DC)`;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3_000;
const RANKED_KEYWORDS: Array<{ term: string; weight: number }> = [
  { term: "olap", weight: 10 },
  { term: "clickhouse", weight: 8 },
  { term: "duckdb", weight: 8 },
  { term: "doris", weight: 8 },
  { term: "starrocks", weight: 8 },
  { term: "data warehouse", weight: 7 },
  { term: "lakehouse", weight: 7 },
  { term: "query engine", weight: 6 },
  { term: "columnar database", weight: 6 },
  { term: "analytical query", weight: 5 },
  { term: "database benchmark", weight: 5 },
];

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return decodeXml(match?.[1] ?? "");
}

function getMatches(block: string, pattern: RegExp): string[] {
  return [...block.matchAll(pattern)].map((match) => decodeXml(match[1] ?? "")).filter(Boolean);
}

function parseEntry(entry: string): ArxivPaper | null {
  const absUrl = getTag(entry, "id");
  const title = getTag(entry, "title");
  if (!absUrl || !title) return null;

  const pdfUrlMatch = entry.match(/<link[^>]+title="pdf"[^>]+href="([^"]+)"/i);
  const altUrlMatch = entry.match(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/i);

  return {
    id: absUrl.split("/").pop() ?? absUrl,
    title,
    summary: getTag(entry, "summary"),
    published: getTag(entry, "published"),
    updated: getTag(entry, "updated"),
    authors: getMatches(entry, /<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/gi),
    categories: getMatches(entry, /<category[^>]+term="([^"]+)"/gi),
    absUrl: altUrlMatch?.[1] ?? absUrl,
    pdfUrl: pdfUrlMatch?.[1] ?? `${absUrl}.pdf`,
  };
}

function scorePaper(paper: ArxivPaper): number {
  const haystack = `${paper.title} ${paper.summary} ${paper.categories.join(" ")}`.toLowerCase();
  return RANKED_KEYWORDS.reduce(
    (score, { term, weight }) => (haystack.includes(term) ? score + weight : score),
    0,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchArxivData(): Promise<ArxivData> {
  const url =
    `${ARXIV_API_URL}?search_query=${encodeURIComponent(SEARCH_QUERY)}` +
    `&start=0&max_results=${MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending`;

  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const resp = await fetch(url, {
        headers: { "User-Agent": "agents-radar/1.0 (OLAP arXiv digest)" },
      });
      if (resp.status === 429 && attempt < MAX_RETRIES) {
        console.error(`  [arxiv] HTTP 429, retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      if (!resp.ok) {
        console.error(`  [arxiv] HTTP ${resp.status}`);
        return { papers: [], fetchSuccess: false, query: SEARCH_QUERY };
      }

      const xml = await resp.text();
      const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/gi) ?? [];
      const papers = entries
        .map(parseEntry)
        .filter((paper): paper is ArxivPaper => paper !== null)
        .map((paper) => ({ paper, score: scorePaper(paper) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.paper.published.localeCompare(a.paper.published);
        })
        .map(({ paper }) => paper)
        .slice(0, 8);

      console.log(`  [arxiv] ${papers.length} papers`);
      return { papers, fetchSuccess: papers.length > 0, query: SEARCH_QUERY };
    }

    return { papers: [], fetchSuccess: false, query: SEARCH_QUERY };
  } catch (err) {
    console.error(`  [arxiv] fetch failed: ${err}`);
    return { papers: [], fetchSuccess: false, query: SEARCH_QUERY };
  }
}
