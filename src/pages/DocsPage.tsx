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

            <article className="space-y-16">

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

            </article>

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
