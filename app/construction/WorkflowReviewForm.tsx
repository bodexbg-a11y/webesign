"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "../components/SafeLink";
import { trackConstructionEvent } from "./ConstructionTracking";

const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/xdenyvnz";

export default function WorkflowReviewForm() {
  const started = useRef(false);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackConstructionEvent("construction_form_started", { form_name: "free_workflow_review" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    let attribution = {};
    try { attribution = JSON.parse(sessionStorage.getItem("opsynq-construction-attribution") || "{}"); } catch { /* ignore invalid local data */ }

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ...attribution,
          pageUrl: window.location.href,
          _subject: `Free Workflow Review — ${String(payload.company || "OPSYNQ construction lead")}`,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      trackConstructionEvent("construction_lead_submitted", { form_name: "free_workflow_review" });
      window.location.assign("/construction/thanks");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="construction-form" onSubmit={submit} onFocus={markStarted}>
      <div className="workflow-form-head"><b>Tell us what needs fixing.</b><span>We&apos;ll use this to prepare a practical workflow review for your company.</span></div>
      <div className="form-pair">
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Company<input name="company" autoComplete="organization" required /></label>
      </div>
      <label>Phone<input type="tel" name="phone" autoComplete="tel" required /></label>
      <label>What is the biggest operational problem you want to solve?<textarea name="problem" rows={3} required /></label>
      <label>What tools are you currently using? <span>Optional</span><select name="tools" defaultValue=""><option value="">Select an answer</option><option>Excel / spreadsheets</option><option>WhatsApp</option><option>CRM</option><option>Project management software</option><option>ERP</option><option>Multiple tools</option><option>Other</option></select></label>
      <input className="honeypot" name="phone_number" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="form-consent"><input type="checkbox" required /><span>I agree to the <Link href="/privacy">Privacy Policy</Link> and to being contacted about this workflow review.</span></label>
      <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Get a Free Workflow Review"}<span>↗</span></button>
      <small>No obligation. We use your details only to arrange and prepare your workflow review.</small>
      {state === "error" && <p className="form-error" role="alert">We could not send your request. Please try again or email hello@opsynq.net.</p>}
    </form>
  );
}
