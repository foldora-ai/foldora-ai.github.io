import { site } from "@/config/product";

export type AnalyticsEventName =
  | "homepage_viewed"
  | "platform_download_cta_clicked"
  | "demo_section_reached"
  | "demo_started"
  | "pricing_section_viewed"
  | "documentation_page_viewed"
  | "contact_support_clicked"
  | "not_found_viewed";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __foldoraGa4Loaded?: boolean;
    FoldoraPrivacy?: {
      getState: () => "unknown" | "granted" | "denied";
      optionalServicesAllowed: () => boolean;
      setOptionalConsent: (granted: boolean) => void;
      showSettings: () => void;
    };
  }
}

export function analyticsConsentGranted(): boolean {
  return (
    typeof window !== "undefined" &&
    window.FoldoraPrivacy?.optionalServicesAllowed() === true
  );
}

export function loadAnalytics(): boolean {
  if (!analyticsConsentGranted()) return false;
  if (window.__foldoraGa4Loaded) return true;

  window.__foldoraGa4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  window.gtag("js", new Date());
  window.gtag("config", site.analyticsMeasurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${site.analyticsMeasurementId}`;
  script.dataset.foldoraGa4 = "true";
  document.head.appendChild(script);
  return true;
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): void {
  if (!analyticsConsentGranted()) return;
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
  if (!analyticsConsentGranted()) return;
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
