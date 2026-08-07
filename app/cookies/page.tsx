import type { Metadata } from "next";
import Link from "../components/SafeLink";
import LegalShell from "../components/LegalShell";
import { legalDetails } from "../legal-data";

export const metadata: Metadata = { title: "Cookie Policy", description: "OPSYNQ Cookie Policy and consent categories for necessary, analytics and marketing technologies.", alternates: { canonical: "/cookies" } };

export default function CookiePage() {
  return (
    <LegalShell eyebrow="CONSENT & TRACKING" title="Cookie Policy" intro={`Last updated ${legalDetails.lastUpdated}. Non-essential analytics and advertising technologies are disabled until you choose to allow them.`}>
      <section><h2>1. What cookies and similar technologies are</h2><p>Cookies are small files stored by a browser. Similar technologies include local storage, pixels and tags. They can support essential functions, remember preferences, measure website performance or attribute advertising activity.</p></section>
      <section><h2>2. How consent works on OPSYNQ</h2><p>On your first visit, the banner offers equally available options to accept all, reject non-essential technologies or manage categories. Rejecting does not block access to the website. Your selection is stored locally under <code>opsynq-consent-v1</code>. You can reopen Cookie settings at any time and change or withdraw consent.</p></section>
      <section><h2>3. Necessary storage</h2><div className="legal-table"><div><b>Storage</b><b>Purpose</b><b>Duration</b></div><div><span>opsynq-consent-v1</span><span>Remembers analytics and marketing preferences. Stored in first-party local storage, not sent as a tracking cookie.</span><span>Until changed or browser storage is cleared</span></div></div></section>
      <section><h2>4. Analytics — optional</h2><p>If Google Analytics is configured and you consent to Analytics, OPSYNQ may load Google measurement technology to understand page usage, performance and conversions. Common first-party identifiers include <code>_ga</code> and <code>_ga_&lt;container-id&gt;</code>, typically retained for up to two years depending on configuration. No Google Analytics script is loaded by our consent manager before this category is allowed.</p></section>
      <section><h2>5. Marketing — optional</h2><p>If Meta Pixel or another advertising tag is configured and you consent to Marketing, the technology may measure visits and advertising conversions. Meta may use identifiers such as <code>_fbp</code>, typically retained for up to 90 days depending on provider configuration. OPSYNQ does not load the Meta Pixel through our consent manager before this category is allowed.</p></section>
      <section><h2>6. Current configuration</h2><p>The consent system supports Google Analytics and Meta Pixel through deployment environment variables. If an identifier is not configured, allowing that category does not cause the absent provider script to load. Provider names, cookies and retention periods may change; this policy will be updated when the live configuration changes.</p></section>
      <section><h2>7. How to withdraw consent</h2><p>Use the Cookie settings button displayed on the website after making a choice. Withdrawing consent updates the stored preference, sends a denial signal to configured tags and attempts to remove related first-party identifiers. You can also remove site data through your browser settings.</p></section>
      <section><h2>8. Contact</h2><p>Questions about cookies and consent can be sent to <a href={`mailto:${legalDetails.privacyEmail}`}>{legalDetails.privacyEmail}</a>. See the <Link href="/privacy">Privacy Policy</Link> for information about personal data and your rights.</p></section>
    </LegalShell>
  );
}
