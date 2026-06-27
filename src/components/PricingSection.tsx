import { Check, CreditCard, Mail, ShieldCheck } from "lucide-react";

import { checkoutUrl, product, site } from "@/config/product";
import { trackEvent } from "@/lib/analytics";

const included = [
  "Foldora desktop app for supported Windows and macOS systems",
  "Local AI organization workflow",
  "Smart renaming suggestions",
  "Preview before applying file moves or filename changes",
  "Access through the checkout provider after purchase",
];

const comparisons = [
  {
    title: "Foldora vs manual sorting",
    bestFor: "Messy folders with repeated cleanup work",
    difference:
      "Foldora proposes folders and filenames in a batch, then you review the plan before applying changes.",
  },
  {
    title: "Foldora vs rules-based tools",
    bestFor: "Files with inconsistent names or mixed document types",
    difference:
      "Rules are useful for exact patterns. Foldora is useful when you want local AI suggestions without building every rule yourself.",
  },
  {
    title: "Foldora vs cloud AI organizers",
    bestFor: "Private documents, invoices, work files, and local folders",
    difference:
      "Foldora is built around local analysis, so files do not need to be uploaded to a cloud organizer.",
  },
];

const PricingSection = () => {
  const cardCheckout = checkoutUrl("homepage", "pricing-card");

  return (
    <section id="pricing" className="section-padding border-t border-border">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Simple <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Pay once, use forever. No subscriptions.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-primary/30 bg-card p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-primary">
              Launch price
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-extrabold text-foreground">
                {product.price.display}
              </span>
              <span className="pb-2 text-2xl font-bold text-muted-foreground line-through">
                $49
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Early adopter price - will increase soon
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={cardCheckout}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("buy_button_clicked", {
                    provider: "gumroad",
                    location: "pricing",
                  });
                  trackEvent("checkout_link_clicked", {
                    provider: "gumroad",
                    location: "pricing",
                  });
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                <CreditCard className="h-5 w-5" />
                Buy with card
              </a>

              <a
                href={product.checkout.paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("buy_button_clicked", {
                    provider: "paypal",
                    location: "pricing",
                  });
                  trackEvent("checkout_link_clicked", {
                    provider: "paypal",
                    location: "pricing",
                  });
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#FFC439] px-6 py-3 text-base font-semibold text-black transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                Pay with PayPal
              </a>
            </div>

            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Checkout happens through the linked payment providers. Foldora does not need your file names or file contents for checkout.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold text-foreground">What buyers receive</h3>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">Supported systems</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {product.platforms.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">After purchase</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Complete checkout through the selected provider.</li>
                  <li>Download and install Foldora on a supported Windows or macOS device.</li>
                  <li>Start with a small folder, review suggestions, then apply approved changes.</li>
                </ol>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold text-foreground">
                How Foldora compares
              </h3>
              <div className="mt-4 grid gap-3">
                {comparisons.map((comparison) => (
                  <div
                    key={comparison.title}
                    className="rounded-lg border border-border/80 bg-secondary/40 p-4"
                  >
                    <h4 className="font-semibold text-foreground">
                      {comparison.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-secondary-foreground">
                        Best for:
                      </span>{" "}
                      {comparison.bestFor}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {comparison.difference}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">Support and purchase issues</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Need installation help or have a checkout issue? Contact Foldora support, or review the checkout provider purchase-support page.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${site.supportEmail}`}
                  onClick={() =>
                    trackEvent("contact_support_clicked", {
                      location: "pricing",
                    })
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                >
                  <Mail className="h-4 w-4" />
                  Contact support
                </a>
                <a
                  href={product.refundPolicy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                >
                  {product.refundPolicy.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
