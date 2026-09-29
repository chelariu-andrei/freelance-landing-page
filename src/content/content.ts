export type IconKey =
  | "java" | "spring" | "quarkus" | "postgres" | "mongodb" | "react" | "gcp" | "terraform" | "kubernetes"
  | "springai" | "langchain4j" | "mcp" | "n8n" | "make"
  | "audit" | "implement" | "platform" | "legacy" | "agents" | "code" | "process";

export interface NavLink { label: string; href: string }
export interface Service {
  id: string; number: string; label: string; icon: IconKey; tone: "cream" | "yellow";
  forWho: string; youGet: string; outcome: string; deliverables: string[]; price: string;
}
export interface Stat { value: string; text: string }
export interface OrbitEntry { id: string; label: string; icon: IconKey; x: number; y: number; size: number }
export interface MatrixModuleContent {
  id: string; name: string; tagline: string; icon: IconKey; iconTone: "periwinkle" | "yellow" | "mint";
  features: { lead: string; text: string }[];
}
export interface StackItem { id: string; name: string; icon: IconKey; description: string }
export interface Seo { title: string; description: string }

export const content = {
  site: {
    name: "Andrei Chelariu",
    role: "AI-Powered Legacy Modernization Engineer",
    /** {{SITE_URL}}: replace, or set NEXT_PUBLIC_SITE_URL. Must be a valid absolute URL. */
    url: "https://example.com",
    calLink: "{{CAL_LINK}}",
    email: "{{EMAIL}}",
    linkedin: "{{LINKEDIN}}",
    github: "{{GITHUB}}",
    photo: "{{PHOTO}}",
    years: "{{YEARS}}",
    industries: "{{INDUSTRIES}}",
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
    tagline: "AI for existing Java systems. Without a rewrite.",
    pagesTitle: "Pages",
    connectTitle: "Connect",
    privacy: "This site uses no cookies and no tracking.",
  },
  seo: {
    landing: {
      title: "Andrei Chelariu · AI for existing Java systems, without a rewrite",
      description: "Freelance senior backend engineer. I add AI agents and automation to the Java/Spring systems you already run, without breaking production.",
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
      lines: [{ text: "Add AI to your" }, { text: "existing Java systems." }, { highlight: "Without a rewrite." }],
      subtitle: "I'm Andrei, a senior backend engineer. I add AI agents and automation to the Java/Spring systems you already run, without breaking production.",
      trust: "{{YEARS}}+ years · Java / Spring / Quarkus · {{INDUSTRIES}}",
      primaryCta: "Book a 30-min call",
      secondaryCta: { label: "See how I work", href: "#services" },
      pipelineLabel: "How it plugs in",
      pipeline: ["Existing backend", "APIs", "Data", "AI agent", "Tools", "Production"],
    },
    servicesCta: "Discuss this",
    servicesMediaTitle: "You get",
    services: [
      {
        id: "audit", number: "01", label: "AI Automation Audit", icon: "audit", tone: "cream",
        forWho: "Teams that suspect AI could save time but don't know where to start.",
        youGet: "A short, fixed-scope review of your workflows and systems.",
        outcome: "A prioritized roadmap with estimated ROI, so the first build is the right one.",
        deliverables: ["Workflow and system review", "ROI estimate per opportunity", "Prioritized roadmap", "Written report + PoC plan"],
        price: "from {{PRICE_AUDIT}}",
      },
      {
        id: "implementation", number: "02", label: "Automation Implementation", icon: "implement", tone: "yellow",
        forWho: "Teams with a clear use case and a backend that has to keep running.",
        youGet: "AI agents, chatbots, integrations, RAG, MCP/tools and workflow automation, built into your existing stack.",
        outcome: "Working automation in production, with guardrails, tests and handover.",
        deliverables: ["Agent or workflow in production", "Integration with your APIs and data", "Guardrails and evaluation", "Docs and handover"],
        price: "from {{PRICE_IMPLEMENTATION}}",
      },
      {
        id: "platform", number: "03", label: "Custom AI Platform / Internal Tools", icon: "platform", tone: "cream",
        forWho: "Companies that need an internal tool nobody sells off the shelf.",
        youGet: "AI-enabled internal software, end to end: backend, API, UI, deployment.",
        outcome: "One tool your team actually uses, owned by you, running on your infrastructure.",
        deliverables: ["Backend and API", "React UI", "Deployment on your cloud", "Source code you own"],
        price: "from {{PRICE_PLATFORM}}",
      },
      {
        id: "legacy", number: "04", label: "Legacy Modernization Acceleration", icon: "legacy", tone: "yellow",
        forWho: "Teams whose Java/Spring core works, but every change takes weeks.",
        youGet: "AI-assisted analysis, migration and refactoring, with guardrails and tests.",
        outcome: "A codebase that is faster to change, modernized step by step instead of rewritten.",
        deliverables: ["Codebase and dependency analysis", "Incremental migration plan", "AI-assisted refactoring with tests", "Upgrade path without downtime"],
        price: "from {{PRICE_LEGACY}}",
      },
    ] as Service[],
    stats: [
      { value: "0", text: "rewrites required." },
      { value: "1", text: "small, fixed-scope first step." },
      { value: "{{YEARS}}+", text: "years shipping production Java." },
    ] as Stat[],
    contact: {
      title: "Have a legacy system, a manual workflow, or an AI idea that needs to reach production?",
      subtitle: "30 minutes. You describe the system, I tell you honestly whether AI helps.",
      cta: "Book a discovery call",
      ctaHover: "30 min, no pitch",
    },
  },
  about: {
    hero: {
      lines: [{ text: "Senior backend engineer." }, { text: "Making AI" }, { highlight: "survive production." }],
      subtitle: "Enterprise Java background, large-scale systems. Now focused on applying AI to existing systems, safely.",
      primaryCta: "Book a call",
    },
    orbit: {
      statement: "{{YEARS}} years inside large Java systems. Now I add AI to them, safely.",
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
        { id: "mongodb", name: "MongoDB", icon: "mongodb", description: "Document data" },
        { id: "react", name: "React", icon: "react", description: "Internal UIs" },
        { id: "gcp", name: "GCP", icon: "gcp", description: "Cloud" },
        { id: "terraform", name: "Terraform", icon: "terraform", description: "Infrastructure as code" },
        { id: "kubernetes", name: "Kubernetes", icon: "kubernetes", description: "Deployment" },
        { id: "springai", name: "Spring AI", icon: "springai", description: "AI in Spring" },
        { id: "langchain4j", name: "LangChain4j", icon: "langchain4j", description: "Agents in Java" },
        { id: "n8n", name: "n8n", icon: "n8n", description: "Workflow automation" },
        { id: "make", name: "Make.com", icon: "make", description: "No-code automation" },
      ] as StackItem[],
    },
    closing: {
      title: "AI is only valuable if it",
      highlight: "survives production.",
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
