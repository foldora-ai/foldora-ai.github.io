import { type ReactNode, useEffect, useRef } from "react";

import { type AnalyticsEventName, trackEvent } from "@/lib/analytics";

interface AnalyticsSectionProps {
  event: AnalyticsEventName;
  payload?: Record<string, string | number | boolean | undefined>;
  threshold?: number;
  children: ReactNode;
}

const AnalyticsSection = ({
  event,
  payload,
  threshold = 0.35,
  children,
}: AnalyticsSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent(event, payload);
        observer.disconnect();
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [event, payload, threshold]);

  return <div ref={ref}>{children}</div>;
};

export default AnalyticsSection;
