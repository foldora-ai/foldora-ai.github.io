import { beforeEach, describe, expect, it } from "vitest";
import { checkoutUrl, paypalCheckoutUrl } from "@/config/product";

describe("checkout campaign attribution", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("keeps direct-visit placement defaults", () => {
    const url = new URL(checkoutUrl("homepage", "hero"));
    expect(url.searchParams.get("utm_source")).toBe("foldoraai.com");
    expect(url.searchParams.get("utm_content")).toBe("hero");
  });

  it("carries campaign origin through internal navigation to both checkouts", () => {
    window.history.replaceState({}, "", "/?utm_source=alternativeto&utm_medium=referral&utm_campaign=listing&email=private");
    const card = new URL(checkoutUrl("homepage", "hero"));
    expect(card.searchParams.get("utm_source")).toBe("alternativeto");
    window.history.replaceState({}, "", "/docs/getting-started");
    const paypal = new URL(paypalCheckoutUrl("docs", "buy"));
    expect(paypal.searchParams.get("utm_source")).toBe("alternativeto");
    expect(paypal.searchParams.get("utm_campaign")).toBe("listing");
    expect(paypal.searchParams.get("utm_content")).toBe("buy");
    expect(sessionStorage.getItem("foldora.campaign")).not.toContain("private");
  });

  it("does not break checkout when saved data is corrupt", () => {
    sessionStorage.setItem("foldora.campaign", "broken");
    expect(new URL(checkoutUrl("homepage", "hero")).hostname).toBe("computora.gumroad.com");
  });
});
