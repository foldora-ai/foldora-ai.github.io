import { motion } from "framer-motion";
import { Cpu, Eye, FolderOpen, Sparkles } from "lucide-react";

const steps = [
  { icon: FolderOpen, step: "01", title: "Select a Folder", desc: "Choose any folder on your computer you want organized." },
  { icon: Cpu, step: "02", title: "Analyze Locally", desc: "Foldora reviews filenames and supported content on your device." },
  { icon: Eye, step: "03", title: "Preview Suggestions", desc: "Inspect proposed folders and filenames before anything changes." },
  { icon: Sparkles, step: "04", title: "Apply Approved Changes", desc: "Move and rename only after the structure fits how you search for files." },
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
            A controlled workflow for organizing files without handing them to a cloud organizer.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="mx-auto mt-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
