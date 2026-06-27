const articles = [
  {
    title: "AI file organizer",
    href: "/ai-file-organizer/",
    description: "When local AI organization is useful, where rules are better, and how previews reduce filing mistakes.",
  },
  {
    title: "Clean Downloads automatically",
    href: "/clean-downloads-folder/",
    description: "A practical workflow for documents, screenshots, installers, invoices, and temporary files.",
  },
  {
    title: "Rename files automatically",
    href: "/rename-files-automatically/",
    description: "How to turn unclear downloaded names into names that make sense in search results.",
  },
  {
    title: "Offline AI file organizer",
    href: "/blog/offline-ai-file-organizer/",
    description: "What local processing protects, what it does not, and what to verify before using any AI organizer.",
  },
  {
    title: "Foldora vs File Juggler",
    href: "/alternatives/file-juggler/",
    description: "Compare local AI suggestions with detailed Windows file automation rules.",
  },
  {
    title: "Install Foldora",
    href: "/docs/install/",
    description: "Installation expectations, first-folder guidance, and support links.",
  },
];

const ArticleSection = () => {
  return (
    <section className="border-t border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            Helpful file organization guides
          </h2>

          <p className="mt-4 text-muted-foreground md:text-lg">
            Start with the page that matches your folder, file type, or buying question.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {article.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
