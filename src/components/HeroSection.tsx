import { motion } from "framer-motion";
import { Check, Eye, ShieldCheck, WifiOff } from "lucide-react";

import demoImg from "@/assets/foldora-demo.png";
import { checkoutTrackingAttributes, checkoutUrl, product } from "@/config/product";
import { trackEvent } from "@/lib/analytics";

const proofItems = [
  { icon: WifiOff, label: "Runs locally" },
  { icon: Eye, label: "Review every change" },
  { icon: ShieldCheck, label: "No cloud upload" },
];

const HeroSection = () => {
  const checkout = checkoutUrl("homepage", "hero-primary");

  return (
    <section className="relative overflow-hidden border-b border-border/60 pt-24 md:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent 72%)",
        }}
      />

      <div className="container relative pb-12 md:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-w-0 text-center lg:text-left"
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 sm:text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
              <span>Private AI file organizer for Windows and Mac</span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-normal text-foreground sm:text-5xl md:text-6xl">
              Turn messy folders into files you can find
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Foldora proposes organized folders and clearer filenames. Review the plan, then apply only the changes you approve.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 lg:items-start">
              <a
                href={checkout}
                target="_blank"
                rel="noopener noreferrer"
                {...checkoutTrackingAttributes("gumroad", "hero-primary", "windows_macos")}
                onClick={() => {
                  trackEvent("platform_download_cta_clicked", {
                    platform: "windows_macos",
                    location: "hero",
                  });
                }}
                className="inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-lg bg-gradient-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background glow-shadow sm:w-auto sm:text-lg"
              >
                Buy Foldora - {product.price.display}
              </a>
              <p className="text-sm text-secondary-foreground">
                One-time purchase. Windows 10/11 and macOS Intel or Apple Silicon.
              </p>
              <p className="text-xs text-muted-foreground">
                Secure Gumroad checkout. PayPal is also available below.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3 lg:justify-start">
              {proofItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-secondary-foreground">
                  <item.icon className="h-4 w-4 shrink-0 text-primary-readable" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.figure
            id="demo"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="min-w-0"
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
              <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-3 text-xs text-muted-foreground">
                <span>Real Foldora preview</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-200">
                  <Check className="h-3.5 w-3.5" /> Review before apply
                </span>
              </div>
              <img
                src={demoImg}
                alt="Foldora desktop application comparing the current file structure with a proposed organized structure"
                width="1902"
                height="918"
                fetchPriority="high"
                className="aspect-[1902/918] w-full bg-background object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted-foreground lg:text-left">
              Current files on the left, Foldora's proposed structure on the right. Nothing changes until you approve it.
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
