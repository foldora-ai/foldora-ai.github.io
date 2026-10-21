import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadAnalytics, trackPageView } from "@/lib/analytics";

function setConsent(allowed: boolean) {
  Object.defineProperty(window, "FoldoraPrivacy", {
    value: {
      getState: () => (allowed ? "granted" : "denied"),
      optionalServicesAllowed: () => allowed,
      setOptionalConsent: () => undefined,
      showSettings: () => undefined,
    },
    writable: true,
    configurable: true,
  });
}

describe("GA4 consent gate", () => {
  beforeEach(() => {
    document
      .querySelectorAll("script[data-foldora-ga4]")
      .forEach((script) => script.remove());
    delete window.__foldoraGa4Loaded;
    delete window.gtag;
    window.dataLayer = [];
  });

  it("does not initialize or send a page view before consent", () => {
    setConsent(false);

    expect(loadAnalytics()).toBe(false);
    trackPageView("/private-test");

    expect(document.querySelector("script[data-foldora-ga4]")).toBeNull();
    expect(window.dataLayer).toEqual([]);
  });

  it("initializes once and sends a page view after consent", () => {
    setConsent(true);
    const gtag = vi.fn();
    window.gtag = gtag;

    expect(loadAnalytics()).toBe(true);
    expect(loadAnalytics()).toBe(true);
    trackPageView("/consented-test");

    expect(document.querySelectorAll("script[data-foldora-ga4]")).toHaveLength(1);
    expect(gtag.mock.calls.filter((call) => call[0] === "config")).toHaveLength(1);
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({ page_path: "/consented-test" }),
    );
  });
});
