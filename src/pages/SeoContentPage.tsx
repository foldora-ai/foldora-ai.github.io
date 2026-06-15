import { useLocation } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoHead from "@/components/SeoHead";
import { seoPagesByRoute } from "@/content/seoPages";

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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SeoContentPage;
