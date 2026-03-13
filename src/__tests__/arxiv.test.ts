import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchArxivData } from "../arxiv.ts";

const SAMPLE_FEED = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>http://arxiv.org/abs/2503.10001v1</id>
    <updated>2026-03-10T10:00:00Z</updated>
    <published>2026-03-10T10:00:00Z</published>
    <title>Adaptive OLAP Query Optimization for Lakehouse Systems</title>
    <summary>We present an OLAP query engine optimization technique for analytical query workloads.</summary>
    <author><name>Alice</name></author>
    <author><name>Bob</name></author>
    <link rel="alternate" type="text/html" href="http://arxiv.org/abs/2503.10001v1"/>
    <link title="pdf" rel="related" type="application/pdf" href="http://arxiv.org/pdf/2503.10001v1"/>
    <category term="cs.DB" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
  <entry>
    <id>http://arxiv.org/abs/2503.10002v1</id>
    <updated>2026-03-11T10:00:00Z</updated>
    <published>2026-03-11T10:00:00Z</published>
    <title>Arrested coalescence in condensates</title>
    <summary>This paper studies unrelated physical systems.</summary>
    <author><name>Carol</name></author>
    <link rel="alternate" type="text/html" href="http://arxiv.org/abs/2503.10002v1"/>
    <link title="pdf" rel="related" type="application/pdf" href="http://arxiv.org/pdf/2503.10002v1"/>
    <category term="cs.DB" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
</feed>`;

describe("fetchArxivData", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses and ranks OLAP-relevant papers ahead of irrelevant ones", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => SAMPLE_FEED,
    }) as unknown as typeof fetch;

    const data = await fetchArxivData();

    expect(data.fetchSuccess).toBe(true);
    expect(data.papers).toHaveLength(1);
    expect(data.papers[0]?.title).toContain("OLAP Query Optimization");
    expect(data.papers[0]?.authors).toEqual(["Alice", "Bob"]);
  });

  it("retries on 429 and succeeds on a later response", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 429, text: async () => "" })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => SAMPLE_FEED,
      }) as unknown as typeof fetch;

    const data = await fetchArxivData();

    expect(data.fetchSuccess).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("retries on 503 and succeeds on a later response", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, text: async () => "" })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => SAMPLE_FEED,
      }) as unknown as typeof fetch;

    const data = await fetchArxivData();

    expect(data.fetchSuccess).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
