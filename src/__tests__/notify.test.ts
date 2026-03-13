import { describe, it, expect, afterEach } from "vitest";
import { buildMessage } from "../notify.ts";

const BASE_URL = "https://example.com/radar";

describe("buildMessage", () => {
  const origPagesUrl = process.env["PAGES_URL"];

  afterEach(() => {
    if (origPagesUrl !== undefined) {
      process.env["PAGES_URL"] = origPagesUrl;
    } else {
      delete process.env["PAGES_URL"];
    }
  });

  it("builds a daily message with zh + en reports", () => {
    const msg = buildMessage(
      "2026-03-09",
      ["olap-index", "olap-index-en", "olap-engines", "olap-engines-en"],
      BASE_URL,
    );
    expect(msg).toContain("agents-radar");
    expect(msg).toContain("2026-03-09");
    expect(msg).toContain("📡");
    // zh links
    expect(msg).toContain(`${BASE_URL}/#2026-03-09/olap-index`);
    expect(msg).toContain("OLAP 索引");
    // en links
    expect(msg).toContain(`${BASE_URL}/#2026-03-09/olap-index-en`);
    expect(msg).toContain("OLAP Index");
  });

  it("shows weekly icon and suffix for weekly reports", () => {
    const msg = buildMessage("2026-03-09", ["olap-weekly", "olap-weekly-en"], BASE_URL);
    expect(msg).toContain("📅");
    expect(msg).toContain("周报");
  });

  it("shows monthly icon and suffix for monthly reports", () => {
    const msg = buildMessage("2026-03-09", ["olap-monthly", "olap-monthly-en"], BASE_URL);
    expect(msg).toContain("📆");
    expect(msg).toContain("月报");
  });

  it("monthly takes priority over weekly", () => {
    const msg = buildMessage("2026-03-09", ["olap-weekly", "olap-monthly"], BASE_URL);
    expect(msg).toContain("📆");
    expect(msg).toContain("月报");
  });

  it("renders zh-only reports without en link", () => {
    const msg = buildMessage("2026-03-09", ["olap-hn"], BASE_URL);
    expect(msg).toContain("HN 数据基础设施社区");
    expect(msg).not.toContain("HN Data Infra");
  });

  it("renders arxiv report labels in zh and en", () => {
    const msg = buildMessage("2026-03-09", ["olap-arxiv", "olap-arxiv-en"], BASE_URL);
    expect(msg).toContain("OLAP ArXiv 论文");
    expect(msg).toContain("OLAP arXiv Paper");
    expect(msg).toContain(`${BASE_URL}/#2026-03-09/olap-arxiv`);
  });

  it("includes Web UI and RSS links", () => {
    const msg = buildMessage("2026-03-09", ["olap-index"], BASE_URL);
    expect(msg).toContain("🌐 Web UI");
    expect(msg).toContain("RSS");
    expect(msg).toContain(`${BASE_URL}/feed.xml`);
  });

  it("strips trailing slash from pagesUrl", () => {
    const msg = buildMessage("2026-03-09", ["olap-index"], BASE_URL + "/");
    expect(msg).not.toContain("//feed.xml");
    expect(msg).toContain(`${BASE_URL}/feed.xml`);
  });
});
