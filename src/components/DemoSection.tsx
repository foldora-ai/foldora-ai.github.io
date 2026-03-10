import { motion } from "framer-motion";
import demoImg from "@/assets/foldora-demo.png"; // your combined screenshot

const DemoSection = () => {
  return (
    <section className="section-padding">
      <div className="container">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            From <span className="text-gradient">chaos</span> to clarity
          </h2>

          <p className="mt-4 text-muted-foreground md:text-lg">
            Foldora analyzes your messy folders and proposes a clean structure instantly.
          </p>
        </motion.div>

        {/* Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-2xl">
            <img
              src={demoImg}
              alt="Foldora AI organizing messy folders into a clean structure"
              className="w-full"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground/90"
        >
          Preview how Foldora reorganizes your folders before applying changes.
        </motion.p>

      </div>
    </section>
  );
};

export default DemoSection;