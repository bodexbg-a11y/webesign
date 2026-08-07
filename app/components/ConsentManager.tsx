"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: 1;
  updatedAt: string;
};

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
  _fbq?: TrackingWindow["fbq"];
};

type MetaPixel = NonNullable<TrackingWindow["fbq"]>;

const STORAGE_KEY = "opsynq-consent-v1";
const googleId = process.env.NEXT_PUBLIC_GA_ID || "";
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

function removeCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
}

function removeTrackingCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name && (name === "_fbp" || name.startsWith("_ga") || name.startsWith("_gcl"))) removeCookie(name);
  });
}

function configureGoogle(consent: Consent) {
  const trackingWindow = window as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag = trackingWindow.gtag || function gtag(...args: unknown[]) { trackingWindow.dataLayer?.push(args); };
  trackingWindow.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });

  if (consent.analytics && googleId && !document.getElementById("opsynq-google-analytics")) {
    const script = document.createElement("script");
    script.id = "opsynq-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`;
    document.head.appendChild(script);
    trackingWindow.gtag("js", new Date());
    trackingWindow.gtag("config", googleId, { anonymize_ip: true });
  }
}

function configureMeta(consent: Consent) {
  const trackingWindow = window as TrackingWindow;
  if (!consent.marketing) {
    trackingWindow.fbq?.("consent", "revoke");
    return;
  }
  if (!metaPixelId) return;

  if (!trackingWindow.fbq) {
    const fbq: MetaPixel = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue?.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    trackingWindow.fbq = fbq;
    trackingWindow._fbq = fbq;
  }

  if (!document.getElementById("opsynq-meta-pixel")) {
    const script = document.createElement("script");
    script.id = "opsynq-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    trackingWindow.fbq?.("consent", "grant");
    trackingWindow.fbq?.("init", metaPixelId);
    trackingWindow.fbq?.("track", "PageView");
  }
}

function applyConsent(consent: Consent) {
  configureGoogle(consent);
  configureMeta(consent);
  if (!consent.analytics && !consent.marketing) removeTrackingCookies();
  window.dispatchEvent(new CustomEvent("opsynq:consent", { detail: consent }));
}

export default function ConsentManager() {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Consent;
          if (parsed.version === 1) {
            setConsent(parsed);
            setAnalytics(parsed.analytics);
            setMarketing(parsed.marketing);
            applyConsent(parsed);
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function save(next: Pick<Consent, "analytics" | "marketing">) {
    const value: Consent = { necessary: true, analytics: next.analytics, marketing: next.marketing, version: 1, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setAnalytics(value.analytics);
    setMarketing(value.marketing);
    setPreferencesOpen(false);
    applyConsent(value);
  }

  if (!ready) return null;

  return (
    <>
      {!consent && !preferencesOpen && (
        <section className="consent-banner" aria-label="Cookie consent">
          <div><b>Your privacy, your choice.</b><p>OPSYNQ uses necessary storage for your consent choice. Analytics and advertising technologies are loaded only if you allow them.</p><Link href="/cookies">Cookie Policy</Link></div>
          <div className="consent-actions"><button className="consent-secondary" onClick={() => save({ analytics: false, marketing: false })}>Reject non-essential</button><button className="consent-secondary" onClick={() => setPreferencesOpen(true)}>Manage preferences</button><button className="consent-primary" onClick={() => save({ analytics: true, marketing: true })}>Accept all</button></div>
        </section>
      )}

      {preferencesOpen && (
        <div className="consent-overlay" role="presentation">
          <section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title">
            <div className="consent-modal-head"><div><span>PRIVACY SETTINGS</span><h2 id="consent-title">Choose what you allow.</h2></div>{consent && <button aria-label="Close cookie settings" onClick={() => setPreferencesOpen(false)}>×</button>}</div>
            <p>Non-essential technologies remain disabled unless you opt in. You can change this choice at any time.</p>
            <div className="consent-option"><div><b>Necessary</b><small>Stores your consent preference and supports essential website functions.</small></div><span className="always-on">Always on</span></div>
            <label className="consent-option"><div><b>Analytics</b><small>Helps us understand website performance through Google Analytics when configured.</small></div><input aria-label="Allow analytics" type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><i /></label>
            <label className="consent-option"><div><b>Marketing</b><small>Allows advertising measurement such as Meta Pixel when configured.</small></div><input aria-label="Allow marketing" type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><i /></label>
            <div className="consent-modal-actions"><button className="consent-secondary" onClick={() => save({ analytics: false, marketing: false })}>Reject all</button><button className="consent-primary" onClick={() => save({ analytics, marketing })}>Save preferences</button></div>
          </section>
        </div>
      )}

      {consent && !preferencesOpen && <button className="consent-settings" onClick={() => setPreferencesOpen(true)}>Cookie settings</button>}
    </>
  );
}
