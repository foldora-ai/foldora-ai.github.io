// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BundleOffer from "@/components/BundleOffer";
import { bundle, bundleCheckoutUrl } from "@/config/bundle";
import { product, site } from "@/config/product";


afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete window.gtag;
});

describe("pricing bundle offer", () => {
  it("shows verified pricing and product-specific platforms", () => {
    render(<BundleOffer />);
    expect(screen.getByRole("heading", { name: bundle.name })).toBeTruthy();
    expect(screen.getByText("$34.99")).toBeTruthy();
    expect(screen.getByText("Lifetime licenses for all three apps. No subscription.")).toBeTruthy();
    expect(screen.getByText("Save $4.98 vs. $39.97 bought separately.")).toBeTruthy();
    expect(screen.getByText("Files and renaming. Windows 10/11 and macOS.")).toBeTruthy();
    expect(screen.getByText("Folder cleanup. Windows 10/11 only.")).toBeTruthy();
    expect(screen.getByText("Photo organization. Windows 10/11 only.")).toBeTruthy();
    expect(bundle.products.find((item) => item.id === bundle.sourceProduct)?.priceCents).toBe(Math.round(product.price.amount * 100));
  });

  it("links directly to the existing checkout with source attribution", () => {
    render(<BundleOffer />);
    const link = screen.getByRole("link", { name: "Get all three apps" });
    const destination = new URL(link.getAttribute("href")!);
    expect(destination.origin + destination.pathname).toBe("https://computora.gumroad.com/l/computoraai");
    expect(destination.searchParams.get("utm_source")).toBe(new URL(site.url).hostname);
    expect(destination.searchParams.get("source_product")).toBe(product.productName.toLowerCase());
    expect(destination.href).toBe(bundleCheckoutUrl());
    expect(link.getAttribute("data-product-id")).toBe("computoraai");
    expect(link.getAttribute("data-source-product")).toBe("foldora");
    expect(link.getAttribute("data-checkout-offer")).toBe("bundle");
  });
});
