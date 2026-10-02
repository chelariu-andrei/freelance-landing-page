export type IconKey =
  | "java" | "spring" | "quarkus" | "postgres" | "mongodb" | "react" | "gcp" | "terraform" | "kubernetes"
  | "oracle" | "docker" | "nextjs"
  | "springai" | "langchain4j" | "mcp" | "n8n" | "make"
  | "audit" | "implement" | "platform" | "legacy" | "agents" | "code" | "process" | "steps" | "shipped" | "mentor" | "stack" | "years";

export interface NavLink { label: string; href: string }
/** One step of the Discover → Build → Test & launch path shared by all services. */
export interface ProcessStep { name: string; text: string }
/** Text of a service's animated diagram: the spoken label plus the words drawn inside it (keys are read by ServiceVisuals). */
export interface ServiceVisual { ariaLabel: string; labels: Record<string, string> }
export interface Service {
  id: string; number: string; label: string; icon: IconKey; tone: "cream" | "yellow";
  forWho: string; youGet: string; outcome: string; visual: ServiceVisual; price: string;
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
    serviceLabels: { forWho: "For:", youGet: "You get:", outcome: "Outcome:" },
    services: [
      {
        id: "automation", number: "01", label: "AI Automation", icon: "implement", tone: "cream",
        forWho: "Teams with repetitive workflows, or a hunch that AI could save time but no clear place to start.",
        youGet: "AI agents, chatbots, integrations, RAG, MCP/tools and workflow automation, built into your existing stack.",
        outcome: "Working automation in production, with guardrails, tests and handover.",
        visual: {
          ariaLabel: "Diagram: incoming emails, tickets and forms go to an AI agent, pass a guardrails check, then act through your APIs or go to human review when unsure.",
          labels: { events: "Incoming", email: "Email", ticket: "Ticket", form: "Form", agent: "AI agent", agentNote: "reads context, decides", guardrails: "Guardrails + evals", guardrailsNote: "checked before it acts", api: "Your APIs", apiNote: "it acts", human: "Human review", humanNote: "when unsure" },
        },
        price: "from {{PRICE_AUTOMATION}}",
        summary: "Agents, chatbots and workflow automation, built into the stack you already run.",
      },
      {
        id: "tools", number: "02", label: "Custom Software", icon: "platform", tone: "yellow",
        forWho: "Companies that need an internal tool nobody sells off the shelf.",
        youGet: "Web apps, internal tools and backends built end to end: API, UI, deployment. AI inside where it helps.",
        outcome: "Software your team actually uses, with source code you own, running on your infrastructure.",
        visual: {
          ariaLabel: "Diagram: a custom software stack built layer by layer, from data and backend through an API to a React interface, deployed on your cloud with source code you own.",
          labels: { ui: "React UI", uiNote: "a tool your team uses without training", api: "API", apiNote: "clean seams for AI and integrations", backend: "Backend", backendNote: "Java / Spring Boot", data: "Data", dataNote: "PostgreSQL", owned: "Your cloud · your source code" },
        },
        price: "from {{PRICE_TOOLS}}",
        summary: "Scalable software built end to end, with the source code owned by you.",
      },
      {
        id: "legacy", number: "03", label: "Legacy Modernization", icon: "legacy", tone: "cream",
        forWho: "Teams whose system works, but is hard to change: slow releases, ageing frameworks, code nobody wants to touch.",
        youGet: "AI-assisted analysis, migration and refactoring, with guardrails and tests. Java/Spring is my home turf.",
        outcome: "A codebase that is faster to change, modernized step by step instead of rewritten.",
        visual: {
          ariaLabel: "Diagram: modules move one at a time from the legacy system to the modernized one, each passing its tests, while the system stays live.",
          labels: { before: "Legacy", after: "Modernized", m1: "Orders", m2: "Billing", m3: "Reports", m4: "Auth", tested: "tested", live: "Live the whole time · no downtime" },
        },
        price: "from {{PRICE_LEGACY}}",
        summary: "Modernize your core system step by step, without a rewrite.",
      },
    ] as Service[],
    stats: [
      { parts: [{ text: "Small steps," }, { icon: "steps", label: "steady progress" }, { text: "not rewrites." }], arrow: true },
      { parts: [{ value: "100%" }, { text: "of the code is yours." }] },
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
