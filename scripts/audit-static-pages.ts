import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://foldoraai.com";
const PUBLIC_DIR = path.resolve("public");
const ROOT_INDEX = path.resolve("index.html");
const APP_ROUTES = path.resolve("src", "App.tsx");

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

function localPublicAsset(url: string): string | undefined {
  if (!url.startsWith(`${SITE_URL}/`)) {
    return undefined;
  }

  const pathname = new URL(url).pathname.replace(/^\//, "");
  return pathname ? path.join(PUBLIC_DIR, ...pathname.split("/")) : undefined;
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
  const privacyConsentCount = (html.match(/src=["']\/privacy-consent\.js["']/g) ?? []).length;
  const checkoutTrackerCount = (html.match(/src=["']\/checkout-tracking\.js["']/g) ?? []).length;
  const eagerGoogleTagCount = (
    html.match(/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com\/gtag/gi) ?? []
  ).length;
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
  const socialImage = getAttribute(
    html,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  const socialType = getAttribute(
    html,
    /<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']+)["']/i,
  );

  if (canonical !== url) {
    errors.push(`${route}: canonical ${canonical ?? "missing"} does not match sitemap`);
  }
  if (!description || description.length < 80) {
    errors.push(`${route}: missing or short meta description`);
  }
  if (!html.includes('<meta name="author" content="Foldora AI">') && !html.includes('<meta name="author" content="Foldora AI" />')) {
    errors.push(`${route}: missing author metadata`);
  }
  if (!html.includes(`<link rel="alternate" hrefLang="en" href="${url}">`) && !html.includes(`<link rel="alternate" hrefLang="en" href="${url}" />`)) {
    errors.push(`${route}: missing English alternate link`);
  }
  if (!html.includes('property="og:image:type" content="image/png"')) {
    errors.push(`${route}: missing Open Graph image type`);
  }
  if (!html.includes(`name="twitter:url" content="${url}"`)) {
    errors.push(`${route}: missing Twitter URL`);
  }
  if (/^\/(?:blog\/|alternatives\/[^/]+\/|use-cases\/)/.test(route) && socialType !== "article") {
    errors.push(`${route}: article page must use og:type=article`);
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
  if (checkoutTrackerCount !== 1) {
    errors.push(`${route}: expected one checkout tracker, found ${checkoutTrackerCount}`);
  }
  if (privacyConsentCount !== 1) {
    errors.push(`${route}: expected one privacy consent loader, found ${privacyConsentCount}`);
  }
  if (eagerGoogleTagCount !== 0) {
    errors.push(`${route}: Google tag must not load before optional consent`);
  }
  for (const checkoutAnchor of html.matchAll(
    /<a\b[^>]*href=["'][^"']*computora\.gumroad\.com\/l\/foldora[^"']*["'][^>]*>/gi,
  )) {
    if (!checkoutAnchor[0].includes("data-foldora-checkout")) {
      errors.push(`${route}: Foldora checkout link is missing its tracking marker`);
    }
  }
  if (!socialImage) {
    errors.push(`${route}: missing Open Graph image`);
  } else {
    const imagePath = localPublicAsset(socialImage);
    if (imagePath && !fs.existsSync(imagePath)) {
      errors.push(`${route}: Open Graph image does not exist: ${socialImage}`);
    }
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

const appRoutes = read(APP_ROUTES);
for (const match of appRoutes.matchAll(
  /<Route\s+path=["']([^"']+)["']\s+element=\{<Navigate\b/g,
)) {
  const route = match[1].endsWith("/") ? match[1] : `${match[1]}/`;
  if (checkedRoutes.has(route)) {
    errors.push(`${route}: sitemap URL conflicts with a client-side redirect`);
  }
}

if (errors.length) {
  throw new Error(`Generated SEO audit failed:\n- ${errors.join("\n- ")}`);
}

console.log(`Audited ${urls.length} sitemap URLs with no output-level SEO errors.`);
