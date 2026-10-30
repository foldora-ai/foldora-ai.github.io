// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import RelatedProducts from "@/components/RelatedProducts";
import Footer from "@/components/Footer";
import { relatedProducts } from "@/config/relatedProducts";
import { product, site } from "@/config/product";

afterEach(cleanup);

describe("other Computora products", () => {
  it("shows only the other two products, once, in the footer", () => {
    render(<Footer />);
    const section = screen.getByRole("region", { name: "Other products by Computora" });
    expect(section.closest("footer")).toBeTruthy();
    expect(within(section).getAllByRole("article")).toHaveLength(2);
    expect(relatedProducts).toHaveLength(2);
    for (const item of relatedProducts) {
      expect(item.id).not.toBe(product.productName.toLowerCase());
      const link = screen.getByRole("link", { name: `Learn more about ${item.name}` });
      expect(link.getAttribute("href")).toBe(item.url);
      expect(document.querySelectorAll(`a[href="${item.url}"]`)).toHaveLength(1);
      const article = link.closest("article")!;
      expect(within(article).getByText(item.description)).toBeTruthy();
      const icon = article.querySelector("img")!;
      expect(icon.getAttribute("src")).toBe(item.icon);
      expect(icon.getAttribute("width")).toBe("32");
      expect(new URL(item.icon).origin).toBe(new URL(item.url).origin);
    }
    expect(section.textContent).not.toMatch(/\$|bundle|sav(e|ings)|discount|buy|purchase/i);
    expect(section.querySelector("[data-foldora-checkout], a[href*='gumroad']")).toBeNull();
  });

  it("keeps the same neutral links and descriptions in initial HTML", () => {
    render(<RelatedProducts />);
    const html = fs.readFileSync("index.html", "utf8");
    const markup = new DOMParser().parseFromString(html, "text/html");
    const section = markup.querySelector("[data-related-products]")!;
    expect(section).toBeTruthy();
    expect(section.querySelectorAll("article")).toHaveLength(2);
    for (const item of relatedProducts) {
      expect(section.textContent).toContain(item.name);
      expect(section.textContent).toContain(item.description);
      expect(section.querySelector(`a[href="${item.url}"]`)).toBeTruthy();
      expect(section.querySelector(`img[src="${item.icon}"]`)).toBeTruthy();
    }
    expect(section.querySelector(`a[href="${site.url}/"]`)).toBeNull();
    expect(html).not.toMatch(/Computora AI Complete Bundle|three_app_bundle|34\.99|4\.98/);
  });
});
