import { useParams } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

import { comparisons } from "@/content/comparison";

const ComparisonPage = () => {
  const { slug } = useParams();

  const post = comparisons[slug as keyof typeof comparisons];

  if (!post) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-background">
          <div className="container py-32">
            <h1 className="text-5xl font-bold">
              Comparison not found
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
              Comparison
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

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

export default ComparisonPage;