// @vitest-environment jsdom
import { lazy, Suspense } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import PricingAnchor from "@/components/PricingAnchor";

const original = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
afterEach(() => {
  cleanup();
  if (original) Object.defineProperty(Element.prototype, "scrollIntoView", original);
  else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

function mockScroll() {
  const scroll = vi.fn();
  Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scroll });
  return scroll;
}

describe("pricing anchor after lazy route load", () => {
  it("scrolls only after the pricing section has committed", async () => {
    const scroll = mockScroll();
    let resolve!: (module: { default: () => React.JSX.Element }) => void;
    const Page = lazy(() => new Promise<{ default: () => React.JSX.Element }>(done => { resolve = done; }));
    render(<MemoryRouter initialEntries={["/#pricing"]}><Suspense fallback={<p>Loading</p>}><Page /><PricingAnchor id="pricing" /></Suspense></MemoryRouter>);
    expect(scroll).not.toHaveBeenCalled();
    await act(async () => resolve({ default: () => <section id="pricing">Pricing</section> }));
    expect(scroll).toHaveBeenCalledOnce();
    expect(scroll).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
  });

  it.each(["/", "/#faq", "/docs/install/#pricing"])("does not move the page for unrelated location %s", location => {
    const scroll = mockScroll();
    render(<MemoryRouter initialEntries={[location]}><section id="pricing">Pricing</section><PricingAnchor id="pricing" /></MemoryRouter>);
    expect(scroll).not.toHaveBeenCalled();
  });

  it("does nothing when the destination is absent", () => {
    const scroll = mockScroll();
    render(<MemoryRouter initialEntries={["/#pricing"]}><PricingAnchor id="pricing" /></MemoryRouter>);
    expect(scroll).not.toHaveBeenCalled();
  });
});
