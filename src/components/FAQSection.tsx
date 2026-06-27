import { motion } from "framer-motion";

import { homepageFaqs } from "@/content/homepageFaqs";

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container max-w-3xl">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {homepageFaqs.map((faq, i) => (
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
