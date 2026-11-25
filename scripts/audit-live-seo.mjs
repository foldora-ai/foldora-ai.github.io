import fs from "node:fs";
import path from "node:path";

// Read-only public checks. Never submits URLs or changes the deployed site.
const args = process.argv.slice(2);
const origin = new URL(args[0] || "https://foldoraai.com").origin;
const output = args[1];
const records = [];
const cache = new Map();

async function request(url) {
  if (cache.has(url)) return cache.get(url);
  const pending = (async () => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      const body = await response.text();
      return {
        url, finalUrl: response.url, status: response.status,
        contentType: response.headers.get("content-type"),
        xRobotsTag: response.headers.get("x-robots-tag"), body,
      };
    } catch (error) {
      return { url, error: error.message, cause: error.cause?.message };
    }
  })();
  cache.set(url, pending);
  return pending;
}

async function pool(items, action) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) await action(items[next++]);
  }));
}

function attribute(html, element, name, value, attributeName) {
  const tags = html.match(new RegExp(`<${element}\\b[^>]*>`, "gi")) || [];
  const tag = tags.find(tag => new RegExp(`\\b${name}=["']${value}["']`, "i").test(tag));
  return tag?.match(new RegExp(`\\b${attributeName}=["']([^"']*)`, "i"))?.[1];
}

const sitemap = await request(`${origin}/sitemap.xml`);
const urls = [...(sitemap.body || "").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const assets = new Set();
await pool([...new Set([`${origin}/`, ...urls])], async url => {
  const result = await request(url);
  const { body = "", ...record } = result;
  record.issues = [];
  if (result.status !== 200) record.issues.push("Page did not return HTTP 200");
  if (!result.contentType?.includes("text/html")) record.issues.push("Page is not HTML");
  record.title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  record.canonical = attribute(body, "link", "rel", "canonical", "href");
  record.robots = attribute(body, "meta", "name", "robots", "content");
  record.description = attribute(body, "meta", "name", "description", "content");
  if (record.canonical !== url) record.issues.push("Canonical differs from sitemap URL");
  if (/noindex|none/i.test(`${record.robots || ""} ${result.xRobotsTag || ""}`)) record.issues.push("Sitemap page has noindex");
  record.h1Count = (body.match(/<h1[\s>]/gi) || []).length;
  if (record.h1Count !== 1) record.issues.push("Expected one H1 in returned HTML");
  if (!record.title) record.issues.push("Missing title");
  if (!record.description) record.issues.push("Missing description");
  record.schemaTypes = [];
  for (const match of body.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const schema = JSON.parse(match[1]);
      const nodes = schema["@graph"] || [schema];
      record.schemaTypes.push(...nodes.flatMap(node => node["@type"] || []));
    } catch { record.issues.push("Invalid JSON-LD"); }
  }
  if (!record.schemaTypes.length) record.issues.push("Missing structured data");
  for (const match of body.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)) {
    const asset = new URL(match[1], url);
    if (asset.origin === origin && /\.(?:js|css)$/.test(asset.pathname)) assets.add(asset.href);
  }
  const text = body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ");
  record.visibleWords = text.split(/\s+/).filter(Boolean).length;
  record.analyticsIds = [...new Set(body.match(/G-[A-Z0-9]{6,}/g) || [])];
  records.push(record);
});

const assetChecks = [];
await pool([...assets].sort(), async url => {
  const { body = "", ...result } = await request(url);
  assetChecks.push({ ...result, analyticsIds: [...new Set(body.match(/G-[A-Z0-9]{6,}/g) || [])] });
});
const resources = [];
for (const route of ["/robots.txt", "/llms.txt", "/seo-audit-missing-page-20261125/"]) {
  const { body, ...result } = await request(origin + route);
  resources.push({ ...result, ...(route === "/robots.txt" ? { body } : {}) });
}
const report = {
  checkedAt: new Date().toISOString(), origin,
  limits: "Public HTTP snapshot only; cannot prove Google indexing, rankings, traffic changes, consent rate, or browser rendering. Analytics IDs are detected only in returned HTML and directly linked JS/CSS.",
  sitemap: { status: sitemap.status, urlCount: urls.length, error: sitemap.error },
  pages: records.sort((a, b) => a.url.localeCompare(b.url)),
  assets: assetChecks.sort((a, b) => a.url.localeCompare(b.url)), resources,
};
if (output) fs.writeFileSync(path.resolve(output), JSON.stringify(report, null, 2) + "\n");
const brokenAssets = assetChecks.filter(asset => asset.status !== 200);
console.log(JSON.stringify({ origin, checkedAt: report.checkedAt, sitemap: report.sitemap,
  pagesWithIssues: records.filter(page => page.issues.length), brokenAssets,
  analyticsIds: [...new Set([...records, ...assetChecks].flatMap(record => record.analyticsIds))],
  resources, output: output ? path.resolve(output) : undefined }, null, 2));
if (sitemap.status !== 200 || !urls.length || records.some(page => page.issues.length) || brokenAssets.length) process.exitCode = 1;
