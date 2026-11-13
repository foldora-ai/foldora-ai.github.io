import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const route = "tools/downloads-folder-cleanup-checklist";
const html = fs.readFileSync(path.resolve("public", route, "index.html"), "utf8");

describe("Downloads cleanup checklist", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = html;
    vi.resetModules();
  });

  async function loadTool() {
    await import("../../public/tools/downloads-folder-cleanup-checklist/tool.js");
  }

  it("tracks completion, persists it, and resets without any file action", async () => {
    await loadTool();
    const first = document.querySelector<HTMLInputElement>('[data-check="backup"]')!;
    const second = document.querySelector<HTMLInputElement>('[data-check="keep"]')!;
    first.click();
    second.click();
    expect(document.querySelector("#progress-text")?.textContent).toBe("2 of 12 checks complete");
    expect(document.querySelector<HTMLProgressElement>("#checklist-progress")?.value).toBe(2);
    expect(JSON.parse(localStorage.getItem("foldora-downloads-cleanup-checklist-v1") || "[]")).toEqual(["backup", "keep"]);

    document.querySelector<HTMLButtonElement>("#reset-checklist")!.click();
    expect(document.querySelector("#progress-text")?.textContent).toBe("0 of 12 checks complete");
    expect(document.querySelector<HTMLProgressElement>("#checklist-progress")?.value).toBe(0);
    expect(first.checked).toBe(false);
    expect(second.checked).toBe(false);
    expect(JSON.parse(localStorage.getItem("foldora-downloads-cleanup-checklist-v1") || "[]")).toEqual([]);
  });

  it("has labeled keyboard controls, mobile rules, and crawlable answers", async () => {
    await loadTool();
    const checks = [...document.querySelectorAll<HTMLInputElement>('#cleanup-checklist input[type="checkbox"]')];
    expect(checks).toHaveLength(12);
    expect(checks.every((check) => check.closest("label")?.textContent?.trim())).toBe(true);
    expect(document.querySelector("#reset-checklist")?.getAttribute("type")).toBe("button");
    expect(document.querySelector("#progress-text")?.getAttribute("aria-live")).toBe("polite");
    expect(html).toContain("@media(max-width:700px)");
    expect(html).toContain("How should I organize my Windows Downloads folder?");
    expect(html).toContain("When is a reviewed local AI file organizer useful?");
    expect(html).toContain('rel="canonical" href="https://foldoraai.com/tools/downloads-folder-cleanup-checklist/"');
    expect(html).not.toMatch(/<input[^>]+type="file"/);
  });
});
