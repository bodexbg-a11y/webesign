export const SITE_URL = "https://www.opsynq.net";
export const CALENDLY_URL = "https://calendly.com/opsynqos/30min";

export const marketAlternates = {
  en: "/",
  "en-NL": "/nl",
  "en-DK": "/da",
  "en-NO": "/no",
  "en-SE": "/sv",
  "x-default": "/",
};

export type MarketLocale = "nl" | "da" | "no" | "sv";

export const markets = {
  nl: {
    country: "Netherlands",
    adjective: "Dutch",
    city: "Amsterdam",
    primaryKeyword: "business automation software Netherlands",
    secondaryKeywords: [
      "custom business software Netherlands",
      "custom CRM development Netherlands",
      "workflow automation Netherlands",
      "custom ERP Netherlands",
      "business process automation Netherlands",
    ],
    headline: "Business automation software for Dutch companies.",
    description:
      "Custom business software for companies in the Netherlands. Replace disconnected CRM, Excel and manual workflows with one Business Operating System.",
    context:
      "Growing Dutch companies often operate across several entities, international customers and highly connected finance, sales and delivery teams. OPSYNQ creates one operational layer that keeps those workflows visible without forcing the business into a generic SaaS template.",
    integrations: ["Exact Online", "AFAS", "Mollie", "Microsoft 365", "Google Workspace", "Power BI"],
    priorities: [
      "Connect commercial, delivery and finance data without repeated exports",
      "Replace spreadsheet-led approvals and operational reporting",
      "Create role-based workflows for distributed and multilingual teams",
      "Keep business data in a controlled, GDPR-conscious architecture",
    ],
    industries: "construction, professional services, logistics, distribution, property operations and manufacturing",
  },
  da: {
    country: "Denmark",
    adjective: "Danish",
    city: "Copenhagen",
    primaryKeyword: "business automation software Denmark",
    secondaryKeywords: [
      "custom business software Denmark",
      "workflow automation Denmark",
      "custom CRM development Denmark",
      "custom ERP Denmark",
      "business process automation Denmark",
    ],
    headline: "Business automation software for Danish companies.",
    description:
      "Custom business software for companies in Denmark. Connect CRM, workflows, finance, documents, reporting and AI inside one Business Operating System.",
    context:
      "Danish companies expect simple digital experiences, dependable integrations and clear ownership of operational data. OPSYNQ brings customer, project, employee, document and finance workflows into one tailored platform designed around how the company already creates value.",
    integrations: ["e-conomic", "Dinero", "Microsoft 365", "Google Workspace", "Business Central", "Power BI"],
    priorities: [
      "Automate handoffs between sales, operations and accounting",
      "Build structured approval and document workflows",
      "Give management real-time operational and financial dashboards",
      "Connect existing Nordic software through secure APIs where available",
    ],
    industries: "construction, manufacturing, distribution, logistics, property management and professional services",
  },
  no: {
    country: "Norway",
    adjective: "Norwegian",
    city: "Oslo",
    primaryKeyword: "business automation software Norway",
    secondaryKeywords: [
      "custom business software Norway",
      "custom ERP development Norway",
      "workflow automation Norway",
      "operations management software Norway",
      "custom CRM development Norway",
    ],
    headline: "Business automation software for Norwegian companies.",
    description:
      "Custom business software for companies in Norway. Replace Excel and disconnected systems with one platform for CRM, operations, reporting and AI.",
    context:
      "Norwegian operations frequently combine office teams, field work, suppliers and project-based delivery. OPSYNQ gives leadership one reliable view while employees receive focused tools for the tasks, documents and decisions that belong to their role.",
    integrations: ["Tripletex", "Visma", "PowerOffice Go", "Microsoft 365", "Google Workspace", "Power BI"],
    priorities: [
      "Coordinate field activity, projects, documentation and management",
      "Connect CRM, operational delivery and accounting information",
      "Reduce manual reporting across locations and business units",
      "Create scalable permissions, audit trails and approval processes",
    ],
    industries: "construction, logistics, manufacturing, distribution, property operations and specialist services",
  },
  sv: {
    country: "Sweden",
    adjective: "Swedish",
    city: "Stockholm",
    primaryKeyword: "business automation software Sweden",
    secondaryKeywords: [
      "custom business software Sweden",
      "custom CRM development Sweden",
      "AI business automation Sweden",
      "workflow automation Sweden",
      "custom ERP Sweden",
    ],
    headline: "Business automation software for Swedish companies.",
    description:
      "Custom business software for companies in Sweden. Connect CRM, operations, finance, documents, integrations and AI in one tailored platform.",
    context:
      "Swedish growth companies need software that supports transparent collaboration without creating another disconnected tool. OPSYNQ unifies customer data, operational work, documents, reporting and automation in a system that can expand across teams and companies.",
    integrations: ["Fortnox", "Visma", "BankID-ready workflows", "Microsoft 365", "Google Workspace", "Power BI"],
    priorities: [
      "Build connected workflows across customers, teams and finance",
      "Introduce practical AI automation inside governed business processes",
      "Replace duplicate data entry and fragmented reporting",
      "Support multi-company structures with clear access control",
    ],
    industries: "manufacturing, construction, logistics, distribution, property management and professional services",
  },
} satisfies Record<MarketLocale, {
  country: string;
  adjective: string;
  city: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  headline: string;
  description: string;
  context: string;
  integrations: string[];
  priorities: string[];
  industries: string;
}>;

export type ServiceSlug =
  | "business-automation-software"
  | "custom-business-software"
  | "custom-crm-development"
  | "custom-erp-development"
  | "workflow-automation"
  | "ai-business-automation";

export const services = {
  "business-automation-software": {
    name: "Business Automation Software",
    eyebrow: "CONNECTED OPERATIONS",
    primaryKeyword: "business automation software",
    keywords: ["business process automation", "operations management software", "business workflow software", "business automation company"],
    title: "Business Automation Software for Growing Companies",
    description: "Custom business automation software that connects CRM, operations, finance, employees, documents, reporting and integrations in one platform.",
    headline: "Automate the work between your teams and systems.",
    intro: "OPSYNQ replaces repetitive administration, disconnected tools and manual handoffs with one operational platform. Rules, responsibilities and data move through the business automatically while management keeps complete visibility and control.",
    outcomes: ["Fewer manual handoffs and repeated entries", "One live view of customers and operations", "Automatic approvals, notifications and reporting", "A scalable system owned by your company"],
    modules: ["Lead and customer workflows", "Projects, tasks and employee activity", "Document generation and approvals", "Finance and management dashboards", "Email and messaging automation", "API and database integrations"],
    faqs: [
      ["What business processes can be automated?", "Lead routing, quotations, approvals, project creation, task assignment, document generation, invoicing triggers, customer communication, reporting and many other rule-based operational workflows."],
      ["Does automation replace our current software?", "Only where replacement creates value. OPSYNQ can also connect the systems you want to keep and become the operational layer between them."],
      ["Can automation be introduced gradually?", "Yes. We normally start with one high-impact workflow and expand in controlled phases once the data model and operating foundation are stable."],
    ],
  },
  "custom-business-software": {
    name: "Custom Business Software",
    eyebrow: "BUILT AROUND YOUR COMPANY",
    primaryKeyword: "custom business software",
    keywords: ["bespoke business software", "internal business software", "custom business management software", "business software development"],
    title: "Custom Business Software Built Around Your Workflow",
    description: "Enterprise-grade custom business software for growing companies that have outgrown spreadsheets, generic SaaS and disconnected internal tools.",
    headline: "Software designed around the way your business works.",
    intro: "Generic software standardizes the company around somebody else's assumptions. We design a tailored Business Operating System around your customers, teams, rules, documents, data and management priorities—then connect every module into one coherent product.",
    outcomes: ["Software that reflects your unique operating model", "Complete ownership of the agreed code and data", "No per-seat feature restrictions", "A modular architecture that grows with the company"],
    modules: ["Custom CRM and relationship data", "Internal portals and dashboards", "Operational and finance workflows", "Document and knowledge management", "Inventory and resource management", "Custom mobile and field applications"],
    faqs: [
      ["When is custom business software the right choice?", "It becomes compelling when spreadsheet work, subscription limitations and disconnected systems create measurable cost, risk or poor management visibility."],
      ["Is this the same as outsourcing development hours?", "No. We analyse the business, define the product architecture and deliver a managed operating platform with clear outcomes and an expansion roadmap."],
      ["Who owns the custom software?", "Your company owns the agreed source code and intellectual property after completion and payment, without platform lock-in."],
    ],
  },
  "custom-crm-development": {
    name: "Custom CRM Development",
    eyebrow: "CRM WITHOUT COMPROMISE",
    primaryKeyword: "custom CRM development",
    keywords: ["custom CRM software", "bespoke CRM development", "CRM system development", "custom customer management system"],
    title: "Custom CRM Development for Complex Sales Workflows",
    description: "Custom CRM development for companies that need unique pipelines, customer workflows, automation, reporting and integrations without SaaS limitations.",
    headline: "A CRM shaped around your customers, pipeline and decisions.",
    intro: "A custom CRM becomes more than a contact database. It connects advertising sources, enquiries, quotations, contracts, projects, customer service, invoices and retention so every team works from the same commercial truth.",
    outcomes: ["A pipeline built around your real sales process", "Automatic lead routing and follow-up", "Customer history connected to delivery and finance", "Management reporting without spreadsheet exports"],
    modules: ["Leads, accounts and contacts", "Custom pipelines and qualification", "Quotations and contract workflows", "Email, WhatsApp and Telegram activity", "Customer portals and service requests", "Revenue, source and conversion analytics"],
    faqs: [
      ["Why build a custom CRM instead of using HubSpot?", "Custom development is appropriate when unique objects, permissions, workflows, integrations or ownership requirements create constant workarounds inside a standard CRM."],
      ["Can you migrate data from our current CRM?", "Yes. We can clean, map and migrate customer, deal, activity and document data from spreadsheets, legacy databases and established CRM platforms."],
      ["Can the CRM connect to advertising and accounting?", "Yes. Leads can enter from Google or Meta and move through sales, delivery and finance with connected attribution and reporting."],
    ],
  },
  "custom-erp-development": {
    name: "Custom ERP Development",
    eyebrow: "OPERATIONAL CONTROL",
    primaryKeyword: "custom ERP development",
    keywords: ["custom ERP software", "ERP system development", "bespoke ERP", "custom operations management software"],
    title: "Custom ERP Development for Growing Operations",
    description: "Custom ERP development for companies that need connected operations, inventory, purchasing, finance, projects and reporting built around their processes.",
    headline: "One operational core for resources, delivery and finance.",
    intro: "OPSYNQ creates focused ERP capabilities around the processes that differentiate your company. Orders, purchasing, inventory, projects, resources, delivery and management reporting share one data model without the weight of an oversized generic suite.",
    outcomes: ["One reliable operational data model", "Live inventory, capacity and project visibility", "Connected purchasing, delivery and finance", "Role-based controls and audit-ready workflows"],
    modules: ["Orders and procurement", "Inventory and warehouse control", "Projects, resources and scheduling", "Production and quality workflows", "Finance and accounting integrations", "Multi-company management dashboards"],
    faqs: [
      ["Do you replace the whole ERP at once?", "Not necessarily. We can build a focused operating layer, integrate an existing ERP and replace legacy modules only when there is a clear operational case."],
      ["Can the system support inventory and production?", "Yes. Data structures and workflows can cover purchasing, stock movement, bills of materials, production stages, quality checks and fulfilment."],
      ["Can it integrate with accounting software?", "Yes. We connect accounting and finance platforms through available APIs, keeping operational detail and financial records synchronized."],
    ],
  },
  "workflow-automation": {
    name: "Workflow Automation",
    eyebrow: "PROCESS BY DESIGN",
    primaryKeyword: "workflow automation",
    keywords: ["business workflow automation", "document workflow automation", "approval workflow software", "business process automation services"],
    title: "Workflow Automation for Business Operations",
    description: "Custom workflow automation for approvals, documents, tasks, notifications, customer communication and reporting across your entire business.",
    headline: "Turn repeatable business processes into reliable workflows.",
    intro: "We map how work moves across people, systems and documents, then create governed workflows that assign responsibility, enforce rules and keep every stakeholder informed. Exceptions remain visible; routine work moves automatically.",
    outcomes: ["Consistent execution across teams", "Shorter approval and response times", "Clear responsibility and audit history", "Automatic documents, messages and reporting"],
    modules: ["Approval workflows", "Task and project automation", "Document generation and signatures", "Email and notification sequences", "Data validation and exception handling", "Cross-system API orchestration"],
    faqs: [
      ["Which workflows should we automate first?", "The best starting points are frequent processes with repeated data entry, handoffs, delays or management escalation—especially where errors have measurable operational cost."],
      ["Can employees override an automated workflow?", "Yes. Permissions, exception paths and human approvals are designed into the process so automation supports accountability rather than hiding decisions."],
      ["Can workflows span several existing systems?", "Yes. OPSYNQ can coordinate data and actions across CRM, accounting, email, documents, spreadsheets and other API-enabled systems."],
    ],
  },
  "ai-business-automation": {
    name: "AI Business Automation",
    eyebrow: "PRACTICAL BUSINESS AI",
    primaryKeyword: "AI business automation",
    keywords: ["AI workflow automation", "AI agents for business", "OpenAI business integration", "AI process automation"],
    title: "AI Business Automation Inside Real Workflows",
    description: "Secure AI business automation for documents, communication, analysis, knowledge and operational decisions inside governed company workflows.",
    headline: "Put AI inside the processes where it creates measurable value.",
    intro: "AI is most useful when it has the right context, permissions and next action. We connect models such as OpenAI to controlled business data and workflows for document processing, assistance, classification, drafting, analysis and operational decision support.",
    outcomes: ["Faster document and information processing", "Context-aware employee assistants", "AI actions governed by permissions and approval", "Measurable automation inside existing operations"],
    modules: ["Private company knowledge assistants", "Document extraction and classification", "Email and response drafting", "Lead and request qualification", "Operational summaries and alerts", "AI agents with approval controls"],
    faqs: [
      ["Is company data used to train public AI models?", "The architecture is designed around controlled API access, permissions and suitable provider settings. Exact data handling depends on the selected provider and your security requirements."],
      ["Do AI agents act without approval?", "Only where that is appropriate. High-impact actions can require human approval, while low-risk classification, drafting and summarisation can run automatically."],
      ["Can AI work with our documents and databases?", "Yes. We can build secure retrieval and workflow layers around approved documents, records and operational systems."],
    ],
  },
} satisfies Record<ServiceSlug, {
  name: string;
  eyebrow: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  headline: string;
  intro: string;
  outcomes: string[];
  modules: string[];
  faqs: string[][];
}>;

export const serviceLinks = Object.entries(services).map(([slug, service]) => ({
  href: `/services/${slug}`,
  label: service.name,
}));

export const marketLinks = Object.entries(markets).map(([locale, market]) => ({
  href: `/${locale}`,
  label: market.country,
}));
