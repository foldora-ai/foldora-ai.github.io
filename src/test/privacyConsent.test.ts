import fs from "node:fs";
import path from "node:path";

import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const consentScript = fs.readFileSync(
  path.resolve("public", "privacy-consent.js"),
  "utf8",
);
const tawkScript = fs.readFileSync(
  path.resolve("public", "tawk-loader.js"),
  "utf8",
);

function loadConsent(
  globalPrivacyControl = false,
  storedChoice?: "granted" | "denied",
) {
  const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url: "https://foldoraai.com/",
    runScripts: "outside-only",
  });
  Object.defineProperty(dom.window.navigator, "globalPrivacyControl", {
    value: globalPrivacyControl,
    configurable: true,
  });
  if (storedChoice) {
    dom.window.localStorage.setItem("foldora.optional-consent.v1", storedChoice);
  }
  dom.window.eval(consentScript);
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  return dom;
}

describe("optional-service consent", () => {
  it("defaults GA4 consent to denied and shows a choice", () => {
    const dom = loadConsent();
    const privacy = dom.window.FoldoraPrivacy!;
    const consentDefault = (dom.window.dataLayer?.[0] as IArguments);

    expect(privacy.optionalServicesAllowed()).toBe(false);
    expect(consentDefault[0]).toBe("consent");
    expect(consentDefault[1]).toBe("default");
    expect(consentDefault[2]).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    const banner = dom.window.document.querySelector<HTMLElement>(
      "#foldora-privacy-banner",
    )!;
    expect(banner.hidden).toBe(false);
    expect(dom.window.document.querySelector(".foldora-privacy-settings")).toBeNull();
    dom.window.close();
  });

  it("loads optional services only after an explicit acceptance", () => {
    const dom = loadConsent();
    const consentChange = vi.fn();
    dom.window.document.addEventListener("foldora:consent-change", consentChange);

    dom.window.document
      .querySelector<HTMLButtonElement>("[data-accept]")!
      .click();

    expect(dom.window.FoldoraPrivacy?.optionalServicesAllowed()).toBe(true);
    expect(dom.window.localStorage.getItem("foldora.optional-consent.v1")).toBe(
      "granted",
    );
    expect(consentChange).toHaveBeenCalledTimes(1);
    expect(
      dom.window.document.querySelector<HTMLElement>("#foldora-privacy-banner")!
        .hidden,
    ).toBe(true);
    const dataLayer = dom.window.dataLayer!;
    const update = dataLayer[dataLayer.length - 1] as IArguments;
    expect(update[1]).toBe("update");
    expect(update[2]).toMatchObject({ analytics_storage: "granted" });
    dom.window.close();
  });

  it("clears optional campaign storage when rejected", () => {
    const dom = loadConsent();
    dom.window.sessionStorage.setItem("foldora.campaign", '{"utm_source":"qa"}');

    dom.window.document
      .querySelector<HTMLButtonElement>("[data-reject]")!
      .click();

    expect(dom.window.FoldoraPrivacy?.optionalServicesAllowed()).toBe(false);
    expect(dom.window.localStorage.getItem("foldora.optional-consent.v1")).toBe(
      "denied",
    );
    expect(dom.window.sessionStorage.getItem("foldora.campaign")).toBeNull();
    expect(
      dom.window.document.querySelector<HTMLElement>("#foldora-privacy-banner")!
        .hidden,
    ).toBe(true);
    dom.window.close();
  });

  it("saves the selected preference and dismisses the banner", () => {
    const dom = loadConsent();
    const checkbox = dom.window.document.querySelector<HTMLInputElement>(
      "[data-optional-choice]",
    )!;
    checkbox.checked = true;

    dom.window.document.querySelector<HTMLButtonElement>("[data-save]")!.click();

    expect(dom.window.FoldoraPrivacy?.getState()).toBe("granted");
    expect(dom.window.localStorage.getItem("foldora.optional-consent.v1")).toBe(
      "granted",
    );
    expect(
      dom.window.document.querySelector<HTMLElement>("#foldora-privacy-banner")!
        .hidden,
    ).toBe(true);
    dom.window.close();
  });

  it("keeps a saved choice hidden and restores it when footer settings reopen", () => {
    const dom = loadConsent(false, "granted");
    const banner = dom.window.document.querySelector<HTMLElement>(
      "#foldora-privacy-banner",
    )!;
    const checkbox = dom.window.document.querySelector<HTMLInputElement>(
      "[data-optional-choice]",
    )!;
    const trigger = dom.window.document.createElement("button");
    trigger.setAttribute("data-foldora-privacy-open", "");
    dom.window.document.body.appendChild(trigger);

    expect(banner.hidden).toBe(true);
    expect(dom.window.FoldoraPrivacy?.optionalServicesAllowed()).toBe(true);

    trigger.click();

    expect(banner.hidden).toBe(false);
    expect(checkbox.checked).toBe(true);
    expect(
      dom.window.document.querySelector("[data-current-choice]")?.textContent,
    ).toContain("allowed");

    dom.window.document.querySelector<HTMLButtonElement>("[data-save]")!.click();
    expect(banner.hidden).toBe(true);
    expect(dom.window.localStorage.getItem("foldora.optional-consent.v1")).toBe(
      "granted",
    );
    dom.window.close();
  });

  it("withdraws consent, clears optional storage, and schedules script removal", () => {
    const dom = loadConsent(false, "granted");
    const reloadTimer = vi
      .spyOn(dom.window, "setTimeout")
      .mockImplementation((() => 1) as typeof dom.window.setTimeout);
    dom.window.sessionStorage.setItem("foldora.campaign", '{"utm_source":"qa"}');
    dom.window.FoldoraPrivacy?.showSettings();

    const checkbox = dom.window.document.querySelector<HTMLInputElement>(
      "[data-optional-choice]",
    )!;
    checkbox.checked = false;
    dom.window.document.querySelector<HTMLButtonElement>("[data-save]")!.click();

    expect(dom.window.FoldoraPrivacy?.optionalServicesAllowed()).toBe(false);
    expect(dom.window.localStorage.getItem("foldora.optional-consent.v1")).toBe(
      "denied",
    );
    expect(dom.window.sessionStorage.getItem("foldora.campaign")).toBeNull();
    const update = dom.window.dataLayer?.at(-1) as IArguments;
    expect(update[1]).toBe("update");
    expect(update[2]).toMatchObject({ analytics_storage: "denied" });
    expect(reloadTimer).toHaveBeenCalledTimes(1);
    dom.window.close();
  });

  it("honors Global Privacy Control and prevents acceptance", () => {
    const dom = loadConsent(true);
    const accept = dom.window.document.querySelector<HTMLButtonElement>(
      "[data-accept]",
    )!;

    expect(dom.window.FoldoraPrivacy?.getState()).toBe("denied");
    expect(dom.window.FoldoraPrivacy?.optionalServicesAllowed()).toBe(false);
    expect(accept.hidden).toBe(true);
    dom.window.close();
  });

  it("does not add the Tawk script until optional services are allowed", () => {
    const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
      url: "https://foldoraai.com/",
      runScripts: "outside-only",
    });
    let allowed = false;
    Object.defineProperty(dom.window, "FoldoraPrivacy", {
      value: {
        getState: () => (allowed ? "granted" : "denied"),
        optionalServicesAllowed: () => allowed,
        setOptionalConsent: () => undefined,
        showSettings: () => undefined,
      },
      configurable: true,
    });
    dom.window.eval(tawkScript);
    dom.window.dispatchEvent(new dom.window.Event("load"));
    dom.window.dispatchEvent(new dom.window.Event("pointerdown"));
    expect(dom.window.document.querySelector("[data-foldora-tawk]")).toBeNull();

    allowed = true;
    dom.window.document.dispatchEvent(
      new dom.window.CustomEvent("foldora:consent-change"),
    );
    dom.window.dispatchEvent(new dom.window.Event("pointerdown"));
    expect(dom.window.document.querySelector("[data-foldora-tawk]")).not.toBeNull();
    dom.window.close();
  });
});
