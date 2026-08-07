import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, marketLinks, serviceLinks } from "../../seo-data";

type Slug = "construction-os" | "manufacturing-os" | "distribution-os" | "logistics-os" | "property-management-os";

const solutions = {
  "construction-os": {
    name: "Construction OS",
    keyword: "construction management software",
    secondary: ["construction CRM", "software for construction companies", "construction workflow automation"],
    intro: "Connect leads, estimates, sites, crews, subcontractors, documents, costs and progress in one construction management system.",
    context: "Construction companies lose margin when commercial, site and finance information lives in separate spreadsheets and messages. NORTH/OS creates one operational record from the first enquiry through estimating, delivery, variations, invoicing and final handover.",
    modules: ["Construction CRM", "Estimates & quotations", "Projects & sites", "Crews & subcontractors", "Daily site reports", "Documents & approvals", "Cost control", "Client dashboards"],
    outcomes: ["Live project and site visibility", "Controlled variations and approvals", "Connected commercial and cost data", "Less manual reporting from field teams"],
  },
  "manufacturing-os": {
    name: "Manufacturing OS",
    keyword: "manufacturing operations software",
    secondary: ["custom manufacturing ERP", "production workflow software", "manufacturing management dashboard"],
    intro: "Connect orders, planning, production, inventory, quality and delivery in one manufacturing operations system.",
    context: "Manufacturing teams need a reliable flow from customer demand to materials, capacity, production, quality and fulfilment. NORTH/OS replaces fragmented tracking with a custom operational model that reflects the real stages, exceptions and controls of the factory.",
    modules: ["Customer orders", "Production planning", "Bill of materials", "Inventory", "Quality control", "Maintenance", "Purchasing", "Performance dashboards"],
    outcomes: ["Clear order-to-production status", "Connected stock and purchasing", "Visible quality and exception workflows", "Management insight into capacity and delivery"],
  },
  "distribution-os": {
    name: "Distribution OS",
    keyword: "distribution management software",
    secondary: ["wholesale management software", "custom distribution ERP", "inventory workflow software"],
    intro: "Manage customers, purchasing, pricing, stock, fulfilment and margins with live distribution management software.",
    context: "Distribution businesses need customer terms, supplier purchasing, inventory, fulfilment and margin data to move together. NORTH/OS creates a tailored commercial and operational platform without forcing complex pricing and order logic into spreadsheets.",
    modules: ["Customer management", "Pricing rules", "Purchasing", "Warehouse", "Order fulfilment", "Inventory control", "Delivery", "Margin reporting"],
    outcomes: ["Accurate stock and order visibility", "Consistent customer pricing rules", "Faster purchasing and fulfilment workflows", "Live margin reporting by customer and order"],
  },
  "logistics-os": {
    name: "Logistics OS",
    keyword: "logistics management software",
    secondary: ["custom logistics software", "logistics CRM", "dispatch workflow software"],
    intro: "Coordinate orders, dispatch, vehicles, drivers, documents and customer communication in one logistics management system.",
    context: "Logistics operations depend on rapid handoffs between customers, dispatch, drivers, documentation and finance. NORTH/OS turns those handoffs into visible workflows with clear exceptions, automated communication and management dashboards.",
    modules: ["Order intake", "Dispatch", "Fleet", "Driver activity", "Route workflows", "Proof of delivery", "Customer updates", "Operations dashboards"],
    outcomes: ["One live dispatch and order view", "Fewer manual customer updates", "Connected delivery documents", "Clear driver, fleet and exception reporting"],
  },
  "property-management-os": {
    name: "Property Management OS",
    keyword: "property management software",
    secondary: ["property CRM", "custom property management platform", "maintenance workflow software"],
    intro: "Control properties, tenants, contracts, maintenance, suppliers, payments and reporting in one property management system.",
    context: "Property operations create a constant flow of tenant communication, contracts, supplier work, maintenance requests and financial events. NORTH/OS connects the portfolio, people, documents and workflows so management sees issues before they become reporting problems.",
    modules: ["Property CRM", "Tenant management", "Contracts", "Maintenance", "Supplier workflows", "Payments", "Document automation", "Owner dashboards"],
    outcomes: ["One record for every property and tenant", "Controlled maintenance and supplier workflows", "Connected contracts and documents", "Clear portfolio and owner reporting"],
  },
} satisfies Record<Slug, { name: string; keyword: string; secondary: string[]; intro: string; context: string; modules: string[]; outcomes: string[] }>;

export function generateStaticParams() {
  return Object.keys(solutions).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutions[slug as Slug];
  if (!solution) return {};
  return {
    title: `${solution.name} | Custom ${solution.keyword}`,
    description: `${solution.intro} Built on the NORTH/OS Business Operating System Core.`,
    keywords: [solution.keyword, ...solution.secondary, "business operating system", "workflow automation", "custom business software"],
    alternates: { canonical: `/solutions/${slug}` },
    openGraph: { title: `${solution.name} | NORTH/OS`, description: solution.intro, url: `/solutions/${slug}`, type: "website" },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutions[slug as Slug];
  if (!solution) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${SITE_URL}/solutions/${slug}#service`, name: solution.name, description: solution.intro, serviceType: [solution.keyword, ...solution.secondary], provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "NORTH/OS", url: SITE_URL }, areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"] },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Industry solutions", item: `${SITE_URL}/#industries` }, { "@type": "ListItem", position: 3, name: solution.name, item: `${SITE_URL}/solutions/${slug}` }] },
    ],
  };

  return (
    <main className="locale-page service-page">
      <script id={`solution-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="nav shell" aria-label="Main navigation"><Link className="brand" href="/"><span className="brand-mark">N</span>NORTH<span>/OS</span></Link><div className="locale-nav"><Link href="/#platform">Platform</Link><Link href="/#industries">Industries</Link><Link href="/#process">Process</Link></div><Link className="nav-cta" href="/#contact">Book a strategy call <span>↗</span></Link></nav>

      <section className="locale-hero shell service-hero"><div className="eyebrow"><i /> INDUSTRY BUSINESS OPERATING SYSTEM</div><h1>{solution.name}.<br /><em>Your operation, connected.</em></h1><p>{solution.intro} The same proven operating core is configured around the way your company actually works.</p><div className="actions"><Link className="button primary" href="/#contact">Discuss your workflow <span>↗</span></Link><Link className="button ghost" href="/#industries">All industries <span>↓</span></Link></div><div className="locale-orbit" aria-hidden="true"><b>CRM</b><b>OPS</b><b>DATA</b><b>AI</b><i>{solution.name.split(" ")[0].toUpperCase()}<br />OS</i></div></section>

      <section className="locale-proof"><div className="shell"><div className="kicker">{solution.keyword.toUpperCase()}</div><h2>One reliable source of <em>operational truth.</em></h2><div><p>{solution.context}</p><p>Every user receives the right workspace, permissions and next actions while leadership gains a real-time view of performance, risk and exceptions.</p></div></div></section>

      <section className="locale-services shell"><div><div className="kicker">WHAT IT CAN INCLUDE</div><h2>Configured around<br /><em>your workflow.</em></h2><p className="locale-section-copy">Modules share one data model and automation layer, removing duplicate entry and inconsistent departmental reports.</p></div><div>{solution.modules.map((module, index) => <article key={module}><span>0{index + 1}</span><b>{module}</b><i>✓</i></article>)}</div></section>

      <section className="market-detail"><div className="shell market-detail-grid"><div><div className="kicker">OPERATIONAL OUTCOMES</div><h2>Software that makes complex work easier to manage.</h2><p>We analyse how work actually moves across commercial, operational and management teams. The first implementation focuses on the processes where disconnected systems create the greatest cost, delay or management risk.</p><p>As the company grows, new workflows, integrations, dashboards and AI capabilities can be added without replacing the operating foundation.</p></div><div className="market-priority-list">{solution.outcomes.map((outcome, index) => <article key={outcome}><span>0{index + 1}</span><p>{outcome}</p></article>)}</div></div></section>

      <section className="market-industries"><div className="shell market-industries-grid"><div><div className="kicker">RELATED BUSINESS SOFTWARE</div><h2>Connect the industry layer to the whole company.</h2></div><div><p>{solution.name} works with the same CRM, ERP, workflow and AI capabilities used across NORTH/OS. This gives sales, operations, employees, finance and management one connected view.</p><div className="text-link-grid">{serviceLinks.slice(0, 6).map((service) => <Link href={service.href} key={service.href}>{service.label} ↗</Link>)}</div></div></div></section>

      <section className="market-integrations shell"><div><div className="kicker">TARGET MARKETS</div><h2>{solution.name} for growing Nordic companies.</h2><p>English-language discovery and remote implementation are available for companies in the Netherlands, Norway, Sweden and Denmark.</p></div><div className="text-link-grid">{marketLinks.map((market) => <Link href={market.href} key={market.href}>{solution.keyword} in {market.label} ↗</Link>)}</div></section>

      <section className="locale-cta"><div className="shell"><h2>See how {solution.name} fits your business.</h2><p>Map the manual processes and disconnected systems your operation needs to replace.</p><Link className="button primary" href="/#contact">Book a strategy call <span>↗</span></Link><small>Remote discovery · Clear implementation roadmap</small></div></section>
      <footer><div className="shell footer-bottom"><span>© 2026 NORTH/OS</span><span>Premium Business Automation Studio</span><Link href="/">Main website ↗</Link></div></footer>
    </main>
  );
}
