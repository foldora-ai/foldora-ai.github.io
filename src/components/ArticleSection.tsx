const articles = [
  {
    title: "How To Organize Downloads Folder Automatically",
    href: "/blog/organize-downloads-folder-automatically",
  },

  {
    title: "Best AI File Organizer For Windows",
    href: "/blog/ai-file-organizer-for-windows",
  },

  {
    title: "Foldora vs Hazel",
    href: "/alternatives/hazel",
  },
];

const ArticleSection = () => {
  return (
    <section className="section-padding border-t border-border">

      <div className="container max-w-5xl">

        <div className="text-center">

          <h2 className="text-5xl font-bold">
            Latest Articles
          </h2>

          <p className="mt-4 text-muted-foreground">
            Learn how to organize files automatically using AI.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="text-xl font-semibold">
                {article.title}
              </h3>
            </a>
          ))}

        </div>

      </div>

    </section>
  );
};

export default ArticleSection;