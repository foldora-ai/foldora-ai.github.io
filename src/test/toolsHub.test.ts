import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

describe("free tools hub output", () => {
  it("renders four working resource paths and accurate limits in initial HTML", () => {
    const html = fs.readFileSync(path.resolve("dist/tools/index.html"), "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const targets = [
      "/tools/file-organization-planner/",
      "/downloads/folder-structure-template.zip",
      "/tools/file-naming-convention-generator/",
      "/tools/downloads-folder-cleanup-checklist/",
    ];
    for (const href of targets) {
      expect(document.querySelector(`main a[href="${href}"]`)).not.toBeNull();
      const relative = href.replace(/^\//, "");
      expect(fs.existsSync(path.resolve("dist", relative, href.endsWith(".zip") ? "" : "index.html"))).toBe(true);
    }
    expect(document.querySelectorAll("main .tool-card")).toHaveLength(4);
    expect(document.querySelector("link[rel=canonical]")?.getAttribute("href")).toBe("https://foldoraai.com/tools/");
    expect(document.querySelector("main")?.textContent).toContain("does not scan, upload, move, delete, or detect duplicate files");
    expect(document.querySelector("main")?.textContent).toContain("does not enforce its generated pattern");
    expect(document.querySelector('a[data-free-tool-product="tools-hub"]')).not.toBeNull();
    expect(html).toContain("@media(max-width:700px)");
    expect(document.querySelectorAll('script[src="/checkout-tracking.js"]')).toHaveLength(1);
    dom.window.close();
  });
});
