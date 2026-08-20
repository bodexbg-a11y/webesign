"use client";

import { useEffect } from "react";
import Link from "../../components/SafeLink";
import { Brand } from "../../components/SiteHeader";
import { trackConstructionEvent } from "../ConstructionTracking";
import "../construction.css";

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendly.com/opsynqos/30min";

export default function WorkflowReviewThanks() {
  useEffect(() => { trackConstructionEvent("construction_call_booking_viewed"); }, []);

  return <main className="construction-landing construction-thanks-page">
    <header className="site-header construction-header"><nav className="nav shell" aria-label="Site navigation"><Brand /><div className="nav-links"><Link href="/construction#how-it-works">How It Works</Link><Link href="/construction#product">Product</Link><Link href="/construction#faq">FAQ</Link></div><Link className="nav-cta" href="/construction">Back to Construction OS <span>↗</span></Link></nav></header>
    <section className="thanks-hero"><div className="construction-shell thanks-layout"><div className="thanks-copy"><span className="construction-kicker">REQUEST RECEIVED</span><div className="thanks-check" aria-hidden="true">✓</div><h1>Thanks — your workflow review is <em>in motion.</em></h1><p>We&apos;ve received your details. The best next step is to choose a time now, so we can come prepared for a focused conversation about your operation.</p><div className="thanks-points"><span>✓ Your request is with the OPSYNQ team</span><span>✓ No generic sales pitch — we&apos;ll discuss your workflow</span></div></div><aside className="booking-card"><span className="booking-eyebrow">STEP 2 OF 2</span><div className="booking-time"><b>30</b><span>MINUTE<br />CALL</span></div><h2>Choose a time for your workflow review.</h2><p>Book a practical conversation with our team while your requirements are fresh.</p><a className="gold-button" href={bookingUrl} target="_blank" rel="noreferrer" onClick={() => trackConstructionEvent("construction_booking_started", { booking_url: bookingUrl })}>Book your 30-minute review <span>↗</span></a><small>Opens our booking calendar in a new tab.</small></aside></div></section>
    <footer className="construction-footer"><div className="construction-shell"><span>© 2026 OPSYNQ OS</span><div><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/legal">Legal</Link></div></div></footer>
  </main>;
}
