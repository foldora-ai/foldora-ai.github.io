import fs from "node:fs";
import path from "node:path";

import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const trackingScript = fs.readFileSync(
  path.resolve("public", "checkout-tracking.js"),
  "utf8",
);

function checkoutMarkup() {
  return `<!doctype html><html><body>
    <a
      href="https://computora.gumroad.com/l/foldora?utm_source=foldoraai.com&amp;utm_medium=referral&amp;utm_campaign=homepage&amp;utm_content=hero"
      target="_blank"
      data-foldora-checkout="true"
      data-checkout-provider="gumroad"
      data-checkout-location="hero-windows"
      data-product-id="foldora"
      data-product-name="Foldora"
      data-product-price="14.99"
      data-product-currency="USD"
      data-product-variant="windows"
    >Buy Foldora</a>
  </body></html>`;
}

function loadTracker(
  url: string,
  referrer?: string,
  privacyStorageDisabled = false,
) {
  const dom = new JSDOM(checkoutMarkup(), {
    url,
    referrer,
    runScripts: "outside-only",
  });
  if (privacyStorageDisabled) {
    Object.defineProperty(dom.window.navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    });
  }
  Object.defineProperty(dom.window, "FoldoraPrivacy", {
    value: {
      optionalServicesAllowed: () => !privacyStorageDisabled,
    },
    configurable: true,
  });
  const gtag = vi.fn();
  Object.defineProperty(dom.window, "gtag", { value: gtag, configurable: true });
  dom.window.eval(trackingScript);
  const link = dom.window.document.querySelector<HTMLAnchorElement>(
    "[data-foldora-checkout]",
  )!;
  return { dom, gtag, link };
}

describe("checkout acquisition tracking", () => {
  it("sends one GA4 begin_checkout event with product and destination data", () => {
    const { dom, gtag, link } = loadTracker("https://foldoraai.com/");
    link.addEventListener("click", (event) => event.preventDefault());

    link.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    link.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag.mock.calls[0][0]).toBe("event");
    expect(gtag.mock.calls[0][1]).toBe("begin_checkout");
    expect(gtag.mock.calls[0][2]).toMatchObject({
      currency: "USD",
      value: 14.99,
      checkout_provider: "gumroad",
      checkout_location: "hero-windows",
      campaign_source: "foldoraai.com",
      campaign_medium: "referral",
      campaign_name: "homepage",
      campaign_content: "hero",
      items: [
        {
          item_id: "foldora",
          item_name: "Foldora",
          item_variant: "windows",
          price: 14.99,
          quantity: 1,
        },
      ],
    });
    expect(gtag.mock.calls.some((call) => call[1] === "purchase")).toBe(false);
    dom.window.close();
  });

  it("preserves an incoming UTM campaign and excludes unrelated personal data", () => {
    const { dom, link } = loadTracker(
      "https://foldoraai.com/?utm_source=newsletter&utm_medium=email&utm_campaign=october&utm_id=launch-01&utm_term=file-organizer&utm_content=button-a&email=person%40example.com",
    );
    const destination = new URL(link.href);

    expect(destination.hostname).toBe("computora.gumroad.com");
    expect(destination.pathname).toBe("/l/foldora");
    expect(destination.searchParams.get("utm_source")).toBe("newsletter");
    expect(destination.searchParams.get("utm_medium")).toBe("email");
    expect(destination.searchParams.get("utm_campaign")).toBe("october");
    expect(destination.searchParams.get("utm_id")).toBe("launch-01");
    expect(destination.searchParams.get("utm_term")).toBe("file-organizer");
    expect(destination.searchParams.get("utm_content")).toBe("button-a");
    expect(dom.window.sessionStorage.getItem("foldora.campaign")).not.toContain("person");
    dom.window.close();
  });

  it("keeps the original campaign instead of replacing it with a later visit", () => {
    const { dom } = loadTracker(
      "https://foldoraai.com/?utm_source=google&utm_medium=cpc&utm_campaign=first-touch",
    );
    dom.window.history.replaceState(
      {},
      "",
      "/guides/?utm_source=other&utm_medium=referral&utm_campaign=later-touch",
    );
    delete dom.window.__foldoraCheckoutTrackingLoaded;
    const laterLink = dom.window.document.createElement("a");
    laterLink.href = "https://computora.gumroad.com/l/foldora?utm_source=foldoraai.com&utm_medium=referral&utm_campaign=guide";
    laterLink.dataset.foldoraCheckout = "true";
    dom.window.document.body.append(laterLink);
    dom.window.eval(trackingScript);

    expect(new URL(laterLink.href).searchParams.get("utm_source")).toBe("google");
    expect(new URL(laterLink.href).searchParams.get("utm_campaign")).toBe("first-touch");
    dom.window.close();
  });

  it("attributes a Google-organic visit", () => {
    const { dom, link } = loadTracker(
      "https://foldoraai.com/ai-file-organizer/",
      "https://www.google.com/search?q=ai+file+organizer",
    );
    const destination = new URL(link.href);
    expect(destination.searchParams.get("utm_source")).toBe("google");
    expect(destination.searchParams.get("utm_medium")).toBe("organic");
    expect(destination.searchParams.get("utm_campaign")).toBe("organic-search");
    dom.window.close();
  });

  it("attributes a ChatGPT referral", () => {
    const { dom, link } = loadTracker(
      "https://foldoraai.com/ai-file-organizer/",
      "https://chatgpt.com/c/example",
    );
    const destination = new URL(link.href);
    expect(destination.searchParams.get("utm_source")).toBe("chatgpt.com");
    expect(destination.searchParams.get("utm_medium")).toBe("referral");
    expect(destination.searchParams.get("utm_campaign")).toBe("ai-assistant-referral");
    dom.window.close();
  });

  it("uses the current campaign without storing it when a privacy signal is enabled", () => {
    const { dom, link } = loadTracker(
      "https://foldoraai.com/?utm_source=privacy-test&utm_medium=test&utm_campaign=no-storage",
      undefined,
      true,
    );
    expect(new URL(link.href).searchParams.get("utm_source")).toBe("privacy-test");
    expect(dom.window.sessionStorage.getItem("foldora.campaign")).toBeNull();
    dom.window.close();
  });

  it("keeps checkout attribution but sends no analytics before consent", () => {
    const dom = new JSDOM(checkoutMarkup(), {
      url: "https://foldoraai.com/?utm_source=qa&utm_medium=test&utm_campaign=privacy",
      runScripts: "outside-only",
    });
    Object.defineProperty(dom.window, "FoldoraPrivacy", {
      value: { optionalServicesAllowed: () => false },
      configurable: true,
    });
    const gtag = vi.fn();
    Object.defineProperty(dom.window, "gtag", { value: gtag, configurable: true });
    dom.window.eval(trackingScript);

    const link = dom.window.document.querySelector<HTMLAnchorElement>(
      "[data-foldora-checkout]",
    )!;
    link.addEventListener("click", (event) => event.preventDefault());
    link.dispatchEvent(
      new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }),
    );

    expect(new URL(link.href).searchParams.get("utm_source")).toBe("qa");
    expect(dom.window.sessionStorage.getItem("foldora.campaign")).toBeNull();
    expect(gtag).not.toHaveBeenCalled();
    dom.window.close();
  });
});
