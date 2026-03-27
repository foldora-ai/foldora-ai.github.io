import { motion } from "framer-motion";
import { FolderOpen, Cpu, Sparkles } from "lucide-react";

const steps = [
  { icon: FolderOpen, step: "01", title: "Select a Folder", desc: "Choose any folder on your computer you want organized." },
  { icon: Cpu, step: "02", title: "AI Analyzes Files", desc: "Foldora scans file types, names, and contents using local AI." },
  { icon: Sparkles, step: "03", title: "Auto-Organized", desc: "Your files are sorted into clean, structured folders instantly." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
            Three simple steps to a perfectly organized file system.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative rounded-2xl border border-border bg-gradient-card p-8 text-center"
            >
              <span className="text-5xl font-extrabold text-gradient opacity-30">{s.step}</span>
              <div className="mx-auto mt-4 flex h-14.99 w-14.99 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
