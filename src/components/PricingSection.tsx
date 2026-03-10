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
            Pay once, use forever. No subscriptions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-14 max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card p-1">
            <div className="rounded-[1.25rem] bg-card p-10 text-center">
              <h3 className="text-xl font-semibold text-foreground">Foldora AI</h3>
              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-6xl font-extrabold text-foreground">$29</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">One-time purchase</p>

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

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
