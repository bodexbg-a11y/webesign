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
      <label>Business Email<input type="email" name="email" autoComplete="email" required /></label>
      <label>What would you like to automate?<textarea name="description" rows={4} required /></label>
      <label className="consent-check"><input type="checkbox" required /><span>I have read the <Link href="/privacy">Privacy Policy</Link> and consent to OPSYNQ using these details to respond to my enquiry.</span></label>
      <button type="submit">Prepare enquiry <span>↗</span></button>
      {sent && <p className="form-status" role="status">Your email application should now open. Send the prepared message to complete the enquiry.</p>}
    </form>
  );
}
