import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { docs } from "@/content/docs";
import { absoluteUrl, checkoutTrackingAttributes, checkoutUrl } from "@/config/product";
import { trackEvent } from "@/lib/analytics";
import { breadcrumbSchema } from "@/lib/seo";
import { useEffect } from "react";

const DocsPage = () => {
  const { slug } = useParams();

  const post = docs[slug as keyof typeof docs];

  useEffect(() => {
    if (!post || !slug) return;
    trackEvent("documentation_page_viewed", {
      page: `docs/${slug}`,
    });
  }, [post, slug]);

  if (!post) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">
              Documentation not found
            </h1>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={`${post.title} | Foldora`}
        description={post.description}
        canonical={absoluteUrl(`docs/${slug}`)}
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Home" },
              { name: "Documentation", route: "docs/how-it-works" },
              { name: post.title, route: `docs/${slug}` },
            ]),
          ],
        }}
      />

      <Navbar />

      <main className="content-page-main">

        <section className="content-hero">
          <div className="content-hero-inner">

            <div className="content-eyebrow">
              Documentation
            </div>

            <h1 className="content-title">
              {post.title}
            </h1>

            <p className="content-intro">
              {post.description}
            </p>

          </div>
        </section>

        <section>
          <div className="content-body">

            {slug === "how-it-works" ? <article className="space-y-12">
              <p className="content-copy">Foldora organizes a selected folder in a user-started run. Its preview shows proposed destinations and names before approved changes are applied; the app does not continuously watch the folder.</p>
              <ol className="list-decimal space-y-8 pl-6">
                {post.sections.map((section, index) => <li key={section.title}>
                  <h2 className="content-section-title">{section.title}</h2>
                  <p className="content-copy">{section.content}</p>
                  {index === 3 && <figure className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
                    <a href="/evidence/foldora-demo.png" aria-label="Open the full-size Foldora preview screenshot"><img src="/evidence/foldora-demo.png" alt="Real Foldora review screen comparing Current Structure with Proposed Structure before files are changed" width="1902" height="918" loading="lazy" className="block h-auto w-full" /></a>
                    <figcaption className="border-t border-border p-4 text-sm text-muted-foreground">Actual Foldora application preview on Windows. The right-hand tree is a proposal; this capture does not show approved moves or the final folder.</figcaption>
                  </figure>}
                </li>)}
              </ol>
              <section>
                <h2 className="content-section-title">What the preview cannot guarantee</h2>
                <p className="content-copy">Foldora can use filenames and available supported content, but it does not understand every file completely. Content reading skips files above 8 MiB; PDF text is sampled from up to three pages, with a first-page local OCR attempt only when embedded text is sparse and OCR is available. ZIP contents are not unpacked. Review unclear suggestions and keep a backup before applying changes.</p>
                <p className="content-copy mt-4">Check <a href="/docs/supported-file-types/">supported formats and analysis limits</a>, <a href="/docs/privacy/">local processing and internet requirements</a>, and <a href="/ai-file-organizer/">Foldora's product details</a> before buying.</p>
              </section>
            </article> : <article className="space-y-16">
              {post.sections.map((section, index) => (
                <div key={index}>

                  <h2 className="content-section-title">
                    {section.title}
                  </h2>

                  <p className="content-copy whitespace-pre-line">
                    {section.content}
                  </p>

                </div>
              ))}

            </article>}

            <div className="content-callout text-center">

              <h2 className="content-section-title">
                Organize your files automatically
              </h2>

              <p className="mt-4 text-muted-foreground">
                Foldora uses local AI to clean messy folders in seconds.
              </p>

              <a
                href={checkoutUrl("docs", `docs-${slug}`)}
                target="_blank"
                rel="noopener noreferrer"
                {...checkoutTrackingAttributes("gumroad", `docs/${slug}`)}
                className="content-primary-button mt-8"
              >
                Get Foldora for Windows or macOS
              </a>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default DocsPage;
