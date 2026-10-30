import { product, site } from "./product";

const includedProducts = [
  { id: "foldora", name: "Foldora AI", purpose: "Files and renaming", platforms: "Windows 10/11 and macOS", priceCents: 1499 },
  { id: "cleanora", name: "Cleanora AI", purpose: "Folder cleanup", platforms: "Windows 10/11 only", priceCents: 999 },
  { id: "galoria", name: "Galoria AI", purpose: "Photo organization", platforms: "Windows 10/11 only", priceCents: 1499 },
] as const;

// Verified against the published Gumroad bundle and individual offers on 2026-10-30.
const priceCents = 3499;
const individualTotalCents = includedProducts.reduce((total, item) => total + item.priceCents, 0);
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const bundle = {
  id: "computoraai",
  name: "Computora AI Complete Bundle",
  checkoutUrl: "https://computora.gumroad.com/l/computoraai",
  sourceProduct: product.productName.toLowerCase(),
  price: { amount: priceCents / 100, display: dollars(priceCents), currency: "USD" },
  individualTotal: dollars(individualTotalCents),
  savings: dollars(individualTotalCents - priceCents),
  products: includedProducts,
};

export function bundleCheckoutUrl(): string {
  const destination = new URL(bundle.checkoutUrl);
  destination.searchParams.set("utm_source", new URL(site.url).hostname);
  destination.searchParams.set("utm_medium", "referral");
  destination.searchParams.set("utm_campaign", "three_app_bundle");
  destination.searchParams.set("utm_content", "pricing_bundle");
  destination.searchParams.set("source_product", bundle.sourceProduct);
  return destination.toString();
}
