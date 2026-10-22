import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import SeoContentPage from "@/pages/SeoContentPage";

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
});
