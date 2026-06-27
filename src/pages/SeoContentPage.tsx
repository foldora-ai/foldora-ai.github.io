import { useLocation } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import { seoPagesByRoute } from "@/content/seoPages";
import { checkoutUrl } from "@/config/product";
import { trackEvent } from "@/lib/analytics";
import { breadcrumbSchema, faqSchema } from "@/lib/seo";

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
        canonical={`https://foldoraai.com/${page.route}/`}
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
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border">
          <div className="container max-w-4xl py-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {page.eyebrow}
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">
              {page.h1}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
              {page.description}
            </p>
          </div>
        </section>

        <div className="container max-w-4xl space-y-20 py-20">
          <section className="rounded-3xl border border-primary/30 bg-card p-8">
            <h2 className="text-3xl font-bold">Direct answer</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {page.directAnswer}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold">{page.problemTitle}</h2>
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
            <h2 className="text-3xl font-bold">Step-by-step workflow</h2>
            <ol className="mt-6 list-decimal space-y-4 pl-6 text-lg text-muted-foreground">
              {page.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold">Use-case examples</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {page.examples.map((example) => (
                <article
                  key={example.title}
                  className="rounded-2xl border border-border bg-card p-6"
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
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
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
            <h2 className="text-3xl font-bold">{page.comparison.title}</h2>
            <p className="mt-4 text-muted-foreground">{page.comparison.summary}</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[640px] border-collapse bg-card text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-sm font-semibold text-foreground">Option</th>
                    <th className="p-4 text-sm font-semibold text-foreground">Best for</th>
                    <th className="p-4 text-sm font-semibold text-foreground">Tradeoff</th>
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

          <section>
            <h2 className="text-3xl font-bold">Related guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {page.related.map((route) => (
                <a
                  key={route}
                  href={`/${route}/`}
                  className="rounded-xl border border-border bg-card p-5 text-foreground transition-colors hover:border-primary/40"
                >
                  {route.split("/").pop()?.replaceAll("-", " ")}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-primary/30 bg-card p-8 text-center">
            <h2 className="text-3xl font-bold">Organize a folder with Foldora</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Run local AI on Windows, review proposed folders and filenames, then apply the changes you approve.
            </p>
            <a
              href={checkoutUrl("seo-page", page.route.replaceAll("/", "-"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("checkout_link_clicked", {
                  provider: "gumroad",
                  location: page.route,
                })
              }
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Download for Windows
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SeoContentPage;
