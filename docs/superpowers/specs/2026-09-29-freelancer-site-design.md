# Freelancer site (v1) — design spec

Date: 2026-09-29
Owner: Andrei Chelariu
Source brief: `docs/init.md` (positioning, tone, copy rules, "nothing fabricated"). Where this spec and `init.md` disagree, **this spec wins** (page structure, sections used, contact approach).

## 1. Goal

A deployable 3-page site that makes a CTO understand in under 10 seconds: who Andrei is (freelance AI-powered legacy modernization engineer, Java/Spring), what he fixes, for whom, and how to book a call. One primary action everywhere: **Book a call** → `{{CAL_LINK}}`.

Success criteria:
- `npm run dev` runs it locally; `npm run build` produces a static export deployable to Vercel/Netlify/Cloudflare Pages.
- Built from the existing Ac. component library; only one new visual component (`PipelineDiagram`).
- No fabricated clients, logos, metrics or testimonials. Unknown facts are `{{PLACEHOLDERS}}` in one content file.
- Responsive from 360px up, keyboard accessible, respects `prefers-reduced-motion`.

## 2. Stack & repo layout

Next.js (App Router, `output: "export"`) added to **this repo**. The component library stays in `src/` and keeps working (`build.mjs`, `build-previews.mjs`, `tsc`).

```
app/
  layout.tsx            fonts (Urbanist, Inter), tokens.css + styles.css, <body><div class="ac-root">,
                        default metadata, JSON-LD (Person + ProfessionalService)
  page.tsx              Landing  (/)
  about/page.tsx        About    (/about)
  expertise/page.tsx    Placeholder (/expertise), robots noindex
  sitemap.ts · robots.ts
src/
  content/content.ts    ALL copy, nav, footer, SEO strings, placeholders — typed
  site/
    PageHero.tsx        HeroSection + SiteHeader(variant="notch", sticky={false}) with active nav link
    Footer.tsx          SiteFooter fed from content.ts
    PipelineDiagram.tsx NEW — hero aside
    landing/*.tsx       Services (FeatureStep ×4), Stats, Contact
    about/*.tsx         Orbit, Matrix, Stack carousel, Closing (dotted surface)
  ...existing library (unchanged except "use client" directives)
```

Rules:
- Page files (`app/**/page.tsx`) are server components: they export `metadata` and render client wrappers from `src/site/`.
- Library files that use hooks, framer-motion or three.js get `"use client"` at the top. esbuild ignores the directive, so the IIFE bundle build is unaffected.
- `DottedSurfaceSection` is loaded via `next/dynamic` with `ssr: false` so three.js ships only on `/about`, lazily.
- Tailwind `content` adds `app/**/*.{ts,tsx}`. tsconfig gets Next's plugin and `include` for `app`, `next-env.d.ts`; the `@/*` → `src/*` alias stays.
- New dependencies: `next`, `react`, `react-dom` (runtime); `@types/react-dom`, `postcss`, `autoprefixer` (dev). Nothing else.

## 3. Shared chrome

**Navigation** (inside every page's hero): Home · About · Expertise, plus CTA button "Book a call" → `{{CAL_LINK}}`. The CTA stays visible on mobile. The current page's link is marked `aria-current="page"`. Logo: `<Logo name="Ac." />` linking to `/`.

**Hero entrance motion**: the library's HeroSection line-by-line stagger (`duration.hero`, `stagger.loose`). Below-the-fold sections use their built-in `animated` reveal. No scroll-jacking and no autoplaying media (LogoCarousel's autoplay is a slow marquee that pauses on hover/focus, and is disabled under reduced motion).

**Footer** (every page), `SiteFooter`:
- tagline: "AI for existing Java systems. Without a rewrite."
- cta: Book a call → `{{CAL_LINK}}`
- columns: Pages (Home, About, Expertise) · Connect (LinkedIn `{{LINKEDIN}}`, GitHub `{{GITHUB}}`, Email `{{EMAIL}}`)
- copyright: `© {current year} Andrei Chelariu`
- legal: one privacy line ("This site uses no cookies and no tracking.")
- No current employer or client named anywhere on the site.

## 4. Landing `/`

1. **Hero** (`PageHero`)
   - lines: "Add AI to your" / "existing Java systems." / highlight "Without a rewrite."
   - subtitle (≤2 lines): "I'm Andrei, a senior backend engineer. I add AI agents and automation to the Java/Spring systems you already run, without breaking production."
   - primary CTA "Book a 30-min call" → `{{CAL_LINK}}`; secondary "See how I work" → `#services`
   - trust line: `{{YEARS}}+ years · Java / Spring / Quarkus · {{INDUSTRIES}}`
   - aside: `PipelineDiagram`
2. **Services** `#services`: 4 × `FeatureStep`. Numbers 01–04; tone alternates cream / yellow; `mediaSide` alternates right / left.
   Each body: *For* (who) · *You get* (deliverable) · *Outcome*, then `ArrowCta` "Discuss this" → `{{CAL_LINK}}`. Media: a `Card` with 3–4 `CheckItem` deliverables. If `PRICING_MODE` is `"from"`, show `from {{PRICE}}`; default `"hidden"`.
   1. **AI Automation Audit.** Fixed-scope. Find the workflows worth automating, estimate ROI, prioritized roadmap. Deliverable: written report + PoC plan.
   2. **Automation Implementation.** AI agents, chatbots, integrations, RAG, MCP/tools and workflow automation, built into your existing stack.
   3. **Custom AI Platform / Internal Tools.** AI-enabled internal software end to end: backend, API, UI, deployment.
   4. **Legacy Modernization Acceleration.** AI-assisted analysis, migration and refactoring of Java/Spring systems, with guardrails and tests.
3. **StatStatement**: statements of approach, not invented results.
   - "**0** rewrites required."
   - "**1** small, fixed-scope first step."
   - "**{{YEARS}}+** years shipping production Java."
4. **Contact** `#contact`: `CtaSection` tone ink.
   - title: "Have a legacy system, a manual workflow, or an AI idea that needs to reach production?"
   - subtitle: "30 minutes. You describe the system, I tell you honestly whether AI helps."
   - cta: "Book a discovery call", hoverLabel "30 min, no pitch" → `{{CAL_LINK}}`
5. **Footer**

### New component: `PipelineDiagram`
- Props: `steps: string[]`, `className?`. Defaults to Existing backend → APIs → Data → AI agent → Tools → Production.
- Renders an `<ol>` of `Chip`s joined by arrow connectors. Horizontal wrap ≥ md, vertical stack < md. The last step is highlighted (yellow).
- Motion: chips stagger in after the hero headline (uses `Stagger` / `StaggerItem` and tokens from `tokens/motion.ts`). Reduced motion: fade only.
- Accessible name: `aria-label="How AI plugs into your existing system"`.

## 5. About `/about`

1. **Short hero** (`PageHero`, no aside)
   - lines: "Senior backend engineer." / "Making AI" / highlight "survive production."
   - subtitle: "Enterprise Java background, large-scale systems. Now focused on applying AI to existing systems, safely."
   - primary CTA "Book a call" → `{{CAL_LINK}}`
2. **OrbitStatement** (tone cream)
   - statement: "{{YEARS}} years inside large Java systems. Now I add AI to them, safely."
   - items (Lucide icons + labels, hand-placed x/y): Java, Spring, Quarkus, PostgreSQL, Kubernetes, Spring AI, LangChain4j, MCP.
   - center: `{{PHOTO}}` image; fallback is an "AC" monogram when the placeholder is unset.
3. **FeatureMatrix**: title "Two disciplines, one engineer." Three modules, each feature written as *capability*: *what it means for you*.
   - **AI Automation / Agentic Engineering** (periwinkle): agents & chatbots, RAG, integrations, MCP/tools, workflow automation, Spring AI / LangChain4j, guardrails & evaluation.
   - **Custom Software Engineering** (yellow): Java/Spring/Quarkus, PostgreSQL/MongoDB, React, APIs/microservices, GCP, Terraform/Kubernetes, full SDLC.
   - **How I work** (mint): Discover → Audit → Prototype → Ship → Support; small first step, fixed scope, production-minded, handover and docs.
4. **LogoCarousel**: eyebrow "Stack", title "Tools I ship with." Items are tech names + Lucide/monogram icons (no external logo CDN): Java, Spring Boot, Quarkus, PostgreSQL, MongoDB, React, GCP, Terraform, Kubernetes, Spring AI, LangChain4j, n8n, Make.com.
5. **DottedSurfaceSection** mode dark, height md: title "AI is only valuable if it" highlight "survives production." Primary CTA "Book a call" → `{{CAL_LINK}}`; secondary "LinkedIn" → `{{LINKEDIN}}`.
6. **Footer**

## 6. Expertise `/expertise`

Short `PageHero`: "Expertise." / highlight "Coming soon." Subtitle: "A deeper breakdown of capabilities is on the way. Meanwhile, see About." One CTA → `/about`. Then the footer. `robots: { index: false }`. Next iteration replaces this.

## 7. Content file

`src/content/content.ts` exports one typed `content` object: `site` (name, url `{{SITE_URL}}`, calLink, email, linkedin, github, photo, years, industries, pricingMode), `nav`, `footer`, `seo` (per-page title and description), `landing`, `about`, `expertise`. Components never hard-code copy. Placeholders are literal `{{LIKE_THIS}}` strings, listed in the README.

## 8. SEO & quality

- Per-page `metadata`: title, description, canonical, Open Graph / Twitter card (text-only for v1).
- JSON-LD `Person` + `ProfessionalService` in the root layout, from `content.site`.
- `sitemap.ts` (/, /about), `robots.ts`.
- Accessibility: one `h1` per page (hero), landmarks (header / main / footer), visible focus (library focus ring), AA contrast from existing tokens, alt text on the photo.
- Performance target: Lighthouse ≥ 95. Fonts self-hosted via fontsource; three.js lazy on /about only.

## 9. Out of scope (v1)

Contact form (the CTA goes to the calendar link instead), analytics, case studies / Work section, blog, i18n, dark mode toggle, the Expertise content itself.

## 10. Verification

- `npm run typecheck`, `npm run build` (Next static export) and the existing `npm run build:bundle` all pass.
- Manual check in the browser (Playwright) at 375px and 1440px on all 3 pages: nav opens and closes on mobile, hero entrance plays, active link is correct, footer is present, no console errors, reduced-motion emulation disables movement.
- An `impeccable` polish pass on spacing, hierarchy and copy against `init.md`'s copy rules.
