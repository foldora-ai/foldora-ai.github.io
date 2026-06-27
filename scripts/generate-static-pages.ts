import fs from "node:fs";
import path from "node:path";

import { categories } from "../src/content/categories";
import { docs } from "../src/content/docs";
import { features } from "../src/content/features";
import {
  seoPages,
  seoPagesByRoute,
  type SeoFaq,
  type SeoPage,
} from "../src/content/seoPages";
import { product, site } from "../src/config/product";

const SITE_URL = site.url;
const OUTPUT_DIR = path.resolve("public");
const UPDATED_AT = "2026-06-14";

interface SupportPage {
  route: string;
  title: string;
  description: string;
  kind: "docs" | "feature";
  indexable: boolean;
  canonicalTarget?: string;
  sections: Array<{ title: string; content: string }>;
}

const supportPages: SupportPage[] = [
  ...Object.entries(docs).map(([slug, page]) => ({
    route: `docs/${slug}`,
    title: page.title,
    description: page.description,
    kind: "docs" as const,
    indexable: true,
    sections: page.sections,
  })),
  ...Object.entries(features).map(([slug, page]) => ({
    route: `features/${slug}`,
    title: page.title,
    description: page.description,
    kind: "feature" as const,
    indexable: false,
    canonicalTarget:
      slug === "smart-file-renaming"
        ? "rename-files-automatically"
        : slug === "downloads-cleanup"
          ? "clean-downloads-folder"
          : "blog/offline-ai-file-organizer",
    sections: page.sections,
  })),
];

const redirects: Record<string, string> = {
  "blog/rename-files-automatically": "rename-files-automatically",
  "blog/ai-file-organizer-for-windows": "best-file-organizer-windows",
  "blog/organize-work-files": "blog/desktop-file-management",
  "alternatives/dropit": "best-file-organizer-windows",
};

const allKnownRoutes = new Set([
  ...seoPages.map((page) => page.route),
  ...supportPages.map((page) => page.route),
  ...Object.keys(categories).map((slug) => `category/${slug}`),
  ...Object.keys(redirects),
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripIndent(value: string): string {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
}

function absoluteUrl(route = ""): string {
  return `${SITE_URL}/${route ? `${route}/` : ""}`;
}

function trackedCheckout(campaign: string, content: string): string {
  const url = new URL(product.checkout.cardUrl);
  url.searchParams.set("utm_source", "foldoraai.com");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", content);
  return url.toString().replaceAll("&", "&amp;");
}

function writeRoute(route: string, html: string): void {
  const directory = path.join(OUTPUT_DIR, ...route.split("/"));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), html, "utf8");
}

function words(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function uniqueContent(page: SeoPage): string {
  return [
    page.title,
    page.h1,
    page.description,
    page.directAnswer,
    page.problemTitle,
    ...page.problem,
    ...page.steps,
    ...page.examples.flatMap((example) => [
      example.title,
      example.before,
      example.after,
    ]),
    page.comparison.title,
    page.comparison.summary,
    ...page.comparison.rows.flatMap((row) => [
      row.option,
      row.bestFor,
      row.tradeoff,
    ]),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

function shingleSet(value: string, size = 4): Set<string> {
  const tokens = words(value);
  const shingles = new Set<string>();
  for (let index = 0; index <= tokens.length - size; index += 1) {
    shingles.add(tokens.slice(index, index + size).join(" "));
  }
  return shingles;
}

function similarity(left: string, right: string): number {
  const a = shingleSet(left);
  const b = shingleSet(right);
  if (!a.size || !b.size) return 0;

  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }

  return intersection / (a.size + b.size - intersection);
}

function validatePages(): void {
  const errors: string[] = [];
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const page of seoPages) {
    const pageWords = words(uniqueContent(page)).length;

    if (!/^[a-z0-9/-]+$/.test(page.route)) {
      errors.push(`${page.route}: route contains unsupported characters`);
    }
    if (pageWords < 260) {
      errors.push(`${page.route}: only ${pageWords} unique source words (minimum 260)`);
    }
    if (page.steps.length < 4) {
      errors.push(`${page.route}: needs at least 4 steps`);
    }
    if (page.examples.length < 2) {
      errors.push(`${page.route}: needs at least 2 examples`);
    }
    if (page.faqs.length < 3) {
      errors.push(`${page.route}: needs at least 3 FAQs`);
    }
    if (page.related.length < 4) {
      errors.push(`${page.route}: needs at least 4 internal links`);
    }
    if (page.title.length > 65) {
      errors.push(`${page.route}: title is ${page.title.length} characters`);
    }
    if (page.description.length < 120 || page.description.length > 165) {
      errors.push(
        `${page.route}: description is ${page.description.length} characters (target 120-165)`,
      );
    }

    const previousTitle = titles.get(page.title.toLowerCase());
    if (previousTitle) {
      errors.push(`${page.route}: duplicate title also used by ${previousTitle}`);
    }
    titles.set(page.title.toLowerCase(), page.route);

    const previousDescription = descriptions.get(page.description.toLowerCase());
    if (previousDescription) {
      errors.push(
        `${page.route}: duplicate description also used by ${previousDescription}`,
      );
    }
    descriptions.set(page.description.toLowerCase(), page.route);

    for (const relatedRoute of page.related) {
      if (!allKnownRoutes.has(relatedRoute)) {
        errors.push(`${page.route}: broken related route ${relatedRoute}`);
      }
      if (relatedRoute === page.route) {
        errors.push(`${page.route}: links to itself`);
      }
    }
  }

  for (let left = 0; left < seoPages.length; left += 1) {
    for (let right = left + 1; right < seoPages.length; right += 1) {
      const score = similarity(
        uniqueContent(seoPages[left]),
        uniqueContent(seoPages[right]),
      );
      if (score >= 0.32) {
        errors.push(
          `${seoPages[left].route} and ${seoPages[right].route}: ${(score * 100).toFixed(1)}% shingle similarity`,
        );
      }
    }
  }

  if (errors.length) {
    throw new Error(`SEO quality gate failed:\n- ${errors.join("\n- ")}`);
  }
}

function breadcrumbItems(route: string, title: string) {
  const [section] = route.split("/");
  const sectionNames: Record<string, string> = {
    blog: "Guides",
    alternatives: "Comparisons",
    "use-cases": "Use Cases",
    docs: "Documentation",
    features: "Features",
    category: "Topics",
  };
  const sectionRoutes: Record<string, string> = {
    blog: "category/productivity",
    alternatives: "best-file-organizer-windows",
    "use-cases": "category/productivity",
    docs: "docs/how-it-works",
    features: "ai-file-organizer",
    category: "",
  };

  if (!sectionNames[section]) {
    return [
      { name: "Home", url: absoluteUrl() },
      { name: title, url: absoluteUrl(route) },
    ];
  }

  return [
    { name: "Home", url: absoluteUrl() },
    { name: sectionNames[section], url: absoluteUrl(sectionRoutes[section]) },
    { name: title, url: absoluteUrl(route) },
  ];
}

function schemaForPage(page: SeoPage): object {
  const breadcrumbs = breadcrumbItems(page.route, page.h1);
  const articleKinds = new Set(["guide", "comparison", "use-case"]);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": articleKinds.has(page.kind) ? "Article" : "WebPage",
        "@id": `${absoluteUrl(page.route)}#page`,
        url: absoluteUrl(page.route),
        headline: page.h1,
        name: page.title,
        description: page.description,
        dateModified: page.updatedAt,
        inLanguage: "en",
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      ...(page.route === "ai-file-organizer"
        ? [
            {
              "@type": "SoftwareApplication",
              name: product.productName,
              url: `${SITE_URL}/`,
              applicationCategory: "FileManagementApplication",
              operatingSystem: product.platforms.supported.join(", "),
              description:
                "Foldora organizes and renames messy folders with local AI and a preview step before changes are applied.",
              featureList: product.claims,
              offers: {
                "@type": "Offer",
                price: product.price.amount.toFixed(2),
                priceCurrency: product.price.currency,
                url: product.checkout.cardUrl,
              },
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ]
        : []),
    ],
  };
}

function basicSchema(route: string, title: string, description: string): object {
  const breadcrumbs = breadcrumbItems(route, title);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl(route)}#page`,
        url: absoluteUrl(route),
        name: title,
        description,
        dateModified: UPDATED_AT,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ],
  };
}

function analyticsHead(): string {
  return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${site.analyticsMeasurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${site.analyticsMeasurementId}', {'anonymize_ip': true});
    </script>`;
}

function pageStyles(): string {
  return `
    :root{color-scheme:dark;--bg:#020817;--card:#0f172a;--line:#243244;--text:#e2e8f0;--muted:#a8b3c5;--green:#22c55e}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.7}
    a{color:#86efac}
    .container{width:min(100% - 40px,980px);margin-inline:auto}
    header{border-bottom:1px solid var(--line);background:rgba(2,8,23,.96)}
    nav{display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:24px}
    nav .links{display:flex;gap:20px;flex-wrap:wrap}
    nav a{text-decoration:none;color:var(--text)}
    .brand{font-weight:800}
    .hero{padding:72px 0 56px;border-bottom:1px solid var(--line)}
    .eyebrow{color:#86efac;font-size:.85rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    h1{max-width:850px;margin:12px 0 20px;color:white;font-size:clamp(2.5rem,7vw,4.5rem);line-height:1.05;letter-spacing:-.04em}
    h2{margin:0 0 18px;color:white;font-size:clamp(1.65rem,4vw,2.35rem);line-height:1.2}
    h3{color:white;line-height:1.3}
    .lede{max-width:760px;color:var(--muted);font-size:1.2rem}
    .breadcrumbs{padding-top:28px;color:var(--muted);font-size:.9rem}
    .breadcrumbs a{color:var(--muted)}
    main{padding:60px 0 90px}
    section{margin-bottom:64px}
    .answer,.card,.cta{border:1px solid var(--line);border-radius:20px;background:var(--card);padding:28px}
    .answer{border-left:4px solid var(--green)}
    .answer p{font-size:1.1rem;margin:0}
    .updated{margin-top:16px;color:#7f8ba0;font-size:.85rem}
    ol{padding-left:24px}
    li{margin-bottom:12px}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    .card p{color:var(--muted)}
    .label{margin-bottom:4px;color:#7f8ba0;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
    table{width:100%;border-collapse:collapse;border:1px solid var(--line);background:var(--card)}
    th,td{padding:16px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}
    th{color:white}
    td{color:var(--muted)}
    .faq{padding:22px 0;border-bottom:1px solid var(--line)}
    .faq h3{margin:0 0 8px}
    .faq p{margin:0;color:var(--muted)}
    .related{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .related a{display:block;padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--card);text-decoration:none;color:white}
    .cta{text-align:center}
    .button{display:inline-block;margin-top:16px;padding:13px 22px;border-radius:999px;background:var(--green);color:#052e16;text-decoration:none;font-weight:800}
    footer{padding:32px 0;border-top:1px solid var(--line);color:var(--muted)}
    @media(max-width:700px){.grid,.related{grid-template-columns:1fr}.links{display:none!important}th,td{padding:12px;font-size:.9rem}}`;
}

function relatedTitle(route: string): string {
  const page = seoPagesByRoute[route];
  if (page) return page.h1;

  const support = supportPages.find((item) => item.route === route);
  if (support) return support.title;

  const categorySlug = route.replace("category/", "");
  const category = categories[categorySlug as keyof typeof categories];
  if (category) return category.title;

  return route
    .split("/")
    .at(-1)!
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function renderMainPage(page: SeoPage): string {
  const canonical = absoluteUrl(page.route);
  const breadcrumbs = breadcrumbItems(page.route, page.h1);
  const schema = JSON.stringify(schemaForPage(page)).replaceAll("<", "\\u003c");
  const campaign = page.route.replaceAll("/", "-");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="${page.kind === "landing" ? "website" : "article"}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Foldora AI">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  <header>
    <nav class="container" aria-label="Primary navigation">
      <a class="brand" href="/">Foldora AI</a>
      <div class="links">
        <a href="/ai-file-organizer/">Product</a>
        <a href="/category/productivity/">Guides</a>
        <a href="/best-file-organizer-windows/">Comparisons</a>
        <a href="/docs/privacy/">Privacy</a>
      </div>
      <a href="${trackedCheckout("seo-header", campaign)}">Download for Windows</a>
    </nav>
  </header>
  <div class="container breadcrumbs" aria-label="Breadcrumb">
    ${breadcrumbs
      .map((item, index) =>
        index === breadcrumbs.length - 1
          ? `<span aria-current="page">${escapeHtml(item.name)}</span>`
          : `<a href="${item.url.replace(SITE_URL, "") || "/"}">${escapeHtml(item.name)}</a> <span aria-hidden="true">/</span> `,
      )
      .join("")}
  </div>
  <section class="hero">
    <div class="container">
      <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${escapeHtml(page.description)}</p>
    </div>
  </section>
  <main class="container">
    <section class="answer" aria-labelledby="direct-answer">
      <h2 id="direct-answer">Direct answer</h2>
      <p>${escapeHtml(page.directAnswer)}</p>
      <div class="updated">Reviewed and updated ${escapeHtml(page.updatedAt)}</div>
    </section>
    <section>
      <h2>${escapeHtml(page.problemTitle)}</h2>
      ${page.problem.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </section>
    <section>
      <h2>Step-by-step workflow</h2>
      <ol>${page.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </section>
    <section>
      <h2>Use-case examples</h2>
      <div class="grid">
        ${page.examples
          .map(
            (example) => `<article class="card">
              <h3>${escapeHtml(example.title)}</h3>
              <div class="label">Before</div>
              <p>${escapeHtml(example.before)}</p>
              <div class="label">After</div>
              <p>${escapeHtml(example.after)}</p>
            </article>`,
          )
          .join("")}
      </div>
    </section>
    <section>
      <h2>${escapeHtml(page.comparison.title)}</h2>
      <p>${escapeHtml(page.comparison.summary)}</p>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Option</th><th>Best for</th><th>Tradeoff</th></tr></thead>
          <tbody>
            ${page.comparison.rows
              .map(
                (row) => `<tr><th scope="row">${escapeHtml(row.option)}</th><td>${escapeHtml(row.bestFor)}</td><td>${escapeHtml(row.tradeoff)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h2>Frequently asked questions</h2>
      ${page.faqs
        .map(
          (faq) => `<article class="faq"><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`,
        )
        .join("")}
    </section>
    <section>
      <h2>Related guides</h2>
      <div class="related">
        ${page.related
          .map(
            (route) => `<a href="/${route}/">${escapeHtml(relatedTitle(route))}</a>`,
          )
          .join("")}
      </div>
    </section>
    <section class="cta">
      <h2>Organize a folder with Foldora</h2>
      <p>Run local AI on Windows, review the proposed structure and filenames, then apply the changes you approve.</p>
      <a class="button" href="${trackedCheckout("seo-page", campaign)}">Download for Windows</a>
    </section>
  </main>
  <footer><div class="container">Foldora AI - Local, privacy-focused file organization</div></footer>
</body>
</html>`;
}

function supportFaqs(page: SupportPage): SeoFaq[] {
  if (page.kind === "feature") {
    return [
      {
        question: `What does ${page.title.toLowerCase()} mean in Foldora?`,
        answer: page.description,
      },
      {
        question: "Can I review the result before applying changes?",
        answer:
          "Yes. Foldora is designed to show proposed organization and naming changes for review.",
      },
      {
        question: "Does this workflow require cloud file uploads?",
        answer:
          "No. Foldora performs its file organization workflow locally.",
      },
    ];
  }

  return [
    {
      question: `Where can I learn more about ${page.title.toLowerCase()}?`,
      answer:
        "Use this documentation page as the starting point and contact Foldora support if the described steps do not resolve the issue.",
    },
    {
      question: "Does Foldora work locally?",
      answer:
        "Yes. File analysis and organization are designed to run on the local device.",
    },
    {
      question: "Should I back up files before a large change?",
      answer:
        "Yes. Keep a current backup before any bulk file move or rename operation.",
    },
  ];
}

function renderSupportPage(page: SupportPage): string {
  const canonicalRoute = page.canonicalTarget ?? page.route;
  const canonical = absoluteUrl(canonicalRoute);
  const metaDescription = `${page.description} Follow practical setup, review, privacy, and troubleshooting guidance for Foldora.`;
  const robots = page.indexable
    ? "index,follow,max-snippet:-1"
    : "noindex,follow";
  const faqs = supportFaqs(page);
  const steps = page.sections.map((section) => stripIndent(section.content));
  const supportSchema = basicSchema(page.route, page.title, metaDescription) as {
    "@context": string;
    "@graph": object[];
  };
  supportSchema["@graph"].push({
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
  const schema = JSON.stringify(supportSchema).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Foldora AI">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  <header><nav class="container"><a class="brand" href="/">Foldora AI</a><a href="/ai-file-organizer/">Product</a><a href="/docs/privacy/">Privacy</a></nav></header>
  <div class="container breadcrumbs"><a href="/">Home</a> / <span>${escapeHtml(page.title)}</span></div>
  <section class="hero"><div class="container"><div class="eyebrow">${escapeHtml(page.kind)}</div><h1>${escapeHtml(page.title)}</h1><p class="lede">${escapeHtml(page.description)}</p></div></section>
  <main class="container">
    <section class="answer"><h2>Direct answer</h2><p>${escapeHtml(page.description)} Foldora keeps the organization workflow local and lets you review changes before applying them.</p></section>
    <section><h2>What to know</h2>${page.sections.map((section) => `<h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(stripIndent(section.content))}</p>`).join("")}</section>
    <section><h2>Step-by-step</h2><ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}<li>Review the proposed result before applying changes to important files.</li></ol></section>
    <section><h2>Example</h2><div class="card"><p>Start with a small representative folder, confirm that the resulting names and locations match your workflow, and only then process a larger collection.</p></div></section>
    <section><h2>Frequently asked questions</h2>${faqs.map((faq) => `<article class="faq"><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`).join("")}</section>
    <section><h2>Related resources</h2><div class="related"><a href="/ai-file-organizer/">AI File Organizer</a><a href="/organize-files-windows/">Organize Files on Windows</a><a href="/features/offline-processing/">Offline Processing</a><a href="/docs/privacy/">Foldora Privacy</a></div></section>
  </main>
  <footer><div class="container">Foldora AI</div></footer>
</body>
</html>`;
}

function renderCategoryPage(slug: string): string {
  const category = categories[slug as keyof typeof categories];
  const route = `category/${slug}`;
  const metaDescription = `${category.description} Browse practical Foldora guides, workflows, examples, comparisons, and related resources.`;
  const topicPages = seoPages.filter(
    (page) =>
      page.topic === slug ||
      (slug === "productivity" && page.topic === "workflows") ||
      (slug === "downloads" && page.route.includes("download")) ||
      (slug === "windows" && page.kind === "comparison"),
  );
  const listedPages = topicPages.length ? topicPages : seoPages.slice(0, 6);
  const schema = JSON.stringify(
    basicSchema(route, category.title, metaDescription),
  ).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(category.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="index,follow,max-snippet:-1">
  <link rel="canonical" href="${absoluteUrl(route)}">
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(category.title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:url" content="${absoluteUrl(route)}">
  <meta property="og:site_name" content="Foldora AI">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(category.title)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  <header><nav class="container"><a class="brand" href="/">Foldora AI</a><a href="/ai-file-organizer/">Product</a><a href="/best-file-organizer-windows/">Comparisons</a></nav></header>
  <div class="container breadcrumbs"><a href="/">Home</a> / <span>Topics</span> / <span>${escapeHtml(category.title)}</span></div>
  <section class="hero"><div class="container"><div class="eyebrow">Topic hub</div><h1>${escapeHtml(category.title)}</h1><p class="lede">${escapeHtml(category.description)} Start with the guide that matches your folder, document type, or workflow.</p></div></section>
  <main class="container">
    <section class="answer"><h2>Direct answer</h2><p>${escapeHtml(category.description)} The resources below cover practical steps, examples, tool comparisons, and related workflows rather than repeating one generic organization template.</p></section>
    <section><h2>Guides in this topic</h2><div class="grid">${listedPages
      .map(
        (page) => `<article class="card"><h3><a href="/${page.route}/">${escapeHtml(page.h1)}</a></h3><p>${escapeHtml(page.description)}</p></article>`,
      )
      .join("")}</div></section>
    <section><h2>How to choose a guide</h2><ol><li>Start with the folder or file type causing the most repeated work.</li><li>Use a persona guide when retention, privacy, or project structure matters.</li><li>Read a comparison page before adopting a new automation tool.</li><li>Test every workflow on a small backed-up folder.</li></ol></section>
  </main>
  <footer><div class="container">Foldora AI</div></footer>
</body>
</html>`;
}

function renderRedirect(from: string, to: string): string {
  const target = `/${to}/`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="${absoluteUrl(to)}">
  <meta http-equiv="refresh" content="0;url=${target}">
  <title>Moved | Foldora</title>
</head>
<body>
  <p>This page moved to <a href="${target}">${escapeHtml(relatedTitle(to))}</a>.</p>
  <script>window.location.replace(${JSON.stringify(target)});</script>
</body>
</html>`;
}

function writeSitemap(): void {
  const entries = [
    { route: "", updatedAt: UPDATED_AT },
    ...seoPages
      .filter((page) => page.indexable !== false)
      .map((page) => ({ route: page.route, updatedAt: page.updatedAt })),
    ...supportPages
      .filter((page) => page.indexable && !page.canonicalTarget)
      .map((page) => ({ route: page.route, updatedAt: UPDATED_AT })),
    ...Object.keys(categories).map((slug) => ({
      route: `category/${slug}`,
      updatedAt: UPDATED_AT,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${absoluteUrl(entry.route)}</loc>
    <lastmod>${entry.updatedAt}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "sitemap.xml"), xml, "utf8");
}

function writeRobots(): void {
  const robots = `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "robots.txt"), robots, "utf8");
}

function writeLlmsTxt(): void {
  const featured = seoPages
    .filter((page) => ["landing", "comparison", "use-case"].includes(page.kind))
    .map(
      (page) =>
        `- [${page.h1}](${absoluteUrl(page.route)}): ${page.description}`,
    )
    .join("\n");

  const content = `# Foldora AI

> Foldora is a ${product.platforms.positioning} that categorizes and renames files locally. Users can review proposed changes before applying them. Verified supported systems: ${product.platforms.supported.join(", ")}.

## Core pages

${featured}

## Documentation

- [Privacy](${absoluteUrl("docs/privacy")})
- [How Foldora works](${absoluteUrl("docs/how-it-works")})
- [Supported file types](${absoluteUrl("docs/supported-file-types")})
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "llms.txt"), content, "utf8");
}

validatePages();

for (const page of seoPages) {
  writeRoute(page.route, renderMainPage(page));
}

for (const page of supportPages) {
  writeRoute(page.route, renderSupportPage(page));
}

for (const slug of Object.keys(categories)) {
  writeRoute(`category/${slug}`, renderCategoryPage(slug));
}

for (const [from, to] of Object.entries(redirects)) {
  writeRoute(from, renderRedirect(from, to));
}

writeSitemap();
writeRobots();
writeLlmsTxt();

console.log(
  `Generated ${seoPages.length} quality-gated SEO pages, ${supportPages.length} support pages, ${Object.keys(categories).length} topic hubs, and ${Object.keys(redirects).length} consolidating redirects.`,
);
