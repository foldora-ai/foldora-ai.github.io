import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { docs } from "@/content/docs";

const DocsPage = () => {
  const { slug } = useParams();

  const post = docs[slug as keyof typeof docs];

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
        title={post.title}
        description={post.description}
      />

      <Navbar />

      <main className="min-h-screen bg-background">

        <section className="border-b border-border">
          <div className="container max-w-4xl py-32">

            <div className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              Documentation
            </div>

            <h1 className="mt-6 text-5xl font-extrabold md:text-6xl">
              {post.title}
            </h1>

            <p className="mt-6 text-xl text-muted-foreground">
              {post.description}
            </p>

          </div>
        </section>

        <section>
          <div className="container max-w-4xl py-20">

            <article className="space-y-16">

              {post.sections.map((section, index) => (
                <div key={index}>

                  <h2 className="text-3xl font-bold">
                    {section.title}
                  </h2>

                  <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>

                </div>
              ))}

            </article>

            <div className="mt-24 rounded-3xl border border-border bg-card p-10 text-center">

              <h2 className="text-3xl font-bold">
                Organize your files automatically
              </h2>

              <p className="mt-4 text-muted-foreground">
                Foldora uses local AI to clean messy folders in seconds.
              </p>

              <a
                href="https://foldora.gumroad.com/l/foldora"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 glow-shadow"
              >
                Download Foldora
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
