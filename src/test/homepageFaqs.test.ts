import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { homepageFaqs } from "../content/homepageFaqs";

describe("crawlable homepage answers", () => {
  it("provides the interactive FAQ answers and matching schema without JavaScript", () => {
    const dom = new JSDOM(fs.readFileSync(path.resolve("index.html"), "utf8"));
    const document = dom.window.document;
    const section = document.querySelector("#faq");
    expect(document.querySelectorAll("#faq")).toHaveLength(1);
    const schemas = (Array.from(document.querySelectorAll('script[type="application/ld+json"]')) as Element[])
      .map(script => JSON.parse(script.textContent || "{}"));
    const faq = schemas.find(schema => schema["@type"] === "FAQPage");
    expect(faq.mainEntity).toHaveLength(homepageFaqs.length);
    homepageFaqs.forEach(({ q, a }, index) => {
      expect(section?.textContent).toContain(q);
      expect(section?.textContent).toContain(a);
      expect(faq.mainEntity[index]).toMatchObject({ name: q, acceptedAnswer: { text: a } });
    });
    dom.window.close();
  });
});
