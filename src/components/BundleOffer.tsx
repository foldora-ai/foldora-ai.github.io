import { ArrowUpRight } from "lucide-react";
import { bundle, bundleCheckoutUrl } from "@/config/bundle";
import { checkoutTrackingAttributes } from "@/config/product";

const BundleOffer = () => (
  <aside aria-labelledby="bundle-offer-title" data-bundle-offer className="rounded-lg border border-primary/30 bg-card p-6">
    <h3 id="bundle-offer-title" className="text-lg font-semibold text-foreground">
      {bundle.name}
    </h3>
    <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <strong className="text-3xl font-bold text-foreground">{bundle.price.display}</strong>
      <span className="text-sm text-muted-foreground">USD, one payment</span>
    </p>
    <p className="mt-2 text-sm text-muted-foreground">Lifetime licenses for all three apps. No subscription.</p>
    <ul className="mt-4 space-y-3 text-sm">
      {bundle.products.map((item) => (
        <li key={item.id}>
          <span className="font-semibold text-foreground">{item.name}</span>
          <span className="block text-muted-foreground">{item.purpose}. {item.platforms}.</span>
        </li>
      ))}
    </ul>
    <p className="mt-4 text-sm font-medium text-foreground">
      Save {bundle.savings} vs. {bundle.individualTotal} bought separately.
    </p>
    <a
      href={bundleCheckoutUrl()}
      target="_blank"
      rel="noopener noreferrer"
      {...checkoutTrackingAttributes("gumroad", "pricing-bundle", "mixed_platform_bundle")}
      data-product-id={bundle.id}
      data-product-name={bundle.name}
      data-product-price={bundle.price.amount}
      data-product-currency={bundle.price.currency}
      data-source-product={bundle.sourceProduct}
      data-checkout-offer="bundle"
      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
      Get all three apps
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  </aside>
);

export default BundleOffer;
