import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { legalDetails } from "../legal-data";

export const metadata: Metadata = {
  title: "About OPSYNQ",
  description: "OPSYNQ is a founder-led Business Automation Studio that designs custom Business Operating Systems for complex growing companies.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const founderConfirmed = !legalDetails.founderName.startsWith("Pending");
  return (
    <main className="about-page">
      <SiteHeader />
      <header className="subpage-hero shell"><div className="eyebrow"><i /> ABOUT OPSYNQ</div><h1>Business understanding.<br /><em>Product discipline.</em></h1><p>OPSYNQ is a founder-led Business Automation Studio. We design the operating software behind growing companies—not websites and not generic bundles of development hours.</p></header>

      <section className="about-statement"><div className="shell compact-heading"><div><div className="kicker">WHY OPSYNQ EXISTS</div><h2>Growing companies deserve software that understands the operation.</h2></div><div><p>Most operational complexity is not caused by a lack of tools. It appears because customer data, employee activity, documents, approvals, projects and finance no longer move together.</p><p>Our work starts by understanding how value moves through the business. Only then do we define the data model, product experience, automation and integrations.</p></div></div></section>

      <section className="founder-section shell"><div className="founder-card"><span>FOUNDER-LED DELIVERY</span><div className="founder-monogram">{founderConfirmed ? legalDetails.founderName.charAt(0) : "O"}</div></div><div><div className="kicker">FOUNDER & BUSINESS SYSTEMS ARCHITECT</div><h2>{founderConfirmed ? legalDetails.founderName : "Founder details to be confirmed"}</h2><p>The founder remains close to discovery, business analysis and system architecture. This keeps commercial objectives, operational reality and technical decisions connected from the first workshop through implementation.</p><p>OPSYNQ combines systems thinking, product design and practical automation. Complex workflows are translated into interfaces and rules that employees can actually use.</p><Link href="/contact">Start a conversation ↗</Link></div></section>

      <section className="approach-section"><div className="shell"><div className="compact-heading"><div><div className="kicker">OUR APPROACH</div><h2>Clarity before code.</h2></div><p>A serious Business Operating System cannot be scoped from a feature checklist alone.</p></div><div className="approach-grid">{[["01","Business discovery","Define outcomes, constraints, stakeholders and operational risk."],["02","Workflow analysis","Map how people, information, decisions and exceptions move today."],["03","Product architecture","Design one data model, permission system and modular roadmap."],["04","Experience design","Prototype critical workflows before committing to the full build."],["05","Controlled implementation","Launch in practical stages with migration, testing and training."],["06","Continuous improvement","Expand the platform as the company and its operating advantage grow."]].map(([number,title,text])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="compact-cta"><div className="shell"><div><div className="kicker">A LONG-TERM OPERATING ASSET</div><h2>Build a system the company can own and expand.</h2></div><div><p>Start with one important operational problem and a clear first release.</p><Link className="button primary" href="/contact">Book a strategy call <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
