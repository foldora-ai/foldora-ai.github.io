const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-sm font-bold text-primary-foreground">F</span>
            </div>
            Foldora AI
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Download</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Support</a>
          </nav>

          <a
            href="mailto:team.foldora@outlook.com"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
