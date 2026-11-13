import fs from "node:fs";
import path from "node:path";

import { categories } from "../src/content/categories";
import { docs } from "../src/content/docs";
import { features } from "../src/content/features";
import {
  seoPages,
  seoPagesByRoute,
  type SeoFaq,
  type SeoComparison,
  type SeoPage,
} from "../src/content/seoPages";
import { product, site } from "../src/config/product";

const SITE_URL = site.url;
const BUNDLE_URL = "https://computora.gumroad.com/l/computoraai";
const OUTPUT_DIR = path.resolve("public");
const SOCIAL_IMAGE_SOURCE = path.resolve("src/assets/foldora-demo.png");
const SOCIAL_IMAGE_PATH = "/foldora-social-preview.png";
const SOCIAL_IMAGE_URL = `${SITE_URL}${SOCIAL_IMAGE_PATH}`;
const FRENCH_ROUTE = "fr/organisateur-fichiers-ia";
const FRENCH_INSTALL_ROUTE = "fr/installation-activation";
const FRENCH_INSTALL_URL = `${SITE_URL}/${FRENCH_INSTALL_ROUTE}/`;
const FRENCH_URL = `${SITE_URL}/${FRENCH_ROUTE}/`;
const HOME_UPDATED_AT = "2026-11-05";
const SUPPORT_UPDATED_AT = "2026-09-08";
const HOW_IT_WORKS_UPDATED_AT = "2026-11-13";
const CATEGORY_UPDATED_AT: Record<string, string> = {
  productivity: "2026-09-19",
  windows: "2026-09-19",
  privacy: "2026-09-17",
};
const TAWK_LOADER_TAG = '<script src="/tawk-loader.js" defer></script>';
const PRIVACY_CONSENT_TAG = '<script src="/privacy-consent.js"></script>';
const CHECKOUT_TRACKING_TAG = '<script src="/checkout-tracking.js" defer></script>';
const PRIVACY_SETTINGS_CONTROL = '<button type="button" class="footer-privacy-settings" data-foldora-privacy-open>Privacy Settings</button>';

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

function canonicalUrl(page: SeoPage): string {
  return page.canonicalUrl ?? absoluteUrl(page.route);
}

function relatedHref(route: string): string {
  return seoPagesByRoute[route]?.canonicalUrl ?? `/${route}/`;
}

function trackedCheckout(campaign: string, content: string): string {
  const url = new URL(product.checkout.cardUrl);
  url.searchParams.set("utm_source", "foldoraai.com");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", content);
  return url.toString().replaceAll("&", "&amp;");
}

function checkoutTrackingAttributes(location: string, variant = "windows_macos"): string {
  const attributes = {
    "data-foldora-checkout": "true",
    "data-checkout-provider": "gumroad",
    "data-checkout-location": location,
    "data-product-id": "foldora",
    "data-product-name": product.productName,
    "data-product-price": String(product.price.amount),
    "data-product-currency": product.price.currency,
    "data-product-variant": variant,
  };
  return Object.entries(attributes)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(" ");
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
    ...(page.decisionComparison ? [page.decisionComparison.title, page.decisionComparison.summary, ...page.decisionComparison.rows.flatMap((row) => [row.option, row.bestFor, row.tradeoff])] : []),
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...(page.sources ?? []).flatMap((source) => [
      source.label,
      source.note,
    ]),
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
    if (/\|\s*Foldora\s*$/i.test(page.title)) {
      errors.push(`${page.route}: title must not include the rendered Foldora suffix`);
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
  if (route === "alternatives") {
    return [
      { name: "Home", url: absoluteUrl() },
      { name: title, url: absoluteUrl(route) },
    ];
  }

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
    alternatives: "alternatives",
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
  const pageUrl = canonicalUrl(page);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
        sameAs: ["https://github.com/foldora-ai"],
        parentOrganization: {
          "@type": "Organization",
          "@id": "https://computoraai.com/#organization",
          name: "Computora AI",
          url: "https://computoraai.com/",
        },
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
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        headline: page.h1,
        name: page.title,
        description: page.description,
        dateModified: page.updatedAt,
        inLanguage: "en",
        image: SOCIAL_IMAGE_URL,
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
              "@id": `${SITE_URL}/#software`,
              name: product.productName,
              url: `${SITE_URL}/`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: product.platforms.supported.join(", "),
              image: SOCIAL_IMAGE_URL,
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
      ...(["tools/file-organization-planner", "tools/downloads-folder-cleanup-checklist"].includes(page.route)
        ? [{
            "@type": "WebApplication",
            "@id": `${pageUrl}#tool`,
            name: page.route === "tools/file-organization-planner" ? "Free File Organization Planner" : "Downloads Folder Cleanup Checklist",
            url: pageUrl,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any modern browser",
            browserRequirements: "JavaScript enabled",
            isAccessibleForFree: true,
            description: page.route === "tools/file-organization-planner" ? "Client-side filename-based folder tree and CSV mapping preview. Does not access or change files." : "Browser-only checklist for planning a safe Windows Downloads cleanup. Does not access or change files.",
            publisher: { "@id": `${SITE_URL}/#organization` },
          }]
        : []),
    ],
  };
}

function basicSchema(
  route: string,
  title: string,
  description: string,
  dateModified: string,
): object {
  const breadcrumbs = breadcrumbItems(route, title);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Foldora AI",
        url: `${SITE_URL}/`,
        sameAs: ["https://github.com/foldora-ai"],
        parentOrganization: {
          "@type": "Organization",
          "@id": "https://computoraai.com/#organization",
          name: "Computora AI",
          url: "https://computoraai.com/",
        },
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
        dateModified,
        inLanguage: "en",
        image: SOCIAL_IMAGE_URL,
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
    ${PRIVACY_CONSENT_TAG}
    <script>
      (function () {
        function analyticsAllowed() {
          return Boolean(
            window.FoldoraPrivacy &&
            typeof window.FoldoraPrivacy.optionalServicesAllowed === 'function' &&
            window.FoldoraPrivacy.optionalServicesAllowed()
          );
        }

        function loadAnalytics() {
          if (!analyticsAllowed() || window.__foldoraGa4Loaded) return;
          window.__foldoraGa4Loaded = true;
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${site.analyticsMeasurementId}', {'anonymize_ip': true});

          var script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=${site.analyticsMeasurementId}';
          script.setAttribute('data-foldora-ga4', 'true');
          document.head.appendChild(script);
        }

        document.addEventListener('foldora:consent-change', loadAnalytics);
        loadAnalytics();
      })();
    </script>
    ${CHECKOUT_TRACKING_TAG}`;
}

function pageStyles(): string {
  return `
    :root{color-scheme:dark;--bg:#0d0d0f;--card:#16161a;--secondary:#252529;--line:#2d2d33;--text:#f2f2f2;--muted:#98989f;--primary:#5b7fe5;--accent:#a14fda;--gradient:linear-gradient(135deg,var(--primary),var(--accent))}
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{margin:0;padding-top:64px;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
    a{color:#8ba7ff}
    a:focus-visible,button:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
    .container{width:min(calc(100% - 40px),1024px);margin-inline:auto}
    .site-header{position:fixed;z-index:50;inset:0 0 auto;border-bottom:1px solid rgba(45,45,51,.75);background:rgba(13,13,15,.86);backdrop-filter:blur(18px)}
    .site-nav{display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:24px}
    .site-nav a{text-decoration:none}
    .brand{display:flex;align-items:center;gap:9px;color:var(--text);font-size:1.05rem;font-weight:800;white-space:nowrap}
    .brand img{width:32px;height:32px;object-fit:contain}
    .nav-links{display:flex;align-items:center;gap:28px}
    .nav-links a{color:var(--muted);font-size:.875rem}
    .nav-links a:hover{color:var(--text)}
    .nav-cta{padding:9px 18px;border-radius:8px;background:var(--gradient);color:white!important;font-size:.875rem;font-weight:700;white-space:nowrap}
    .mobile-menu{display:none;padding:7px 11px;border:1px solid var(--line);border-radius:8px;color:var(--muted)!important;font-size:1.1rem;line-height:1}
    .breadcrumbs{padding-top:24px;color:var(--muted);font-size:.875rem}
    .breadcrumbs a{color:var(--muted)}
    .hero{padding:56px 0 64px;border-bottom:1px solid var(--line)}
    .eyebrow{color:#8ba7ff;font-size:.8rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    h1{max-width:850px;margin:16px 0 20px;color:white;font-size:4rem;line-height:1.08;letter-spacing:0}
    h2{margin:0 0 18px;color:white;font-size:2rem;line-height:1.25;letter-spacing:0}
    h3{margin:0 0 10px;color:white;font-size:1.2rem;line-height:1.35;letter-spacing:0}
    p{margin:0 0 18px}
    .lede{max-width:760px;margin:0;color:var(--muted);font-size:1.2rem;line-height:1.75}
    .hero-cta{margin-top:24px}.hero-cta .button{margin-top:0}.hero-cta p{margin:10px 0 0;color:var(--muted);font-size:.95rem}
    main{width:min(calc(100% - 40px),900px)!important;padding:64px 0 96px}
    section{margin-bottom:72px}
    section>p,section>ol{max-width:760px;color:var(--muted)}
    .answer,.card,.cta{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:28px}
    .answer{border-color:rgba(91,127,229,.45)}
    .answer p{font-size:1.1rem;margin:0}
    .updated{margin-top:16px;color:#7f8ba0;font-size:.85rem}
    ol{padding-left:26px}
    li{margin-bottom:12px}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    .card p{margin-bottom:16px;color:var(--muted)}
    .label{margin-bottom:4px;color:#7f8ba0;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
    .table-wrap{max-width:100%;overflow-x:auto;border:1px solid var(--line);border-radius:12px}
    table{width:100%;min-width:680px;border-collapse:collapse;background:var(--card)}
    th,td{padding:16px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}
    tr:last-child th,tr:last-child td{border-bottom:0}
    th{color:white;font-size:.9rem}
    td{color:var(--muted)}
    .faq{padding:22px 0;border-bottom:1px solid var(--line)}
    .faq h3{margin:0 0 8px}
    .faq p{margin:0;color:var(--muted)}
    .evidence-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:24px 0}
    .evidence-fact{padding:18px;border:1px solid var(--line);border-radius:12px;background:var(--card)}
    .evidence-fact dt{color:#8ba7ff;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .evidence-fact dd{margin:8px 0 0;color:white;font-size:1.05rem;font-weight:700}
    .evidence-media{display:grid;gap:18px;margin-top:24px}
    .evidence-media figure{margin:0;overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--card)}
    .evidence-media img,.evidence-media video{display:block;width:100%;height:auto;background:#000}
    .evidence-media figcaption{padding:14px 18px;border-top:1px solid var(--line);color:var(--muted);font-size:.9rem}
    .evidence-note{max-width:none;padding:16px;border:1px solid var(--line);border-radius:10px;background:var(--secondary);color:var(--muted);font-size:.9rem}
    .related{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .related a{display:block;padding:18px;border:1px solid var(--line);border-radius:10px;background:var(--card);text-decoration:none;color:white;transition:border-color .2s}
    .related a:hover{border-color:rgba(91,127,229,.65)}
    .cta{text-align:center}
    .cta p{margin-inline:auto}
    .button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-top:16px;padding:12px 22px;border-radius:8px;background:var(--gradient);color:white;text-decoration:none;font-weight:800}.button.secondary{margin-left:8px;background:transparent;color:var(--text);border:1px solid rgba(91,127,229,.6)}
    footer{padding:48px 0;border-top:1px solid var(--line);color:var(--muted)}
    .footer-inner{display:flex;align-items:center;justify-content:space-between;gap:28px;flex-wrap:wrap}
    .publisher{display:inline-flex;align-items:center;padding:6px 12px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.7rem;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:.12em}
    footer a,footer button{color:var(--muted)}
    .footer-privacy-settings{border:0;background:transparent;padding:0;font:inherit;text-decoration:underline;cursor:pointer}
    .footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;font-size:.875rem}
    .copyright{margin:28px 0 0;text-align:center;font-size:.75rem}
    @media(max-width:800px){.nav-links,.nav-cta{display:none}.mobile-menu{display:inline-flex}.footer-inner{flex-direction:column;text-align:center}}
    @media(max-width:700px){.container,main{width:min(calc(100% - 32px),900px)!important}.hero{padding:42px 0 48px}h1{font-size:2.5rem}h2{font-size:1.65rem}.lede{font-size:1.08rem}main{padding-top:48px}section{margin-bottom:56px}.answer,.card,.cta{padding:22px}.grid,.related,.evidence-facts{grid-template-columns:1fr}th,td{padding:13px;font-size:.88rem}.button.secondary{margin-left:0}.cta .button{width:100%}}`;
}

function renderPageHeader(
  content: string,
  showCheckout = true,
  campaign = "site-nav",
  location = `header/${content}`,
): string {
  return `<header class="site-header">
    <nav class="container site-nav" aria-label="Primary navigation">
      <a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a>
      <div class="nav-links">
        <a href="https://computoraai.com/">Computora AI</a><a href="/#features">Features</a><a href="/#how-it-works">How It Works</a><a href="/alternatives/">Comparisons</a><a href="/#pricing">Pricing</a><a href="/#faq">FAQ</a>
      </div>
      <a class="mobile-menu" href="/#pricing" aria-label="Open pricing and FAQ">&#9776;</a>
${showCheckout ? `      <a class="nav-cta" href="${trackedCheckout(campaign, content)}" ${checkoutTrackingAttributes(location)}>Get Foldora</a>` : ""}
    </nav>
  </header>`;
}

function renderPageFooter(showCheckout = true): string {
  return `<footer><div class="container">
    <div class="footer-inner">
      <a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a>
      <a class="publisher" href="https://computoraai.com/">By Computora AI</a>
      <div class="footer-links">
${showCheckout ? `        <a href="${trackedCheckout("site-footer", "footer-download")}" ${checkoutTrackingAttributes("footer")}>Get Foldora for Windows or macOS</a>` : ""}
        <a href="/#features">Features</a><a href="/docs/install/">Install</a><a href="/docs/privacy/">Privacy</a>${PRIVACY_SETTINGS_CONTROL}<a href="/docs/troubleshooting/">Support</a>
      </div>
      <a href="mailto:${escapeHtml(site.supportEmail)}">${escapeHtml(site.supportEmail)}</a>
    </div>
    <p class="copyright">Copyright ${new Date().getFullYear()} Foldora AI. All rights reserved.</p>
  </div></footer>`;
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

function renderEvidence(page: SeoPage): string {
  if (!page.evidence) return "";

  return `<section aria-labelledby="evidence-title">
    <h2 id="evidence-title">${escapeHtml(page.evidence.title)}</h2>
    <p>${escapeHtml(page.evidence.summary)}</p>
    <dl class="evidence-facts">
      ${page.evidence.facts
        .map(
          (fact) => `<div class="evidence-fact"><dt>${escapeHtml(fact.label)}</dt><dd>${escapeHtml(fact.value)}</dd></div>`,
        )
        .join("")}
    </dl>
    <div class="evidence-media">
      ${page.evidence.media
        .map(
          (item) => `<figure>${
            item.kind === "video"
              ? `<video controls preload="metadata" playsinline aria-label="${escapeHtml(item.alt)}"><source src="${escapeHtml(item.src)}" type="video/mp4"><track kind="captions" src="/foldora-demo-captions.vtt" srclang="en" label="English visual description"></video>`
              : `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy">`
          }<figcaption>${escapeHtml(item.caption)}</figcaption></figure>`,
        )
        .join("")}
    </div>
    <p class="evidence-note">${escapeHtml(page.evidence.note)}</p>
  </section>`;
}

function renderSelectionTable(page: SeoPage, comparison: SeoComparison = page.comparison, first = page.comparisonFirst): string {
  return `    <section${first ? ' aria-labelledby="organizer-selection"' : ""}>
      <h2${first ? ' id="organizer-selection"' : ""}>${escapeHtml(comparison.title)}</h2>
      <p>${escapeHtml(comparison.summary)}</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>${escapeHtml(comparison.headers?.option ?? "Option")}</th><th>${escapeHtml(comparison.headers?.bestFor ?? "Best for")}</th><th>${escapeHtml(comparison.headers?.tradeoff ?? "Tradeoff")}</th></tr></thead>
          <tbody>
            ${comparison.rows
              .map(
                (row) => `<tr><th scope="row">${escapeHtml(row.option)}</th><td>${escapeHtml(row.bestFor)}</td><td>${escapeHtml(row.tradeoff)}${row.sources ? `<div class="row-sources" style="margin-top:12px;font-size:.85rem">${row.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>`).join(" · ")}</div>` : ""}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function renderMainPage(page: SeoPage): string {
  const canonical = canonicalUrl(page);
  const robots = page.indexable === false
    ? "noindex,follow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const articlePage = ["guide", "comparison", "use-case"].includes(page.kind);
  const breadcrumbs = breadcrumbItems(page.route, page.h1);
  const schema = JSON.stringify(schemaForPage(page)).replaceAll("<", "\\u003c");
  const campaign = page.route.replaceAll("/", "-");
  const singleOffer = page.route === "alternatives/hazel" || page.route === "blog/organize-invoices-automatically";
  const isDownloadsChecklist = page.route === "tools/downloads-folder-cleanup-checklist";
  const hideBundle = singleOffer || isDownloadsChecklist || page.route === "alternatives/sortio" || page.route === "alternatives/renamer-ai" || page.route === "alternatives/filex-ai" || page.route === "local-vs-cloud-ai-file-organizer";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="robots" content="${robots}">
  <meta name="author" content="Foldora AI">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hrefLang="en" href="${canonical}">${page.route === "ai-file-organizer" ? `
  <link rel="alternate" hreflang="fr" href="${FRENCH_URL}">` : ""}
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="${page.kind === "landing" ? "website" : "article"}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Foldora AI">
  <meta property="og:image" content="${SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="${escapeHtml(page.title)} — Foldora AI">
  <meta property="og:image:width" content="1902">
  <meta property="og:image:height" content="918">
  <meta property="og:image:type" content="image/png">
  <meta property="og:locale" content="en_US">
${articlePage ? `  <meta property="article:modified_time" content="${page.updatedAt}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${SOCIAL_IMAGE_URL}">
  <meta name="twitter:url" content="${canonical}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}${isDownloadsChecklist ? `
    .checklist-shell{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:28px}
    .checklist-intro{color:var(--muted)}
    .checklist-progress{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:20px 0}
    .checklist-progress progress{width:100%;height:14px;accent-color:var(--primary)}
    .checklist-shell fieldset{margin:24px 0;padding:0;border:0}
    .checklist-shell legend{margin-bottom:10px;color:white;font-size:1.2rem;font-weight:800}
    .check-item{display:flex;align-items:flex-start;gap:13px;margin:8px 0;padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--secondary);cursor:pointer}
    .check-item input{flex:none;width:20px;height:20px;margin:3px 0 0;accent-color:var(--primary)}
    .check-item span{min-width:0}.check-item strong{display:block;color:white}.check-item small{display:block;margin-top:3px;color:var(--muted);font-size:.9rem;line-height:1.5}
    .checklist-shell button{min-height:44px;padding:9px 16px;border:1px solid var(--line);border-radius:8px;background:var(--secondary);color:white;font:inherit;cursor:pointer}
    .checklist-shell button:focus-visible,.check-item:focus-within{outline:2px solid var(--primary);outline-offset:3px}
    @media(max-width:700px){.checklist-shell{padding:20px}.check-item{padding:12px}}
  ` : ""}${page.route === "tools/file-organization-planner" ? `
    .planner-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.planner-panel{padding:24px;border:1px solid var(--line);border-radius:14px;background:var(--card);min-width:0}
    .planner-panel h3{margin-top:0}.planner-panel label{display:block;margin:12px 0 5px;font-weight:700}.planner-panel textarea,.planner-panel select,.planner-panel input{width:100%;min-height:42px;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--secondary);color:var(--text);font:inherit}
    .planner-panel textarea{min-height:210px;resize:vertical}.planner-panel button{min-height:42px;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--secondary);color:var(--text);font:inherit;cursor:pointer}.planner-panel button:disabled{opacity:.5;cursor:not-allowed}
    .planner-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:15px}.planner-panel pre{overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:14px;border:1px solid var(--line);border-radius:8px;background:var(--secondary)}
    .planner-panel [hidden]{display:none!important}.planner-rules{list-style:none;padding:0;margin:10px 0}.planner-rules li{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) 42px 42px auto;gap:6px;margin:8px 0}
    .planner-map{overflow-x:auto}.planner-map table{width:100%;border-collapse:collapse}.planner-map th,.planner-map td{text-align:left;padding:9px;border-bottom:1px solid var(--line);overflow-wrap:anywhere}.planner-note{font-size:.9rem;color:var(--muted)}
    @media(max-width:740px){.planner-grid{grid-template-columns:1fr}.planner-panel{padding:18px}.planner-rules li{grid-template-columns:1fr 1fr 42px 42px}.planner-rules li input{grid-column:span 2}}
  ` : ""}${page.route === "tools/file-naming-convention-generator" ? `
    .tool-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
    .tool-panel{padding:24px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
    .tool-panel h3{margin:0 0 18px;color:white}.tool-panel label,.tool-panel legend{display:block;color:var(--text);font-weight:700}
    .tool-panel input:not([type=checkbox]),.tool-panel select{width:100%;min-height:44px;margin:7px 0 17px;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--secondary);color:white;font:inherit}
    .tool-panel fieldset{margin:0 0 18px;padding:0;border:0}.tool-panel legend{margin-bottom:9px}
    .component-list{list-style:none;margin:0;padding:0}.component-list li{display:flex;align-items:center;gap:8px;margin:7px 0;padding:9px;border:1px solid var(--line);border-radius:8px}
    .component-list label{flex:1}.component-list button,.copy-button{min-width:38px;min-height:38px;border:1px solid var(--line);border-radius:7px;background:var(--secondary);color:white;cursor:pointer}
    .component-list button:disabled,.copy-button:disabled{opacity:.45;cursor:not-allowed}.copy-button{padding:8px 14px;margin:8px 8px 8px 0}
    .tool-output{overflow-wrap:anywhere}.tool-output code{display:block;padding:14px;border:1px solid var(--line);border-radius:8px;background:var(--secondary);color:white}
    .tool-output ul{padding-left:22px}.tool-output li{margin:8px 0}.tool-note{font-size:.9rem;color:var(--muted)}
    @media(max-width:700px){.tool-grid{grid-template-columns:1fr}.tool-panel{padding:18px}}
  ` : ""}</style>
</head>
<body>
  ${renderPageHeader(campaign, !singleOffer && !isDownloadsChecklist, "seo-header", `seo-header/${page.route}`)}
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
${page.route === "ai-file-organizer" ? `      <p><a href="/${FRENCH_ROUTE}/" lang="fr" hreflang="fr">Lire cette page en français</a></p>` : ""}
${page.route === "ai-file-organizer" ? `      <div class="hero-cta"><a class="button" href="${trackedCheckout("seo-page", "ai-file-organizer-hero")}" ${checkoutTrackingAttributes("ai-file-organizer-hero")}>Get Foldora - ${escapeHtml(product.price.display)}</a><p>One-time purchase. Windows 10/11 and macOS on Intel or Apple Silicon.</p></div>` : ""}
    </div>
  </section>
  <main class="container">
    <section class="answer" aria-labelledby="direct-answer">
      <h2 id="direct-answer">Direct answer</h2>
      <p>${escapeHtml(page.directAnswer)}</p>
      <div class="updated">Reviewed and updated ${escapeHtml(page.updatedAt)}</div>
    </section>
${isDownloadsChecklist ? `    <section id="cleanup-checklist" aria-labelledby="checklist-heading">
      <h2 id="checklist-heading">Plan your Downloads cleanup</h2>
      <p>Work through these checks while you inspect your own folder. A checked box means you completed that review step, not that any file was moved or deleted. Your progress stays in this browser; this page never requests uploads or accesses your files.</p>
      <div class="checklist-shell">
        <div class="checklist-progress"><strong id="progress-text" role="status" aria-live="polite">0 of 12 checks complete</strong><button id="reset-checklist" type="button">Reset checklist</button><progress id="checklist-progress" value="0" max="12" aria-label="Checklist progress"></progress></div>
        <fieldset><legend>1. Decide what stays</legend>
          <label class="check-item"><input type="checkbox" data-check="backup"><span><strong>Protect important originals</strong><small>Keep a separate backup of records and irreplaceable files before a large move.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="keep"><span><strong>Identify files to keep</strong><small>Mark active work and records you will need again; choose a durable project or subject folder.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="archive"><span><strong>Identify files to archive</strong><small>Set aside finished material you must retain but rarely open.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="review"><span><strong>Leave uncertain files for review</strong><small>Do not move or delete a file until you know its purpose and owner.</small></span></label>
        </fieldset>
        <fieldset><legend>2. Separate the mixed pile</legend>
          <label class="check-item"><input type="checkbox" data-check="documents"><span><strong>Review documents</strong><small>File PDFs and Office documents by purpose, such as Finance or a project, rather than extension alone.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="images"><span><strong>Review images</strong><small>Separate screenshots and reference images from photos or project assets you need to retain.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="archives"><span><strong>Review archives</strong><small>Check ZIP contents and whether an archive is a backup or required project package before moving it.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="installers"><span><strong>Review installers</strong><small>Check whether an installer is still needed for repair, reinstall, or offline use. Deleting it does not uninstall the app.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="temporary"><span><strong>Review temporary downloads</strong><small>Confirm an export or temporary copy is genuinely replaceable before deciding whether to delete it.</small></span></label>
        </fieldset>
        <fieldset><legend>3. Check risks before acting</legend>
          <label class="check-item"><input type="checkbox" data-check="lookalikes"><span><strong>Compare duplicate-looking names</strong><small>Names such as report.pdf and report (1).pdf are only a prompt for manual comparison; this page does not detect duplicates.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="dependencies"><span><strong>Check app dependencies</strong><small>An app, project, or shortcut may expect a file at its current path. Leave it there if you are unsure.</small></span></label>
          <label class="check-item"><input type="checkbox" data-check="sample"><span><strong>Plan a small test move</strong><small>Choose destinations, move a small verified batch in File Explorer, and open a sample from its new location. Decide on deletion separately.</small></span></label>
        </fieldset>
      </div>
      <noscript><p>The review steps above are available without JavaScript. Enable JavaScript to track and reset progress.</p></noscript>
    </section>` : ""}
${page.route === "tools/file-naming-convention-generator" ? `    <section id="naming-tool" aria-labelledby="tool-heading">
      <h2 id="tool-heading">Generate a file naming convention</h2>
      <p>Choose a workflow, select and reorder the fields, then copy a pattern or illustrative examples. This tool only creates text; it does not rename, read, or upload files.</p>
      <div class="tool-grid">
        <div class="tool-panel">
          <h3>Build your pattern</h3>
          <label for="workflow">Workflow</label><select id="workflow"><option value="invoices">Invoices</option><option value="business">Business documents</option><option value="personal">Personal files</option><option value="projects">Project files</option></select>
          <fieldset><legend>Filename components and order</legend><p class="tool-note">Use the arrows to move a component. Uncheck anything you do not need.</p><ul id="component-list" class="component-list"></ul></fieldset>
          <label for="separator">Separator</label><select id="separator"><option value="hyphen">Hyphen (-)</option><option value="underscore">Underscore (_)</option><option value="space">Space</option></select>
          <label for="date-format">Date format</label><select id="date-format"><option value="iso">YYYY-MM-DD</option><option value="compact">YYYYMMDD</option><option value="month">YYYY-MM</option></select>
        </div>
        <div class="tool-panel">
          <h3>Sample details</h3>
          <label for="date">Date</label><input id="date" type="date" value="2026-04-18">
          <label for="category">Category</label><input id="category" type="text" maxlength="80" value="Invoice" autocomplete="off">
          <label for="project">Project or client</label><input id="project" type="text" maxlength="80" value="Acme" autocomplete="off">
          <label for="description">Description</label><input id="description" type="text" maxlength="80" value="April services" autocomplete="off">
          <label for="sequence">Starting sequence number</label><input id="sequence" type="number" min="1" max="9999" step="1" value="1">
          <label for="extension">Example file extension</label><input id="extension" type="text" maxlength="10" value="pdf" autocomplete="off" aria-describedby="extension-help"><p id="extension-help" class="tool-note">Letters and digits only. Keep the real file's extension when naming it.</p>
        </div>
      </div>
      <div class="tool-panel tool-output" style="margin-top:24px">
        <h3>Your pattern</h3><code id="pattern-output">{date}-{project}-{category}-{description}-{sequence}.{extension}</code><button id="copy-pattern" class="copy-button" type="button">Copy pattern</button>
        <h3>Illustrative filename examples</h3><p class="tool-note">Suggestions for planning only. These are not actual Foldora AI output.</p>
        <ul id="example-output"><li>2026-04-18-Acme-Invoice-April services-001.pdf</li><li>2026-05-03-Northstar-Invoice-Design retainer-002.pdf</li><li>2026-05-14-Acme-Receipt-Office supplies-003.pdf</li></ul>
        <button id="copy-examples" class="copy-button" type="button">Copy examples</button><p id="tool-feedback" role="status" aria-live="polite" class="tool-note">Examples are illustrative suggestions, not Foldora AI output.</p>
      </div>
      <noscript><p>Turn on JavaScript to change components or copy results. The example pattern above is available without it.</p></noscript>
    </section>` : ""}
${page.route === "tools/file-organization-planner" ? `    <section id="organization-planner" aria-labelledby="planner-heading">
      <h2 id="planner-heading">Preview a folder plan from filenames</h2>
      <p>Paste names only, one per line. This is a browser-only text preview: no upload, AI classification, file access, folder creation, renaming, or moving. The example is illustrative, not Foldora output.</p>
      <div class="planner-grid">
        <div class="planner-panel">
          <h3>Input and rules</h3>
          <label for="filenames">Filenames, one per line</label>
          <textarea id="filenames" spellcheck="false" aria-describedby="filename-help">2026-04-18_acme_invoice.pdf&#10;2026-04-20_receipt_coffee.jpg&#10;project-brief.docx&#10;family-photo.jpg&#10;2026-05-03_budget.xlsx&#10;scan001.pdf</textarea>
          <p id="filename-help" class="planner-note">Maximum 1,000 lines. Paste basenames, not full paths. Names stay in this tab.</p>
          <label for="mode">Organization rule</label>
          <select id="mode"><option value="keyword">Editable keywords, first match wins</option><option value="type">File extension</option><option value="date">One valid YYYY-MM-DD date</option></select>
          <div id="keyword-controls"><p class="planner-note">Top rule wins when several keywords occur in a name. Use the arrows to change priority. Use relative folder names only.</p>
            <ol id="rule-list" class="planner-rules"></ol><button id="add-rule" type="button">Add keyword rule</button>
          </div>
          <div class="planner-actions"><button id="reset-example" type="button">Reset example</button></div>
        </div>
        <div class="planner-panel">
          <h3>Proposed folder tree</h3><pre id="plan-tree">Proposed structure/</pre>
          <div class="planner-actions"><button id="copy-tree" type="button">Copy structure</button><button id="download-csv" type="button">Download CSV mapping</button></div>
          <p id="planner-feedback" class="planner-note" role="status" aria-live="polite">Review the real folder before moving anything.</p>
          <p class="planner-note">CSV exports a checklist, not a script. Check backups, duplicate names, and existing destinations before manual changes.</p>
        </div>
      </div>
      <div class="planner-panel planner-map" style="margin-top:24px"><h3>Before and proposed destination</h3>
        <table><thead><tr><th scope="col">Line</th><th scope="col">Filename before</th><th scope="col">Proposed folder</th><th scope="col">Review note</th></tr></thead><tbody id="mapping-body"></tbody></table>
      </div>
      <noscript><p>Enable JavaScript to change rules and preview mappings. The explanation and example filenames above remain available without it.</p></noscript>
    </section>` : ""}
${page.comparisonFirst ? renderSelectionTable(page) + "\n" : ""}${renderEvidence(page)}
${page.decisionComparison ? renderSelectionTable(page, page.decisionComparison, false) : ""}
    <section>
      <h2>${escapeHtml(page.problemTitle)}</h2>
      ${page.problem.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${page.contextualLinks?.map((link) => `<p>${escapeHtml(link.before)}<a href="${escapeHtml(link.href)}">${escapeHtml(link.anchor)}</a>${escapeHtml(link.after)}</p>`).join("") ?? ""}
    </section>
    <section>
      <h2>${escapeHtml(page.stepsTitle ?? "Step-by-step workflow")}</h2>
      <ol>${page.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
${page.route === "best-file-organizer-windows" ? `      <div class="hero-cta"><p>If the reviewed batch workflow fits, <a href="/ai-file-organizer/">see Foldora's product details</a> and <a href="/docs/supported-file-types/">check its format limits</a>.</p><a class="button" href="${trackedCheckout("seo-page", campaign)}" ${checkoutTrackingAttributes(page.route)}>Get Foldora - ${escapeHtml(product.price.display)} one-time</a></div>` : ""}
    </section>
${page.route === "organize-files-windows" ? `    <section>
      <h2>Free folder structure template</h2>
      <p>This small ZIP suits Windows users starting a simple home or work filing system. It contains empty Work, Personal, Finance, Reference, and Archive folders plus a README with ways to adapt them and suggested filename examples. Extract it into a new, empty location and adjust the categories to your needs. It creates a starting structure; it does not sort, move, or rename your files.</p>
      <p><a href="/downloads/folder-structure-template.zip" download>Download the free folder structure template (ZIP)</a></p>
      <p>For reviewed organization suggestions, <a href="/ai-file-organizer/">see how Foldora works</a>: select a folder, generate a preview, inspect proposed destinations and names, then apply only the changes you approve.</p>
    </section>` : ""}
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
${!page.comparisonFirst ? renderSelectionTable(page) : ""}
${page.sources ? `    <section>
        <h2>Official sources</h2>
        <p>${isDownloadsChecklist ? "Windows actions and settings are linked to Microsoft's current support guidance." : "Competitor facts are linked to the publisher's own product, store, and documentation pages."}</p>
        <div class="related">${page.sources
          .map(
            (source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(source.label)}</strong><span style="display:block;margin-top:.45rem;color:var(--muted);font-weight:400">${escapeHtml(source.note)}</span></a>`,
          )
          .join("")}</div>
      </section>` : ""}
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
            (route) => `<a href="${relatedHref(route)}">${escapeHtml(relatedTitle(route))}</a>`,
          )
          .join("")}
      </div>
    </section>
${page.route === "organize-files-mac" ? `    <section>
      <h2>Before buying for Mac</h2>
      <p>The <a href="/#pricing">Foldora product and pricing page</a> lists Intel and Apple Silicon Macs. The <a href="https://github.com/foldora-ai/foldora-releases/releases/tag/1.0.0-mac">published Mac release notes</a> identify a separate macOS ZIP package, <code>FoldoraAI-Setup-mac.zip</code>, and explain its installation. The newer 1.0.4 release contains a Windows installer only. See the <a href="/docs/install/">installation guide</a> for the checkout and license steps.</p>
      <p>The public checkout listing currently says “Download Foldora for Windows”; it does not confirm Mac package delivery or whether a purchased license applies to the Mac release. <a href="mailto:${escapeHtml(site.supportEmail)}">Ask Foldora support</a> to confirm both for your order before paying. A public installer download alone does not include a license.</p>
    </section>` : ""}
${page.route === "best-file-organizer-windows" ? "" : `    <section class="cta">
      <h2>Organize a folder with Foldora</h2>
      <p>${isDownloadsChecklist ? "For a mixed Downloads batch of supported PDFs, documents, spreadsheets, presentations, images, and ZIP files, Foldora can suggest folders and names from local analysis. Review its plan before approving moves or renames. It does not delete files or detect duplicates. The individual license costs $14.99 once; purchase, download, activation, periodic validation, and updates need internet access." : page.route === "organize-files-mac" ? "On a Mac, confirm package delivery and license compatibility with support before checkout. Then review proposed folders and filenames before applying changes." : "Run local AI on Windows or macOS, review the proposed structure and filenames, then apply the changes you approve."}</p>
      <a class="button" href="${trackedCheckout("seo-page", campaign)}" ${checkoutTrackingAttributes(page.route)}>${hideBundle ? `Get Foldora - ${escapeHtml(product.price.display)}` : "Get Foldora"}</a>
${hideBundle ? "" : `      <a class="button secondary" href="${BUNDLE_URL}" target="_blank" rel="noopener noreferrer">Get the complete bundle</a>`}
    </section>`}
  </main>
  ${renderPageFooter(!singleOffer && !isDownloadsChecklist)}
  ${TAWK_LOADER_TAG}
${page.route === "tools/file-naming-convention-generator" ? '  <script type="module" src="/tools/file-naming-convention-generator/tool.js"></script>' : ""}
${page.route === "tools/file-organization-planner" ? '  <script type="module" src="/tools/file-organization-planner/tool.js"></script>' : ""}
${isDownloadsChecklist ? '  <script type="module" src="/tools/downloads-folder-cleanup-checklist/tool.js"></script>' : ""}
</body>
</html>`;
}

function renderFrenchAiFileOrganizer(): string {
  const title = "Organisateur de fichiers IA pour Windows et Mac : vérifiez avant de déplacer";
  const description = "Foldora classe les fichiers d'un dossier avec une IA locale. Vérifiez les propositions avant de les appliquer. Windows 10/11 et macOS, licence à 14,99 $ en paiement unique.";
  const checkout = trackedCheckout("seo-page-fr", "organisateur-fichiers-ia");
  const checkoutAttributes = checkoutTrackingAttributes("fr/organisateur-fichiers-ia");
  const faqs = [
    ["Mes fichiers sont-ils envoyés dans le cloud ?", "Non. L'analyse et l'organisation des fichiers pris en charge se font localement. Un accès à Internet reste nécessaire pour l'achat, le téléchargement, l'activation de la licence et sa validation périodique."],
    ["Puis-je vérifier les changements avant le déplacement ?", "Oui. Foldora affiche la structure et les nouveaux noms proposés avant leur application. Vérifiez les suggestions incertaines et gardez une sauvegarde avant une opération importante."],
    ["Quels systèmes sont pris en charge ?", "Windows 10, Windows 11 et macOS sur processeurs Intel ou Apple Silicon. L'interface actuelle de l'application est en anglais ; cette page en français ne traduit pas le logiciel."],
    ["Quels formats peut-il analyser ?", "Foldora prend notamment en charge PDF, DOCX, TXT, XLSX, CSV, PPT, PPTX, PNG, JPG, GIF, WEBP et ZIP. La profondeur de l'analyse dépend du format ; une archive ZIP ou un programme d'installation n'est pas lu comme un document."],
    ["Lit-il tous les PDF numérisés ?", "Non. Pour un PDF, l'analyse porte au maximum sur les trois premières pages et les fichiers de plus de 8 Mio ne sont pas lus pour leur contenu. Une reconnaissance locale de texte peut être tentée sur la première page si le texte intégré est insuffisant ; ce n'est pas une lecture OCR de tout le document."],
    ["Comprend-il le contenu en français ?", "La prise en charge fiable de l'analyse de contenu en français n'est pas vérifiée. Testez d'abord un petit dossier représentatif et examinez chaque proposition avant de l'appliquer."],
    ["Surveille-t-il automatiquement mes dossiers ?", "Non. Vous choisissez un dossier et lancez une analyse ponctuelle. Foldora ne surveille pas les dossiers en continu et ne garantit pas un classement correct pour chaque fichier ambigu."],
    ["Quel est le prix et comment recevoir le logiciel ?", `La licence individuelle est actuellement proposée à ${product.price.display} en paiement unique, sans abonnement. L'achat et la livraison du téléchargement et de la licence passent par une page de paiement en anglais.`],
  ];
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${FRENCH_URL}#page`,
    url: FRENCH_URL,
    name: title,
    description,
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  }).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="author" content="Foldora AI">
  <link rel="canonical" href="${FRENCH_URL}">
  <link rel="alternate" hreflang="fr" href="${FRENCH_URL}">
  <link rel="alternate" hreflang="en" href="${SITE_URL}/ai-file-organizer/">
  <link rel="icon" href="/favicon.ico">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${FRENCH_URL}">
  <meta property="og:site_name" content="Foldora AI">
  <meta property="og:image" content="${SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="Aperçu de Foldora AI">
  <meta property="og:image:type" content="image/png">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SOCIAL_IMAGE_URL}">
  <meta name="twitter:url" content="${FRENCH_URL}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  <header class="site-header"><nav class="container site-nav" aria-label="Navigation principale">
    <a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a>
    <div class="nav-links"><a href="#fonctionnement">Fonctionnement</a><a href="#formats">Formats et limites</a><a href="#questions">Questions</a><a href="/#pricing" lang="en">Prix (en anglais)</a><a href="/ai-file-organizer/" hreflang="en">Version anglaise</a></div>
    <a class="mobile-menu" href="/ai-file-organizer/" hreflang="en" aria-label="Lire cette page en anglais">Anglais</a>
    <a class="nav-cta" href="${checkout}" ${checkoutAttributes}>Acheter Foldora</a>
  </nav></header>
  <div class="container breadcrumbs" aria-label="Fil d'Ariane"><a href="/">Accueil (en anglais)</a> / <span aria-current="page">Organisateur de fichiers IA</span></div>
  <section class="hero"><div class="container">
    <div class="eyebrow">Classement local de fichiers avec IA</div>
    <h1>${escapeHtml(title)}</h1>
    <p class="lede">${escapeHtml(description)}</p>
    <div class="hero-cta"><a class="button" href="${checkout}" ${checkoutAttributes}>Acheter Foldora — ${escapeHtml(product.price.display)} (paiement en anglais)</a><p>Licence individuelle en paiement unique. Windows 10/11 et macOS sur Intel ou Apple Silicon.</p></div>
  </div></section>
  <main class="container">
    <section class="answer"><h2>En bref</h2><p>Foldora est un logiciel de bureau qui propose un classement et des noms plus clairs pour les fichiers d'un dossier choisi. L'analyse des fichiers pris en charge se fait localement. Vous voyez les changements proposés avant de les approuver. Une connexion est nécessaire pour acheter, télécharger, activer la licence et la valider périodiquement. L'interface de l'application est actuellement en anglais.</p></section>
    <section id="fonctionnement"><h2>Comment fonctionne Foldora ?</h2>
      <ol><li>Choisissez un dossier comme Téléchargements, Bureau ou Documents. Activez ou désactivez la recherche dans les sous-dossiers selon votre besoin.</li><li>Foldora analyse les noms et, lorsque le format le permet, le contenu des fichiers sur votre appareil.</li><li>Examinez l'arborescence et les nouveaux noms proposés.</li><li>Appliquez les modifications approuvées. Conservez une sauvegarde indépendante avant un grand classement.</li></ol>
      <figure class="evidence-media"><img src="/evidence/foldora-demo.png" alt="Capture réelle de Foldora : structure actuelle à gauche et structure proposée à droite" width="1902" height="918" loading="lazy" style="display:block;width:100%;height:auto"><figcaption>Capture réelle de l'interface Foldora en anglais : comparaison entre les fichiers actuels et la structure proposée. Les propositions visibles ne représentent pas une garantie de résultat pour vos fichiers.</figcaption></figure>
      <figure class="evidence-media"><video controls preload="metadata" playsinline aria-label="Démonstration enregistrée de Foldora, interface en anglais"><source src="/foldora-demo.mp4" type="video/mp4"><track kind="captions" src="/foldora-demo-captions.vtt" srclang="en" label="Descriptions visuelles en anglais"></video><figcaption>Démonstration enregistrée du parcours dans Foldora. L'interface et les descriptions de la vidéo sont en anglais.</figcaption></figure>
    </section>
    <section><h2>Éléments de démonstration et portée des mesures</h2><p>Le site anglais présente une démonstration réelle et un test technique reproductible réalisé le 6 septembre 2026 sur un ordinateur Windows 11 Pro (Core i5-8350U, 8 Go de mémoire). Le test a traité 40 000 classifications de schémas en 1,2745 seconde et découvert 1 001 fichiers en 0,0091 seconde, dont 300 fichiers de test ignorés sous node_modules. Ces nombres ne mesurent ni la durée complète d'analyse par les modèles d'IA ni la précision du classement sur vos dossiers. Les résultats dépendent de l'appareil et des fichiers. <a href="/blog/foldora-file-organizer-benchmark/" lang="en">Voir la méthode détaillée (en anglais)</a>.</p></section>
    <section><h2>Exemples de dossiers</h2><p>Exemples illustratifs de catégories possibles, à vérifier dans l'aperçu ; ils ne proviennent pas d'un test sur vos fichiers.</p>
      <div class="grid"><article class="card"><h3>Téléchargements mélangés</h3><div class="label">Avant</div><p>invoice_1042.pdf, IMG_4829.png, setup.exe</p><div class="label">Après, si l'analyse le propose</div><p>Finance/Factures, Images/Captures, Logiciels/Installateurs</p></article><article class="card"><h3>Documents de projet</h3><div class="label">Avant</div><p>final.pdf, notes.txt, presentation.pptx</p><div class="label">Après, si l'analyse le propose</div><p>Projet/Documentation, Projet/Notes, Projet/Présentations</p></article></div>
    </section>
    <section id="formats"><h2>Formats, portée et limites</h2>
      <p>Les formats courants comprennent PDF, DOCX, TXT, XLSX, CSV, PPT, PPTX, PNG, JPG, GIF, WEBP et ZIP. Le traitement dépend du format. Foldora ne lit pas le contenu d'une archive ZIP comme un document. Les fichiers de plus de 8 Mio ne sont pas lus pour leur contenu. Pour les PDF, il examine au plus les trois premières pages ; il peut tenter une reconnaissance locale du texte sur la première page seulement si le texte intégré est insuffisant.</p>
      <p>La recherche dans les sous-dossiers est activée par défaut et peut être désactivée. Le programme exclut certains dossiers techniques, noms commençant par un point et son dossier de sortie. Une analyse prend au plus 1 000 fichiers admissibles. Il ne surveille pas les dossiers en continu, ne garantit pas un classement parfait et n'est pas un moteur de règles exactes. Si vous devez répéter une règle stricte sur chaque nouveau fichier, choisissez plutôt un outil à règles.</p>
      <p>Consultez <a href="/docs/supported-file-types/" lang="en">les formats et limites détaillés (en anglais)</a> ainsi que <a href="/docs/privacy/" lang="en">la politique de confidentialité (en anglais)</a>.</p>
    </section>
    <section><h2>Foldora, règles automatiques ou classement manuel ?</h2><p>Choisissez selon la régularité de vos fichiers et le niveau de contrôle souhaité.</p><div class="table-wrap"><table><thead><tr><th>Approche</th><th>Adaptée à</th><th>Limite</th></tr></thead><tbody><tr><th>Foldora</th><td>Dossiers mélangés dont les noms ou contenus donnent des indices</td><td>Suggestions à vérifier ; analyse variable selon le format</td></tr><tr><th>Outil à règles</th><td>Critères exacts à appliquer régulièrement</td><td>Règles à créer et à entretenir</td></tr><tr><th>Classement manuel</th><td>Petit nombre de fichiers occasionnels</td><td>Chaque nouveau fichier demande du temps</td></tr></tbody></table></div></section>
    <section id="questions"><h2>Questions fréquentes</h2>${faqs.map(([question, answer]) => `<article class="faq"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("")}</section>
    <section><h2>Pour aller plus loin</h2><div class="related"><a href="/${FRENCH_INSTALL_ROUTE}/">Guide d’installation et d’activation</a><a href="/docs/supported-file-types/" lang="en">Formats pris en charge (en anglais)</a><a href="/docs/privacy/" lang="en">Confidentialité (en anglais)</a><a href="/ai-file-organizer/" hreflang="en">Lire ce guide en anglais</a></div></section>
    <section class="cta"><h2>Prêt à vérifier vos propres fichiers ?</h2><p>Commencez par un petit dossier, examinez les suggestions, puis décidez des modifications à appliquer. L'achat, les instructions de téléchargement et l'activation de la licence sont en anglais.</p><a class="button" href="${checkout}" ${checkoutAttributes}>Acheter Foldora — ${escapeHtml(product.price.display)} (paiement en anglais)</a></section>
  </main>
  <footer><div class="container"><div class="footer-inner"><a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a><a class="publisher" href="https://computoraai.com/">Par Computora AI</a><div class="footer-links"><a href="/ai-file-organizer/" hreflang="en">Version anglaise</a><a href="/docs/privacy/" lang="en">Confidentialité (en anglais)</a><a href="/docs/troubleshooting/" lang="en">Assistance (en anglais)</a><button type="button" class="footer-privacy-settings" data-foldora-privacy-open>Préférences de confidentialité</button></div><a href="mailto:${escapeHtml(site.supportEmail)}">${escapeHtml(site.supportEmail)}</a></div></div></footer>
  ${TAWK_LOADER_TAG}
</body>
</html>`;
}

function renderFrenchInstallGuide(): string {
  const title = "Installer et activer Foldora";
  const description = "Guide en français pour recevoir, installer et activer Foldora sur Windows ou macOS, puis vérifier ses premières suggestions avant de modifier vos fichiers.";
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${FRENCH_INSTALL_URL}#page`,
    url: FRENCH_INSTALL_URL,
    name: title,
    description,
    inLanguage: "fr",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  }).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="author" content="Foldora AI">
  <link rel="canonical" href="${FRENCH_INSTALL_URL}">
  <link rel="alternate" hreflang="fr" href="${FRENCH_INSTALL_URL}">
  <link rel="icon" href="/favicon.ico">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${FRENCH_INSTALL_URL}">
  <meta property="og:site_name" content="Foldora AI">
  <meta property="og:image" content="${SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="Aperçu de Foldora AI">
  <meta property="og:image:type" content="image/png">
  <meta property="og:locale" content="fr_FR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SOCIAL_IMAGE_URL}">
  <meta name="twitter:url" content="${FRENCH_INSTALL_URL}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  <header class="site-header"><nav class="container site-nav" aria-label="Navigation principale">
    <a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a>
    <div class="nav-links"><a href="/${FRENCH_ROUTE}/">Produit en français</a><a href="/docs/install/" lang="en">Documentation anglaise</a></div>
    <a class="mobile-menu" href="/${FRENCH_ROUTE}/" aria-label="Retour au produit en français">Produit</a>
  </nav></header>
  <div class="container breadcrumbs" aria-label="Fil d'Ariane"><a href="/${FRENCH_ROUTE}/">Organisateur de fichiers IA</a> / <span aria-current="page">Installation et activation</span></div>
  <section class="hero"><div class="container"><div class="eyebrow">Documentation</div><h1>${escapeHtml(title)}</h1><p class="lede">${escapeHtml(description)}</p></div></section>
  <main class="container">
    <section class="answer"><h2>Avant de commencer</h2><p>L’interface de Foldora est en anglais. Après l’achat, la page de paiement en anglais fournit le téléchargement et les instructions de licence. Utilisez le programme d’installation ou le paquet fourni pour votre système ; aucune adresse de téléchargement distincte n’est nécessaire.</p></section>
    <section><h2>Configuration et installation</h2><ol>
      <li>Vérifiez votre système : Windows 10 ou 11, ou macOS sur processeur Intel ou Apple Silicon. Foldora doit pouvoir accéder au dossier choisi et disposer d’assez d’espace libre pour les déplacements et renommages.</li>
      <li>Terminez l’achat sur la page de paiement en anglais. Suivez les instructions de téléchargement et de licence fournies après le paiement.</li>
      <li>Téléchargez le paquet destiné à votre système, puis exécutez son programme d’installation ou ouvrez le paquet reçu. Suivez les indications de ce paquet pour installer Foldora.</li>
      <li>Activez la licence en suivant les instructions reçues. Une connexion Internet est nécessaire pour l’achat, le téléchargement et l’activation, puis périodiquement pour valider la licence et pour les mises à jour. L’analyse des fichiers se fait localement.</li>
    </ol></section>
    <section><h2>Premier classement</h2><ol>
      <li>Gardez une sauvegarde indépendante, puis commencez par une copie ou un petit dossier facile à vérifier.</li>
      <li>Sélectionnez ce dossier dans Foldora. Le mode <span lang="en">AI Content</span> propose des catégories et des noms à partir des indices disponibles.</li>
      <li>Lancez <span lang="en">Generate Preview</span> pour produire l’aperçu. Comparez <span lang="en">Current Structure</span> (structure actuelle) et <span lang="en">Proposed Structure</span> (structure proposée), notamment les dossiers de destination et les nouveaux noms.</li>
      <li>Appliquez uniquement un plan qui vous convient. Si une suggestion est incertaine, ne l’appliquez pas ; réduisez le dossier sélectionné et vérifiez à nouveau. L’aperçu ne constitue pas une sauvegarde.</li>
    </ol></section>
    <section><h2>Besoin d’aide ?</h2><p>Consultez <a href="/docs/troubleshooting/" lang="en">l’aide au dépannage (en anglais)</a> ou contactez <a href="mailto:${escapeHtml(site.supportEmail)}">${escapeHtml(site.supportEmail)}</a> pour une question d’installation ou d’achat. Indiquez votre version du système, le nom du fichier téléchargé et le message d’erreur exact. N’envoyez pas votre clé de licence ni le contenu de vos fichiers dans le chat d’assistance.</p></section>
    <section><h2>Retour au produit</h2><div class="related"><a href="/${FRENCH_ROUTE}/">Organisateur de fichiers IA : page française</a><a href="/docs/install/" lang="en">Guide d’installation original (en anglais)</a></div></section>
  </main>
  <footer><div class="container"><div class="footer-inner"><a class="brand" href="/"><img src="/foldora-logo-32.png" alt="" width="32" height="32">Foldora AI</a><a href="/${FRENCH_ROUTE}/">Produit en français</a><a href="/docs/privacy/" lang="en">Confidentialité (en anglais)</a><button type="button" class="footer-privacy-settings" data-foldora-privacy-open>Préférences de confidentialité</button><a href="mailto:${escapeHtml(site.supportEmail)}">${escapeHtml(site.supportEmail)}</a></div></div></footer>
  ${TAWK_LOADER_TAG}
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
  const isWorkflowGuide = page.route === "docs/how-it-works";
  const canonicalRoute = page.canonicalTarget ?? page.route;
  const canonical = absoluteUrl(canonicalRoute);
  const metaDescription = page.description;
  const robots = page.indexable
    ? "index,follow,max-snippet:-1"
    : "noindex,follow";
  const faqs = supportFaqs(page);
  const steps = page.sections.map((section) => stripIndent(section.content));
  const supportSchema = basicSchema(
    page.route,
    page.title,
    metaDescription,
    isWorkflowGuide ? HOW_IT_WORKS_UPDATED_AT : SUPPORT_UPDATED_AT,
  ) as {
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
  const workflowBody = isWorkflowGuide ? `    <section class="answer"><h2>Direct answer</h2><p>Foldora organizes a selected folder in a user-started run. Choose Content, Date, or Type; generate a proposal; compare Current Structure with Proposed Structure; then apply only a suitable plan. It does not continuously watch the folder.</p></section>
    <section><h2>Six steps from folder to reviewed result</h2><ol>${page.sections.map((section, index) => `<li><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(stripIndent(section.content))}</p>${index === 3 ? `<div class="evidence-media"><figure><a href="/evidence/foldora-demo.png" aria-label="Open the full-size Foldora preview screenshot"><img src="/evidence/foldora-demo.png" alt="Real Foldora review screen comparing Current Structure with Proposed Structure before files are changed" width="1902" height="918" loading="lazy"></a><figcaption>Actual Foldora application preview on Windows. The right-hand tree is a proposal; this capture does not show approved moves or the final folder.</figcaption></figure></div>` : ""}</li>`).join("")}</ol></section>
    <section><h2>What the preview cannot guarantee</h2><p>Foldora can use filenames and available supported content, but it does not understand every file completely. Content reading skips files above 8 MiB; PDF text is sampled from up to three pages, with a first-page local OCR attempt only when embedded text is sparse and OCR is available. ZIP contents are not unpacked. Review unclear suggestions and keep a backup before applying changes.</p><p>Check <a href="/docs/supported-file-types/">supported formats and analysis limits</a>, <a href="/docs/privacy/">local processing and internet requirements</a>, and <a href="/ai-file-organizer/">Foldora's product details</a> before buying.</p></section>` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(page.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="${robots}">
  <meta name="author" content="Foldora AI">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hrefLang="en" href="${canonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Foldora AI">
  <meta property="og:image" content="${SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="Foldora AI previewing a file organization plan">
  <meta property="og:image:width" content="1902">
  <meta property="og:image:height" content="918">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <meta name="twitter:image" content="${SOCIAL_IMAGE_URL}">
  <meta name="twitter:url" content="${canonical}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  ${renderPageHeader(page.route.replaceAll("/", "-"))}
  <div class="container breadcrumbs"><a href="/">Home</a> / <span>${escapeHtml(page.title)}</span></div>
  <section class="hero"><div class="container"><div class="eyebrow">${escapeHtml(page.kind)}</div><h1>${escapeHtml(page.title)}</h1><p class="lede">${escapeHtml(page.description)}</p></div></section>
  <main class="container">
${workflowBody || `    <section class="answer"><h2>Direct answer</h2><p>${escapeHtml(page.description)} Foldora keeps the organization workflow local and lets you review changes before applying them.</p></section>
    <section><h2>What to know</h2>${page.sections.map((section) => `<h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(stripIndent(section.content))}</p>`).join("")}</section>
    <section><h2>Step-by-step</h2><ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}<li>Review the proposed result before applying changes to important files.</li></ol></section>
    <section><h2>Example</h2><div class="card"><p>Start with a small representative folder, confirm that the resulting names and locations match your workflow, and only then process a larger collection.</p></div></section>`}
    <section><h2>Frequently asked questions</h2>${faqs.map((faq) => `<article class="faq"><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`).join("")}</section>
    <section><h2>Related resources</h2><div class="related"><a href="/ai-file-organizer/">AI File Organizer</a><a href="/organize-files-windows/">Organize Files on Windows</a><a href="/features/offline-processing/">Offline Processing</a><a href="/docs/privacy/">Foldora Privacy</a></div></section>
  </main>
  ${renderPageFooter()}
  ${TAWK_LOADER_TAG}
</body>
</html>`;
}

function renderCategoryPage(slug: string): string {
  const category = categories[slug as keyof typeof categories];
  const route = `category/${slug}`;
  const isDownloadsCategory = slug === "downloads";
  const categoryCanonical = isDownloadsCategory
    ? "https://cleanoraai.com/category/downloads/"
    : absoluteUrl(route);
  const categoryRobots = isDownloadsCategory
    ? "noindex,follow"
    : "index,follow,max-snippet:-1";
  const metaDescription = `${category.description} Browse practical Foldora guides, workflows, examples, comparisons, and related resources.`;
  const topicPages = seoPages.filter(
    (page) =>
      isDownloadsCategory
        ? page.topic === "downloads"
        : page.indexable !== false &&
          (page.topic === slug ||
            (slug === "productivity" && page.topic === "workflows") ||
            (slug === "windows" && page.kind === "comparison")),
  );
  const listedPages = topicPages.length
    ? topicPages
    : seoPages.filter((page) => page.indexable !== false).slice(0, 6);
  const schema = JSON.stringify(
    basicSchema(
      route,
      category.title,
      metaDescription,
      CATEGORY_UPDATED_AT[slug] ?? SUPPORT_UPDATED_AT,
    ),
  ).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(category.title)} | Foldora</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="${categoryRobots}">
  <meta name="author" content="Foldora AI">
  <link rel="canonical" href="${categoryCanonical}">
  <link rel="alternate" hrefLang="en" href="${categoryCanonical}">
  <link rel="icon" href="/favicon.ico">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(category.title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:url" content="${categoryCanonical}">
  <meta property="og:site_name" content="Foldora AI">
  <meta property="og:image" content="${SOCIAL_IMAGE_URL}">
  <meta property="og:image:alt" content="Foldora AI previewing a file organization plan">
  <meta property="og:image:width" content="1902">
  <meta property="og:image:height" content="918">
  <meta property="og:image:type" content="image/png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(category.title)}">
  <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
  <meta name="twitter:image" content="${SOCIAL_IMAGE_URL}">
  <meta name="twitter:url" content="${categoryCanonical}">
  <script type="application/ld+json">${schema}</script>
${analyticsHead()}
  <style>${pageStyles()}</style>
</head>
<body>
  ${renderPageHeader(route.replaceAll("/", "-"))}
  <div class="container breadcrumbs"><a href="/">Home</a> / <span>Topics</span> / <span>${escapeHtml(category.title)}</span></div>
  <section class="hero"><div class="container"><div class="eyebrow">Topic hub</div><h1>${escapeHtml(category.title)}</h1><p class="lede">${escapeHtml(category.description)} Start with the guide that matches your folder, document type, or workflow.</p></div></section>
  <main class="container">
    <section class="answer"><h2>Direct answer</h2><p>${escapeHtml(category.description)} The resources below cover practical steps, examples, tool comparisons, and related workflows rather than repeating one generic organization template.</p></section>
    <section><h2>Guides in this topic</h2><div class="grid">${listedPages
      .map(
        (page) => `<article class="card"><h3><a href="${relatedHref(page.route)}">${escapeHtml(page.h1)}</a></h3><p>${escapeHtml(page.description)}</p></article>`,
      )
      .join("")}</div></section>
    <section><h2>How to choose a guide</h2><ol><li>Start with the folder or file type causing the most repeated work.</li><li>Use a persona guide when retention, privacy, or project structure matters.</li><li>Read a comparison page before adopting a new automation tool.</li><li>Test every workflow on a small backed-up folder.</li></ol></section>
  </main>
  ${renderPageFooter()}
  ${TAWK_LOADER_TAG}
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
    { route: "", updatedAt: HOME_UPDATED_AT },
    ...seoPages
      .filter((page) => page.indexable !== false)
      .map((page) => ({ route: page.route, updatedAt: page.updatedAt })),
    { route: FRENCH_ROUTE, updatedAt: "2026-11-07" },
    { route: FRENCH_INSTALL_ROUTE, updatedAt: "2026-11-07" },
    ...supportPages
      .filter((page) => page.indexable && !page.canonicalTarget)
      .map((page) => ({ route: page.route, updatedAt: page.route === "docs/how-it-works" ? HOW_IT_WORKS_UPDATED_AT : SUPPORT_UPDATED_AT })),
    ...Object.keys(categories).filter((slug) => slug !== "downloads").map((slug) => ({
      route: `category/${slug}`,
      updatedAt: CATEGORY_UPDATED_AT[slug] ?? SUPPORT_UPDATED_AT,
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

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "robots.txt"), robots, "utf8");
}

function writeLlmsTxt(): void {
  const featured = seoPages
    .filter(
      (page) =>
        page.indexable !== false &&
        ["landing", "comparison", "use-case"].includes(page.kind),
    )
    .map(
      (page) =>
        `- [${page.h1}](${absoluteUrl(page.route)}): ${page.description}`,
    )
    .join("\n");

  const content = `# Foldora AI

> Foldora is a ${product.platforms.positioning} that categorizes and renames files locally. Users can review proposed changes before applying them. Verified supported systems: ${product.platforms.supported.join(", ")}.

## Official product facts

- Canonical website: ${SITE_URL}/
- Product category: Local AI file organizer and file renaming software
- Supported platforms: ${product.platforms.supported.join(", ")}
- Current lifetime price: ${product.price.currency} ${product.price.amount.toFixed(2)}
- Official purchase page: ${product.checkout.cardUrl}
- Publisher: Computora AI (https://computoraai.com/)
- Official GitHub organization: https://github.com/foldora-ai
- Support: ${site.supportEmail}
- Privacy model: File analysis and organization run locally; files do not need to be uploaded to a cloud organizer.
- Safety model: Users preview proposed folders and filenames before applying changes.

## Core pages

${featured}

## Documentation

- [Privacy](${absoluteUrl("docs/privacy")})
- [How Foldora works](${absoluteUrl("docs/how-it-works")})
- [Supported file types](${absoluteUrl("docs/supported-file-types")})
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, "llms.txt"), content, "utf8");
}

function writeSocialPreview(): void {
  fs.copyFileSync(
    SOCIAL_IMAGE_SOURCE,
    path.join(OUTPUT_DIR, SOCIAL_IMAGE_PATH.slice(1)),
  );
}

writeSocialPreview();
validatePages();

for (const page of seoPages) {
  writeRoute(page.route, renderMainPage(page));
}

writeRoute(FRENCH_ROUTE, renderFrenchAiFileOrganizer());
writeRoute(FRENCH_INSTALL_ROUTE, renderFrenchInstallGuide());

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
