import { motion } from "framer-motion";
import demoVideo from "../assets/foldora-demo.mp4";
import demoImg from "../assets/foldora-demo.png";

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


        {/* GIF Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 max-w-5xl"
        >

          <p className="text-center text-xs text-primary/80 mb-3">
            Real demo – no edits
          </p>

          <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              width="1200"
              height="700"
              className="w-full pointer-events-none"
            >
              <source src={demoVideo} type="video/mp4" />
            </video>
          </div>

        </motion.div>


        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground/90"
        >
          Messy folder → organized automatically in seconds.
        </motion.p>


        {/* Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-xl">
            <img
              src={demoImg}
              alt="Foldora interface preview"
              className="w-full"
              loading="lazy"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default DemoSection;