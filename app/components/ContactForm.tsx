"use client";

import { FormEvent, useState } from "react";
import Link from "./SafeLink";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`OPSYNQ enquiry — ${String(data.get("company") || "New company")}`);
    const body = encodeURIComponent([
      `Name: ${data.get("name") || ""}`,
      `Company: ${data.get("company") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Website: ${data.get("website") || ""}`,
      `Employees: ${data.get("company-size") || ""}`,
      `Interest: ${data.get("interest") || ""}`,
      "",
      String(data.get("description") || ""),
    ].join("\n"));
    setSent(true);
    window.location.href = `mailto:hello@opsynq.net?subject=${subject}&body=${body}`;
  }

  return (
    <form className="simple-form" onSubmit={submit}>
      <div className="form-intro"><span>01</span><div><b>Tell us about the operation</b><small>Your email application will prepare the enquiry for you to review and send.</small></div></div>
      <div className="form-row"><label>Full Name<input name="name" autoComplete="name" required /></label><label>Company<input name="company" autoComplete="organization" required /></label></div>
      <div className="form-row"><label>Business Email<input type="email" name="email" autoComplete="email" required /></label><label>Phone<input type="tel" name="phone" autoComplete="tel" /></label></div>
      <label>Company Website<input type="url" name="website" placeholder="https://company.com" /></label>
      <div className="form-row"><label>Number of Employees<select name="company-size" required defaultValue=""><option value="" disabled>Select company size</option><option>10–25</option><option>26–50</option><option>51–100</option><option>101–250</option><option>251–500</option><option>500+</option></select></label><label>Primary Interest<select name="interest" required defaultValue=""><option value="" disabled>Select a solution</option><option>Business Operating System</option><option>Construction OS</option><option>Custom CRM</option><option>Workflow Automation</option><option>Custom ERP</option><option>AI Automation</option></select></label></div>
      <label>What would you like to automate?<textarea name="description" rows={5} required /></label>
      <label className="consent-check"><input type="checkbox" required /><span>I have read the <Link href="/privacy">Privacy Policy</Link> and consent to OPSYNQ using these details to respond to my enquiry.</span></label>
      <button type="submit">Prepare enquiry <span>↗</span></button>
      {sent && <p className="form-status" role="status">Your email application should now open. Send the prepared message to complete the enquiry.</p>}
    </form>
  );
}
