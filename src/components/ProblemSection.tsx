import { motion } from "framer-motion";
import { FolderX, Clock, FileSearch } from "lucide-react";

const problems = [
  { icon: FolderX, title: "Mixed Downloads", desc: "Receipts, screenshots, PDFs, installers, and work files land in one place." },
  { icon: FileSearch, title: "Unclear filenames", desc: "Names like scan0001.pdf and final-final.docx stop making sense later." },
  { icon: Clock, title: "Repeated cleanup", desc: "Manual sorting takes attention every time a folder gets messy again." },
];

const ProblemSection = () => {
  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Your folder is not broken. It is doing too many jobs.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg">
            Foldora helps turn a file inbox into a reviewed structure you can browse and search.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-border bg-gradient-card p-8 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
