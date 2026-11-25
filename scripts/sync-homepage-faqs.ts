import fs from "node:fs";
import path from "node:path";

type Faq = { q: string; a: string };

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

/** Keep initial HTML, interactive answers, and JSON-LD on the same facts. */
export function syncHomepageFaqs(faqs: Faq[]): void {
  const file = path.resolve("index.html");
  let html = fs.readFileSync(file, "utf8");
  const section = `<!-- homepage-faqs:start -->
        <section id="faq" aria-labelledby="homepage-faq-title">
          <h2 id="homepage-faq-title">Frequently asked questions</h2>
${faqs.map(({ q, a }) => `          <h3>${escapeHtml(q)}</h3>\n          <p>${escapeHtml(a)}</p>`).join("\n")}
        </section>
        <!-- homepage-faqs:end -->`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const structured = `<!-- homepage-faq-schema:start -->
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
    <!-- homepage-faq-schema:end -->`;
  const sectionPattern = /<!-- homepage-faqs:start -->[\s\S]*?<!-- homepage-faqs:end -->/;
  const schemaPattern = /<!-- homepage-faq-schema:start -->[\s\S]*?<!-- homepage-faq-schema:end -->/;
  if (!html.includes("</main>") || !html.includes("</head>")) {
    throw new Error("Homepage FAQ sync requires a main element and head");
  }
  html = sectionPattern.test(html)
    ? html.replace(sectionPattern, () => section)
    : html.replace("</main>", () => `${section}\n      </main>`);
  html = schemaPattern.test(html)
    ? html.replace(schemaPattern, () => structured)
    : html.replace("</head>", () => `${structured}\n  </head>`);
  if (fs.readFileSync(file, "utf8") !== html) fs.writeFileSync(file, html, "utf8");
}
