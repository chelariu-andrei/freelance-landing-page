# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Technical decision-makers (CTOs, engineering managers, tech leads, founders with budget) at companies that already run Java/Spring/Quarkus systems and want AI-powered workflows, integrations and automation on top of them. Secondary: SaaS/software companies adding AI agents to an existing backend. Tertiary, mentioned lightly: small and mid-sized businesses with manual workflows and a need for custom internal software. They arrive evaluating whether one freelancer can be trusted with production.

## Product Purpose
Personal site of Andrei Chelariu, a freelance senior backend engineer (AI-powered legacy modernization). Its job is to start conversations and book 30-minute discovery calls, not to entertain. Success is a qualified decision-maker booking a call.

## Positioning
Adds AI agents and automation to existing Java/Spring systems without a rewrite and without breaking production: one engineer with enterprise Java depth (5+ years, retail), working in small, fixed-scope steps with guardrails, tests and handover.

## Operating Context
Three fixed-scope services sharing one path (discover, build, test and launch): AI Automation, Custom Software, Legacy Modernization. Booking happens through a Cal.com link (`calLink`, still a placeholder); contact also by email, LinkedIn, GitHub and a Europass CV served from /public.

## Capabilities and Constraints
- Pages: Home (hero, services, stats, contact), About, Expertise (placeholder, "coming soon").
- Static-first Next.js 14 + Tailwind + framer-motion; no cookies, no tracking.
- Pricing hidden by default (`pricingMode`), `from` mode available; price values are placeholders.
- Open placeholders: `SITE_URL`, `CAL_LINK`, service prices.
- Site language is English; the owner converses in Romanian.

## Brand Commitments
Tone: senior, direct, technical, calm, outcome-oriented. Engineer talking to an engineer who controls a budget. No hype, no "revolutionize", no "cutting-edge", no buzzword soup. Name: Andrei Chelariu.

## Evidence on Hand
Europass CV (`/EUROPASS_CV.pdf`). The owner has real figures for experience, but the About numbers currently in `content.ts` (30+ projects, 12 engineers mentored, 25+ technologies) are illustrative and flagged by `scripts/check-placeholders.mjs` until replaced; the real values are not yet supplied. No public client names, logos, case studies or testimonials exist; none may be invented. Slots for GitHub demos, architecture diagrams and short videos are planned but empty.

## Product Principles
1. Start a conversation: every surface leads toward booking a call.
2. Small steps, not rewrites: show the added AI plugging into what already runs.
3. Production-minded credibility: guardrails, tests and handover over demos.
4. Never fabricate proof: illustrative values are labeled, real ones replace them.
5. Calm and exact: plain technical language, no hype.
