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
/** One section of the privacy page; `email` adds the contact address under its paragraphs. */
export interface PrivacySection { title: string; paragraphs: string[]; email?: boolean }

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
    /** {{BOOKING_URL}}: the Google Apps Script web app URL (integrations/google-calendar/README.md), or set NEXT_PUBLIC_BOOKING_URL. */
    bookingUrl: "{{BOOKING_URL}}",
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
    privacy: "No cookies. Privacy-friendly analytics.",
    privacyLink: { label: "Privacy", href: "/privacy" } as NavLink,
  },
  seo: {
    landing: {
      title: "Andrei Chelariu · AI automation, custom software and legacy modernization",
      description: "Freelance senior engineer. I automate workflows with AI, build custom software that scales and modernize legacy systems without a rewrite.",
    } as Seo,
    about: {
      title: "About · Andrei Chelariu",
      description: `Backend engineer with ${YEARS} years on large enterprise systems in retail, now also building AI agents that work with existing systems.`,
    } as Seo,
    privacy: {
      title: "Privacy · Andrei Chelariu",
      description: "What personal data this site collects, why, where it goes and how to have it deleted.",
    } as Seo,
    notFound: {
      title: "Page not found · Andrei Chelariu",
      description: "This address doesn't exist on the site.",
    } as Seo,
  },
  notFound: {
    lines: [{ text: "404." }, { text: "This page" }, { highlight: "never shipped." }],
    subtitle: "Old link, or someone typed fast. Either way, nothing is on fire. The pages that did ship are one click away.",
    primaryCta: "Back to home",
    primaryCtaHover: "Take me home",
    secondaryCta: "Or book a call",
    terminal: {
      path: "~/site",
      /** The visitor's own path is appended at runtime. */
      command: "http GET",
      steps: ["Looking up the route...", "Checked /: exists", "Checked /about: exists", "Grepped the logs: no trace of it"],
      done: "404. No stack trace, just a typo.",
      ariaLabel: "A request for this address is checked against the site's pages, Home and About, finds no match and returns 404 Not Found.",
    },
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
    booking: {
      stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
      steps: {
        date: "Pick a day.",
        time: "Pick a time.",
        you: "Who should I expect?",
        phone: "A number, just in case. (optional)",
        interest: "What do you want to talk about?",
        review: "All good?",
      },
      loading: "Checking my calendar…",
      noTimes: "No free times on this day. Pick another one.",
      timeZoneNote: (tz: string) => `Times are in your time zone (${tz}). Each call is 30 minutes.`,
      fields: {
        name: "Your name",
        email: "Email",
        emailHint: "The calendar invite goes here.",
        phone: "Phone",
        phoneHint: "Optional. Only used if the video link fails.",
        note: "Anything I should know before the call? (optional)",
      },
      interests: ["AI Automation", "Custom Software", "Legacy Modernization", "Not sure yet"],
      review: { when: "When", who: "Who", phone: "Phone", topic: "Topic", edit: "Edit", noPhone: "Not given" },
      consent: { before: "By booking you agree to the processing described in the ", link: "privacy policy", after: "." },
      back: "Back",
      next: "Continue",
      confirm: "Confirm booking",
      sending: "Booking…",
      errors: {
        name: "Tell me your name.",
        email: "That email doesn't look right.",
        phone: "That number doesn't look right.",
        interest: "Pick one. \"Not sure yet\" is fine.",
        slot_taken: "Someone just took that slot. Pick another time.",
        invalid: "Something in the form didn't check out. Have another look.",
        rate_limited: "You've already booked a call today. Email me if you need another one.",
        server: "Booking failed on my side. Try again, or email me.",
        network: "Couldn't reach the calendar. Check your connection and try again.",
        not_configured: "Online booking isn't connected yet. Email me and I'll send you a time.",
      },
      emailMe: "Email me instead",
      done: {
        title: "You're booked.",
        text: (email: string) => `The calendar invite with the video link is on its way to ${email}.`,
        again: "Book another time",
      },
    },
  },
  privacy: {
    hero: {
      lines: [{ text: "Your data," }, { highlight: "kept small." }],
      subtitle: "What this site collects, why, where it goes and how to have it deleted. No cookies, no ad trackers, no data sold.",
    },
    updatedLabel: "Last updated",
    updated: "3 October 2026",
    sections: [
      {
        title: "Who is responsible",
        paragraphs: [
          "Andrei Chelariu, freelance software engineer based in Romania, is the controller for the personal data described here.",
          "Questions or requests about your data: write to the email address below.",
        ],
        email: true,
      },
      {
        title: "Booking a call",
        paragraphs: [
          "When you book a call I collect your name, email address, the topic you pick, any note you add and, if you choose to give it, a phone number. I use them only to schedule and hold the call and to follow up on it.",
          "Legal basis: steps taken at your request before a possible contract (Art. 6(1)(b) GDPR).",
          "The booking is stored as an event in my Google Calendar and I receive a copy by email (Google, as processor). Google may process data outside the EU under the EU-US Data Privacy Framework and Standard Contractual Clauses.",
          "If we don't start working together, I delete the booking details within 12 months of the call.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "I use Vercel Web Analytics to see which pages are visited. It sets no cookies and stores no persistent identifier; visits are counted from a hash that changes daily and is never linked back to you.",
          "It records the page, the referring site, country, browser, operating system and device type, in aggregate only.",
          "Legal basis: my legitimate interest in knowing whether the site is useful (Art. 6(1)(f) GDPR).",
        ],
      },
      {
        title: "Hosting",
        paragraphs: [
          "The site is hosted by Vercel. Like any web server, it briefly processes your IP address and request details to deliver pages and protect against abuse. Vercel acts as processor.",
        ],
      },
      {
        title: "Email",
        paragraphs: [
          "If you email me directly, I keep the conversation for as long as it is relevant to our contact or a project, and delete it on request when nothing obliges me to keep it.",
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "This site sets no cookies and uses no local tracking, so there is no cookie banner.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You can ask to access, correct, delete or export your data, to restrict its processing, or object to it. Send me an email and I'll answer within 30 days.",
          "You can also complain to the Romanian data protection authority (ANSPDCP, dataprotection.ro) or the authority in your country.",
        ],
      },
    ] as PrivacySection[],
  },
  about: {
    hero: {
      lines: [{ text: "Backend engineer." }, { text: "I read stack traces" }, { highlight: "for fun." }],
      subtitle: `${YEARS} years on large enterprise backends in retail. Lately I also build AI agents that work with existing systems and get tested like the rest of the code.`,
      cvCta: "Europass CV",
      cvCtaHover: "Open my CV",
    },
    orbit: {
      statement: "My AI agents get tools, not the keys. Guardrails and a sandbox decide what they touch.",
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
    experience: {
      title: "The work behind the promise.",
      subtitle: "Numbers from production systems, not side projects.",
      featured: { id: "projects", value: "10", label: "projects shipped to production", icon: "shipped" } as ExperienceFigure,
      figures: [
        { id: "years", value: YEARS, label: "years of enterprise Java", icon: "years" },
        { id: "mentored", value: "30", label: "engineers mentored", icon: "mentor" },
        { id: "tech", value: "25+", label: "technologies used in production", icon: "stack" },
      ] as ExperienceFigure[],
    },
    matrix: {
      title: "Two disciplines, one engineer.",
      meta: "Skill · how I use it",
      modules: [
        {
          id: "ai", name: "AI Automation / Agentic Engineering", tagline: "What I build now", icon: "agents", iconTone: "periwinkle",
          features: [
            { lead: "Agents & chatbots", text: "I build agents that call real APIs through typed tools and act on the result" },
            { lead: "MCP & tool calling", text: "I expose existing services as tools an agent can use, with the minimum permissions it needs" },
            { lead: "RAG", text: "retrieval over internal documents, with the source attached to every answer" },
            { lead: "Workflow automation", text: "multi-step processes in code, or in n8n and Make when that is enough" },
            { lead: "Spring AI / LangChain4j", text: "my default for putting LLMs inside Java services" },
            { lead: "Guardrails, sandbox & evals", text: "schema-checked output, sandboxed execution and an eval set of real cases before anything ships" },
          ],
        },
        {
          id: "software", name: "Custom Software Engineering", tagline: "What I've done for years", icon: "code", iconTone: "yellow",
          features: [
            { lead: "Java / Spring / Quarkus", text: "my core stack, on large enterprise systems in retail" },
            { lead: "PostgreSQL / Oracle / MongoDB", text: "schema design, migrations and queries that hold up under load" },
            { lead: "APIs & microservices", text: "contract-first APIs and service boundaries that stay easy to change" },
            { lead: "React / Next.js", text: "the frontend when a project needs one, usually internal tools" },
            { lead: "GCP · Terraform / Docker / Kubernetes", text: "infrastructure as code, containers and deployments" },
            { lead: "Full SDLC", text: "from design to production, and support after release" },
          ],
        },
      ] as MatrixModuleContent[],
    },
    stack: {
      eyebrow: "Stack",
      title: "Tools I ship with.",
      titleMuted: "And would ship with again.",
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
};

export type Content = typeof content;
