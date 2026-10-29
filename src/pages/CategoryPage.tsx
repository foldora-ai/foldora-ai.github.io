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

      <main className="content-page-main">

        <section className="content-hero">
          <div className="content-hero-inner">

            <div className="content-eyebrow">
              Category
            </div>

            <h1 className="content-title">
              {category.title}
            </h1>

            <p className="content-intro">
              {category.description}
            </p>

          </div>
        </section>

        <section>
          <div className="content-body max-w-5xl">

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
                    className="content-card transition-colors hover:border-primary/40"
                  >
                    <h2 className="text-xl font-bold md:text-2xl">
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
