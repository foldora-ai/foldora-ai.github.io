import { useLocation } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import { seoPagesByRoute } from "@/content/seoPages";
import { docs } from "@/content/docs";
import { features } from "@/content/features";
import { categories } from "@/content/categories";
import { checkoutTrackingAttributes, checkoutUrl, product } from "@/config/product";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

const bundleUrl = "https://computora.gumroad.com/l/computoraai";

const relatedTitle = (route: string) => {
  if (seoPagesByRoute[route]) return seoPagesByRoute[route].h1;
  if (route.startsWith("docs/")) return docs[route.slice(5) as keyof typeof docs]?.title ?? route;
  if (route.startsWith("features/")) return features[route.slice(9) as keyof typeof features]?.title ?? route;
  if (route.startsWith("category/")) return categories[route.slice(9) as keyof typeof categories]?.title ?? route;
  return route.split("/").pop()?.replace(/-/g, " ") ?? route;
};

const SeoContentPage = () => {
  const location = useLocation();
  const route = location.pathname.replace(/^\/|\/$/g, "");
  const page = seoPagesByRoute[route];

  if (!page) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">Page not found</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={`${page.title} | Foldora`}
        description={page.description}
        canonical={page.canonicalUrl ?? `https://foldoraai.com/${page.route}/`}
        robots={page.indexable === false ? "noindex,follow" : undefined}
        type={
          page.kind === "guide" ||
          page.kind === "comparison" ||
          page.kind === "use-case"
            ? "article"
            : "website"
        }
        modifiedTime={page.updatedAt}
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home" },
              { name: page.h1, route: page.route },
            ]),
            faqSchema(page.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))),
          ],
        }}
      />
      <Navbar showCheckout={page.route !== "alternatives/hazel"} />
      <main className="content-page-main">
        <section className="content-hero">
          <div className="content-hero-inner">
            <p className="content-eyebrow">
              {page.eyebrow}
            </p>
            <h1 className="content-title">
              {page.h1}
            </h1>
            <p className="content-intro">
              {page.description}
            </p>
            {page.route === "ai-file-organizer" && (
              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href={checkoutUrl("seo-page", "ai-file-organizer-hero")}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...checkoutTrackingAttributes("gumroad", "ai-file-organizer-hero")}
                  className="content-primary-button"
                >
                  Get Foldora - {product.price.display}
                </a>
                <p className="text-sm text-muted-foreground">
                  One-time purchase. Windows 10/11 and macOS on Intel or Apple Silicon.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="content-body">
          <section className="content-callout">
            <h2 className="content-section-title">Direct answer</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {page.directAnswer}
            </p>
          </section>

          {page.evidence && (
            <section aria-labelledby="evidence-title">
              <h2 id="evidence-title" className="content-section-title">
                {page.evidence.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {page.evidence.summary}
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {page.evidence.facts.map((fact) => (
                  <div key={fact.label} className="content-card p-5">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 grid gap-6">
                {page.evidence.media.map((item) => (
                  <figure key={item.src} className="overflow-hidden rounded-xl border border-border bg-card">
                    {item.kind === "video" ? (
                      <video controls preload="metadata" playsInline aria-label={item.alt} className="w-full bg-black">
                        <source src={item.src} type="video/mp4" />
                        <track
                          kind="captions"
                          src="/foldora-demo-captions.vtt"
                          srcLang="en"
                          label="English visual description"
                        />
                      </video>
                    ) : (
                      <img src={item.src} alt={item.alt} loading="lazy" className="h-auto w-full" />
                    )}
                    <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
                      {item.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
                {page.evidence.note}
              </p>
            </section>
          )}

          <section>
            <h2 className="content-section-title">{page.problemTitle}</h2>
            {page.problem.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-5 text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>

          <section>
            <h2 className="content-section-title">Step-by-step workflow</h2>
            <ol className="mt-6 list-decimal space-y-4 pl-6 text-lg text-muted-foreground">
              {page.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="content-section-title">Use-case examples</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {page.examples.map((example) => (
                <article
                  key={example.title}
                  className="content-card"
                >
                  <h3 className="text-xl font-semibold">{example.title}</h3>
                  <p className="mt-4 text-muted-foreground">
                    <strong>Before:</strong> {example.before}
                  </p>
                  <p className="mt-3 text-muted-foreground">
                    <strong>After:</strong> {example.after}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="content-section-title">Frequently asked questions</h2>
            <div className="mt-8 space-y-6">
              {page.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="content-section-title">{page.comparison.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.comparison.summary}</p>
            <div className="mt-6 max-w-full overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[640px] border-collapse bg-card text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-sm font-semibold text-foreground">
                      {page.comparison.headers?.option ?? "Option"}
                    </th>
                    <th className="p-4 text-sm font-semibold text-foreground">
                      {page.comparison.headers?.bestFor ?? "Best for"}
                    </th>
                    <th className="p-4 text-sm font-semibold text-foreground">
                      {page.comparison.headers?.tradeoff ?? "Tradeoff"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.comparison.rows.map((row) => (
                    <tr key={row.option} className="border-b border-border last:border-b-0">
                      <th scope="row" className="p-4 align-top text-sm font-semibold text-foreground">
                        {row.option}
                      </th>
                      <td className="p-4 align-top text-sm text-muted-foreground">{row.bestFor}</td>
                      <td className="p-4 align-top text-sm text-muted-foreground">{row.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {page.sources && (
            <section>
              <h2 className="content-section-title">Official sources</h2>
              <p className="mt-4 text-muted-foreground">
                Competitor facts are linked to the publisher's own product, store, and documentation pages.
              </p>
              <div className="mt-6 grid gap-4">
                {page.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="content-card p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="font-semibold text-foreground">{source.label}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">{source.note}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="content-section-title">Related guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {page.related.map((route) => (
                <a
                  key={route}
                  href={seoPagesByRoute[route]?.canonicalUrl ?? `/${route}/`}
                  className="content-card p-5 text-foreground transition-colors hover:border-primary/40"
                >
                  {relatedTitle(route)}
                </a>
              ))}
            </div>
          </section>

          <section className="content-callout text-center">
            <h2 className="content-section-title">Organize a folder with Foldora</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Run local AI on Windows or macOS, review proposed folders and filenames, then apply the changes you approve.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={checkoutUrl("seo-page", page.route.replace(/\//g, "-"))}
                target="_blank"
                rel="noopener noreferrer"
                {...checkoutTrackingAttributes("gumroad", page.route)}
                className="content-primary-button"
              >
                {page.route === "alternatives/hazel"
                  ? `Get Foldora - ${product.price.display}`
                  : "Get Foldora"}
              </a>
              {page.route !== "alternatives/hazel" && (
                <a
                  href={bundleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary/40 px-6 py-3 font-semibold text-foreground transition-colors hover:border-primary"
                >
                  Get the complete bundle
                </a>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer showCheckout={page.route !== "alternatives/hazel"} />
    </>
  );
};

export default SeoContentPage;
