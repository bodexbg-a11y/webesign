import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Operating System & Automation Software | NORTH/OS",
  description: "One custom Business Operating System for CRM, operations, employees, finance, documents, reporting, integrations and AI automation.",
};

const buildItems = [
  ["01", "Custom CRM", "A commercial system shaped around your pipeline, relationships, and decisions."],
  ["02", "ERP Systems", "One reliable operational core for resources, inventory, delivery, and finance."],
  ["03", "Business Operating Systems", "Your complete company architecture—designed as one connected platform."],
  ["04", "Client Portals", "Secure, self-service spaces that make every client interaction effortless."],
  ["05", "Employee Portals", "A focused workspace for people, policies, requests, and internal services."],
  ["06", "Internal Dashboards", "Live operational truth for leadership and every team that needs it."],
  ["07", "AI Assistants", "Private, context-aware copilots that turn company knowledge into action."],
  ["08", "Workflow Automation", "Remove repetitive handoffs and build consistency into every process."],
  ["09", "Document Management", "Create, approve, sign, find, and govern critical business documents."],
  ["10", "Inventory Systems", "Real-time control of stock, purchasing, movement, and demand."],
  ["11", "Finance Dashboards", "Revenue, cost, cash flow, and margin—visible without spreadsheet archaeology."],
  ["12", "Reporting Systems", "Decision-ready reports delivered automatically to the right people."],
  ["13", "Custom Mobile Apps", "Business-critical workflows, designed for the field and the real world."],
  ["14", "API Integrations", "Connect the tools you keep and eliminate double entry everywhere else."],
];

const benefits = [
  ["∞", "No platform ceiling", "No per-seat pricing or feature gates deciding how your company can operate."],
  ["↳", "Built around your workflow", "The system adapts to the way your business creates value—not the reverse."],
  ["⌁", "Unlimited integrations", "Connect the tools, data, and partners that your operation depends on."],
  ["✦", "AI-native automation", "Put intelligence inside real workflows with secure, governed automations."],
  ["◫", "Complete ownership", "Your platform, your data, your intellectual property, your competitive advantage."],
  ["↑", "Scalable architecture", "Engineered for the team you have now and the organization you are building."],
];

const industries = ["Construction", "Manufacturing", "Healthcare", "Logistics", "Real Estate", "Wholesale", "Professional Services", "E-commerce"];
const process = ["Discovery", "Business Analysis", "UX/UI Design", "System Implementation", "Integration", "Launch", "Continuous Improvement"];
const integrations = ["Google Ads", "Meta / Facebook", "Excel", "Google Workspace", "Microsoft 365", "OpenAI", "Your databases", "Any API"];

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"NORTH/OS","url":"https://webesign.vercel.app","description":"Premium Business Automation Studio providing custom Business Operating Systems for growing companies.","areaServed":["Netherlands","Denmark","Norway","Sweden","Ireland"]},{"@type":"SoftwareApplication","name":"NORTH/OS Business Operating System","applicationCategory":"BusinessApplication","operatingSystem":"Web","description":"Custom business automation software connecting CRM, operations, employees, finance, documents, reporting, integrations and AI."}]})}} />
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="North OS home"><span className="brand-mark">N</span>NORTH<span>/OS</span></a>
        <div className="nav-links"><a href="#solutions">Solutions</a><a href="#industries">Industries</a><a href="#process">Process</a><a href="#about">Approach</a><div className="languages"><button aria-label="Choose language">EN⌄</button><div><a href="/nl">NL</a><a href="/da">DA</a><a href="/no">NO</a><a href="/sv">SV</a><a href="/ie">IE</a></div></div></div>
        <a className="nav-cta" href="#contact">Book a strategy call <span>↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i /> Bespoke systems for serious operations</div>
          <h1>Custom Business<br/><em>Operating Systems.</em></h1>
          <p>We design one unique platform around your business—not another tool you have to adapt to. Management, employees, activity, CRM, operations, finance, advertising, documents, data, AI and integrations—all inside one system.</p>
          <div className="actions"><a className="button primary" href="#contact">Book free strategy call <span>↗</span></a><a className="button ghost" href="#platform">Watch demo <span className="play">▶</span></a></div>
          <div className="hero-note"><span>Built for companies with 10–500+ employees</span><span className="implementation-price">Implementation from €5,000</span></div>
        </div>
        <div className="dashboard-wrap" aria-label="Business operating system dashboard preview">
          <div className="dashboard-glow" />
          <div className="dashboard">
            <aside><div className="dash-brand"><b>N</b></div><div className="side-icon active">⌂</div><div className="side-icon">◎</div><div className="side-icon">▣</div><div className="side-icon">◇</div><div className="side-icon">≡</div><div className="avatar">AK</div></aside>
            <div className="dash-main">
              <header><div><small>EXECUTIVE OVERVIEW</small><h3>Good morning, Alex.</h3></div><button>+ New report</button></header>
              <div className="metrics"><div><span>Revenue</span><b>€482.6k</b><small className="up">↗ 12.4%</small></div><div><span>Active projects</span><b>38</b><small>7 due soon</small></div><div><span>Operating margin</span><b>24.8%</b><small className="up">↗ 3.2%</small></div></div>
              <div className="dash-grid">
                <div className="chart-card"><div className="card-head"><div><small>PERFORMANCE</small><b>Revenue overview</b></div><span>Last 6 months⌄</span></div><div className="chart"><div className="axis"><i>500k</i><i>300k</i><i>100k</i></div><div className="bars">{[42,58,47,69,63,88,77,94,82,100].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></div><div className="months"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div>
                <div className="activity"><div className="card-head"><div><small>LIVE</small><b>Recent activity</b></div><i className="pulse" /></div>{[["NW","Northwind","Invoice paid","€18,400"],["AL","Atlas Labs","Project approved","Today"],["VB","Vertex Build","Contract signed","09:42"]].map(x=><div className="activity-row" key={x[0]}><i>{x[0]}</i><span><b>{x[1]}</b><small>{x[2]}</small></span><strong>{x[3]}</strong></div>)}</div>
              </div>
            </div>
          </div>
          <div className="float-card fc-one"><span>AI AUTOMATION</span><b>14.2 hrs</b><small>saved this week</small></div>
          <div className="float-card fc-two"><i>✓</i><span><b>Workflow complete</b><small>Purchase order #2048</small></span></div>
        </div>
      </section>

      <section className="trust"><div className="shell trust-inner"><span>One system replaces</span>{["SPREADSHEETS","DISCONNECTED CRM","MANUAL REPORTS","DATA SILOS","REPETITIVE ADMIN"].map(x=><b key={x}>{x}</b>)}</div></section>

      <section className="one-system"><div className="shell one-system-grid">
        <div><div className="kicker">ONE BUSINESS / ONE SYSTEM</div><h2>Everything your company does.<br/><em>Working as one.</em></h2></div>
        <div className="one-system-copy"><p>Your Business OS becomes the single place where leadership sees the full picture and every employee gets exactly the tools, information, and next actions they need.</p><p>We connect your advertising, sales, operations, people, finance, files, spreadsheets, and private databases into one custom solution—with automation running across the entire business.</p></div>
        <div className="system-flow" aria-label="Connected business functions"><span>Advertising<small>Google · Facebook</small></span><i>→</i><span>Sales<small>Leads · CRM</small></span><i>→</i><span>Operations<small>Teams · Activity</small></span><i>→</i><span>Finance<small>Invoices · Reports</small></span><i>→</i><span>Intelligence<small>Dashboards · AI</small></span></div>
      </div></section>

      <section className="light-section" id="about"><div className="shell">
        <div className="section-head"><div><div className="kicker">01 / WHY CUSTOM</div><h2>Software should fit<br/>the business. <em>Precisely.</em></h2></div><p>Off-the-shelf tools solve average problems. We engineer around your real operation—preserving what makes it work and removing everything that slows it down.</p></div>
        <div className="benefit-grid">{benefits.map(([icon,title,text])=><article key={title}><i>{icon}</i><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section className="build-section" id="solutions"><div className="shell">
        <div className="section-head dark-head"><div><div className="kicker">02 / WHAT YOUR SYSTEM CAN INCLUDE</div><h2>Your business.<br/><em>One intelligent system.</em></h2></div><p>Start with the operational priorities that matter now. Every capability is designed to work as part of one coherent platform and expand with the business.</p></div>
        <div className="build-list">{buildItems.map(([n,title,text])=><article key={title}><span>{n}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}</div>
      </div></section>

      <section className="industry-section" id="industries"><div className="shell industry-grid"><div className="industry-copy"><div className="kicker">03 / INDUSTRIES</div><h2>Complex operations.<br/><em>Made clear.</em></h2><p>We work where generic tools break down: multi-stage operations, specialist workflows, demanding compliance, and data that must move across teams.</p><a href="#contact">Discuss your industry <span>↗</span></a></div><div className="industry-list">{industries.map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b><i>↗</i></div>)}</div></div></section>

      <section className="platform-section" id="platform"><div className="shell"><div className="platform-top"><div className="kicker">04 / YOUR CONTROL CENTER</div><h2>Everything that runs<br/>your business. <em>Connected.</em></h2></div>
        <div className="platform-ui"><div className="platform-nav"><b>NORTH<span>/OS</span></b><small>MAIN WORKSPACE</small>{["Overview","CRM","Projects","Finance","Inventory","Documents","Automations","Analytics"].map((x,i)=><div className={i===0?"selected":""} key={x}><i>{["⌂","◎","▣","€","◇","□","✦","⌁"][i]}</i>{x}{i===6&&<span>12</span>}</div>)}</div><div className="platform-main"><header><div><small>OPERATIONS / OVERVIEW</small><h3>Company overview</h3></div><div className="people"><i>ML</i><i>AK</i><i>+8</i></div></header><div className="platform-metrics"><div><span>Monthly revenue</span><b>€482,680</b><small>↑ 12.4% vs last month</small></div><div><span>Open projects</span><b>38</b><small>92% on schedule</small></div><div><span>Tasks completed</span><b>1,248</b><small>↑ 18% efficiency</small></div><div><span>Outstanding</span><b>€64,200</b><small>8 invoices</small></div></div><div className="lower-grid"><div className="big-graph"><div className="card-head"><div><small>CASH FLOW</small><b>Financial performance</b></div><span>2026⌄</span></div><div className="line-chart"><i className="line one"/><i className="line two"/><i className="line three"/><i className="line four"/><i className="line five"/><i className="line six"/><div className="dot"/></div></div><div className="task-card"><div className="card-head"><div><small>WORKLOAD</small><b>Teams</b></div><span>•••</span></div>{[["Operations",82],["Sales",68],["Finance",54],["Delivery",76]].map(([x,n])=><div className="team" key={String(x)}><span>{x}</span><i><b style={{width:`${n}%`}}/></i><small>{n}%</small></div>)}</div></div></div></div>
        <div className="integration-row"><span>Everything connected</span>{integrations.map(x=><b key={x}>{x}</b>)}</div>
        <div className="integration-message"><div><span>ADVERTISING TO OPERATIONS</span><h3>Know which campaign created the customer—and what happened next.</h3></div><p>Google Ads and Facebook lead data flows directly into your CRM. Follow every enquiry through sales, delivery, invoicing, and retention without exports, duplicate entry, or blind spots.</p></div>
      </div></section>

      <section className="process-section" id="process"><div className="shell"><div className="section-head"><div><div className="kicker">05 / HOW WE WORK</div><h2>From complexity<br/>to <em>clarity.</em></h2></div><p>A rigorous, transparent process that de-risks transformation and delivers usable value at every stage.</p></div><div className="process-list">{process.map((x,i)=><article key={x}><span>0{i+1}</span><i/><h3>{x}</h3><p>{["We map the ambition, constraints, and real business outcomes.","We study how work actually moves across people, tools, and data.","We prototype the experience before configuring the full system.","The platform is implemented securely in clear, usable stages.","Your existing systems become part of one reliable information flow.","We migrate, train, test, and release without operational surprises.","The platform evolves as your organization and advantage grow."][i]}</p></article>)}</div></div></section>

      <section className="faq-section"><div className="shell faq-grid"><div><div className="kicker">06 / QUESTIONS</div><h2>Before we<br/><em>begin.</em></h2><p>Have a different question?</p><a href="#contact">Talk to a systems architect ↗</a></div><div>{[
        ["Why custom software instead of Bitrix24 or HubSpot?","Standard platforms make you adapt your operation to their model. A custom Business OS preserves your unique workflows, removes licensing constraints, connects every department, and becomes an asset you own."],
        ["How long does implementation take?","A focused first release typically takes 6–12 weeks. Larger multi-department platforms are introduced in controlled phases, so you begin seeing value long before the full roadmap is complete."],
        ["Can you integrate our existing systems?","Yes. We connect ERPs, CRMs, accounting platforms, banks, communication tools, legacy databases, and virtually any service with a usable API."],
        ["Can we continue expanding later?","Absolutely. Modular architecture is central to our work. New teams, workflows, integrations, and AI capabilities can be added as the business evolves."],
        ["Who owns the code?","You do. On completion and payment, the agreed source code and intellectual property are transferred to your company. There is no platform lock-in."],
      ].map(([q,a],i)=><details key={q} open={i===0}><summary><span>0{i+1}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div></div></section>

      <section className="contact-section" id="contact"><div className="shell contact-grid"><div><div className="kicker">START A CONVERSATION</div><h2>Ready to automate<br/>your <em>business?</em></h2><p>Tell us where manual work, spreadsheets or disconnected systems are slowing the company down. We will show you what one connected Business Operating System could change.</p><div className="contact-points"><span><i>✓</i> 30-minute strategy session</span><span><i>✓</i> No generic sales presentation</span><span><i>✓</i> Clear technical and operational direction</span></div></div><form className="simple-form"><div className="form-intro"><span>01</span><div><b>Tell us about the business</b><small>Six simple fields. Usually under two minutes.</small></div></div><div className="form-row"><label>Full Name<input name="name" placeholder="Your full name" required /></label><label>Company<input name="company" placeholder="Company name" required /></label></div><div className="form-row"><label>Business Email<input type="email" name="email" placeholder="you@company.com" required /></label><label>Company Website<input type="url" name="website" placeholder="https://company.com" /></label></div><label>Number of Employees<select name="company-size" required defaultValue=""><option value="" disabled>Select company size</option><option>10–25</option><option>26–50</option><option>51–100</option><option>101–250</option><option>251–500</option><option>500+</option></select></label><label>What would you like to automate?<textarea name="description" rows={5} placeholder="Describe the manual work, disconnected tools or operational bottlenecks you want to improve." required /></label><button type="submit">Book strategy call <span>↗</span></button><small>By submitting, you agree to our privacy policy. No spam. Ever.</small></form></div></section>

      <footer><div className="shell footer-top"><a className="brand" href="#top"><span className="brand-mark">N</span>NORTH<span>/OS</span></a><p>We turn complex businesses into clear, connected systems.</p><div><a href="#solutions">Solutions</a><a href="#industries">Industries</a><a href="#process">Process</a><a href="#contact">Contact</a></div></div><div className="shell footer-bottom"><span>© 2026 NORTH/OS. All rights reserved.</span><span>Sofia · London · Working globally</span><span>LinkedIn ↗</span></div></footer>
    </main>
  );
}
