import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "./components/ContactForm";
import DashboardPreview from "./components/DashboardPreview";
import Link from "./components/SafeLink";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { SITE_URL } from "./seo-data";

export const metadata: Metadata = {
  title: { absolute: "Custom Business Operating Systems & Automation Software | OPSYNQ" },
  description: "OPSYNQ builds custom Business Operating Systems, CRM, ERP and workflow automation for growing companies in the Netherlands, Norway, Sweden and Denmark." ,
  keywords: [
    "business operating system",
    "business automation software",
    "custom business software",
    "custom CRM development",
    "workflow automation",
    "business process automation",
    "custom ERP",
    "operations management software",
    "AI business automation",
    "construction management software",
  ],
  alternates: { canonical: "/" },
};

const businessProblems = [
  ["01", "Data lives in different places", "Customer details, project updates, documents and financial data are split across spreadsheets and disconnected tools."],
  ["02", "Work depends on manual follow-up", "Employees copy information, chase approvals and rebuild the same reports instead of moving the operation forward."],
  ["03", "Management sees problems too late", "There is no reliable real-time view of workload, delivery, cash flow, margins or accountability."],
];

const advantages = [
  ["One source of truth", "Customers, operations, employees, finance and documents work from the same structured data."],
  ["Built around your workflow", "Roles, permissions, stages and business rules reflect how your company actually operates."],
  ["Automation across departments", "Approvals, tasks, notifications, documents and handoffs move automatically."],
  ["Connect what you already use", "Google, Meta, Microsoft, accounting systems, existing databases and documented APIs can stay connected."],
  ["Complete ownership", "Your operating platform becomes a long-term business asset without generic SaaS limitations."],
  ["Designed to expand", "Start with the operational bottleneck, then add teams, workflows, companies and industry modules."],
];

const capabilities = [
  ["Custom CRM", "Leads, customers, pipelines, communication and commercial activity in one tailored workspace.", "/services/custom-crm-development"],
  ["Operations & projects", "Projects, tasks, responsibilities, deadlines, approvals and delivery workflows connected end to end.", "/solutions"],
  ["Finance & reporting", "Invoices, costs, margins, forecasts and management dashboards built around the decisions you make.", "/services/custom-erp-development"],
  ["Documents & approvals", "Generate, route, sign, store and retrieve business documents without manual duplication.", "/services/workflow-automation"],
  ["ERP & inventory", "Custom ERP, purchasing, warehouse, inventory, production and logistics modules where required.", "/services/custom-erp-development"],
  ["AI automation", "AI assistants and agents that classify, prepare, summarise and act inside controlled business workflows.", "/services/ai-business-automation"],
];

const verticalCrmFeatures = [
  ["Facebook lead capture", "New enquiries enter the CRM with campaign source, contact details and arrival time ready for manager follow-up."],
  ["Technical project brief", "Area, problem, materials, services, photos, answers and site requirements become one structured object record."],
  ["Quotation calculator", "Calculate material consumption, reserve, margin and delivery before generating a controlled commercial offer."],
  ["Manager SLA control", "Track first contact, response speed, fresh comments, daily tasks and deals that need immediate attention."],
  ["Contractors & documents", "Connect the customer, project, contractor, quotation, invoice, files and delivery activity in one history."],
  ["Executive sales dashboard", "See leads, response time, quotations, payments, win rate and reasons for lost deals by manager and source."],
];

const crmStages = ["New lead", "Brief", "Quotation", "Negotiation", "Invoice", "Paid / delivery"];

const productScreens = [
  {
    src: "/product/ai-assistant.jpg",
    width: 2200,
    height: 1204,
    label: "AI ASSISTANT",
    title: "Ask the operation directly.",
    text: "Analyse projects, invoices, teams and schedules through a controlled assistant connected to company data.",
    alt: "OPSYNQ Construction OS AI Assistant interface with project and finance questions",
  },
  {
    src: "/product/construction-teams.jpg",
    width: 2200,
    height: 1203,
    label: "WORKFORCE CONTROL",
    title: "See every crew and assignment.",
    text: "Track availability, foremen, performance, hours, incidents and the active project for every construction team.",
    alt: "OPSYNQ Construction OS teams dashboard showing crews, performance and active projects",
  },
  {
    src: "/product/subcontractors.jpg",
    width: 2200,
    height: 1200,
    label: "SUBCONTRACTOR NETWORK",
    title: "Control trade partners in one place.",
    text: "Manage specialties, ratings, contacts, completed work, invoiced value and current project assignments.",
    alt: "OPSYNQ Construction OS subcontractor management interface",
  },
];

const industries = [
  ["Construction", "Leads, estimates, sites, crews, subcontractors, costs and variations.", "/construction-os"],
  ["Manufacturing", "Orders, production, materials, quality, capacity and operational reporting.", "/solutions/manufacturing-os"],
  ["Distribution & wholesale", "Customers, pricing, stock, purchasing, fulfilment and margin control.", "/solutions/distribution-os"],
  ["Logistics", "Orders, dispatch, fleet workflows, documents, costs and delivery visibility.", "/solutions/logistics-os"],
  ["Property management", "Properties, tenants, maintenance, documents, payments and portfolio reporting.", "/solutions/property-management-os"],
  ["Professional services", "Sales, client onboarding, delivery, utilisation, billing and account visibility.", "/contact"],
];

const process = [
  ["01", "Discovery", "We identify the operational bottleneck, commercial goal and systems already in place."],
  ["02", "Business analysis", "We map people, data, permissions, exceptions and the workflows the platform must support."],
  ["03", "UX & system design", "We design a clear operating model and interfaces employees can use without unnecessary complexity."],
  ["04", "Build & integration", "The Business OS is developed in focused releases and connected to the tools worth keeping."],
  ["05", "Launch & improvement", "We support migration, training, rollout and the roadmap for the next operational priorities."],
];

const faqs = [
  ["What is a Business Operating System?", "A Business Operating System is one custom platform that connects the workflows, data and teams required to run your company. It can combine CRM, operations, projects, employees, finance, documents, reporting, automation and integrations."],
  ["Why choose custom software instead of another CRM or ERP?", "Generic software makes the business adapt to fixed objects, limits and subscription tiers. OPSYNQ is designed around your roles, processes and competitive workflows, while connecting systems that still provide value."],
  ["How long does implementation take?", "The timeline depends on scope, integrations and data migration. We define a focused first release during discovery, then expand the platform in controlled stages rather than attempting an oversized launch."],
  ["Can OPSYNQ integrate our existing systems and databases?", "Yes. We can connect advertising platforms, Google Workspace, Microsoft 365, accounting tools, existing databases and other systems with a documented, suitable API."],
  ["Can we add new modules later?", "Yes. The architecture is designed for continuous expansion. New departments, workflows, dashboards, automations and industry-specific modules can be introduced as the business grows."],
  ["Who is OPSYNQ built for?", "OPSYNQ is designed for growing companies, typically with 10–500+ employees, that have outgrown spreadsheets, disconnected CRM tools or manual operational coordination."],
];

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "OPSYNQ",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.png`,
        description: "Premium Business Automation Studio building custom Business Operating Systems for growing companies.",
        areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"],
        knowsAbout: ["Business Operating Systems", "Business Automation Software", "Custom CRM", "Custom ERP", "Workflow Automation", "AI Business Automation", "Construction Management Software"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "OPSYNQ",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#business-os`,
        name: "Custom Business Operating Systems",
        serviceType: "Custom business software and business process automation",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"],
        audience: { "@type": "BusinessAudience", audienceType: "CEOs, founders, managing directors and operations leaders" },
        offers: { "@type": "Offer", priceCurrency: "EUR", price: "5000", description: "Custom implementation starting from €5,000" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className="sales-home">
      <script id="home-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> BUSINESS SYSTEMS, NOT WEBSITES</div>
          <h1>Custom Business<br /><em>Operating Systems.</em></h1>
          <p>One platform built around the way your company works. Connect CRM, operations, employees, finance, documents, reporting, integrations and AI—without forcing the business into another generic tool.</p>
          <div className="actions"><Link className="button primary" href="#consultation">Book a strategy call <span>↗</span></Link><Link className="button ghost" href="#capabilities">Explore the system <span>↓</span></Link></div>
          <div className="hero-note"><span>For companies with 10–500+ employees</span><span className="implementation-price">Implementation from €5,000</span></div>
        </div>
        <DashboardPreview />
      </section>

      <section className="trust" aria-label="Systems OPSYNQ can replace"><div className="shell trust-inner"><span>Replace operational friction</span>{["EXCEL WORKAROUNDS", "DISCONNECTED CRM", "MANUAL APPROVALS", "DUPLICATE DATA", "DELAYED REPORTING"].map((item) => <b key={item}>{item}</b>)}</div></section>

      <section className="home-problem">
        <div className="shell compact-heading"><div><div className="kicker">WHEN THE BUSINESS OUTGROWS ITS TOOLS</div><h2>Growth creates complexity.<br /><em>Your systems should remove it.</em></h2></div><p>More customers, employees and services often mean more spreadsheets, more subscriptions and more manual coordination. A custom Business OS gives the company a dependable operational foundation.</p></div>
        <div className="shell problem-grid">{businessProblems.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="home-advantages">
        <div className="shell compact-heading"><div><div className="kicker">WHY OPSYNQ</div><h2>A system designed<br /><em>for the business you run.</em></h2></div><p>Not development hours. Not another off-the-shelf subscription. OPSYNQ delivers a business management platform that becomes part of how your company operates and improves.</p></div>
        <div className="shell advantage-grid">{advantages.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="home-capabilities" id="capabilities">
        <div className="shell compact-heading"><div><div className="kicker">ONE PLATFORM / THE WHOLE OPERATION</div><h2>Everything your teams need.<br /><em>Connected by design.</em></h2></div><p>Build the modules that matter now and expand when the next bottleneck appears. Every part shares the same data, permissions and business logic.</p></div>
        <div className="shell capability-grid">{capabilities.map(([title, text, href], index) => <Link href={href} key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><i>↗</i></Link>)}</div>
      </section>

      <section className="vertical-crm-showcase" aria-labelledby="vertical-crm-title">
        <div className="shell vertical-crm-heading">
          <div><div className="kicker">REAL-WORLD BUSINESS OS EXAMPLE</div><h2 id="vertical-crm-title">From Facebook lead<br /><em>to paid construction order.</em></h2></div>
          <div><p>OPSYNQ can become a vertical construction CRM for material suppliers—not just a place to store contacts, but the complete sales and project workflow from first response to quotation, invoice and delivery.</p><span>Illustrative demo workspace · No real customer data</span></div>
        </div>

        <div className="shell vertical-crm-ui" aria-label="Illustrative construction CRM workflow">
          <header><div><span>CONSTRUCTION SALES OS</span><h3>Project opportunity #2048</h3></div><div className="crm-demo-label">DEMO WORKSPACE</div></header>
          <div className="crm-stage-row">{crmStages.map((stage, index) => <div className={index < 3 ? "complete" : index === 3 ? "active" : ""} key={stage}><i>{index < 3 ? "✓" : index + 1}</i><span>{stage}</span></div>)}</div>
          <div className="crm-ui-grid">
            <div className="crm-project-card">
              <div className="crm-card-title"><div><small>PROJECT BRIEF</small><b>Northwind Warehouse</b></div><span>Updated 8 min ago</span></div>
              <div className="crm-project-metrics"><div><small>Lead source</small><b>Meta Lead Ads</b></div><div><small>First response</small><b>06 min</b></div><div><small>Project area</small><b>1,240 m²</b></div><div><small>Quote value</small><b>€28,460</b></div></div>
              <div className="crm-brief-table"><div><span>Application</span><b>Roof insulation</b></div><div><span>Material</span><b>PIR 120 mm</b></div><div><span>Reserve</span><b>8% included</b></div><div><span>Delivery</span><b>Oslo · Week 36</b></div></div>
            </div>
            <aside className="crm-activity-card">
              <div className="crm-card-title"><div><small>MANAGER CONTROL</small><b>Next best actions</b></div><i /> </div>
              <div className="crm-sla"><span>SLA STATUS</span><b>On track</b><small>First response target: 15 min</small></div>
              <div className="crm-activity-list"><div><i>01</i><span><b>Confirm delivery access</b><small>Due today · Alex K.</small></span></div><div><i>02</i><span><b>Update contractor price</b><small>Waiting for supplier</small></span></div><div><i>03</i><span><b>Schedule quotation follow-up</b><small>Tomorrow · 10:30</small></span></div></div>
              <div className="crm-quote-action" aria-hidden="true">Prepare quotation <span>↗</span></div>
            </aside>
          </div>
        </div>

        <div className="shell vertical-crm-feature-grid">{verticalCrmFeatures.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="shell vertical-crm-cta"><div><b>Customer → project → contractor → quotation → invoice → logistics</b><p>One visible sales process for managers, technical teams and leadership.</p></div><Link className="button primary" href="/construction-os">Explore Construction OS <span>↗</span></Link></div>
      </section>

      <section className="real-product-showcase" aria-labelledby="real-product-title">
        <div className="shell real-product-heading"><div><div className="kicker">INSIDE THE ACTUAL PRODUCT</div><h2 id="real-product-title">Construction OS.<br /><em>Built and working.</em></h2></div><div><p>These are real screens from the OPSYNQ product experience—not a stock dashboard or a design concept. Each workspace turns operational data into a clear next decision.</p><span>Actual interface · Demo data shown</span></div></div>

        <figure className="shell product-shot product-shot-featured">
          <div className="product-browser-bar"><i /><i /><i /><span>OPSYNQ / Executive Dashboard</span><b>LIVE PRODUCT UI</b></div>
          <div className="product-image-wrap"><Image src="/product/construction-dashboard.jpg" width={2200} height={1206} sizes="(max-width: 900px) 100vw, 1240px" alt="OPSYNQ Construction OS executive dashboard with projects, crews, revenue, profit, invoices and cash position" /></div>
          <figcaption><div><span>EXECUTIVE CONTROL</span><h3>One view of the entire construction company.</h3></div><p>Projects, delays, tasks, crews, revenue, profit, outstanding invoices and cash position—visible without waiting for manual reporting.</p></figcaption>
        </figure>

        <div className="shell product-screen-grid">{productScreens.map((screen) => <figure className="product-shot" key={screen.src}><div className="product-browser-bar"><i /><i /><i /><span>OPSYNQ</span></div><div className="product-image-wrap"><Image src={screen.src} width={screen.width} height={screen.height} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 410px" alt={screen.alt} /></div><figcaption><span>{screen.label}</span><h3>{screen.title}</h3><p>{screen.text}</p></figcaption></figure>)}</div>
      </section>

      <section className="home-flow">
        <div className="shell flow-layout">
          <div><div className="kicker">FROM FIRST CLICK TO MANAGEMENT REPORT</div><h2>One continuous<br /><em>operating flow.</em></h2><p>A lead from Google or Meta can become a customer, project, task plan, document set, invoice and management report—without rebuilding the same information across departments.</p></div>
          <div className="operating-flow" aria-label="Connected business workflow"><span>Advertising<small>Google · Meta</small></span><i>→</i><span>CRM<small>Lead · Customer</small></span><i>→</i><span>Operations<small>Project · Task</small></span><i>→</i><span>Finance<small>Cost · Invoice</small></span><i>→</i><span>Leadership<small>Dashboard · AI</small></span></div>
        </div>
        <div className="shell integration-cloud" aria-label="Available integrations">{["Google Ads", "Meta / Facebook", "Excel", "Existing databases", "Google Workspace", "Microsoft 365", "WhatsApp", "Telegram", "Stripe", "Accounting software", "OpenAI", "Any documented API"].map((item) => <span key={item}>{item}<i>+</i></span>)}</div>
      </section>

      <section className="home-industries">
        <div className="shell industries-layout">
          <div className="industries-intro"><div className="kicker">INDUSTRY OPERATING SYSTEMS</div><h2>Built for the reality<br /><em>of your operation.</em></h2><p>The same Business OS foundation is configured around each company’s terminology, roles, compliance needs and competitive workflows.</p><Link href="/solutions">Explore all industry solutions ↗</Link></div>
          <div className="industry-sales-list">{industries.map(([title, text, href], index) => <Link href={href} key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><i>↗</i></Link>)}</div>
        </div>
      </section>

      <section className="construction-feature">
        <div className="shell construction-feature-grid">
          <div><div className="kicker">FLAGSHIP INDUSTRY SOLUTION</div><h2>Construction OS.</h2><p>Custom construction management software connecting leads, estimates, projects, sites, crews, subcontractors, documents, costs, variations and client reporting.</p><Link className="button primary" href="/construction-os">Explore Construction OS <span>↗</span></Link></div>
          <div className="construction-flow" aria-label="Construction workflow"><span>Lead<small>Source · CRM</small></span><i>→</i><span>Estimate<small>Scope · Margin</small></span><i>→</i><span>Site<small>Crew · Progress</small></span><i>→</i><span>Finance<small>Cost · Invoice</small></span></div>
        </div>
      </section>

      <section className="home-process">
        <div className="shell compact-heading"><div><div className="kicker">A CLEAR IMPLEMENTATION METHOD</div><h2>Start with the bottleneck.<br /><em>Build for the long term.</em></h2></div><p>We combine business analysis, product strategy, UX and engineering. The first release solves a defined operational problem and creates a stable foundation for expansion.</p></div>
        <div className="shell process-sales-list">{process.map(([number, title, text]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="home-markets">
        <div className="shell markets-layout"><div><div className="kicker">NORTHERN EUROPE / ENGLISH-LANGUAGE DELIVERY</div><h2>Remote discovery.<br /><em>Serious implementation.</em></h2></div><div><p>OPSYNQ works with decision makers who need practical business automation software, clear ownership and a platform that can evolve with the company.</p><div className="market-links"><Link href="/nl">Netherlands ↗</Link><Link href="/no">Norway ↗</Link><Link href="/sv">Sweden ↗</Link><Link href="/da">Denmark ↗</Link></div></div></div>
      </section>

      <section className="home-faq">
        <div className="shell faq-grid"><div><div className="kicker">DECISION-MAKER FAQ</div><h2>Before you<br /><em>book a call.</em></h2><p>Need a direct answer?</p><a href="mailto:hello@opsynq.net">hello@opsynq.net ↗</a></div><div>{faqs.map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="home-consultation" id="consultation">
        <div className="shell consultation-layout">
          <div className="consultation-copy"><div className="kicker">FREE INITIAL STRATEGY CALL</div><h2>Ready to run the business<br /><em>from one system?</em></h2><p>Tell us what is slowing the operation down. We will discuss the workflows, data and systems involved, then identify a practical first implementation.</p><div className="consultation-points"><span>✓ Focused around a real operational bottleneck</span><span>✓ Clear recommendation for the first release</span><span>✓ No obligation and no generic sales presentation</span><span>✓ Custom implementations start from €5,000</span></div><small>For CEOs, founders, managing directors and operations leaders.</small></div>
          <ContactForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
