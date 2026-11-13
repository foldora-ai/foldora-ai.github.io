import fs from "node:fs";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import DocsPage from "@/pages/DocsPage";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({ default: () => null }));
afterEach(cleanup);

describe("how-it-works evidence", () => {
  it("shows six verified steps and labels the real screenshot as a proposal in the app page", () => {
    render(<MemoryRouter initialEntries={["/docs/how-it-works/"]}><Routes><Route path="/docs/:slug/" element={<DocsPage />} /></Routes></MemoryRouter>);
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps).toHaveLength(6);
    expect(screen.getByRole("heading", { name: "Review Current Structure and Proposed Structure" })).toBeVisible();
    expect(screen.getByRole("img", { name: /Real Foldora review screen/ })).toHaveAttribute("src", "/evidence/foldora-demo.png");
    expect(screen.getByText(/this capture does not show approved moves or the final folder/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Foldora's product details" })).toHaveAttribute("href", "/ai-file-organizer/");
  });

  it("renders the evidence and limits in initial HTML with a valid image and canonical", () => {
    const html = fs.readFileSync("public/docs/how-it-works/index.html", "utf8");
    const document = new DOMParser().parseFromString(html, "text/html");
    const heading = [...document.querySelectorAll("h2")].find((item) => item.textContent === "Six steps from folder to reviewed result")!;
    expect(heading.nextElementSibling?.querySelectorAll("li")).toHaveLength(6);
    const img = document.querySelector('img[src="/evidence/foldora-demo.png"]')!;
    expect(img.getAttribute("alt")).toContain("before files are changed");
    expect(img.getAttribute("width")).toBe("1902");
    expect(img.getAttribute("height")).toBe("918");
    const bytes = fs.readFileSync("public/evidence/foldora-demo.png");
    expect(bytes.readUInt32BE(16)).toBe(1902);
    expect(bytes.readUInt32BE(20)).toBe(918);
    expect(html).toContain("What the preview cannot guarantee");
    expect(html).toContain("first-page local OCR attempt");
    expect(html).not.toContain("before-messy.png");
    expect(html).not.toContain("after-clean.png");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://foldoraai.com/docs/how-it-works/");
  });
});
