import type { Metadata } from "next";
import Link from "../components/SafeLink";
import DashboardPreview from "../components/DashboardPreview";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { SITE_URL } from "../seo-data";

export const metadata: Metadata = {
  title: "Construction Management Software & Construction CRM",
  description: "Custom construction management software and construction CRM for leads, estimates, projects, sites, crews, documents, costs, variations and reporting.",
  keywords: ["construction management software", "construction CRM", "software for construction companies", "construction workflow automation", "custom construction software"],
  alternates: { canonical: "/construction-os" },
  openGraph: { title: "Construction OS | OPSYNQ", description: "One connected operating system for construction companies.", url: "/construction-os", type: "website", siteName: "OPSYNQ", images: [{ url: "/og.png", width: 1731, height: 909, alt: "OPSYNQ Construction OS" }] },
  twitter: { card: "summary_large_image", title: "Construction OS | OPSYNQ", description: "One connected operating system for construction companies.", images: ["/og.png"] },
};

const modules = [
  ["Construction CRM", "Capture every enquiry, source, contact, site opportunity and follow-up in a pipeline built around your sales process."],
  ["Estimates & quotations", "Build controlled scopes, pricing, margin and approval workflows without copying information between spreadsheets."],
  ["Projects & sites", "Turn an approved opportunity into a live project with milestones, responsibilities, documents and management visibility."],
  ["Crews & subcontractors", "Coordinate internal teams and external partners with role-based tasks, schedules, requests and activity history."],
  ["Daily reporting", "Give site teams a focused way to record progress, issues, photos, labour, materials and next actions."],
  ["Documents & approvals", "Control drawings, contracts, variations, certificates, signatures and version history in the relevant project context."],
  ["Cost & margin control", "Connect estimates, purchasing, commitments, variations, invoices and actual cost into one operational picture."],
  ["Client & leadership dashboards", "Provide the right view to customers, project leaders and directors without exposing unrelated internal data."],
];

const faqs = [
  ["Is Construction OS off-the-shelf construction software?", "No. It is a custom Business Operating System built on the OPSYNQ core and configured around the company's sales, project, site, document and financial workflows."],
  ["Can it replace our construction CRM and spreadsheets?", "Yes, where replacement makes operational sense. It can also integrate accounting, document, communication and specialist systems that the business wants to keep."],
  ["Can site teams use it on mobile devices?", "Yes. Field workflows can be designed for mobile use, with focused forms, task views, photo capture and role-specific information."],
  ["Can we implement one module first?", "Yes. A common starting point is construction CRM plus estimating, or project and site reporting. The shared data model makes later expansion easier."],
  ["Can it connect to accounting and Microsoft 365?", "OPSYNQ can integrate with accounting platforms, Microsoft 365, Google Workspace and other systems through available APIs and approved project scope."],
];

export default function ConstructionOSPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${SITE_URL}/construction-os#service`, name: "Construction OS", description: metadata.description, serviceType: ["Construction Management Software", "Construction CRM", "Construction Workflow Automation"], provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "OPSYNQ", url: SITE_URL }, areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"] },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Construction OS", item: `${SITE_URL}/construction-os` }] },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return (
    <main className="construction-page">
      <script id="construction-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <section className="hero shell construction-hero"><div className="hero-copy"><div className="eyebrow"><i /> CONSTRUCTION MANAGEMENT SOFTWARE</div><h1>Construction OS.<br /><em>From lead to site to margin.</em></h1><p>One custom construction CRM and operations platform for enquiries, estimates, projects, sites, crews, subcontractors, documents, variations, costs and management reporting.</p><div className="actions"><Link className="button primary" href="/contact">Book a construction demo <span>↗</span></Link><a className="button ghost" href="#modules">See the modules <span>↓</span></a></div></div><DashboardPreview /></section>

      <section className="construction-problem"><div className="shell compact-heading"><div><div className="kicker">THE OPERATIONAL PROBLEM</div><h2>The project is connected.<br /><em>The software usually is not.</em></h2></div><div><p>Leads live in one CRM. Estimates live in Excel. Site updates arrive through WhatsApp. Documents sit in folders. Cost information reaches management after the decision has already been made.</p><p>Construction OS creates one operational record from the first enquiry through handover—without forcing every role into the same complicated interface.</p></div></div></section>

      <section className="construction-modules shell" id="modules"><div className="compact-heading"><div><div className="kicker">ONE CONSTRUCTION OPERATING SYSTEM</div><h2>Every stage visible.<br /><em>Every handoff controlled.</em></h2></div><p>Modules share customers, projects, permissions, documents and reporting. The system can begin with one high-value process and expand across the company.</p></div><div className="construction-module-grid">{modules.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="construction-workflow"><div className="shell"><div className="kicker">CONNECTED PROJECT LIFECYCLE</div><h2>Commercial, operational and financial data move together.</h2><div className="workflow-line">{[["01","Enquiry","Source, client and opportunity"],["02","Estimate","Scope, price and margin"],["03","Contract","Approval and documents"],["04","Delivery","Site, team and progress"],["05","Control","Cost, variation and risk"],["06","Handover","Completion and reporting"]].map(([number,title,text])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="construction-visibility shell"><div><div className="kicker">ROLE-BASED VISIBILITY</div><h2>One system does not mean one screen for everyone.</h2><p>Directors see portfolio performance, cash exposure, margin and risk. Project managers see milestones, approvals, variations and responsibilities. Site teams receive mobile-focused tasks and forms. Clients see only the updates and documents intended for them.</p><p>Roles, permissions, audit history and approval rules are defined during business analysis so the platform supports accountability across employees, subcontractors and business units.</p></div><div className="visibility-cards"><article><span>DIRECTOR</span><b>Portfolio, margin, cash and exceptions</b></article><article><span>PROJECT MANAGER</span><b>Programme, teams, documents and cost</b></article><article><span>SITE TEAM</span><b>Tasks, progress, issues and evidence</b></article><article><span>CLIENT</span><b>Approvals, status and shared documents</b></article></div></section>

      <section className="construction-integrations"><div className="shell compact-heading"><div><div className="kicker">YOUR EXISTING STACK</div><h2>Connect what works.<br /><em>Replace what slows you down.</em></h2></div><div><p>OPSYNQ can connect accounting, Microsoft 365, Google Workspace, email, messaging, advertising sources, existing databases and construction-specific services through available APIs.</p><p>Integration scope is validated during discovery. We do not claim a partnership with third-party providers simply because a technical connection is possible.</p></div></div></section>

      <section className="market-faq shell"><div><div className="kicker">CONSTRUCTION SOFTWARE FAQ</div><h2>Questions before we map the workflow.</h2></div><div>{faqs.map(([question,answer],index)=><details key={question} open={index===0}><summary><span>0{index+1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></section>

      <section className="construction-markets"><div className="shell"><div><div className="kicker">ENGLISH-LANGUAGE NORDIC MARKETS</div><h2>Construction OS for companies across Northern Europe.</h2></div><div className="text-link-grid"><Link href="/nl">Construction software in Netherlands ↗</Link><Link href="/no">Construction software in Norway ↗</Link><Link href="/sv">Construction software in Sweden ↗</Link><Link href="/da">Construction software in Denmark ↗</Link></div></div></section>

      <section className="compact-cta"><div className="shell"><div><div className="kicker">MAP YOUR CONSTRUCTION OPERATION</div><h2>See what Construction OS could replace.</h2></div><div><p>Bring the spreadsheets, tools and manual handoffs. We will identify a practical first implementation.</p><Link className="button primary" href="/contact">Book a construction demo <span>↗</span></Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
