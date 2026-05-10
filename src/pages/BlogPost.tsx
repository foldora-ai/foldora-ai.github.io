import { useParams } from "react-router-dom";

import SeoHead from "@/components/SeoHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { blogPosts } from "@/content/blog";

const BlogPost = () => {
  const { slug } = useParams();

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">
              Post not found
            </h1>

            <p className="mt-4 text-muted-foreground">
              The article you are looking for does not exist.
            </p>
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

        {/* HERO */}
        <section className="border-b border-border">
          <div className="container max-w-4xl py-32">

            <div className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              AI File Organization
            </div>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-6xl">
              {post.title}
            </h1>

            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              Updated: {post.updatedAt}
            </p>

          </div>
        </section>

        {/* ARTICLE */}
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

            {/* CTA */}
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

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ 100% offline</span>
                <span>✓ No subscription</span>
                <span>✓ Local AI processing</span>
              </div>

            </div>

            {/* RELATED POSTS */}
            <div className="mt-24">

              <h3 className="text-3xl font-bold">
                Related Articles
              </h3>

              <div className="mt-8 grid gap-6 md:grid-cols-2">

                <a
                  href="/blog/clean-desktop-clutter"
                  className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <h4 className="text-xl font-semibold">
                    How To Clean Desktop Clutter Automatically
                  </h4>

                  <p className="mt-3 text-muted-foreground">
                    Stop messy desktop chaos using AI-powered organization.
                  </p>
                </a>

                <a
                  href="/blog/ai-file-organizer-for-windows"
                  className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <h4 className="text-xl font-semibold">
                    Best AI File Organizer For Windows
                  </h4>

                  <p className="mt-3 text-muted-foreground">
                    Discover how Foldora organizes files automatically on Windows.
                  </p>
                </a>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default BlogPost;