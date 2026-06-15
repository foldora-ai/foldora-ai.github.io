import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://foldoraai.com";
const PUBLIC_DIR = path.resolve("public");
const ROOT_INDEX = path.resolve("index.html");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function routeFile(url: string): string {
  const route = url.replace(`${SITE_URL}/`, "").replace(/\/$/, "");
  return route
    ? path.join(PUBLIC_DIR, ...route.split("/"), "index.html")
    : ROOT_INDEX;
}

function getAttribute(html: string, tagPattern: RegExp): string | undefined {
  return html.match(tagPattern)?.[1]?.trim();
}

function visibleWordCount(html: string): number {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const sitemap = read(path.join(PUBLIC_DIR, "sitemap.xml"));
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
const errors: string[] = [];
const checkedRoutes = new Set<string>();

for (const url of urls) {
  const filePath = routeFile(url);
  const route = url.replace(SITE_URL, "") || "/";

  if (checkedRoutes.has(route)) {
    errors.push(`${route}: duplicate sitemap entry`);
    continue;
  }
  checkedRoutes.add(route);

  if (!url.endsWith("/")) {
    errors.push(`${route}: sitemap URL must use the trailing-slash canonical`);
  }
  if (!fs.existsSync(filePath)) {
    errors.push(`${route}: no generated index.html`);
    continue;
  }

  const html = read(filePath);
  const canonical = getAttribute(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  );
  const description = getAttribute(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  const robots = getAttribute(
    html,
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i,
  );

  if (canonical !== url) {
    errors.push(`${route}: canonical ${canonical ?? "missing"} does not match sitemap`);
  }
  if (!description || description.length < 80) {
    errors.push(`${route}: missing or short meta description`);
  }
  if (robots?.includes("noindex")) {
    errors.push(`${route}: sitemap URL is noindex`);
  }
  if (!/<h1[\s>]/i.test(html)) {
    errors.push(`${route}: missing H1`);
  }
  if (!/<script[^>]+application\/ld\+json/i.test(html)) {
    errors.push(`${route}: missing JSON-LD`);
  }

  const minimumWords = route.startsWith("/category/") ? 140 : route === "/" ? 80 : 220;
  const count = visibleWordCount(html);
  if (count < minimumWords) {
    errors.push(`${route}: ${count} visible words (minimum ${minimumWords})`);
  }

  if (
    !route.startsWith("/docs/") &&
    !route.startsWith("/category/") &&
    route !== "/"
  ) {
    for (const requiredHeading of [
      "Direct answer",
      "Step-by-step workflow",
      "Use-case examples",
      "Frequently asked questions",
      "Related guides",
    ]) {
      if (!html.includes(requiredHeading)) {
        errors.push(`${route}: missing ${requiredHeading} section`);
      }
    }
  }

  for (const match of html.matchAll(/href=["'](\/[^"'#?]*)/g)) {
    const link = match[1];
    if (
      link === "/" ||
      link.startsWith("/assets/") ||
      path.posix.extname(link) !== ""
    ) {
      continue;
    }
    const target = path.join(
      PUBLIC_DIR,
      ...link.replace(/^\/|\/$/g, "").split("/"),
      "index.html",
    );
    if (!fs.existsSync(target)) {
      errors.push(`${route}: broken internal link ${link}`);
    }
  }
}

if (errors.length) {
  throw new Error(`Generated SEO audit failed:\n- ${errors.join("\n- ")}`);
}

console.log(`Audited ${urls.length} sitemap URLs with no output-level SEO errors.`);
