// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PRESETS, formatDate, generateNamingData, initNamingTool, sanitizeSegment } from "../../public/tools/file-naming-convention-generator/tool.js";

const options = (workflow: keyof typeof PRESETS, overrides = {}) => ({
  workflow,
  order: PRESETS[workflow].order,
  selected: PRESETS[workflow].selected,
  separator: "hyphen",
  dateFormat: "iso",
  fields: PRESETS[workflow].samples[0],
  extension: PRESETS[workflow].extension,
  ...overrides,
});
describe("file naming convention generator", () => {
  it.each(["invoices", "business", "personal", "projects"] as const)("generates three illustrative %s filenames", (workflow) => {
    const result = generateNamingData(options(workflow));
    expect(result.errors).toEqual([]);
    expect(result.examples).toHaveLength(3);
    expect(result.examples.every((name: string) => name.endsWith(`.${PRESETS[workflow].extension}`))).toBe(true);
  });

  it("respects field order, separator, and date format", () => {
    const result = generateNamingData(options("invoices", {
      order: ["description", "project", "date", "category", "sequence"],
      selected: ["description", "project", "date"],
      separator: "underscore",
      dateFormat: "compact",
    }));
    expect(result.pattern).toBe("{description}_{project}_{date}.{extension}");
    expect(result.examples[0]).toBe("April services_Acme_20260418.pdf");
    expect(formatDate("2026-04-18", "month")).toBe("2026-04");
    expect(generateNamingData(options("personal", { separator: "space" })).examples[0]).toContain("2026-04-18 Home Insurance policy");
  });

  it("cleans unsafe Windows text and blocks invalid or empty fields", () => {
    expect(sanitizeSegment("CON").value).toBe("CON-file");
    expect(sanitizeSegment("COM¹").value).toBe("COM¹-file");
    expect(sanitizeSegment('Client: Acme/West*').value).toBe("Client Acme West");
    const cleaned = generateNamingData(options("invoices", { fields: { ...PRESETS.invoices.samples[0], project: "CON" } }));
    expect(cleaned.examples[0]).toContain("CON-file");
    expect(cleaned.warnings.length).toBeGreaterThan(0);
    expect(generateNamingData(options("invoices", { fields: { ...PRESETS.invoices.samples[0], description: "   " } })).errors).toContain("Enter description.");
    expect(generateNamingData(options("invoices", { selected: [] })).errors).toContain("Select at least one filename component.");
    expect(generateNamingData(options("invoices", { extension: "pdf*" })).errors[0]).toMatch(/extension/);
    expect(formatDate("2026-02-30", "iso")).toBeNull();
  });
});

describe("browser controls", () => {
  beforeEach(() => {
    document.body.innerHTML = `<section id="naming-tool">
      <select id="workflow"><option value="invoices">Invoices</option><option value="business">Business</option><option value="personal">Personal</option><option value="projects">Projects</option></select>
      <ul id="component-list"></ul><select id="separator"><option value="hyphen">-</option><option value="underscore">_</option><option value="space"> </option></select>
      <select id="date-format"><option value="iso">ISO</option><option value="compact">Compact</option><option value="month">Month</option></select>
      <input id="date"><input id="category"><input id="project"><input id="description"><input id="sequence"><input id="extension">
      <code id="pattern-output"></code><ul id="example-output"></ul><button id="copy-pattern"></button><button id="copy-examples"></button><p id="tool-feedback"></p>
    </section>`;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
    initNamingTool();
  });

  it("switches presets and moves a selected component", () => {
    const workflow = document.querySelector<HTMLSelectElement>("#workflow")!;
    workflow.value = "projects";
    workflow.dispatchEvent(new Event("change"));
    expect(document.querySelector("#pattern-output")?.textContent).toMatch(/^\{project\}-\{date\}/);
    document.querySelector<HTMLButtonElement>('[aria-label="Move Date up"]')!.click();
    expect(document.querySelector("#pattern-output")?.textContent).toMatch(/^\{date\}-\{project\}/);
  });

  it("copies the pattern and examples, and disables copy for empty input", async () => {
    document.querySelector<HTMLButtonElement>("#copy-pattern")!.click();
    await vi.waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith("{date}-{project}-{category}-{description}-{sequence}.{extension}"));
    document.querySelector<HTMLButtonElement>("#copy-examples")!.click();
    await vi.waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("2026-04-18-Acme-Invoice")));
    const description = document.querySelector<HTMLInputElement>("#description")!;
    description.value = "";
    description.dispatchEvent(new Event("input"));
    expect(document.querySelector<HTMLButtonElement>("#copy-examples")!.disabled).toBe(true);
    expect(document.querySelector("#tool-feedback")?.textContent).toContain("Enter description.");
  });
});
