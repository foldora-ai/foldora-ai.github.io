// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EXAMPLE_NAMES, EXAMPLE_RULES, initPlanner, mappingCsv, planFiles } from "../../public/tools/file-organization-planner/tool.js";

describe("filename-only organization planning", () => {
  it("groups file types, preserves each name, and flags missing extensions", () => {
    const result = planFiles("report.PDF\nphoto.jpg\narchive.zip\nREADME", "type");
    expect(result.rows.map((row: { folder: string }) => row.folder)).toEqual(["Documents/PDF", "Images", "Archives", "No extension"]);
    expect(result.rows[0].path).toBe("Documents/PDF/report.PDF");
    expect(result.rows[3].note).toMatch(/No extension/);
    expect(result.tree).toContain("  Documents/\n    PDF/");
  });

  it("requires one calendar-valid ISO date and does not guess", () => {
    const result = planFiles("invoice-2026-04-18.pdf\nscan001.pdf\nreport-2026-02-30.pdf\na-2026-03-01-b-2026-04-02.txt", "date");
    expect(result.rows.map((row: { folder: string }) => row.folder)).toEqual([
      "By date/2026/04", "Needs review/No clear date", "Needs review/No clear date", "Needs review/Multiple dates",
    ]);
  });

  it("uses first keyword rule, flags overlaps and duplicate destinations", () => {
    const result = planFiles("invoice-receipt.pdf\ninvoice-receipt.pdf\nunknown.txt", "keyword", EXAMPLE_RULES);
    expect(result.rows[0].folder).toBe("Finance/Invoices");
    expect(result.rows[0].note).toContain("first rule wins");
    expect(result.rows[1].note).toContain("Duplicate filename");
    expect(result.rows[1].note).toContain("Proposed destination duplicates");
    expect(result.rows[2].folder).toBe("Needs review/No keyword match");
    expect(planFiles("invoice-receipt.pdf", "keyword", [...EXAMPLE_RULES].reverse()).rows[0].folder).toBe("Finance/Receipts");
  });

  it("rejects empty and malformed input and unsafe rule folders", () => {
    expect(planFiles(" \n", "type").errors).toContain("Enter at least one valid filename.");
    const result = planFiles("../secret.pdf\nCON.txt\nfile?.pdf\nokay.pdf", "type");
    expect(result.rows).toHaveLength(1);
    expect(result.warnings).toHaveLength(3);
    expect(planFiles("a.txt", "keyword", [{ keyword: "a", folder: "../private" }]).errors[0]).toMatch(/safe relative folder/);
    expect(planFiles("a.txt", "keyword", [{ keyword: "", folder: "Work" }]).errors[0]).toMatch(/keyword/);
    expect(planFiles("a.txt", "type").rows).toHaveLength(1);
  });

  it("quotes CSV fields and neutralizes spreadsheet formulas", () => {
    const rows = planFiles("=SUM(1+1).pdf\nnormal,report.pdf", "type").rows;
    const csv = mappingCsv(rows);
    expect(csv).toContain('"\'=SUM(1+1).pdf"');
    expect(csv).toContain('"normal,report.pdf"');
    expect(csv).toContain('"Documents/PDF/normal,report.pdf"');
    expect(csv.split("\r\n")).toHaveLength(4);
  });
});

describe("planner controls", () => {
  beforeEach(() => {
    document.body.innerHTML = `<section id="organization-planner"><textarea id="filenames"></textarea><select id="mode"><option value="keyword">Keyword</option><option value="type">Type</option><option value="date">Date</option></select><div id="keyword-controls"><ol id="rule-list"></ol><button id="add-rule"></button></div><button id="reset-example"></button><pre id="plan-tree"></pre><table><tbody id="mapping-body"></tbody></table><p id="planner-feedback"></p><button id="copy-tree"></button><button id="download-csv"></button></section>`;
    document.querySelector<HTMLTextAreaElement>("#filenames")!.value = EXAMPLE_NAMES;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
    initPlanner();
  });

  it("renders untrusted text as text and supports keyboard-reachable rule controls", () => {
    const names = document.querySelector<HTMLTextAreaElement>("#filenames")!;
    names.value = "&lt;img src=x onerror=alert(1)&gt;.pdf\ninvoice.pdf";
    names.dispatchEvent(new Event("input"));
    expect(document.querySelector("#mapping-body img")).toBeNull();
    expect(document.querySelector("#mapping-body")?.textContent).toContain("&lt;img");
    const up = document.querySelector<HTMLButtonElement>('[aria-label="Move rule 2 up"]')!;
    up.click();
    expect(document.querySelector<HTMLInputElement>('[aria-label="Rule 1 keyword"]')?.value).toBe("receipt");
    expect(document.querySelectorAll("#rule-list button").length).toBeGreaterThan(0);
    expect(document.querySelectorAll("#rule-list input[aria-label]").length).toBeGreaterThan(0);
  });

  it("copies structure, exports a CSV, resets, and disables output on empty input", async () => {
    document.querySelector<HTMLButtonElement>("#copy-tree")!.click();
    await vi.waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Proposed structure/")));
    const create = vi.fn().mockReturnValue("blob:planner-test");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    document.querySelector<HTMLButtonElement>("#download-csv")!.click();
    expect(create).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector("#planner-feedback")?.textContent).toContain("CSV mapping downloaded");
    const names = document.querySelector<HTMLTextAreaElement>("#filenames")!;
    names.value = ""; names.dispatchEvent(new Event("input"));
    expect(document.querySelector<HTMLButtonElement>("#download-csv")!.disabled).toBe(true);
    document.querySelector<HTMLButtonElement>("#reset-example")!.click();
    expect(names.value).toBe(EXAMPLE_NAMES);
    expect(document.querySelector<HTMLButtonElement>("#download-csv")!.disabled).toBe(false);
    click.mockRestore();
  });
});
