import type { Metadata } from "next";
import Link from "../../components/SafeLink";
import { notFound } from "next/navigation";
import {
  CALENDLY_URL,
  SITE_URL,
  marketLinks,
  serviceLinks,
  services,
  type ServiceSlug,
} from "../../seo-data";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    keywords: [service.primaryKeyword, ...service.keywords],
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.title} | OPSYNQ`,
      description: service.description,
      url: `/services/${slug}`,
      type: "website",
      siteName: "OPSYNQ",
      images: [{ url: "/og.png", width: 1731, height: 909, alt: `${service.name} | OPSYNQ` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | OPSYNQ`,
      description: service.description,
      images: ["/og.png"],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug as ServiceSlug];
  if (!service) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/services/${slug}#service`,
        name: service.name,
        description: service.description,
        provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "OPSYNQ", url: SITE_URL },
        areaServed: ["Netherlands", "Norway", "Sweden", "Denmark"],
        audience: { "@type": "BusinessAudience", audienceType: "CEOs, founders, managing directors and operations leaders" },
        serviceType: service.keywords,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Solutions", item: `${SITE_URL}/solutions` },
          { "@type": "ListItem", position: 3, name: service.name, item: `${SITE_URL}/services/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  const relatedServices = serviceLinks.filter((link) => link.href !== `/services/${slug}`);

  return (
    <main className="locale-page service-page">
      <script id={`service-schema-${slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <SiteHeader />

      <section className="locale-hero shell service-hero">
        <div className="eyebrow"><i /> {service.eyebrow}</div>
        <h1>{service.headline.split(".")[0]}.<br /><em>Built as one system.</em></h1>
        <p>{service.intro}</p>
        <div className="actions">
          <Link className="button primary" href="/contact">Discuss your operation <span>↗</span></Link>
          <Link className="button ghost" href="/solutions">See the platform <span>↓</span></Link>
        </div>
        <div className="locale-orbit" aria-hidden="true"><b>DATA</b><b>AI</b><b>RULES</b><b>API</b><i>OP<br />SYNQ</i></div>
      </section>

      <section className="locale-proof">
        <div className="shell">
          <div className="kicker">THE BUSINESS OUTCOME</div>
          <h2>{service.name} without disconnected tools or platform limits.</h2>
          <div>
            <p>We begin with the operating model, not a feature list. Discovery identifies where information enters the business, who makes each decision, which exceptions matter and what leadership needs to see.</p>
            <p>The resulting platform connects people, rules and data in one maintainable architecture. Your company receives a system that can evolve as teams, services, locations and management requirements change.</p>
          </div>
        </div>
      </section>

      <section className="service-outcomes shell">
        <div><div className="kicker">WHAT CHANGES</div><h2>Operational clarity you can measure.</h2></div>
        <div className="service-outcome-grid">{service.outcomes.map((outcome, index) => <article key={outcome}><span>0{index + 1}</span><h3>{outcome}</h3><p>Defined during business analysis and implemented through a combination of product design, automation, permissions and integrations.</p></article>)}</div>
      </section>

      <section className="market-detail">
        <div className="shell market-detail-grid">
          <div>
            <div className="kicker">ONE MODULAR BUSINESS OS</div>
            <h2>Start with the priority. Keep one foundation.</h2>
            <p>Companies rarely need every possible module on day one. We define a focused first implementation around the processes with the highest operational value, then connect additional departments and capabilities in controlled phases.</p>
            <p>Because CRM, projects, employees, documents, finance, reporting and automation share the same core, each new capability strengthens the system instead of creating another data silo.</p>
          </div>
          <div className="market-priority-list">
            {service.modules.map((module, index) => <article key={module}><span>0{index + 1}</span><p>{module}</p></article>)}
          </div>
        </div>
      </section>

      <section className="market-integrations shell service-process">
        <div>
          <div className="kicker">IMPLEMENTATION PROCESS</div>
          <h2>From operational analysis to a system employees can use.</h2>
          <p>Discovery and business analysis establish the scope. UX/UI design makes complex work clear before development. Implementation, migration, integration, testing and training are delivered in practical stages with a visible improvement roadmap.</p>
        </div>
        <div className="service-steps">
          {["Discovery", "Business analysis", "UX/UI design", "Implementation", "Integration", "Launch", "Continuous improvement"].map((step, index) => <span key={step}><i>0{index + 1}</i>{step}</span>)}
        </div>
      </section>

      <section className="market-industries">
        <div className="shell market-industries-grid">
          <div><div className="kicker">ENGLISH-LANGUAGE NORDIC MARKETS</div><h2>Built remotely for growing European companies.</h2></div>
          <div>
            <p>We target decision makers in the Netherlands, Norway, Sweden and Denmark. Every project remains unique to the client&apos;s workflow; market pages provide local context without pretending to be a generic local SaaS product.</p>
            <div className="text-link-grid">{marketLinks.map((market) => <Link href={market.href} key={market.href}>{service.name} in {market.label} ↗</Link>)}</div>
          </div>
        </div>
      </section>

      <section className="market-faq shell">
        <div><div className="kicker">{service.primaryKeyword.toUpperCase()}</div><h2>Questions before implementation.</h2></div>
        <div>{service.faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="related-services shell">
        <div className="kicker">RELATED CAPABILITIES</div>
        <div>{relatedServices.map((related) => <Link href={related.href} key={related.href}>{related.label}<span>↗</span></Link>)}</div>
      </section>

      <section className="locale-cta"><div className="shell"><h2>Map the right {service.name.toLowerCase()} solution.</h2><p>Show us the workflows, spreadsheets and disconnected systems creating operational friction. We will identify a practical first implementation.</p><Link className="button primary" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a strategy call <span>↗</span></Link><small>Remote discovery · Netherlands · Norway · Sweden · Denmark</small></div></section>

      <SiteFooter />
    </main>
  );
}
