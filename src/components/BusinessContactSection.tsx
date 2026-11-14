import { ArrowUpRight } from "lucide-react";

import { site } from "@/config/product";

const businessEmail = `mailto:${site.supportEmail}?subject=${encodeURIComponent("Foldora AI — Business Inquiry")}`;

const BusinessContactSection = () => (
  <section id="business" aria-labelledby="business-heading" className="border-y border-border/60 bg-secondary/30 py-16 sm:py-20">
    <div className="container grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">For companies and professional teams</p>
        <h2 id="business-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built for individuals. Available for businesses.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Organizing professional documents across your business? Foldora AI offers business licensing on request, including multi-computer inquiries. Contact the Computora AI team to discuss your requirements and a suitable arrangement directly.
        </p>
      </div>
      <a
        href={businessEmail}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Contact Us for Business <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default BusinessContactSection;
