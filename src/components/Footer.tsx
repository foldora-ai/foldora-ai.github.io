const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-foreground"
          >
            <img
              src="/favicon.ico"
              alt="Foldora AI"
              className="h-8 w-8 object-contain"
            />
            Foldora AI
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://foldora.gumroad.com/l/foldora"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Download
            </a>
            <a
              href="/#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="/docs/privacy/"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="/docs/troubleshooting/"
              className="transition-colors hover:text-foreground"
            >
              Support
            </a>
          </nav>

          <a
            href="mailto:team.foldora@outlook.com"
            className="text-sm text-muted-foreground"
          >
            team.foldora@outlook.com
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Foldora AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
