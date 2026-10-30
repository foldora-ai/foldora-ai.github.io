import fs from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import SeoContentPage from "@/pages/SeoContentPage";
import { seoPagesByRoute } from "@/content/seoPages";

vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));

function renderPage(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <SeoContentPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("SEO landing purchase action", () => {
  it("shows the price and supported systems beside the AI organizer page introduction", () => {
    renderPage("/ai-file-organizer/");

    const buyLink = screen.getByRole("link", { name: "Get Foldora - $14.99" });
    const destination = new URL(buyLink.getAttribute("href")!);
    expect(destination.hostname).toBe("computora.gumroad.com");
    expect(destination.pathname).toBe("/l/foldora");
    expect(destination.searchParams.get("utm_campaign")).toBe("seo-page");
    expect(destination.searchParams.get("utm_content")).toBe("ai-file-organizer-hero");
    expect(buyLink).toHaveAttribute("data-foldora-checkout", "true");
    expect(buyLink).toHaveAttribute("data-checkout-provider", "gumroad");
    expect(buyLink).toHaveAttribute("data-checkout-location", "ai-file-organizer-hero");
    expect(buyLink).toHaveAttribute("target", "_blank");
    expect(
      screen.getByText(/One-time purchase\. Windows 10\/11 and macOS on Intel or Apple Silicon\./),
    ).toBeInTheDocument();
  });

  it("does not add the landing-page purchase action to other SEO pages", () => {
    renderPage("/organize-files-windows/");

    expect(screen.queryByRole("link", { name: "Get Foldora - $14.99" })).not.toBeInTheDocument();
  });

  it("explains PDF sampling limits in the page, initial HTML, and matching FAQ schema", () => {
    renderPage("/ai-file-organizer/");
    const question = "Does Foldora read every page of a PDF, including scans?";
    const faq = seoPagesByRoute["ai-file-organizer"].faqs.find((item) => item.question === question)!;
    const article = screen.getByRole("heading", { name: question }).closest("article")!;
    expect(within(article).getByText(faq.answer)).toBeVisible();
    expect(faq.answer).toContain("first three pages");
    expect(faq.answer).toContain("over 8 MiB");
    expect(faq.answer).toContain("does not OCR an entire scanned document");

    const html = fs.readFileSync("public/ai-file-organizer/index.html", "utf8");
    const document = new DOMParser().parseFromString(html, "text/html");
    const visibleFaq = [...document.querySelectorAll("article.faq")].find((item) => item.querySelector("h3")?.textContent === question);
    expect(visibleFaq?.querySelector("p")?.textContent).toBe(faq.answer);
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map((item) => JSON.parse(item.textContent!));
    const faqSchema = schemas.flatMap((item) => item["@graph"] ?? [item]).find((item) => item["@type"] === "FAQPage");
    expect(faqSchema.mainEntity.find((item: { name: string }) => item.name === question).acceptedAnswer.text).toBe(faq.answer);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://foldoraai.com/ai-file-organizer/");
    const purchase = document.querySelector('[data-checkout-location="ai-file-organizer-hero"]')!;
    expect(new URL(purchase.getAttribute("href")!).pathname).toBe("/l/foldora");
  });
});
