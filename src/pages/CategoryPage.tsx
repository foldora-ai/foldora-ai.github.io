import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { categories } from "@/content/categories";
import { blogPosts } from "@/content/blog";

const CategoryPage = () => {
  const { slug } = useParams();

  const category = categories[slug as keyof typeof categories];

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
        title={category.title}
        description={category.description}
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

              {category.posts.map((slug) => {
                const post =
                  blogPosts[slug as keyof typeof blogPosts];

                return (
                  <a
                    key={slug}
                    href={`/blog/${slug}`}
                    className="rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
                  >
                    <h2 className="text-2xl font-bold">
                      {post.title}
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                      {post.description}
                    </p>
                  </a>
                );
              })}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;