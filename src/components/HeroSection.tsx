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

          {/* Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            AI File Organizer
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Automatically organize
            <br />
            <span className="text-gradient">your messy folders</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Foldora AI analyzes and sorts your files into clean, structured folders in seconds.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4">

            <a
              href="https://foldora.gumroad.com/l/foldora"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 glow-shadow"
            >
              Download Foldora 
            </a>

            {/* Trust bullets */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>✓ Works fully offline</span>
              <span>✓ Preview before applying changes</span>
              <span>✓ CPU only (no GPU required)</span>
              <span>✓ One-time purchase</span>
            </div>

          </div>

        </motion.div>

        {/* Demo */}
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