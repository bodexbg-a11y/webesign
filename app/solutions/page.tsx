import type { Metadata } from "next";
import Link from "../components/SafeLink";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Business OS Solutions & Modules",
  description: "Explore the OPSYNQ Business Operating System architecture: Core, Automation and Advanced industry modules for growing companies.",
  alternates: { canonical: "/solutions" },
};

const layers = [
  {
    number: "01", name: "Core", line: "The shared operational foundation.",
    intro: "Core creates the company-wide data model, user structure and daily workspace. It is the foundation for every later workflow and industry module.",
    modules: ["Custom CRM", "Customer management", "Projects", "Tasks", "Employees", "Roles & permissions", "Dashboard", "Documents", "Calendar", "Notifications", "Reporting", "Basic API", "Business branding"],
  },
  {
    number: "02", name: "Automation", line: "The workflows between people and systems.",
    intro: "Automation removes repetitive handoffs, enforces rules and keeps communication, documents and approvals moving across the operation.",
    modules: ["Business workflow automation", "Email automation", "WhatsApp integration", "Telegram integration", "Google Workspace", "Microsoft 365", "Electronic signatures", "Document automation", "Approval workflows", "Advanced reporting", "OpenAI integration", "Custom business logic"],
  },
  {
    number: "03", name: "Advanced", line: "Industry logic and enterprise control.",
    intro: "Advanced extends the shared core with specialist operations, high-value integrations, AI agents and multi-company architecture.",
    modules: ["Industry-specific modules", "ERP connections", "Accounting integrations", "Inventory", "Production", "Logistics", "Construction modules", "Property management", "Manufacturing modules", "Custom dashboards", "AI agents", "Enterprise security", "Multi-company support", "Unlimited customization"],
  },
];

export default function SolutionsPage() {
  return (
    <main className="solutions-page">
      <SiteHeader />
      <header className="subpage-hero shell"><div className="eyebrow"><i /> MODULAR BUSINESS OPERATING SYSTEM</div><h1>One platform.<br /><em>Three layers of capability.</em></h1><p>Core, Automation and Advanced are not fixed subscription plans. They are a clear architecture for deciding what your business needs now and what the system should support next.</p><div className="actions"><Link className="button primary" href="/contact">Map your system <span>↗</span></Link><Link className="button ghost" href="/construction-os">Construction OS <span>↗</span></Link></div></header>

      <section className="solution-architecture shell">{layers.map((layer) => <article key={layer.name} id={layer.name.toLowerCase()}><header><span>{layer.number}</span><div><h2>{layer.name}</h2><p>{layer.line}</p></div></header><div className="layer-body"><p>{layer.intro}</p><div>{layer.modules.map((module) => <span key={module}>{module}<i>✓</i></span>)}</div></div></article>)}</section>

      <section className="solution-principles"><div className="shell compact-heading"><div><div className="kicker">PRODUCT PRINCIPLES</div><h2>Focused first release.<br /><em>Long-term operating asset.</em></h2></div><div><p>We do not sell development hours or force companies into prebuilt plans. Discovery identifies the most valuable operating layer and defines a staged roadmap.</p><p>Every module shares data, access control and business logic. Expansion makes the platform more connected instead of adding another disconnected tool.</p></div></div><div className="shell principles-grid">{[["Ownership","Agreed code, data and intellectual property belong to your company."],["Modularity","New departments, workflows and integrations can be added without rebuilding the core."],["Integration","Existing systems remain where they create value and connect through available APIs."],["Governance","Roles, permissions, audit history and approval rules are designed into the system."]].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="industry-solutions shell"><div className="compact-heading"><div><div className="kicker">INDUSTRY OPERATING SYSTEMS</div><h2>The same core.<br /><em>Configured for the operation.</em></h2></div><p>Industry solutions reuse the OPSYNQ foundation while adapting objects, workflows, dashboards and terminology to each client&apos;s business.</p></div><div className="industry-solution-links"><Link href="/construction-os"><span>01</span><b>Construction OS</b><i>Flagship solution ↗</i></Link><Link href="/solutions/manufacturing-os"><span>02</span><b>Manufacturing OS</b><i>Explore ↗</i></Link><Link href="/solutions/logistics-os"><span>03</span><b>Logistics OS</b><i>Explore ↗</i></Link><Link href="/solutions/distribution-os"><span>04</span><b>Distribution OS</b><i>Explore ↗</i></Link><Link href="/solutions/property-management-os"><span>05</span><b>Property Management OS</b><i>Explore ↗</i></Link></div></section>

      <section className="compact-cta"><div className="shell"><div><div className="kicker">DEFINE THE RIGHT FIRST LAYER</div><h2>Build what the operation actually needs.</h2></div><div><p>A strategy call maps the bottlenecks, existing systems and first practical release.</p><Link className="button primary" href="/contact">Book a demo <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
