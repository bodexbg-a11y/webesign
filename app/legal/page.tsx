import type { Metadata } from "next";
import LegalShell from "../components/LegalShell";
import { legalDetails } from "../legal-data";

export const metadata: Metadata = { title: "Legal Notice & Company Information", description: "Legal and company information for the operator of OPSYNQ.", alternates: { canonical: "/legal" } };

export default function LegalNoticePage() {
  return (
    <LegalShell eyebrow="COMPANY INFORMATION" title="Legal Notice" intro="Information about the operator responsible for the OPSYNQ website and commercial service.">
      <section className="legal-alert"><b>Action required before commercial launch</b><p>The owner must confirm the legal entity name, company number, VAT number, registered address and founder name. These details are deliberately not invented.</p></section>
      <section><h2>Website and product</h2><div className="legal-facts"><div><span>Product / trading name</span><b>{legalDetails.productName}</b></div><div><span>Website</span><b>{legalDetails.website}</b></div><div><span>General contact</span><b>{legalDetails.generalEmail}</b></div><div><span>Legal contact</span><b>{legalDetails.legalEmail}</b></div></div></section>
      <section><h2>Operating entity</h2><div className="legal-facts"><div><span>Legal company name</span><b>{legalDetails.companyName}</b></div><div><span>Registration number</span><b>{legalDetails.registrationNumber}</b></div><div><span>VAT number</span><b>{legalDetails.vatNumber}</b></div><div><span>Registered address</span><b>{legalDetails.registeredAddress}</b></div></div></section>
      <section><h2>Responsible person</h2><div className="legal-facts"><div><span>Founder & Business Systems Architect</span><b>{legalDetails.founderName}</b></div><div><span>Privacy contact</span><b>{legalDetails.privacyEmail}</b></div></div></section>
      <section><h2>Regulatory and dispute information</h2><p>Applicable supervisory authority, governing law, jurisdiction and any mandatory dispute-resolution information will be confirmed after the legal entity and registered establishment are supplied.</p></section>
      <section><h2>Third-party names</h2><p>Google, Meta, Microsoft, WhatsApp, Telegram, OpenAI and other third-party names belong to their respective owners. References describe potential technical integrations and do not imply partnership or endorsement.</p></section>
    </LegalShell>
  );
}
