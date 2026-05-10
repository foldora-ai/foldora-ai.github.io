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
    <section className="border-t border-border py-24">
      <div className="container">

        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-4xl font-bold md:text-5xl">
            Popular File Organization Guides
          </h2>

          <p className="mt-6 text-xl text-muted-foreground">
            Learn how to organize downloads folders, PDFs, screenshots,
            desktop clutter, and work files automatically using AI.
          </p>

        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <a
            href="/blog/organize-downloads-folder-automatically"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              How To Organize Downloads Folder Automatically
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Automatically clean and organize messy Downloads folders using local AI.
            </p>
          </a>

          <a
            href="/blog/ai-file-organizer-for-windows"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              Best AI File Organizer For Windows
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Discover AI-powered file organization workflows for Windows users.
            </p>
          </a>

          <a
            href="/alternatives/hazel"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              Foldora vs Hazel
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Compare Foldora and Hazel for automatic file organization workflows.
            </p>
          </a>

          <a
            href="/features/offline-processing"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              Offline AI Processing
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Learn how Foldora processes files locally without cloud uploads.
            </p>
          </a>

          <a
            href="/docs/install"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              Foldora Installation Guide
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Install Foldora and start organizing files automatically in minutes.
            </p>
          </a>

          <a
            href="/category/productivity"
            className="rounded-3xl border border-border bg-card p-8 transition-colors hover:bg-secondary"
          >
            <h3 className="text-2xl font-bold">
              Productivity File Organization
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Improve productivity using structured AI-powered file organization.
            </p>
          </a>

        </div>

      </div>
    </section>
  );
};

export default ArticleSection;