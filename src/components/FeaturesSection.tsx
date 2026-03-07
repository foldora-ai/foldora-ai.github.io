import { motion } from "framer-motion";
import { Brain, Eye, Undo2, WifiOff, Zap } from "lucide-react";

const features = [
  { icon: Brain, title: "AI File Organization", desc: "Automatically categorizes files into meaningful folders." },
  { icon: Eye, title: "Preview Before Changes", desc: "See the folder structure before applying changes." },
  { icon: Undo2, title: "Undo Anytime", desc: "Instantly revert if you want your original structure back." },
  { icon: WifiOff, title: "Works Offline", desc: "All processing happens locally on your computer." },
  { icon: Zap, title: "Fast Processing", desc: "Organize hundreds of files in seconds." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Packed with <span className="text-gradient">features</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
            Everything you need to keep your files perfectly organized.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-gradient-card p-7 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
