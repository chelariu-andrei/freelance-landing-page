export type IconKey =
  | "java" | "spring" | "quarkus" | "postgres" | "mongodb" | "react" | "gcp" | "terraform" | "kubernetes"
  | "oracle" | "docker" | "nextjs"
  | "springai" | "langchain4j" | "mcp" | "n8n" | "make"
  | "audit" | "implement" | "platform" | "legacy" | "agents" | "code" | "process" | "steps" | "shipped" | "mentor" | "stack" | "years";

export interface NavLink { label: string; href: string }
/** One step of the Discover → Build → Test & launch path shared by all services. */
export interface ProcessStep { name: string; text: string }
/** 01: one inbound document run through the agent, its guardrails, and out to an API or a person. */
export interface AgentCase {
  file: string; from: string;
  /** Fields the agent extracts, as [key, value] pairs. */
  fields: [string, string][];
  checks: { label: string; ok: boolean }[];
  route: "api" | "human";
  result: string;
}
/** 02: one span of a request trace; `start` and `ms` are milliseconds from the request's start. */
export interface TraceSpan { layer: string; name: string; start: number; ms: number }
/** 03: one module of the system being modernized. */
export interface LegacyModule { name: string; state: "done" | "active" | "legacy" }
/**
 * Text of a service's animated diagram: the spoken label, the words drawn inside it (keys read by ServiceVisuals),
 * the worked example it plays, and that example's data.
 */
export interface ServiceVisual {
  ariaLabel: string;
  /** One sentence under the diagram naming the scenario it plays. */
  example: string;
  labels: Record<string, string>;
  cases?: AgentCase[];
  spans?: TraceSpan[];
  /** Share of traffic on the new code at each step of the rollout, in percent. */
  ramp?: number[];
  modules?: LegacyModule[];
}
export interface Service {
  id: string; number: string; label: string; icon: IconKey; tone: "cream" | "yellow";
  forWho: string; youGet: string; outcome: string; visual: ServiceVisual; price: string;
  /** Engineering practices that keep it safe in production; three short lines. */
  safeguards: string[];
  /** Tools it is usually built with. */
  stack: string[];
  /** One line for the overview cards. */
  summary: string;
}
/** One pill of the stat statement: words, a yellow icon bubble (with a spoken label) or a yellow value pill. */
export type StatPart = { text: string } | { icon: IconKey; label: string } | { value: string };
export interface Stat { parts: StatPart[]; /** Stone arrow disc after the pill, pointing at the next line. */ arrow?: boolean }
export interface OrbitEntry { id: string; label: string; icon: IconKey; x: number; y: number; size: number }
export interface MatrixModuleContent {
  id: string; name: string; tagline: string; icon: IconKey; iconTone: "periwinkle" | "yellow" | "mint";
  features: { lead: string; text: string }[];
}
/** One figure in the About experience bento. `value` is a number plus an optional suffix ("30+"). */
export interface ExperienceFigure { id: string; value: string; label: string; icon: IconKey }
export interface StackItem { id: string; name: string; icon: IconKey; description: string }
export interface Seo { title: string; description: string }

const YEARS = "5+";
const INDUSTRIES = "Retail";

const social = { linkedin: "https://www.linkedin.com/in/andrei-chelariu-8a7a86204/", github: "https://github.com/chelariu-andrei" };

export const content = {
  site: {
    name: "Andrei Chelariu",
    role: "Freelance Software Engineer: AI Automation, Custom Software, Legacy Modernization",
    /** {{SITE_URL}}: replace, or set NEXT_PUBLIC_SITE_URL. Must be a valid absolute URL. */
    url: "https://example.com",
    calLink: "{{CAL_LINK}}",
    email: "chelariu.andrew@gmail.com",
    linkedin: social.linkedin,
    github: social.github,
    /** Europass CV, served from /public. */
    europass: "/EUROPASS_CV.pdf",
    photo: "/me.png",
    years: YEARS,
    industries: INDUSTRIES,
    areaServed: "Worldwide",
    /** "hidden" | "from": "from" shows each service's price line. */
    pricingMode: "hidden" as "hidden" | "from",
  },
  nav: {
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Expertise", href: "/expertise" },
    ] as NavLink[],
    cta: "Book a call",
  },
  footer: {
    tagline: "AI automation, custom software, legacy modernization.",
    pagesTitle: "Pages",
    connectTitle: "Connect",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    emailLabel: "Email",
    europassLabel: "Europass CV",
    privacy: "This site uses no cookies and no tracking.",
  },
  seo: {
    landing: {
      title: "Andrei Chelariu · AI automation, custom software and legacy modernization",
      description: "Freelance senior engineer. I automate workflows with AI, build custom software that scales and modernize legacy systems without a rewrite.",
    } as Seo,
    about: {
      title: "About · Andrei Chelariu",
      description: "Senior backend engineer with an enterprise Java background, now focused on applying AI to existing systems safely.",
    } as Seo,
    expertise: {
      title: "Expertise · Andrei Chelariu",
      description: "A detailed breakdown of capabilities is coming soon.",
    } as Seo,
  },
  landing: {
    hero: {
      lines: [{ text: "Software that scales." }, { text: "AI that ships." }, { highlight: "Systems that last." }],
      subtitle: "I'm Andrei, a freelance senior engineer. I automate workflows, build custom software, and modernize legacy systems without a rewrite.",
      trust: `${YEARS} years in enterprise Java · Production systems in ${INDUSTRIES.toLowerCase()}`,
      primaryCta: "Book a 30-min call",
      primaryCtaHover: "Pick a time",
      secondaryCta: { label: "View services", href: "#services" },
      terminal: {
        path: "~/projects",
        command: "architect --project restaurant-ai",
        steps: [
          "Analyzing requirements...",
          "Designing architecture...",
          "Building APIs...",
          "Integrating AI workflows...",
          "Running tests...",
          "Deploying to production...",
        ],
        done: "Hello, world!",
        ariaLabel: "A project going from requirements through architecture, APIs, AI workflows and tests to a production deployment that answers: Hello, world",
      },
    },
    servicesOverview: {
      title: "Three ways I help.",
      titleTail: "One way of",
      titleHighlight: "working.",
      lead: "AI automation, custom software or legacy modernization. Each is fixed-scope and stands on its own.",
      process: {
        title: "How it runs",
        steps: [
          { name: "Discover", text: "Map your workflows, systems and data, then agree a prioritized scope." },
          { name: "Build", text: "Implement against your APIs and data, with guardrails and tests at every step." },
          { name: "Test & launch", text: "Test on real cases, ship to production and hand over with docs." },
        ] as ProcessStep[],
      },
      pick: "Take one service, or combine several:",
      details: "Details",
    },
    servicesCta: "Discuss this",
    servicesAriaLabel: "Services",
    serviceLabels: { forWho: "For:", youGet: "You get:", outcome: "Outcome:", safeguards: "Built in", stack: "Usually built with" },
    services: [
      {
        id: "automation", number: "01", label: "AI Automation", icon: "implement", tone: "cream",
        forWho: "Teams buried in repetitive inbound work: invoices, tickets and forms that someone retypes into another system.",
        youGet: "Agents that read the input, call your systems through typed tools (MCP or plain Java interfaces) and act, with retrieval over your own documents where context matters.",
        outcome: "Work is handled as it arrives. Anything uncertain lands with a person, with the reason attached.",
        safeguards: [
          "Model output is validated against a schema before anything is written.",
          "Every prompt or model change runs against an eval set of real past cases before it ships.",
          "Business rules and confidence thresholds decide: act, or hand over to a human.",
        ],
        stack: ["Spring AI", "LangChain4j", "MCP", "pgvector", "OpenTelemetry"],
        visual: {
          ariaLabel: "Diagram: a supplier invoice arrives by email, an AI agent extracts supplier, PO and amount, guardrails check them against the ERP, and the invoice is either booked through the ERP API or routed to accounts payable with the reason.",
          example: "Example: supplier invoices arrive by email. Clean ones are booked in the ERP, mismatches go to accounts payable.",
          labels: { inbox: "Inbox", agent: "AI agent", agentNote: "extracts fields", guardrails: "Guardrails", api: "ERP API", human: "Human review", running: "running", done: "done" },
          cases: [
            {
              file: "INV-2291.pdf", from: "billing@acme-supplies.example",
              fields: [["supplier", "Acme Supplies"], ["po", "PO-7781"], ["amount", "4,180.00 EUR"]],
              checks: [{ label: "PO-7781 exists in ERP", ok: true }, { label: "Amount within ±2% of PO", ok: true }, { label: "Confidence 0.94 ≥ 0.85", ok: true }],
              route: "api", result: "POST /erp/payables → 201 Created",
            },
            {
              file: "INV-2304.pdf", from: "ar@northwind-freight.example",
              fields: [["supplier", "Northwind Freight"], ["po", "PO-7790"], ["amount", "12,460.00 EUR"]],
              checks: [{ label: "PO-7790 exists in ERP", ok: true }, { label: "Amount +12% over PO", ok: false }, { label: "Confidence 0.91 ≥ 0.85", ok: true }],
              route: "human", result: "Queued for AP · amount differs from PO",
            },
          ],
        },
        price: "from {{PRICE_AUTOMATION}}",
        summary: "Agents, chatbots and workflow automation, built into the stack you already run.",
      },
      {
        id: "tools", number: "02", label: "Custom Software", icon: "platform", tone: "yellow",
        forWho: "Companies running a key process on spreadsheets, email threads or a tool that almost fits.",
        youGet: "A web app built end to end: React UI, a Spring Boot API with an OpenAPI contract, PostgreSQL, CI/CD and deployment on your cloud. AI inside where it helps.",
        outcome: "A tool your team uses every day, with source code, docs and a runbook that belong to you.",
        safeguards: [
          "Contract-first API, so other systems and AI agents can plug in later.",
          "Flyway migrations and Testcontainers integration tests, run in CI on every commit.",
          "Tracing, metrics and an audit log from day one, not bolted on later.",
        ],
        stack: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Docker"],
        visual: {
          ariaLabel: "Diagram: in a returns desk app, approving a refund sends one request through the API, the refund policy, the database, the audit log and the payment provider, shown as a trace with timings.",
          example: "Example: a retail returns desk replaces a shared spreadsheet. One click runs the whole refund, traced end to end.",
          labels: { app: "Returns desk", order: "Order #48213", items: "2 items · 84.90 EUR", approve: "Approve refund", trace: "trace", response: "201 Created", owned: "Your repo · your cloud · your runbook" },
          spans: [
            { layer: "API", name: "POST /api/returns", start: 0, ms: 84 },
            { layer: "Domain", name: "RefundPolicy.evaluate()", start: 4, ms: 9 },
            { layer: "DB", name: "SELECT order, items", start: 14, ms: 6 },
            { layer: "DB", name: "INSERT return, audit_log", start: 22, ms: 8 },
            { layer: "Ext", name: "payments.refund()", start: 32, ms: 49 },
          ],
        },
        price: "from {{PRICE_TOOLS}}",
        summary: "Scalable software built end to end, with the source code owned by you.",
      },
      {
        id: "legacy", number: "03", label: "Legacy Modernization", icon: "legacy", tone: "cream",
        forWho: "Teams whose system works but is hard to change: Java EE or old Spring, slow releases, code nobody wants to touch.",
        youGet: "Modernization one module at a time behind a routing layer (the strangler fig pattern): behaviour pinned by tests first, then moved to Java 21 and Spring Boot 3, with AI-assisted analysis and refactoring.",
        outcome: "Faster releases and smaller risk, without a big-bang rewrite or a frozen roadmap.",
        safeguards: [
          "Characterization tests pin today's behaviour before a line changes.",
          "Traffic shifts gradually while responses are compared against the old code.",
          "Rollback is a routing change, not a redeploy.",
        ],
        stack: ["Java 21", "Spring Boot 3", "OpenRewrite", "Testcontainers", "Kubernetes"],
        visual: {
          ariaLabel: "Diagram: a gateway shifts billing traffic from a Java EE monolith to a new Spring Boot service in steps of 1, 10, 50 and 100 percent, while a shadow comparison checks the responses match.",
          example: "Example: billing moves out of a Java EE monolith. Traffic ramps up only while the shadow diffs stay at zero.",
          labels: { gateway: "Gateway", gatewayNote: "routes /billing/**", legacy: "Monolith", legacyNote: "Java EE 7", modern: "billing-service", modernNote: "Spring Boot 3 · Java 21", shadow: "Shadow compare", compared: "compared", diffs: "diffs", rollback: "Rollback = flip the route", live: "Live the whole time" },
          ramp: [0, 1, 10, 50, 100],
          modules: [{ name: "Orders", state: "done" }, { name: "Billing", state: "active" }, { name: "Reports", state: "legacy" }, { name: "Auth", state: "legacy" }],
        },
        price: "from {{PRICE_LEGACY}}",
        summary: "Modernize your core system step by step, without a rewrite.",
      },
    ] as Service[],
    stats: [
      { parts: [{ text: "Small steps," }, { icon: "steps", label: "steady progress" }, { text: "not rewrites." }], arrow: true },
      { parts: [{ text: "So production" }, { icon: "process", label: "safely" }, { text: "never notices." }] },
    ] as Stat[],
    contact: {
      title: "Bring the problem. Leave with a plan.",
      subtitle: "30 minutes. You describe the situation, I tell you honestly what would help, AI or not.",
      cta: "Book a discovery call",
      ctaHover: "30 min, no pitch",
    },
  },
  about: {
    hero: {
      lines: [{ text: "Senior backend engineer." }, { text: "Making AI" }, { highlight: "survive production." }],
      subtitle: "Enterprise Java background, large-scale systems. Now focused on applying AI to existing systems, safely.",
      cvCta: "Europass CV",
      cvCtaHover: "Open my CV",
    },
    orbit: {
      statement: `${YEARS} years inside large Java systems. Now I add AI to them, safely.`,
      monogram: "AC",
      photoAlt: "Andrei Chelariu",
      items: [
        { id: "java", label: "Java", icon: "java", x: 14, y: 24, size: 16 },
        { id: "spring", label: "Spring", icon: "spring", x: 8, y: 62, size: 12 },
        { id: "quarkus", label: "Quarkus", icon: "quarkus", x: 26, y: 88, size: 11 },
        { id: "mcp", label: "MCP", icon: "mcp", x: 32, y: 10, size: 10 },
        { id: "langchain4j", label: "LangChain4j", icon: "langchain4j", x: 68, y: 10, size: 10 },
        { id: "postgres", label: "PostgreSQL", icon: "postgres", x: 86, y: 24, size: 14 },
        { id: "kubernetes", label: "Kubernetes", icon: "kubernetes", x: 92, y: 60, size: 11 },
        { id: "springai", label: "Spring AI", icon: "springai", x: 74, y: 88, size: 15 },
      ] as OrbitEntry[],
    },
    // ILLUSTRATIVE — replace with real numbers before launch (scripts/check-placeholders.mjs warns while this marker is here).
    experience: {
      title: "The work behind the promise.",
      subtitle: "Numbers from production systems, not side projects.",
      featured: { id: "projects", value: "30+", label: "projects shipped to production", icon: "shipped" } as ExperienceFigure,
      figures: [
        { id: "years", value: YEARS, label: "years of enterprise Java", icon: "years" },
        { id: "mentored", value: "12", label: "engineers mentored", icon: "mentor" },
        { id: "tech", value: "25+", label: "technologies used in production", icon: "stack" },
      ] as ExperienceFigure[],
    },
    matrix: {
      title: "Two disciplines, one engineer.",
      meta: "Capability · what it means for you",
      modules: [
        {
          id: "ai", name: "AI Automation / Agentic Engineering", tagline: "AI that works inside your systems", icon: "agents", iconTone: "periwinkle",
          features: [
            { lead: "Agents & chatbots", text: "that call your real APIs, not a demo sandbox" },
            { lead: "RAG", text: "answers grounded in your own documents and data" },
            { lead: "Integrations & MCP/tools", text: "AI connected to the systems your team already uses" },
            { lead: "Workflow automation", text: "manual steps removed, with a human in the loop where it matters" },
            { lead: "Spring AI / LangChain4j", text: "AI built in Java, in the codebase you already maintain" },
            { lead: "Guardrails & evaluation", text: "you know when the model is wrong before your users do" },
          ],
        },
        {
          id: "software", name: "Custom Software Engineering", tagline: "The backend underneath", icon: "code", iconTone: "yellow",
          features: [
            { lead: "Java / Spring / Quarkus", text: "changes that respect how your system already works" },
            { lead: "PostgreSQL / MongoDB", text: "data models that hold up under real load" },
            { lead: "React", text: "internal UIs your team can use without training" },
            { lead: "APIs / microservices", text: "clean seams to plug new features into" },
            { lead: "GCP · Terraform / Kubernetes", text: "reproducible deployments you can run yourself" },
            { lead: "Full SDLC", text: "from design to production and support" },
          ],
        },
        {
          id: "process", name: "How I work", tagline: "Discover → Audit → Prototype → Ship → Support", icon: "process", iconTone: "mint",
          features: [
            { lead: "Small first step", text: "a fixed-scope start before any big commitment" },
            { lead: "Fixed scope", text: "you know what you get and when" },
            { lead: "Production-minded", text: "tests, monitoring and rollback plans from day one" },
            { lead: "Handover", text: "docs and code your team can own after I leave" },
          ],
        },
      ] as MatrixModuleContent[],
    },
    stack: {
      eyebrow: "Stack",
      title: "Tools I ship with.",
      titleMuted: "Chosen for production, not for demos.",
      items: [
        { id: "java", name: "Java", icon: "java", description: "Core language" },
        { id: "spring", name: "Spring Boot", icon: "spring", description: "Services and APIs" },
        { id: "quarkus", name: "Quarkus", icon: "quarkus", description: "Fast, lean services" },
        { id: "postgres", name: "PostgreSQL", icon: "postgres", description: "Relational data" },
        { id: "oracle", name: "Oracle", icon: "oracle", description: "Enterprise database" },
        { id: "mongodb", name: "MongoDB", icon: "mongodb", description: "Document data" },
        { id: "react", name: "React", icon: "react", description: "Internal UIs" },
        { id: "nextjs", name: "Next.js", icon: "nextjs", description: "Web apps" },
        { id: "gcp", name: "GCP", icon: "gcp", description: "Cloud" },
        { id: "terraform", name: "Terraform", icon: "terraform", description: "Infrastructure as code" },
        { id: "docker", name: "Docker", icon: "docker", description: "Containers" },
        { id: "kubernetes", name: "Kubernetes", icon: "kubernetes", description: "Deployment" },
        { id: "springai", name: "Spring AI", icon: "springai", description: "AI in Spring" },
        { id: "langchain4j", name: "LangChain4j", icon: "langchain4j", description: "Agents in Java" },
        { id: "n8n", name: "n8n", icon: "n8n", description: "Workflow automation" },
        { id: "make", name: "Make.com", icon: "make", description: "No-code automation" },
      ] as StackItem[],
    },
    closing: {
      title: "Looking for the",
      highlight: "next challenge.",
      subtitle: "If you have an interesting problem to solve, let’s talk.",
      primaryCta: "Book a call",
      secondaryCta: "LinkedIn",
    },
  },
  expertise: {
    hero: {
      lines: [{ text: "Expertise." }, { highlight: "Coming soon." }],
      subtitle: "A deeper breakdown of capabilities is on the way. Meanwhile, see About.",
      primaryCta: { label: "About me", href: "/about" },
    },
  },
};

export type Content = typeof content;
