import type { Metadata } from "next";
import Link from "next/link";
import DashboardPreview from "./components/DashboardPreview";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { SITE_URL } from "./seo-data";

export const metadata: Metadata = {
  title: { absolute: "Business Operating System for Growing Companies | OPSYNQ" },
  description: "OPSYNQ builds custom Business Operating Systems that connect CRM, operations, employees, finance, documents, automation, reporting and AI.",
  alternates: { canonical: "/" },
};

const layers = [
  ["01", "Core", "The operational foundation: CRM, customers, projects, tasks, employees, roles, dashboards, documents and reporting."],
  ["02", "Automation", "Connected workflows: approvals, communication, document generation, signatures, integrations and business logic."],
  ["03", "Advanced", "Industry modules, ERP connections, inventory, multi-company operations, AI agents and enterprise controls."],
];

const outcomes = [
  ["One source of truth", "Leadership sees customers, operations, people and performance without waiting for manual reports."],
  ["Workflows that run", "Tasks, approvals, documents, notifications and handoffs move automatically across the company."],
  ["Built around the business", "The platform follows your roles, rules and competitive workflows—not a generic SaaS template."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "OPSYNQ", url: SITE_URL, description: "Custom Business Operating Systems and business automation software for growing companies.", areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"], knowsAbout: ["Business Operating Systems", "Construction Management Software", "Custom CRM", "Workflow Automation", "Custom ERP", "AI Business Automation"] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "OPSYNQ", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en" },
      { "@type": "Service", "@id": `${SITE_URL}/#service`, name: "Custom Business Operating Systems", provider: { "@id": `${SITE_URL}/#organization` }, areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"], audience: { "@type": "BusinessAudience", audienceType: "CEOs, founders, managing directors and operations leaders" } },
    ],
  };

  return (
    <main className="compact-home">
      <script id="home-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> BUSINESS SYSTEMS, NOT WEBSITES</div>
          <h1>The operating system<br /><em>for your business.</em></h1>
          <p>OPSYNQ replaces disconnected CRM tools, spreadsheets and manual coordination with one custom platform for customers, operations, employees, finance, documents, reporting, integrations and AI.</p>
          <div className="actions"><Link className="button primary" href="/contact">Book a demo <span>↗</span></Link><Link className="button ghost" href="/solutions">Explore the system <span>↓</span></Link></div>
          <div className="hero-note"><span>For companies with 10–500+ employees</span><span className="implementation-price">Implementation from €5,000</span></div>
        </div>
        <DashboardPreview />
      </section>

      <section className="trust"><div className="shell trust-inner"><span>One system replaces</span>{["SPREADSHEETS", "DISCONNECTED CRM", "MANUAL REPORTS", "DATA SILOS", "REPETITIVE ADMIN"].map((item) => <b key={item}>{item}</b>)}</div></section>

      <section className="compact-value">
        <div className="shell compact-heading"><div><div className="kicker">ONE BUSINESS / ONE SYSTEM</div><h2>Everything important.<br /><em>Connected by design.</em></h2></div><p>Advertising becomes a lead. The lead becomes a customer. The customer becomes a project. The project creates tasks, documents, invoices and management data—all without rebuilding the same information in five different tools.</p></div>
        <div className="shell outcome-grid">{outcomes.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="system-integrations"><div className="shell"><div><div className="kicker">YOUR DATA / ONE OPERATING FLOW</div><h2>Advertising, operations and reporting.<br /><em>All inside one system.</em></h2><p>Connect the tools worth keeping, import the data trapped in spreadsheets and replace the manual layers around them. Every integration is validated against the available API and your security requirements.</p></div><div className="integration-tags">{["Google Ads","Meta / Facebook Leads","Excel data","Existing databases","Microsoft 365","Google Workspace","Accounting platforms","Any documented API"].map((item)=><span key={item}>{item}<i>↗</i></span>)}</div></div></section>

      <section className="construction-feature">
        <div className="shell construction-feature-grid">
          <div><div className="kicker">FLAGSHIP INDUSTRY SOLUTION</div><h2>Construction OS.</h2><p>A connected construction management platform for leads, estimates, projects, sites, crews, subcontractors, documents, costs, variations and client reporting.</p><Link className="button primary" href="/construction-os">Explore Construction OS <span>↗</span></Link></div>
          <div className="construction-flow" aria-label="Construction workflow"><span>Lead<small>Source · CRM</small></span><i>→</i><span>Estimate<small>Scope · Margin</small></span><i>→</i><span>Site<small>Crew · Progress</small></span><i>→</i><span>Finance<small>Cost · Invoice</small></span></div>
        </div>
      </section>

      <section className="solution-layers shell">
        <div className="compact-heading"><div><div className="kicker">MODULAR PRODUCT ARCHITECTURE</div><h2>Core. Automation.<br /><em>Advanced.</em></h2></div><p>Not fixed packages. Three layers help us define a focused first implementation and a clear path for expansion.</p></div>
        <div className="layer-list">{layers.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p><Link href="/solutions">View modules ↗</Link></article>)}</div>
      </section>

      <section className="compact-process">
        <div className="shell compact-heading"><div><div className="kicker">HOW WE WORK</div><h2>From operational complexity<br /><em>to a usable system.</em></h2></div><p>We combine business analysis, product design and system architecture. The first release solves a defined operational problem; the platform then improves continuously.</p></div>
        <div className="shell process-strip">{[["01","Discover","Business goals and constraints"],["02","Map","People, data and workflows"],["03","Design & build","A focused operational product"],["04","Launch & improve","Migration, training and roadmap"]].map(([number,title,text])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="compact-cta"><div className="shell"><div><div className="kicker">START WITH THE BOTTLENECK</div><h2>See what one connected system could replace.</h2></div><div><p>Tell us where spreadsheets, disconnected software or manual approvals are slowing the company down.</p><Link className="button primary" href="/contact">Book a strategy call <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
