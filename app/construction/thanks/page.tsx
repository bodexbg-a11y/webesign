"use client";

import Image from "next/image";
import { useEffect } from "react";
import { trackConstructionEvent } from "../ConstructionTracking";

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendly.com/opsynqos/30min";

export default function WorkflowReviewThanks() {
  useEffect(() => { trackConstructionEvent("construction_call_booking_viewed"); }, []);
  return <main className="construction-thanks"><div className="thanks-card"><Image src="/opsynq-logo.png" width={74} height={37} alt="OPSYNQ" /><span>REQUEST RECEIVED</span><h1>Thanks — let&apos;s talk about your workflow.</h1><p>Your review request is on its way to our team. Choose a time now for a focused 30-minute workflow review.</p><a href={bookingUrl} target="_blank" rel="noreferrer" onClick={() => trackConstructionEvent("construction_booking_started", { booking_url: bookingUrl })}>Book your 30-minute workflow review <b>↗</b></a><small>Pick a time now to secure your review. We will focus on the processes slowing your business down.</small></div></main>;
}
