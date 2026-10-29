import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { features } from "@/content/features";
import { absoluteUrl, checkoutTrackingAttributes, checkoutUrl } from "@/config/product";

const FeaturePage = () => {
  const { slug } = useParams();

  const post = features[slug as keyof typeof features];

  if (!post) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">
              Feature not found
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
        canonical={absoluteUrl(`features/${slug}`)}
        robots="noindex,follow"
      />

      <Navbar />

      <main className="content-page-main">

        <section className="content-hero">
          <div className="content-hero-inner">

            <div className="content-eyebrow">
              Feature
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
                Foldora uses local AI to organize messy folders with a preview step.
              </p>

              <a
                href={checkoutUrl("feature-page", `features-${slug}`)}
                target="_blank"
                rel="noopener noreferrer"
                {...checkoutTrackingAttributes("gumroad", `features/${slug}`)}
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

export default FeaturePage;
