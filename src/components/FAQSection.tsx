import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does Foldora organize my files?",
    a: "Foldora analyzes your files locally and suggests a clean folder structure based on file type, name, and context using AI."
  },
  {
    q: "Does Foldora upload my files to the cloud?",
    a: "No. Everything runs locally on your computer. Your files never leave your device."
  },

  {
    q: "What folders can Foldora organize?",
    a: "Any folder: Downloads, Documents, Desktop or custom directories."
  },
  {
    q: "Can Foldora rename files automatically?",

    a: "Yes. Foldora can generate meaningful filenames based on the content of your files and their context."
  },
  
  {
    q: "Does Foldora require a GPU?",
    a: "No. Foldora runs entirely on CPU."
  },
  {
    q: "Is it a subscription?",
    a: "No. Foldora is a one-time purchase."
  }
];

const FAQSection = () => {
  return (
    <section className="section-padding">
      <div className="container max-w-3xl">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-semibold text-lg">{faq.q}</h3>
              <p className="text-muted-foreground mt-2">{faq.a}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;