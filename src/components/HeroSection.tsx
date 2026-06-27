import { motion } from "framer-motion";
import InteractiveDemo from "./InteractiveDemo";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            AI File Organizer
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

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>100% offline (your files never leave your computer)</span>
              <span>Preview before applying changes</span>
              <span>CPU only (no GPU required)</span>
              <span>One-time purchase (no subscription)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-24"
        >
          <InteractiveDemo />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
