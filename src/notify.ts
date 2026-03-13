/**
 * Telegram notification — reads manifest.json and sends a message
 * with links to the latest reports. Skips silently if secrets are not set.
 *
 * Required env vars:
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather
 *   TELEGRAM_CHAT_ID    — channel/group/user chat ID
 * Optional:
 *   PAGES_URL           — GitHub Pages base URL (defaults to the public deployment)
 */

import fs from "node:fs";

const PAGES_URL_DEFAULT = "https://duanyytop.github.io/agents-radar";

const ZH_LABELS: Record<string, string> = {
  "olap-index": "OLAP 索引",
  "olap-engines": "OLAP 引擎生态",
  "olap-web": "OLAP 官方内容",
  "olap-trending": "OLAP GitHub 趋势",
  "olap-hn": "HN 数据基础设施社区",
  "olap-weekly": "OLAP 生态周报",
  "olap-monthly": "OLAP 生态月报",
  "ai-cli": "AI CLI 工具",
  "ai-agents": "AI Agents 生态",
  "ai-web": "官网动态",
  "ai-trending": "GitHub 趋势",
  "ai-hn": "HN 社区动态",
  "ai-weekly": "AI 工具生态周报",
  "ai-monthly": "AI 工具生态月报",
};

const EN_LABELS: Record<string, string> = {
  "olap-index": "OLAP Index",
  "olap-engines": "OLAP Engines",
  "olap-web": "OLAP Official Content",
  "olap-trending": "OLAP GitHub Trends",
  "olap-hn": "HN Data Infra",
  "olap-weekly": "OLAP Weekly",
  "olap-monthly": "OLAP Monthly",
  "ai-cli": "AI CLI Tools",
  "ai-agents": "AI Agents Ecosystem",
  "ai-web": "Official Updates",
  "ai-trending": "GitHub Trends",
  "ai-hn": "HN Community",
  "ai-weekly": "AI Tools Weekly",
  "ai-monthly": "AI Tools Monthly",
};

async function sendTelegram(text: string): Promise<void> {
  const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"] ?? "";
  const CHAT_ID = process.env["TELEGRAM_CHAT_ID"] || "@agents_radar";
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}

export function buildMessage(date: string, reports: string[], pagesUrl?: string): string {
  const PAGES_URL = (pagesUrl ?? process.env["PAGES_URL"] ?? PAGES_URL_DEFAULT).replace(/\/$/, "");
  const baseReports = reports.filter((r) => !r.endsWith("-en"));
  const isWeekly = baseReports.includes("olap-weekly") || baseReports.includes("ai-weekly");
  const isMonthly = baseReports.includes("olap-monthly") || baseReports.includes("ai-monthly");

  const icon = isMonthly ? "📆" : isWeekly ? "📅" : "📡";
  const suffix = isMonthly ? " 月报" : isWeekly ? " 周报" : "";
  const lines: string[] = [`${icon} <b>agents-radar${suffix} · ${date}</b>\n`];

  // Daily reports first, then rollups
  const ordered = [
    ...baseReports.filter((r) => !r.includes("weekly") && !r.includes("monthly")),
    ...baseReports.filter((r) => r.includes("weekly") || r.includes("monthly")),
  ];

  for (const r of ordered) {
    const zhLabel = ZH_LABELS[r] ?? r;
    const zhUrl = `${PAGES_URL}/#${date}/${r}`;
    const enKey = `${r}-en`;
    if (reports.includes(enKey)) {
      const enLabel = EN_LABELS[r] ?? "EN";
      const enUrl = `${PAGES_URL}/#${date}/${enKey}`;
      lines.push(`• <a href="${zhUrl}">${zhLabel}</a>  ·  <a href="${enUrl}">${enLabel}</a>`);
    } else {
      lines.push(`• <a href="${zhUrl}">${zhLabel}</a>`);
    }
  }

  lines.push(`\n<a href="${PAGES_URL}">🌐 Web UI</a>  ·  <a href="${PAGES_URL}/feed.xml">⊕ RSS</a>`);
  return lines.join("\n");
}

async function main(): Promise<void> {
  const BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"] ?? "";
  if (!BOT_TOKEN) {
    console.log("[notify] TELEGRAM_BOT_TOKEN not set — skipping.");
    return;
  }

  if (!fs.existsSync("manifest.json")) {
    console.log("[notify] manifest.json not found — skipping.");
    return;
  }

  const { dates } = JSON.parse(fs.readFileSync("manifest.json", "utf-8")) as {
    dates: { date: string; reports: string[] }[];
  };

  const latest = dates?.[0];
  if (!latest) {
    console.log("[notify] manifest is empty — skipping.");
    return;
  }
  const { date, reports } = latest;
  const text = buildMessage(date, reports);

  console.log(`[notify] Sending Telegram message for ${date} (${reports.length} reports)…`);
  await sendTelegram(text);
  console.log("[notify] Done!");
}

main().catch((e: unknown) => {
  console.error("[notify]", e instanceof Error ? e.message : e);
  process.exit(1);
});
