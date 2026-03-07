import { motion } from "framer-motion";
import heroMockup from "@/assets/hero-mockup.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="container relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Now available for Windows
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Automatically organize your{" "}
            <span className="text-gradient">messy folders.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Foldora AI analyzes and sorts your files into clean, structured folders in seconds.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 glow-shadow"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5L7.5 3v18L3 18.5V5.5zm4.5-2.5l5 2.5V15l-5-2.5V3zm5 2.5l5-2.5v15l-5 2.5V5.5zm5-2.5L21 5.5v13L17.5 21V3z" />
              </svg>
              Download for Windows
            </a>
            <p className="text-sm text-muted-foreground">
              Private • Local AI • One-time purchase
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-24"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/5">
            <img
              src={heroMockup}
              alt="Foldora AI application interface showing organized files"
              className="w-full"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
