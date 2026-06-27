import { checkoutUrl, site } from "@/config/product";
import { trackEvent } from "@/lib/analytics";

const Footer = () => {
  const checkout = checkoutUrl("site-footer", "footer-download");

  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <a href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <img src="/favicon.ico" alt="" className="h-8 w-8 object-contain" />
            Foldora AI
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground" aria-label="Footer navigation">
            <a
              href={checkout}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("platform_download_cta_clicked", {
                  platform: "windows",
                  location: "footer",
                });
                trackEvent("checkout_link_clicked", {
                  provider: "gumroad",
                  location: "footer",
                });
              }}
              className="transition-colors hover:text-foreground"
            >
              Download for Windows
            </a>
            <a href="/#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="/docs/install/" className="transition-colors hover:text-foreground">
              Install
            </a>
            <a href="/docs/privacy/" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="/docs/troubleshooting/" className="transition-colors hover:text-foreground">
              Support
            </a>
          </nav>

          <a
            href={`mailto:${site.supportEmail}`}
            onClick={() =>
              trackEvent("contact_support_clicked", {
                location: "footer",
              })
            }
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {site.supportEmail}
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Copyright {new Date().getFullYear()} Foldora AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
