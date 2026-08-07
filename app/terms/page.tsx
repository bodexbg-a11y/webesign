import type { Metadata } from "next";
import LegalShell from "../components/LegalShell";
import { legalDetails } from "../legal-data";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms governing access to and use of the OPSYNQ website.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalShell eyebrow="WEBSITE TERMS" title="Terms of Use" intro={`Last updated ${legalDetails.lastUpdated}. These terms govern use of the public OPSYNQ website. Client projects are governed by separate proposals and agreements.`}>
      <section><h2>1. Website purpose</h2><p>The website provides general information about OPSYNQ, Business Operating Systems, construction software, automation and related consulting services. It is not a binding offer, technical specification or guarantee of suitability.</p></section>
      <section><h2>2. Acceptable use</h2><p>You may use the website for lawful business research and communication. You must not attempt unauthorised access, interfere with operation, introduce malicious code, scrape at a harmful rate, impersonate another person or use the content to violate applicable law.</p></section>
      <section><h2>3. No professional advice</h2><p>Website content does not constitute legal, tax, accounting, security or other regulated professional advice. Information about GDPR and cookies describes our intended website practices and should be reviewed against your organisation&apos;s specific legal requirements.</p></section>
      <section><h2>4. Intellectual property</h2><p>Unless stated otherwise, the OPSYNQ name, website copy, interface concepts, graphics and other original content are protected by applicable intellectual property laws. You may not reproduce or commercially exploit substantial content without written permission.</p></section>
      <section><h2>5. Third-party services and links</h2><p>References or links to third-party products do not imply partnership, endorsement or guaranteed integration. Third-party availability, APIs, terms and privacy practices are controlled by their respective providers.</p></section>
      <section><h2>6. Availability and accuracy</h2><p>We aim to keep information accurate and the website available, but may change, suspend or remove content without notice. To the extent permitted by law, the website is provided without warranties regarding uninterrupted availability, completeness or fitness for a particular purpose.</p></section>
      <section><h2>7. Project engagements</h2><p>Implementation scope, ownership, fees, timelines, responsibilities, confidentiality, data processing and support are defined only in a signed proposal, order form or service agreement. Website descriptions do not override those documents.</p></section>
      <section><h2>8. Liability</h2><p>Nothing excludes liability that cannot legally be excluded. Subject to that limitation, OPSYNQ is not responsible for indirect loss arising solely from reliance on general website information or temporary website unavailability.</p></section>
      <section><h2>9. Governing terms and contact</h2><p>The governing law and jurisdiction must be confirmed with the operating legal entity and will be stated in the final Legal Notice and client agreements. Questions can be sent to <a href={`mailto:${legalDetails.legalEmail}`}>{legalDetails.legalEmail}</a>.</p></section>
    </LegalShell>
  );
}
