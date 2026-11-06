import fs from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import SeoContentPage from "@/pages/SeoContentPage";

vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
afterEach(cleanup);

function show(route: string) {
  render(<HelmetProvider><MemoryRouter initialEntries={[route]}><SeoContentPage /></MemoryRouter></HelmetProvider>);
}

describe("Windows organizer buying guide", () => {
  it("puts one five-tool selection table after the answer and before the retained demo", () => {
    show("/best-file-organizer-windows/");
    const table = screen.getByRole("table");
    const heading = screen.getByRole("heading", { name: "Direct answer" });
    const evidence = screen.getByRole("region", { name: "See the Foldora workflow, price, and limits before choosing" });
    expect(heading.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(table.compareDocumentPosition(evidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByRole("table")).toHaveLength(1);
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(5);
    for (const tool of ["Foldora", "AI File Sorter", "File Juggler", "DropIt", "Power Automate"]) {
      expect(rows.some(row => row.textContent?.includes(tool))).toBe(true);
    }
    for (const row of rows) expect(within(row).getAllByRole("link").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Publisher disclosure: Computora AI publishes Foldora/)).toBeVisible();
    expect(screen.getByRole("link", { name: "individual lifetime-license offer" })).toHaveAttribute("href", "/#pricing");
  });

  it("keeps the early selection table and citations in initial HTML without review-rating markup", () => {
    const document = new DOMParser().parseFromString(fs.readFileSync("public/best-file-organizer-windows/index.html", "utf8"), "text/html");
    const table = document.querySelector("table")!;
    const answer = document.querySelector("#direct-answer")!;
    const evidence = document.querySelector("#evidence-title")!;
    expect(answer.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(table.compareDocumentPosition(evidence) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelectorAll("table")).toHaveLength(1);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelector('a[href="https://filesorter.app/faq/"]')).toBeTruthy();
    expect(table.querySelector('a[href="https://www.filejuggler.com/documentation/conditions/"]')).toBeTruthy();
    const schema = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent!));
    expect(JSON.stringify(schema)).not.toMatch(/AggregateRating|reviewRating/);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://foldoraai.com/best-file-organizer-windows/");
  });

  it("preserves the later comparison placement on an existing workflow page", () => {
    show("/organize-files-windows/");
    const examples = screen.getByRole("heading", { name: "Use-case examples" });
    expect(examples.compareDocumentPosition(screen.getByRole("table")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
