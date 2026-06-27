import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, Eye, ShieldCheck, WifiOff } from "lucide-react";

import InteractiveDemo from "./InteractiveDemo";
import { checkoutUrl, product } from "@/config/product";
import { trackEvent } from "@/lib/analytics";

const trustItems = [
  { icon: WifiOff, label: "Runs locally" },
  { icon: Eye, label: "Preview first" },
  { icon: ShieldCheck, label: "No cloud upload" },
  { icon: CheckCircle2, label: "One-time purchase" },
];

const HeroSection = () => {
  const checkout = checkoutUrl("homepage", "hero-primary");

  return (
    <section className="relative overflow-hidden border-b border-border/60 pt-28 md:pt-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent 72%)",
        }}
      />

      <div className="container relative pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Local AI file organizer for Windows and macOS
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Clean and organize
            <br />
            <span className="text-gradient">your messy files automatically</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Foldora AI analyzes and sorts your files into clean, structured folders in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://foldora.gumroad.com/l/foldora"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 glow-shadow"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2 3l9-1v10H2V3zm11-1l9-1v11h-9V2zM2 13h9v10l-9-1V13zm11 0h9v11l-9-1V13z" />
                </svg>
                Download for Windows
              </a>

              <a
                href="https://foldora.gumroad.com/l/foldora"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-[#111] to-[#222] px-8 py-4 text-lg font-semibold text-white transition-all hover:border-white/20 hover:bg-[#1a1a1a]"
              >
                <span aria-hidden="true">🍎</span>
                Download for macOS
              </a>
            </div>

            <div className="mt-4 text-sm text-white/70">
              Windows 10/11 | macOS Intel and Apple Silicon
            </div>

            <div className="mt-3 text-sm text-white/60">
              Secure checkout - PayPal accepted - One-time purchase
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {product.price.display} one-time purchase. Windows 10/11 and macOS Intel or Apple Silicon.
          </p>

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-2 gap-2 text-left sm:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="flex min-h-11 items-center gap-2 rounded-md border border-border/70 bg-background/70 px-3 text-sm text-secondary-foreground backdrop-blur"
              >
                <item.icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-12 max-w-6xl md:mt-16"
        >
          <InteractiveDemo />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
