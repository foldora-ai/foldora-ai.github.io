import { beforeEach, describe, expect, it } from "vitest";
import { checkoutUrl, paypalCheckoutUrl } from "@/config/product";

describe("checkout URL defaults", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("keeps direct-visit placement defaults", () => {
    const url = new URL(checkoutUrl("homepage", "hero"));
    expect(url.searchParams.get("utm_source")).toBe("foldoraai.com");
    expect(url.searchParams.get("utm_medium")).toBe("referral");
    expect(url.searchParams.get("utm_campaign")).toBe("homepage");
    expect(url.searchParams.get("utm_content")).toBe("hero");
  });

  it("adds placement defaults to PayPal without changing the checkout", () => {
    const paypal = new URL(paypalCheckoutUrl("docs", "buy"));
    expect(paypal.hostname).toBe("www.paypal.com");
    expect(paypal.pathname).toBe("/ncp/payment/YDYSDRF5NRCUW");
    expect(paypal.searchParams.get("utm_source")).toBe("foldoraai.com");
    expect(paypal.searchParams.get("utm_medium")).toBe("referral");
    expect(paypal.searchParams.get("utm_campaign")).toBe("docs");
    expect(paypal.searchParams.get("utm_content")).toBe("buy");
  });

  it("preserves the working Gumroad product URL", () => {
    const url = new URL(checkoutUrl("homepage", "hero"));
    expect(url.hostname).toBe("computora.gumroad.com");
    expect(url.pathname).toBe("/l/foldora");
  });
});
