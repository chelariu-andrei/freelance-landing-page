# TASK: Build the Freelancer Landing Page (v1, iteration-ready)

You are building the landing page for **Andrei Chelariu**, a freelance
**AI-Powered Legacy Modernization Engineer**. The goal of this page is NOT to look
pretty. The goal is to **start conversations with technical decision-makers
(CTOs, engineering managers, tech leads, founders) and book discovery calls.**

I already have a component library / design system (built with Claude Design).
**Use it. Do not invent new visual primitives unless something is missing.**

---

## 0. FIRST STEPS (do before writing code)

1. Inspect the repo: framework, package manager, styling approach, component
   library location, design tokens, existing pages. Summarize what you found in
   5 lines.
2. If the stack is ambiguous, pick the simplest option that fits the existing
   library (prefer static/SSG: Next.js or Astro + Tailwind if nothing exists).
3. Propose the file/section structure in a short plan, then implement.
   Do not ask me questions unless something blocks you; make reasonable
   assumptions and list them at the end.

---

## 1. POSITIONING (drives all copy)

**One-liner:**
I help engineering teams modernize legacy Java/Spring systems and add AI agents
and automation to existing backends, without rewrites and without breaking
production.

**Primary audience (Niche B, lead with this):**
Companies running existing Java/Spring/Quarkus systems that want AI-powered
workflows, integrations and automation on top of what they already have.

**Secondary audience (Niche A):**
SaaS/software companies that want to add AI agents to an existing backend:
`existing backend → APIs → data → AI agent → tools → deployment → production`

**Tertiary (mention lightly):**
Small and mid-sized businesses that want manual workflows automated and custom
internal software built.

**Tone:** Senior, direct, technical, calm. Outcome-oriented. No hype, no
"revolutionize", no "cutting-edge", no emoji spam, no buzzword soup.
Write like an engineer talking to another engineer who controls a budget.

---

## 2. PAGE STRUCTURE (single page, anchored sections + sticky nav)

Nav: Services · Work · Expertise · Tech Stack · About · Contact
Primary CTA in nav: **"Book a call"** (always visible, also on mobile).

### 2.1 Hero
- H1 (draft): "Add AI to your existing Java systems. Without a rewrite."
- Sub: 2 lines max. Who I am + what outcome clients get.
- Primary CTA: "Book a 30-min discovery call". Secondary CTA: "See how I work".
- Trust line under CTAs: years of experience, stack, industries
  (use placeholders I can fill: `{{YEARS}}`, `{{INDUSTRIES}}`).
- Small visual: the pipeline diagram
  `Existing backend → APIs → Data → AI agent → Tools → Production`
  (SVG/CSS, no heavy assets).

### 2.2 Problem strip
3 short pain points a CTO recognizes, for example:
- "Your core system works, but every new integration takes weeks."
- "Your team wants AI features but nobody wants to touch the legacy core."
- "Manual workflows keep eating engineering and ops time."
Keep each to 1–2 lines.

### 2.3 Services (4-tier funnel, cards with clear entry points)
1. **AI Automation Audit**: short, fixed-scope engagement. Find the workflows
   worth automating, estimate ROI, deliver a prioritized roadmap.
   Deliverable: written report + 1 working proof of concept plan.
2. **Automation Implementation**: build and deploy AI agents, chatbots,
   integrations, RAG, MCP/tools, workflow automation into your existing stack.
3. **Custom AI Platform / Internal Tools**: AI-enabled internal software,
   end-to-end (backend, API, UI, deployment).
4. **Legacy Modernization Acceleration**: AI-assisted analysis, migration and
   refactoring of Java/Spring systems, with guardrails and tests.

Each card: title, who it's for, what you get, typical outcome, CTA
("Discuss this" → scrolls to contact and pre-selects the service in the form).
Do NOT show prices. Add a `{{PRICING_MODE}}` config flag so I can add
"from €X" later.

### 2.4 Work / Case studies
- Structure for 3 case study cards: Problem → Approach → Result → Stack.
- I do NOT have public client proof yet. **Do not invent clients, logos,
  metrics or testimonials.** Use clearly marked placeholder cards
  (`{{CASE_STUDY_1}}`) and one "Example engagement (illustrative)" card that is
  explicitly labeled as an illustrative scenario, not a real client.
- Add a section slot for: GitHub demos, architecture diagrams, short Loom videos.

### 2.5 Expertise
Two columns:

**AI Automation / Agentic Engineering**
AI agents · chatbots · RAG · integrations · MCP/tools · workflow automation ·
Spring AI / LangChain4j · AI-enabled internal tools · guardrails and evaluation

**Custom Software Engineering**
Java/Spring/Quarkus · PostgreSQL/MongoDB · React · APIs/microservices ·
GCP · Terraform/Kubernetes · full SDLC

Frame each as a capability with one line of "what this means for you",
not just a list of keywords.

### 2.6 Tech stack
Visual grid grouped by: Languages & Frameworks · Data · AI/Agents · Cloud &
DevOps · Frontend · Automation tools (n8n, Make.com where relevant).
Use text/simple icons, no external logo CDN dependency at runtime.

### 2.7 How I work (short process)
Discover → Audit → Prototype → Ship → Support. One line each.
Emphasize: small first step, fixed scope, production-minded, guardrails.

### 2.8 About
- Short, first person, credible: senior software engineer, enterprise
  backend background (Java/Quarkus/Spring, large-scale systems), now
  focused on applying AI to existing systems safely.
- Photo slot (`{{PHOTO}}`), LinkedIn + GitHub links.
- Do NOT name my current employer or client anywhere on the page.
- Include one line on the "why": AI is only valuable if it survives production.

### 2.9 Contact (final CTA)
- Headline: "Have a legacy system, a manual workflow, or an AI idea that
  needs to reach production?"
- Form fields: name, email, company, "What do you want to fix or automate?",
  service interest (dropdown of the 4 services), rough budget range (optional).
- Also show a calendar booking link slot (`{{CAL_LINK}}`) and email.
- Form backend: use the simplest option without a custom server
  (Formspree / Resend / Web3Forms / serverless function). Make it configurable
  via env var. Include honeypot spam protection, validation, success and error
  states.

### 2.10 Footer
Minimal: name, links, © year, privacy note.

---

## 3. ENGINEERING REQUIREMENTS

- **Content lives in one typed config/content file** (e.g. `content.ts` or
  `content.json`), separate from components, so I can iterate on copy and
  offers without touching layout code.
- Reuse existing components; list any component you had to add.
- Fully responsive (mobile first), dark/light support only if my design system
  already has it.
- Accessibility: semantic HTML, keyboard navigation, focus states, contrast
  (WCAG AA), alt text.
- Performance: Lighthouse 95+ on performance, accessibility, SEO, best
  practices. No heavy client JS for static sections. Lazy-load below the fold.
- SEO: title, meta description, Open Graph/Twitter cards, canonical, JSON-LD
  (`Person` + `ProfessionalService`), sitemap, robots.txt.
- Analytics: privacy-friendly and pluggable (Plausible or Umami), env-driven.
  Track events: CTA clicks, form submit, calendar click.
- Smooth anchor scrolling, no scroll-jacking, no autoplaying media, no
  cookie banner unless required by the analytics chosen.
- Add README with: run, build, deploy (Vercel/Netlify/Cloudflare Pages),
  env vars, how to edit content.

---

## 4. COPY RULES

- Every section headline states an outcome or a pain, not a category.
- Concrete over abstract: "add an AI agent to your existing Spring Boot API"
  beats "AI solutions".
- Every service and case study answers: **for whom, what problem, what result.**
- Max ~2 lines per paragraph. Scannable.
- One primary action per screen: book a call.
- Write draft copy in English. Keep strings ready for later i18n (Romanian
  version possible).

---

## 5. OUT OF SCOPE (v1)

Blog, CMS, login, pricing calculator, chatbot widget, newsletter, testimonials
carousel with fake data, animations that hurt performance.

---

## 6. DELIVERABLES

1. Working landing page, runnable locally with one command.
2. `content` file with all copy and placeholders clearly marked `{{LIKE_THIS}}`.
3. Short list of: assumptions made, components added, placeholders I must
   fill (photo, case studies, links, form endpoint, calendar link).
4. 5 suggested improvements for v2, ranked by likely impact on booked calls.

---

## 7. DEFINITION OF DONE

- I can deploy it today and send the link to a prospect.
- A CTO landing on it understands in under 10 seconds: who I am, what I fix,
  for whom, and how to book a call.
- Nothing on the page is fabricated.