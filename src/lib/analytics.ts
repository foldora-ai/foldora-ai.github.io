import { site } from "@/config/product";

export type AnalyticsEventName =
  | "homepage_viewed"
  | "platform_download_cta_clicked"
  | "demo_section_reached"
  | "demo_started"
  | "pricing_section_viewed"
  | "buy_button_clicked"
  | "checkout_link_clicked"
  | "documentation_page_viewed"
  | "contact_support_clicked"
  | "not_found_viewed";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function loadAnalytics(): void {
  if (typeof window === "undefined" || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", site.analyticsMeasurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${site.analyticsMeasurementId}`;
  document.head.appendChild(script);
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  try {
    window.gtag?.("event", eventName, {
      event_category: "website_funnel",
      ...payload,
    });
  } catch {
    // Analytics must never block navigation, checkout, or page rendering.
  }
}

export function trackPageView(path: string, title = document.title): void {
  try {
    window.gtag?.("event", "page_view", {
      page_title: title,
      page_location: window.location.href,
      page_path: path,
    });
  } catch {
    // Ignore analytics failures.
  }
}
