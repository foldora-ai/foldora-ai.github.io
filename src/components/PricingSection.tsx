import { motion } from "framer-motion";
import { Check } from "lucide-react";

const perks = ["One-time purchase", "Free updates included", "Works offline", "Local AI processing", "No subscription"];

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Simple <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Ready to Transform Your Workflow?
          </p>          
          <p className="mt-4 text-muted-foreground md:text-lg">
            Pay once, use forever. No subscriptions.
          </p>
        </motion.div>
        <div className="text-center mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
            🚀 Launch price
          </span>

          <h3 className="text-2xl font-bold">
            $14.99 <span className="text-muted-foreground line-through ml-2">$39</span>
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Early adopter price — will increase soon
          </p>
        </div>        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-14.99 max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card p-1">
            <div className="rounded-[1.25rem] bg-card p-10 text-center">
              <h3 className="text-xl font-semibold text-foreground">Foldora AI</h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-6xl font-extrabold text-foreground">$14.99</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">One-time purchase - No subscription</p>

              <ul className="mt-8 space-y-3 text-left">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* <a
                href="#"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-primary py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 glow-shadow"
              >
                Download Foldora
              </a> */}

              <div className="mt-8 flex flex-col gap-3">

                <a
                  href="https://foldora.gumroad.com/l/foldora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-primary py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 glow-shadow"
                >
                  Buy with Card 
                </a>

                <a
                  href="https://www.paypal.com/ncp/payment/YDYSDRF5NRCUW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#FFC439] py-4 text-base font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Pay with PayPal
                </a>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
                  <span>✓ Runs fully offline</span>
                  <span>✓ One-time purchase</span>                  
                  <span>✓ Preview changes before applying</span>
                  <span>✓ Renames messy filenames automatically</span>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
