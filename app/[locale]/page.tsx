import type { Metadata } from "next";
import Link from "../components/SafeLink";
import { notFound } from "next/navigation";
import {
  SITE_URL,
  marketAlternates,
  markets,
  serviceLinks,
  type MarketLocale,
} from "../seo-data";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const marketFaqs = [
  [
    "Can OPSYNQ integrate the software we already use?",
    "Yes. We can connect accounting, CRM, advertising, Microsoft 365, Google Workspace, databases and specialist platforms through their available APIs. The goal is one reliable operating flow, not change for its own sake.",
  ],
  [
    "Is this standard SaaS or custom business software?",
    "OPSYNQ is a tailored Business Operating System. The data model, permissions, workflows, dashboards and integrations are configured or developed around your company instead of forcing your teams into a fixed subscription product.",
  ],
  [
    "Can implementation be delivered remotely?",
    "Yes. Discovery, business analysis, design, implementation, training and continuous improvement can be delivered remotely with structured workshops and clear stakeholder ownership.",
  ],
  [
    "How do you handle security and GDPR requirements?",
    "Security, access control, data location, audit history and provider selection are defined during discovery. The final architecture is aligned with the data and operational risk of the specific company.",
  ],
];

export function generateStaticParams() {
  return Object.keys(markets).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const market = markets[locale as MarketLocale];
  if (!market) return {};

  return {
    title: `Business Automation Software in ${market.country}`,
    description: market.description,
    keywords: [market.primaryKeyword, ...market.secondaryKeywords],
    alternates: { canonical: `/${locale}`, languages: marketAlternates },
    openGraph: {
      title: `${market.headline} | OPSYNQ`,
      description: market.description,
      url: `/${locale}`,
      type: "website",
    },
  };
}

export default async function MarketPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const market = markets[locale as MarketLocale];
  if (!market) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/${locale}#service`,
        name: `Business automation software in ${market.country}`,
        description: market.description,
        provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "OPSYNQ", url: SITE_URL },
        areaServed: { "@type": "Country", name: market.country },
        audience: { "@type": "BusinessAudience", audienceType: "CEOs, founders, managing directors and operations leaders" },
        serviceType: ["Custom Business Software", "Custom CRM Development", "Custom ERP Development", "Workflow Automation", "AI Business Automation"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: market.country, item: `${SITE_URL}/${locale}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: marketFaqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className="locale-page">
      <script id={`market-schema-${locale}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <SiteHeader />

      <section className="locale-hero shell">
        <div className="eyebrow"><i /> BUSINESS AUTOMATION · {market.country.toUpperCase()}</div>
        <h1>{market.headline.split(" for ")[0]}<br /><em>for {market.adjective} companies.</em></h1>
        <p>Replace disconnected CRM software, Excel spreadsheets and manual work with one custom Business Operating System—built around your workflows, people, data and operational priorities.</p>
        <div className="actions">
          <Link className="button primary" href="/contact">Book a strategy call <span>↗</span></Link>
          <Link className="button ghost" href="/services/business-automation-software">Explore business automation <span>↓</span></Link>
        </div>
        <div className="locale-orbit" aria-hidden="true"><b>CRM</b><b>AI</b><b>ERP</b><b>OPS</b><i>ONE<br />SYSTEM</i></div>
      </section>

      <section className="locale-proof">
        <div className="shell">
          <div className="kicker">OPSYNQ / {market.country.toUpperCase()}</div>
          <h2>Custom business software should fit the operation. <em>Precisely.</em></h2>
          <div>
            <p>{market.context}</p>
            <p>Leadership gains one reliable view of customers, projects, employees, finance and performance. Teams get the information, responsibilities and automation they need without moving work between disconnected tools.</p>
          </div>
        </div>
      </section>

      <section className="locale-services shell">
        <div>
          <div className="kicker">COMMERCIAL SOFTWARE CAPABILITIES</div>
          <h2>Everything your company needs.<br /><em>Working as one.</em></h2>
          <p className="locale-section-copy">Each capability shares the same data, permissions and automation layer. Start with the most valuable operational problem and expand without rebuilding the foundation.</p>
        </div>
        <div>
          {serviceLinks.map((service, index) => (
            <Link className="locale-service-link" href={service.href} key={service.href}>
              <span>0{index + 1}</span><b>{service.label}</b><i>↗</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="market-detail">
        <div className="shell market-detail-grid">
          <div>
            <div className="kicker">BUILT FOR {market.adjective.toUpperCase()} OPERATIONS</div>
            <h2>From manual coordination to one operational system.</h2>
            <p>Custom software is valuable when the business has outgrown generic CRM packages, spreadsheets and isolated departmental tools. OPSYNQ maps the actual flow of enquiries, approvals, projects, resources, documents, invoices and management decisions before defining the platform.</p>
            <p>The result is not another application sitting beside the existing stack. It is a connected management layer that can replace weak tools, integrate the systems worth keeping and give every employee a clear operational workspace.</p>
          </div>
          <div className="market-priority-list">
            {market.priorities.map((priority, index) => <article key={priority}><span>0{index + 1}</span><p>{priority}</p></article>)}
          </div>
        </div>
      </section>

      <section className="market-integrations shell">
        <div>
          <div className="kicker">LOCAL & GLOBAL INTEGRATIONS</div>
          <h2>Connect the systems your teams already depend on.</h2>
          <p>Depending on API availability and project scope, your Business OS can exchange data with local finance platforms, productivity suites, advertising channels, private databases and specialist industry software. We do not claim partnerships with the providers listed below.</p>
        </div>
        <div className="market-integration-grid">
          {market.integrations.map((integration) => <span key={integration}>{integration}<i>API</i></span>)}
          <span>Any documented API<i>+</i></span>
        </div>
      </section>

      <section className="market-industries">
        <div className="shell market-industries-grid">
          <div>
            <div className="kicker">INDUSTRY BUSINESS OPERATING SYSTEMS</div>
            <h2>Designed for complex, multi-stage work.</h2>
          </div>
          <div>
            <p>Our platform is suited to {market.industries}. The same Business Operating System core is configured around the data, roles, controls and workflows of each client.</p>
            <div className="text-link-grid">
              <Link href="/construction-os">Construction management software ↗</Link>
              <Link href="/solutions/manufacturing-os">Manufacturing operations software ↗</Link>
              <Link href="/solutions/logistics-os">Logistics management software ↗</Link>
              <Link href="/solutions/distribution-os">Distribution management software ↗</Link>
              <Link href="/solutions/property-management-os">Property management software ↗</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="market-faq shell">
        <div><div className="kicker">QUESTIONS FROM DECISION MAKERS</div><h2>Before we map your operation.</h2></div>
        <div>{marketFaqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="locale-cta">
        <div className="shell">
          <h2>Ready to simplify your {market.adjective.toLowerCase()} operation?</h2>
          <p>Tell us where disconnected systems and manual work are slowing the company down. We will map what one connected Business Operating System could change.</p>
          <Link className="button primary" href="/contact">Book a strategy call <span>↗</span></Link>
          <small>{market.city} · Remote implementation across {market.country}</small>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
