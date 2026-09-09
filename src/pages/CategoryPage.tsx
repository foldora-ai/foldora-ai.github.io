import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { categories } from "@/content/categories";
import { seoPages } from "@/content/seoPages";

const CategoryPage = () => {
  const { slug } = useParams();

  const category = categories[slug as keyof typeof categories];
  const isDownloadsCategory = slug === "downloads";

  if (!category) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">
              Category not found
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
        title={`${category.title} | Foldora`}
        description={category.description}
        canonical={
          isDownloadsCategory
            ? "https://cleanoraai.com/category/downloads/"
            : `https://foldoraai.com/category/${slug}/`
        }
        robots={isDownloadsCategory ? "noindex,follow" : undefined}
      />

      <Navbar />

      <main className="min-h-screen bg-background">

        <section className="border-b border-border">
          <div className="container max-w-5xl py-32">

            <div className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              Category
            </div>

            <h1 className="mt-6 text-6xl font-bold">
              {category.title}
            </h1>

            <p className="mt-6 text-xl text-muted-foreground">
              {category.description}
            </p>

          </div>
        </section>

        <section>
          <div className="container max-w-5xl py-20">

            <div className="grid gap-6 md:grid-cols-2">

              {seoPages
                .filter((page) => {
                  if (isDownloadsCategory) return page.topic === "downloads";
                  if (page.indexable === false) return false;
                  if (slug === "productivity") return page.topic === "workflows";
                  return page.topic === slug;
                })
                .map((post) => (
                  <a
                    key={post.route}
                    href={post.canonicalUrl ?? `/${post.route}/`}
                    className="rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
                  >
                    <h2 className="text-2xl font-bold">
                      {post.h1}
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                      {post.description}
                    </p>
                  </a>
                ))}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;
