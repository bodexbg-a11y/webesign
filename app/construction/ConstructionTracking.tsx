"use client";

import { useEffect } from "react";

type TrackingWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
};

export function trackConstructionEvent(name: string, parameters: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.dataLayer.push({ event: name, ...parameters });

  const metaEvents: Record<string, string> = {
    construction_view_content: "ViewContent",
    construction_form_started: "InitiateCheckout",
    construction_lead_submitted: "Lead",
    construction_booking_started: "Schedule",
    construction_call_booked: "Schedule",
  };
  const metaName = metaEvents[name];
  if (metaName) trackingWindow.fbq?.("track", metaName, parameters);
  else trackingWindow.fbq?.("trackCustom", name, parameters);
}

export default function ConstructionTracking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const attribution = Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
        .map((key) => [key, params.get(key)])
        .filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    if (Object.keys(attribution).length) sessionStorage.setItem("opsynq-construction-attribution", JSON.stringify(attribution));
    trackConstructionEvent("construction_view_content", { content_name: "OPSYNQ Construction", ...attribution });

    const thresholds = [25, 50, 75, 90];
    const seen = new Set<number>();
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const depth = available > 0 ? Math.round((window.scrollY / available) * 100) : 100;
      thresholds.forEach((threshold) => {
        if (depth >= threshold && !seen.has(threshold)) {
          seen.add(threshold);
          trackConstructionEvent("construction_scroll_depth", { percent: threshold });
        }
      });
    };
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cta]");
      if (target) trackConstructionEvent("construction_cta_click", { cta: target.dataset.cta, location: target.dataset.location });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
