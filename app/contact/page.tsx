import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact OPSYNQ | Book a Demo",
  description: "Book an OPSYNQ strategy call to discuss a custom Business Operating System, Construction OS, CRM, ERP, workflow or AI automation project.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <SiteHeader />
      <section className="contact-section standalone-contact"><div className="shell contact-grid"><div><div className="kicker">CONTACT / BOOK A DEMO</div><h1>Show us how the<br /><em>business operates.</em></h1><p>Tell us where manual work, spreadsheets or disconnected systems are slowing the company down. We will identify whether a custom Business Operating System is the right investment and what a focused first release could include.</p><div className="contact-points"><span><i>✓</i> 30-minute strategy session</span><span><i>✓</i> No generic software presentation</span><span><i>✓</i> Clear operational and technical direction</span><span><i>✓</i> Projects starting from €5,000</span></div><div className="contact-direct"><span>DIRECT CONTACT</span><a href="mailto:hello@opsynq.net">hello@opsynq.net ↗</a></div></div><ContactForm /></div></section>
      <section className="contact-expectations shell"><div><div className="kicker">WHAT HAPPENS NEXT</div><h2>A useful first conversation.</h2></div><div>{[["01","We review the context","Company, existing systems, employees and operational bottlenecks."],["02","We identify the leverage","Which workflow or visibility problem creates the strongest business case."],["03","We outline the first release","A practical implementation direction, dependencies and next steps."]].map(([number,title,text])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <SiteFooter />
    </main>
  );
}
