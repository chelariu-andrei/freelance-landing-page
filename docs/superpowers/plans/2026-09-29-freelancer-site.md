# Freelancer Site v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A deployable 3-page Next.js static site (Landing, About, Expertise placeholder) for freelancer Andrei Chelariu, built from the existing Ac. component library.

**Architecture:** Next.js 14 App Router with `output: "export"`, added to this repo next to the library in `src/`. Server page files in `app/` export metadata and render client wrappers from `src/site/`. The wrappers map a single typed content file (`src/content/content.ts`) onto library props.

**Tech Stack:** Next.js 14, React 18, TypeScript (strict), Tailwind 3 (library config), framer-motion 11, three.js (About only, lazy), lucide-react, `node:test` (built-in, no test deps).

**Spec:** `docs/superpowers/specs/2026-09-29-freelancer-site-design.md`. Copy and positioning source: `docs/init.md`.

## Global Constraints

- One primary action everywhere: **Book a call** → `content.site.calLink` (`{{CAL_LINK}}`).
- No fabricated clients, logos, metrics or testimonials. Unknown facts are literal `{{LIKE_THIS}}` strings in `src/content/content.ts`.
- Components never hard-code copy: every visible string comes from `content.ts`.
- No current employer or client named anywhere.
- Only one new visual component: `PipelineDiagram`. Everything else reuses the library.
- New dependencies: `next`, `react`, `react-dom`; dev `@types/react-dom`, `postcss`, `autoprefixer`. Nothing else.
- The existing library builds must keep passing: `npm run typecheck`, `npm run build` (bundle + css), `node build-previews.mjs`.
- Import library modules by direct path (`@/sections/HeroSection`), **never** from `@/index`: the barrel pulls in three.js on every page.
- Tone: senior, direct, technical, calm. No "revolutionize", "cutting-edge", emoji.
- `prefers-reduced-motion` must be respected (the library handles its own components; new motion must use `Stagger`/`Reveal` or `useReducedMotion`).
- Deviation from spec §2, noted for the reviewer: the spec says library files get `"use client"`. Instead, the boundary is the `"use client"` wrappers in `src/site/`. Everything they import becomes client code, so no library file needs editing. Same outcome, less churn.

## Review Focus

1. **Unfilled URL placeholders** (`{{CAL_LINK}}`, `{{LINKEDIN}}`, `{{GITHUB}}`, `{{EMAIL}}`) must never reach an `href`, or a site deployed today ships 404 links. Unset links resolve to `/#contact` or are omitted. Pinned by Task 2 (unit) and Task 8 (scan of every built page).
2. **Phone width (360–390px):** "Book a call" is visible without opening the menu, and nothing scrolls horizontally (pipeline, orbit, stat pills, carousel). Pinned by Task 9 (Playwright).
3. **Reduced motion:** the hero does not slide, the carousel does not autoplay, and chips don't animate position. Pinned by Task 9 (Playwright `emulateMedia`).
4. **No JS / WebGL unavailable:** the About closing section's copy and CTAs are present in the static HTML even though three.js loads client-side only. Pinned by Task 7.
5. **Photo placeholder unset:** the orbit center shows an "AC" monogram, not a broken `<img>`. Pinned by Task 7.

## File map

| File | Responsibility |
|---|---|
| `next.config.mjs`, `postcss.config.js`, `.gitignore` | Next static export + Tailwind pipeline |
| `app/layout.tsx`, `app/globals.css` | fonts, CSS, `.ac-root`, metadataBase, JSON-LD |
| `app/page.tsx`, `app/about/page.tsx`, `app/expertise/page.tsx` | server pages: metadata + composition |
| `app/sitemap.ts`, `app/robots.ts` | SEO files |
| `src/content/content.ts` | all copy + placeholders, typed, no runtime imports |
| `src/content/links.ts` | placeholder detection + href resolution (pure) |
| `src/site/icons.tsx` | `IconKey` → lucide icon |
| `src/site/seo.ts` | `pageMetadata()` + `jsonLd()` (server-safe) |
| `src/site/PageHero.tsx` | HeroSection + notch SiteHeader, used by every page |
| `src/site/Footer.tsx` | SiteFooter from content |
| `src/site/PipelineDiagram.tsx` | NEW hero aside |
| `src/site/landing/*.tsx` | LandingHero, Services, Stats, Contact |
| `src/site/about/*.tsx` | AboutHero, Orbit, Matrix, StackCarousel, Closing |
| `src/layout/SiteHeader.tsx` (modify) | `currentHref` + `pinCtaOnMobile` props |
| `tests/content.test.mts`, `tests/site.test.mjs` | unit + built-HTML tests |

---

### Task 1: Next.js scaffold + test harness

**Files:**
- Create: `.gitignore`, `next.config.mjs`, `postcss.config.js`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/about/page.tsx`, `app/expertise/page.tsx`, `tests/site.test.mjs`
- Modify: `package.json` (scripts, deps, peerDeps), `tailwind.config.js:4` (content), `tsconfig.json` (include; Next also edits it on first build)

**Interfaces:**
- Produces: `npm run dev`, `npm run build:site` (writes `out/index.html`, `out/about.html`, `out/expertise.html`), `npm test`; helper `page(name)` in `tests/site.test.mjs`.

- [ ] **Step 1: Commit the existing library as a baseline** (it is untracked; this makes later diffs reviewable)

Create `.gitignore`:
```
node_modules/
.next/
out/
dist/
*.tsbuildinfo
```
```bash
git add .gitignore README.md SETUP.md build.mjs build-previews.mjs components.json package.json src previews tailwind.config.js tsconfig.json
git status --short   # confirm: no node_modules, no secrets
git commit -m "chore: track Ac. component library baseline"
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install next@14 react@18 react-dom@18
npm install -D @types/react-dom@18 postcss autoprefixer
```
Then in `package.json` set `"peerDependencies": { "react": "^18", "react-dom": "^18" }` (unchanged) and replace `"scripts"` with:
```json
"scripts": {
  "dev": "next dev",
  "build:site": "next build",
  "test": "node --test \"tests/*.test.*\"",
  "typecheck": "tsc -p .",
  "build:bundle": "node build.mjs",
  "build:css": "tailwindcss -c tailwind.config.js -i src/styles.css -o dist/bundle.css --minify",
  "build": "npm run build:bundle && npm run build:css"
}
```

- [ ] **Step 3: Write the failing test** — `tests/site.test.mjs`

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export const page = (name) => readFileSync(new URL(`../out/${name}.html`, import.meta.url), "utf8");
const PAGES = ["index", "about", "expertise"];

test("every page is exported with lang=en and the Ac. root", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.match(html, /<html lang="en"/, p);
    assert.match(html, /class="ac-root/, p);
  }
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, `ENOENT ... out/index.html`.

- [ ] **Step 5: Add config and minimal pages**

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
export default { output: "export", images: { unoptimized: true }, reactStrictMode: true };
```
`postcss.config.js`:
```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```
`tailwind.config.js` line 4:
```js
  content: ["./src/**/*.{ts,tsx}", "./previews/src/**/*.tsx", "./app/**/*.{ts,tsx}"],
```
`tsconfig.json`: change `"include": ["src"]` to `"include": ["src", "app", "next-env.d.ts", ".next/types/**/*.ts"]`.

`app/globals.css`:
```css
html, body { margin: 0; background: var(--cream); }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
```
`app/layout.tsx`:
```tsx
import "@fontsource-variable/urbanist";
import "@fontsource-variable/inter";
import "@/tokens/tokens.css";
import "@/styles.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Andrei Chelariu" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="ac-root">{children}</div>
      </body>
    </html>
  );
}
```
`app/page.tsx`, `app/about/page.tsx`, `app/expertise/page.tsx` (each, for now):
```tsx
export default function Page() {
  return <main />;
}
```

- [ ] **Step 6: Build and run the test**

Run: `npm run build:site && npm test`
Expected: build succeeds (Next may rewrite `tsconfig.json`, adding `plugins`, `jsx: "preserve"`, `isolatedModules`, `allowJs`, `incremental`; keep those edits). Test PASS.

- [ ] **Step 7: Verify the library builds still pass**

Run: `npm run typecheck && npm run build && node build-previews.mjs`
Expected: all succeed. If `typecheck` fails only because of Next's tsconfig edits, fix the reported library file minimally and note it in the commit.

- [ ] **Step 8: Commit**

```bash
git add .gitignore next.config.mjs postcss.config.js tailwind.config.js tsconfig.json next-env.d.ts package.json package-lock.json app tests
git commit -m "feat: add Next.js static-export shell for the freelancer site"
```

---

### Task 2: Content file + link resolution

**Files:**
- Create: `src/content/links.ts`, `src/content/content.ts`, `tests/content.test.mts`

**Interfaces:**
- Produces:
  - `isPlaceholder(v: string): boolean`, `isSet(v: string | undefined): v is string`, `resolveHref(v: string, fallback?: string): string`, `mailtoHref(email: string): string`, `CONTACT_FALLBACK = "/#contact"`
  - `content: Content` and types `IconKey`, `Service`, `NavLink` (as below). Later tasks read `content.site`, `content.nav`, `content.footer`, `content.seo`, `content.landing`, `content.about`, `content.expertise`.

- [ ] **Step 1: Write the failing test** — `tests/content.test.mts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { isPlaceholder, isSet, resolveHref, mailtoHref, CONTACT_FALLBACK } from "../src/content/links.ts";
import { content } from "../src/content/content.ts";

test("placeholder detection", () => {
  assert.equal(isPlaceholder("{{CAL_LINK}}"), true);
  assert.equal(isPlaceholder(" {{EMAIL}} "), true);
  assert.equal(isPlaceholder("https://cal.com/andrei"), false);
  assert.equal(isSet(""), false);
  assert.equal(isSet(undefined), false);
  assert.equal(isSet("{{GITHUB}}"), false);
  assert.equal(isSet("https://github.com/x"), true);
});

test("unset links never produce a placeholder href", () => {
  assert.equal(resolveHref("{{CAL_LINK}}"), CONTACT_FALLBACK);
  assert.equal(resolveHref(""), CONTACT_FALLBACK);
  assert.equal(resolveHref("{{X}}", "/about"), "/about");
  assert.equal(resolveHref("https://cal.com/a"), "https://cal.com/a");
  assert.equal(mailtoHref("{{EMAIL}}"), CONTACT_FALLBACK);
  assert.equal(mailtoHref("a@b.dev"), "mailto:a@b.dev");
});

test("content shape matches the spec", () => {
  assert.deepEqual(content.nav.links.map((l) => l.href), ["/", "/about", "/expertise"]);
  assert.equal(content.nav.cta, "Book a call");
  assert.equal(content.landing.services.length, 4);
  assert.deepEqual(content.landing.services.map((s) => s.number), ["01", "02", "03", "04"]);
  assert.equal(content.landing.stats.length, 3);
  assert.equal(content.about.orbit.items.length, 8);
  assert.equal(content.about.matrix.modules.length, 3);
  assert.equal(content.site.pricingMode, "hidden");
});

test("no hype words in copy", () => {
  const all = JSON.stringify(content).toLowerCase();
  for (const w of ["revolutioni", "cutting-edge", "game-chang", "synergy"]) assert.ok(!all.includes(w), w);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module .../src/content/links.ts`.

- [ ] **Step 3: Write `src/content/links.ts`**

```ts
export const CONTACT_FALLBACK = "/#contact";

export const isPlaceholder = (v: string) => /^\{\{[A-Z0-9_]+\}\}$/.test(v.trim());

export const isSet = (v: string | undefined): v is string => !!v && !isPlaceholder(v);

export const resolveHref = (v: string, fallback: string = CONTACT_FALLBACK) => (isSet(v) ? v : fallback);

export const mailtoHref = (email: string) => (isSet(email) ? `mailto:${email}` : CONTACT_FALLBACK);
```

- [ ] **Step 4: Write `src/content/content.ts`** (pure data: no runtime imports, so Node can load it in tests)

```ts
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: all content tests PASS. (`site.test.mjs` still passes from Task 1's build.)

- [ ] **Step 6: Typecheck and commit**

Run: `npm run typecheck`, expected no errors.
```bash
git add src/content tests/content.test.mts
git commit -m "feat: add typed site content and placeholder-safe link helpers"
```

---

### Task 3: SiteHeader: active link + pinned mobile CTA

**Files:**
- Modify: `src/layout/SiteHeader.tsx` (props interface lines 12–28; render lines 31–120)

**Interfaces:**
- Produces: `SiteHeaderProps.currentHref?: string` (link whose `href` equals it gets `aria-current="page"` and a persistent underline); `SiteHeaderProps.pinCtaOnMobile?: boolean` (below `lg`, the last CTA renders as a small button next to the menu toggle). Both default to off, so existing previews are unchanged.

- [ ] **Step 1: Add the props to the interface**

In `SiteHeaderProps`, after `defaultOpen?: boolean;`:
```ts
  /** Href of the current page; that link gets aria-current="page". */
  currentHref?: string;
  /** Below lg, keep the last CTA visible next to the menu button. */
  pinCtaOnMobile?: boolean;
```
And add `currentHref, pinCtaOnMobile = false` to the destructured params of `SiteHeader`.

- [ ] **Step 2: Mark the current link (desktop and mobile lists)**

Desktop `<a>`:
```tsx
<a href={l.href} aria-current={l.href === currentHref ? "page" : undefined} className={cx("ac-focus rounded-sm font-body text-body-md text-ink no-underline hover:underline underline-offset-4", l.href === currentHref && "underline")}>{l.label}</a>
```
Mobile `<a>`:
```tsx
<a href={l.href} aria-current={l.href === currentHref ? "page" : undefined} onClick={() => setOpen(false)} className={cx("ac-focus rounded-sm font-display text-heading-lg text-ink no-underline", l.href === currentHref && "underline underline-offset-4")}>{l.label}</a>
```

- [ ] **Step 3: Pin the CTA on mobile**

Replace the hamburger `<button ...>...</button>` with a wrapper. Move `lg:hidden` from the button to the wrapper:
```tsx
<div className="lg:hidden flex items-center gap-2">
  {pinCtaOnMobile && ctas.length > 0 && (() => {
    const c = ctas[ctas.length - 1];
    return <Button href={c.href} size="sm" variant={c.variant ?? "primary"}>{c.label}</Button>;
  })()}
  <button
    type="button"
    className="ac-focus inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink text-white border-0 cursor-pointer"
    aria-expanded={open}
    aria-controls={panelId}
    aria-label={open ? "Close menu" : "Open menu"}
    onClick={() => setOpen((o) => !o)}
  >
    {open ? <X size={22} strokeWidth={1.75} aria-hidden /> : <Menu size={22} strokeWidth={1.75} aria-hidden />}
  </button>
</div>
```

- [ ] **Step 4: Verify the library still builds and previews are unaffected**

Run: `npm run typecheck && npm run build && node build-previews.mjs`
Expected: all succeed. (Behavior is asserted on real pages in Task 4.)

- [ ] **Step 5: Commit**

```bash
git add src/layout/SiteHeader.tsx
git commit -m "feat(SiteHeader): add currentHref and pinCtaOnMobile"
```

---

### Task 4: Shared chrome: icons, PageHero, Footer, Expertise page

**Files:**
- Create: `src/site/icons.tsx`, `src/site/PageHero.tsx`, `src/site/Footer.tsx`
- Modify: `app/expertise/page.tsx`, `app/page.tsx`, `app/about/page.tsx` (add Footer), `tests/site.test.mjs`

**Interfaces:**
- Consumes: `content`, `resolveHref`, `mailtoHref`, `isSet` (Task 2); `SiteHeader` `currentHref`/`pinCtaOnMobile` (Task 3).
- Produces:
  - `iconFor(key: IconKey, size?: number, strokeWidth?: number): JSX.Element`
  - `<PageHero current: string; lines: HeroLine[]; subtitle?: React.ReactNode; primaryCta?: {label; href}; secondaryCta?: {label; href}; aside?: React.ReactNode />`
  - `<Footer />`

- [ ] **Step 1: Write the failing tests** (append to `tests/site.test.mjs`)

```js
const count = (html, re) => (html.match(re) || []).length;

test("every page has exactly one h1, the main nav, and the footer", () => {
  for (const p of PAGES) {
    const html = page(p);
    assert.equal(count(html, /<h1[\s>]/g), 1, `${p}: h1 count`);
    assert.match(html, /<nav aria-label="Main"/, p);
    assert.match(html, /<footer/, p);
    assert.match(html, new RegExp(`© ${new Date().getFullYear()} Andrei Chelariu`), p);
    assert.match(html, /This site uses no cookies and no tracking\./, p);
  }
});

test("current page link is marked aria-current", () => {
  assert.match(page("index"), /href="\/" aria-current="page"/);
  assert.match(page("about"), /href="\/about" aria-current="page"/);
  assert.match(page("expertise"), /href="\/expertise" aria-current="page"/);
});

test("Book a call is pinned outside the mobile menu", () => {
  const html = page("expertise");
  assert.match(html, /class="lg:hidden flex items-center gap-2"><a[^>]*>Book a call/);
});

test("expertise placeholder copy", () => {
  const html = page("expertise");
  assert.match(html, /Coming soon\./);
  assert.match(html, /href="\/about"/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build:site && npm test`
Expected: FAIL on h1 count (0).

- [ ] **Step 3: Write `src/site/icons.tsx`**

```tsx
import { Coffee, Leaf, Zap, Database, FileJson, Atom, Cloud, Layers, Boxes, Bot, Link2, Plug, Workflow, Repeat, Search, Cog, LayoutDashboard, RefreshCw, Code2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconKey } from "@/content/content";

const map: Record<IconKey, LucideIcon> = {
  java: Coffee, spring: Leaf, quarkus: Zap, postgres: Database, mongodb: FileJson, react: Atom, gcp: Cloud,
  terraform: Layers, kubernetes: Boxes, springai: Bot, langchain4j: Link2, mcp: Plug, n8n: Workflow, make: Repeat,
  audit: Search, implement: Cog, platform: LayoutDashboard, legacy: RefreshCw, agents: Bot, code: Code2, process: ShieldCheck,
};

export function iconFor(key: IconKey, size = 26, strokeWidth = 1.75) {
  const I = map[key];
  return <I size={size} strokeWidth={strokeWidth} aria-hidden />;
}
```
If typecheck reports a missing lucide export, run `node -e "const l=require('lucide-react');console.log(['FileJson','Boxes','Link2','Plug','Repeat','LayoutDashboard'].filter(n=>!l[n]))"` and swap any missing name for a close existing one.

- [ ] **Step 4: Write `src/site/PageHero.tsx`**

```tsx
"use client";
import * as React from "react";
import { HeroSection, type HeroLine } from "@/sections/HeroSection";
import { SiteHeader } from "@/layout/SiteHeader";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export interface PageHeroProps {
  current: string;
  lines: HeroLine[];
  subtitle?: React.ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  aside?: React.ReactNode;
}

export function PageHero({ current, ...hero }: PageHeroProps) {
  return (
    <HeroSection
      {...hero}
      header={
        <SiteHeader
          variant="notch"
          sticky={false}
          links={content.nav.links}
          ctas={[{ label: content.nav.cta, href: resolveHref(content.site.calLink), variant: "primary" }]}
          currentHref={current}
          pinCtaOnMobile
        />
      }
    />
  );
}
```

- [ ] **Step 5: Write `src/site/Footer.tsx`**

```tsx
"use client";
import { Linkedin, Github } from "lucide-react";
import { SiteFooter } from "@/layout/SiteFooter";
import { content } from "@/content/content";
import { isSet, mailtoHref, resolveHref } from "@/content/links";

export function Footer() {
  const { site, nav, footer } = content;
  const connect = [
    ...(isSet(site.linkedin) ? [{ label: "LinkedIn", href: site.linkedin }] : []),
    ...(isSet(site.github) ? [{ label: "GitHub", href: site.github }] : []),
    ...(isSet(site.email) ? [{ label: "Email", href: mailtoHref(site.email) }] : []),
    { label: nav.cta, href: resolveHref(site.calLink) },
  ];
  const socials = [
    ...(isSet(site.linkedin) ? [{ label: "LinkedIn", href: site.linkedin, icon: <Linkedin size={26} strokeWidth={1.75} /> }] : []),
    ...(isSet(site.github) ? [{ label: "GitHub", href: site.github, icon: <Github size={26} strokeWidth={1.75} /> }] : []),
  ];
  return (
    <SiteFooter
      tagline={footer.tagline}
      ctas={[{ label: nav.cta, href: resolveHref(site.calLink) }]}
      columns={[{ title: footer.pagesTitle, links: nav.links }, { title: footer.connectTitle, links: connect }]}
      socials={socials}
      copyright={`© ${new Date().getFullYear()} ${site.name} · ${footer.privacy}`}
    />
  );
}
```

- [ ] **Step 6: Build the Expertise page and add Footer to the other two**

`app/expertise/page.tsx`:
```tsx
import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";

export default function ExpertisePage() {
  const h = content.expertise.hero;
  return (
    <>
      <main>
        <PageHero current="/expertise" lines={h.lines} subtitle={h.subtitle} primaryCta={h.primaryCta} />
      </main>
      <Footer />
    </>
  );
}
```
In `app/page.tsx` and `app/about/page.tsx`, temporarily render the hero with the landing/about hero lines so every page has one h1 (Tasks 5 and 7 replace these):
```tsx
import { PageHero } from "@/site/PageHero";
import { Footer } from "@/site/Footer";
import { content } from "@/content/content";

export default function Page() {
  return (
    <>
      <main><PageHero current="/" lines={content.landing.hero.lines} /></main>
      <Footer />
    </>
  );
}
```
(For `about`, use `current="/about"` and `content.about.hero.lines`.)

- [ ] **Step 7: Build and run tests**

Run: `npm run build:site && npm test`
Expected: PASS. If the pinned-CTA regex fails only because of attribute order in the rendered `<a>`, loosen it to `/lg:hidden flex items-center gap-2"[^]*?>Book a call</`. Do not change the component.

- [ ] **Step 8: Commit**

```bash
git add src/site app tests/site.test.mjs
git commit -m "feat: shared hero with nav, footer, and Expertise placeholder page"
```

---

### Task 5: PipelineDiagram + Landing hero

**Files:**
- Create: `src/site/PipelineDiagram.tsx`, `src/site/landing/LandingHero.tsx`
- Modify: `app/page.tsx`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `PageHero` (Task 4), `content.landing.hero`, `resolveHref`.
- Produces: `<PipelineDiagram steps?: string[]; className?: string />`, `<LandingHero />`.

- [ ] **Step 1: Write the failing test** (append)

```js
test("landing hero: headline, trust line, CTAs and pipeline in order", () => {
  const html = page("index");
  assert.match(html, /Without a rewrite\./);
  assert.match(html, /\{\{YEARS\}\}\+ years · Java \/ Spring \/ Quarkus/);
  assert.match(html, />Book a 30-min call</);
  assert.match(html, /href="#services"[^>]*>See how I work</);
  assert.match(html, /<ol aria-label="How AI plugs into your existing system"/);
  const steps = ["Existing backend", "APIs", "Data", "AI agent", "Tools", "Production"];
  let at = 0;
  for (const s of steps) {
    const i = html.indexOf(`>${s}<`, at);
    assert.ok(i > at, `pipeline step ${s} in order`);
    at = i;
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build:site && npm test`
Expected: FAIL on the trust-line assertion (the Task 4 placeholder hero renders the headline lines only, with no subtitle or aside).

- [ ] **Step 3: Write `src/site/PipelineDiagram.tsx`**

```tsx
"use client";
import { ArrowRight } from "lucide-react";
import { Chip } from "@/primitives/Chip";
import { Stagger, StaggerItem } from "@/motion/Reveal";
import { stagger } from "@/tokens/motion";
import { cx } from "@/lib/cx";

const DEFAULT_STEPS = ["Existing backend", "APIs", "Data", "AI agent", "Tools", "Production"];

export interface PipelineDiagramProps {
  steps?: string[];
  className?: string;
}

export function PipelineDiagram({ steps = DEFAULT_STEPS, className }: PipelineDiagramProps) {
  const last = steps.length - 1;
  return (
    <Stagger immediate delay={1.1} stagger={stagger.base} className={className}>
      <ol aria-label="How AI plugs into your existing system" className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-2 md:gap-3">
        {steps.map((s, i) => (
          <StaggerItem as="li" key={s} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
            <Chip tone={i === last ? "yellow" : "white"}>{s}</Chip>
            {i < last && <ArrowRight aria-hidden size={18} strokeWidth={1.75} className="text-muted-on-dark rotate-90 md:rotate-0 ml-4 md:ml-0" />}
          </StaggerItem>
        ))}
      </ol>
    </Stagger>
  );
}
```

- [ ] **Step 4: Write `src/site/landing/LandingHero.tsx`**

```tsx
"use client";
import { PageHero } from "@/site/PageHero";
import { PipelineDiagram } from "@/site/PipelineDiagram";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function LandingHero() {
  const h = content.landing.hero;
  return (
    <PageHero
      current="/"
      lines={h.lines}
      subtitle={<>{h.subtitle}<span className="block mt-4 font-body text-body-md text-muted-on-dark">{h.trust}</span></>}
      primaryCta={{ label: h.primaryCta, href: resolveHref(content.site.calLink) }}
      secondaryCta={h.secondaryCta}
      aside={
        <div className="rounded-lg border border-solid border-line-on-dark p-5 lg:p-8">
          <p className="m-0 mb-4 font-body text-overline uppercase text-muted-on-dark">{h.pipelineLabel}</p>
          <PipelineDiagram steps={h.pipeline} />
        </div>
      }
    />
  );
}
```

- [ ] **Step 5: Use it in `app/page.tsx`**

```tsx
import { LandingHero } from "@/site/landing/LandingHero";
import { Footer } from "@/site/Footer";

export default function LandingPage() {
  return (
    <>
      <main>
        <LandingHero />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Build and run tests**

Run: `npm run build:site && npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/site/PipelineDiagram.tsx src/site/landing/LandingHero.tsx app/page.tsx tests/site.test.mjs
git commit -m "feat: landing hero with animated AI pipeline diagram"
```

---

### Task 6: Landing sections: Services, Stats, Contact

**Files:**
- Create: `src/site/landing/Services.tsx`, `src/site/landing/Stats.tsx`, `src/site/landing/Contact.tsx`
- Modify: `app/page.tsx`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `content.landing.services|stats|contact`, `content.site.pricingMode`, `iconFor`, `resolveHref`.
- Produces: `<Services />` (`<section id="services">`), `<Stats />`, `<Contact />` (`<div id="contact">`).

- [ ] **Step 1: Write the failing test** (append)

```js
test("landing sections in order: services, stats, contact", () => {
  const html = page("index");
  const iServices = html.indexOf('id="services"');
  const iStats = html.indexOf("rewrites required.");
  const iContact = html.indexOf('id="contact"');
  assert.ok(iServices > 0 && iStats > iServices && iContact > iStats, "order");
  for (const s of ["AI Automation Audit", "Automation Implementation", "Custom AI Platform / Internal Tools", "Legacy Modernization Acceleration"]) {
    assert.match(html, new RegExp(s.replace(/[/]/g, "\\/")), s);
  }
  assert.equal(count(html, />Discuss this</g), 4);
  assert.match(html, /small, fixed-scope first step\./);
  assert.match(html, /needs to reach production\?/);
  assert.match(html, />Book a discovery call</);
});

test("prices hidden while pricingMode is hidden", () => {
  assert.doesNotMatch(page("index"), /PRICE_/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build:site && npm test`
Expected: FAIL, "order".

- [ ] **Step 3: Write `src/site/landing/Services.tsx`**

```tsx
"use client";
import { FeatureStep } from "@/sections/FeatureStep";
import { Card } from "@/primitives/Card";
import { CheckItem } from "@/primitives/CheckItem";
import { ArrowCta } from "@/primitives/ArrowCta";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function Services() {
  const { services, servicesCta, servicesMediaTitle } = content.landing;
  const cal = resolveHref(content.site.calLink);
  return (
    <section id="services" aria-label="Services">
      {services.map((s, i) => (
        <FeatureStep
          key={s.id}
          number={s.number}
          label={s.label}
          tone={s.tone}
          mediaSide={i % 2 === 0 ? "right" : "left"}
          icon={iconFor(s.icon)}
          body={
            <div className="flex flex-col gap-4">
              <p className="m-0"><strong>For:</strong> {s.forWho}</p>
              <p className="m-0"><strong>You get:</strong> {s.youGet}</p>
              <p className="m-0"><strong>Outcome:</strong> {s.outcome}</p>
              <ArrowCta label={servicesCta} href={cal} tone={s.tone === "yellow" ? "white" : "yellow"} className="self-start" />
            </div>
          }
          media={
            <Card surface="white" radius="xl" padding="lg">
              <p className="m-0 mb-5 font-display text-heading-lg">{servicesMediaTitle}</p>
              <ul className="flex flex-col gap-3">
                {s.deliverables.map((d) => <CheckItem key={d}>{d}</CheckItem>)}
              </ul>
              {content.site.pricingMode === "from" && <p className="m-0 mt-5 font-body text-body-md text-ink-muted">{s.price}</p>}
            </Card>
          }
        />
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Write `src/site/landing/Stats.tsx`**

```tsx
"use client";
import { StatStatement } from "@/sections/StatStatement";
import { content } from "@/content/content";

export function Stats() {
  return (
    <StatStatement
      rows={content.landing.stats.map((s) => ({ parts: [{ kind: "value" as const, text: s.value }, { kind: "text" as const, text: s.text }] }))}
    />
  );
}
```

- [ ] **Step 5: Write `src/site/landing/Contact.tsx`**

```tsx
"use client";
import { CtaSection } from "@/sections/CtaSection";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function Contact() {
  const c = content.landing.contact;
  return (
    <div id="contact">
      <CtaSection tone="ink" title={c.title} subtitle={c.subtitle} cta={{ label: c.cta, hoverLabel: c.ctaHover, href: resolveHref(content.site.calLink) }} />
    </div>
  );
}
```

- [ ] **Step 6: Compose `app/page.tsx`**

```tsx
import { LandingHero } from "@/site/landing/LandingHero";
import { Services } from "@/site/landing/Services";
import { Stats } from "@/site/landing/Stats";
import { Contact } from "@/site/landing/Contact";
import { Footer } from "@/site/Footer";

export default function LandingPage() {
  return (
    <>
      <main>
        <LandingHero />
        <Services />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Build and run tests**

Run: `npm run build:site && npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/site/landing app/page.tsx tests/site.test.mjs
git commit -m "feat: landing services, stats and contact sections"
```

---

### Task 7: About page

**Files:**
- Create: `src/site/about/AboutHero.tsx`, `src/site/about/Orbit.tsx`, `src/site/about/Matrix.tsx`, `src/site/about/StackCarousel.tsx`, `src/site/about/Closing.tsx`
- Modify: `app/about/page.tsx`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `content.about.*`, `content.site.photo|linkedin|calLink`, `iconFor`, `isSet`, `resolveHref`, `PageHero`.
- Produces: the five components above, no props.

- [ ] **Step 1: Write the failing tests** (append)

```js
test("about sections in order", () => {
  const html = page("about");
  const order = ["survive production.", "years inside large Java systems", "Two disciplines, one engineer.", "Tools I ship with.", "survives production."];
  let at = 0;
  for (const s of order) {
    const i = html.indexOf(s, at);
    assert.ok(i >= at && i !== -1, `order: ${s}`);
    at = i + 1;
  }
});

test("closing section is in the static HTML (works without JS/WebGL)", () => {
  const html = page("about");
  assert.match(html, /AI is only valuable if it/);
  assert.match(html, /survives production\./);
  assert.match(html, />Book a call</);
});

test("unset photo falls back to the AC monogram, never a broken img", () => {
  const html = page("about");
  assert.match(html, />AC</);
  assert.doesNotMatch(html, /src="\{\{PHOTO\}\}"/);
});

test("stack carousel lists tech, no client logos", () => {
  const html = page("about");
  for (const n of ["Spring Boot", "Quarkus", "PostgreSQL", "LangChain4j", "n8n"]) assert.match(html, new RegExp(n), n);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build:site && npm test`
Expected: FAIL, "order: years inside large Java systems".

- [ ] **Step 3: Write `src/site/about/AboutHero.tsx`**

```tsx
"use client";
import { PageHero } from "@/site/PageHero";
import { content } from "@/content/content";
import { resolveHref } from "@/content/links";

export function AboutHero() {
  const h = content.about.hero;
  return <PageHero current="/about" lines={h.lines} subtitle={h.subtitle} primaryCta={{ label: h.primaryCta, href: resolveHref(content.site.calLink) }} />;
}
```

- [ ] **Step 4: Write `src/site/about/Orbit.tsx`**

```tsx
"use client";
import { OrbitStatement } from "@/sections/OrbitStatement";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";
import { isSet } from "@/content/links";

export function Orbit() {
  const o = content.about.orbit;
  const photo = content.site.photo;
  return (
    <OrbitStatement
      tone="cream"
      magnet={0.3}
      statement={o.statement}
      centerPosition={{ x: 50, y: 50, size: 34 }}
      center={
        isSet(photo)
          ? <img src={photo} alt={o.photoAlt} className="w-full h-full object-cover rounded-full" />
          : <span className="font-display text-display-lg text-ink" aria-label={o.photoAlt}>{o.monogram}</span>
      }
      items={o.items.map((it) => ({ id: it.id, label: it.label, x: it.x, y: it.y, size: it.size, icon: iconFor(it.icon, 28) }))}
    />
  );
}
```

- [ ] **Step 5: Write `src/site/about/Matrix.tsx`**

```tsx
"use client";
import { FeatureMatrix } from "@/sections/FeatureMatrix";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";

export function Matrix() {
  const m = content.about.matrix;
  return (
    <FeatureMatrix
      title={m.title}
      meta={m.meta}
      modules={m.modules.map((mod) => ({
        id: mod.id, name: mod.name, tagline: mod.tagline, iconTone: mod.iconTone, icon: iconFor(mod.icon, 22),
        features: mod.features.map((f) => ({ lead: f.lead, text: `— ${f.text}` })),
      }))}
    />
  );
}
```

- [ ] **Step 6: Write `src/site/about/StackCarousel.tsx`**

```tsx
"use client";
import { LogoCarousel } from "@/sections/LogoCarousel";
import { iconFor } from "@/site/icons";
import { content } from "@/content/content";

export function StackCarousel() {
  const s = content.about.stack;
  return (
    <LogoCarousel
      eyebrow={s.eyebrow}
      title={s.title}
      titleMuted={s.titleMuted}
      size="md"
      speed={24}
      items={s.items.map((it) => ({ id: it.id, name: it.name, description: it.description, icon: iconFor(it.icon, 40, 1.5) }))}
    />
  );
}
```
(LogoCarousel already disables autoplay under reduced motion and pauses on interaction; no extra handling.)

- [ ] **Step 7: Write `src/site/about/Closing.tsx`** (three.js loads client-side only; the fallback renders the same copy statically)

```tsx
"use client";
import dynamic from "next/dynamic";
import { Button } from "@/primitives/Button";
import { HighlightText } from "@/primitives/HighlightText";
import { content } from "@/content/content";
import { isSet, resolveHref } from "@/content/links";

function useClosingProps() {
  const c = content.about.closing;
  const primaryCta = { label: c.primaryCta, href: resolveHref(content.site.calLink) };
  const secondaryCta = isSet(content.site.linkedin) ? { label: c.secondaryCta, href: content.site.linkedin } : undefined;
  return { c, primaryCta, secondaryCta };
}

function StaticClosing() {
  const { c, primaryCta, secondaryCta } = useClosingProps();
  return (
    <section className="bg-cream px-2 lg:px-gutter py-2">
      <div className="bg-ink ac-dark rounded-lg lg:rounded-xl px-5 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col items-center text-center gap-8">
        <h2 className="m-0 font-display font-regular text-display-lg max-w-[16ch] text-white">
          {c.title} <HighlightText variant="text">{c.highlight}</HighlightText>
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button href={primaryCta.href} size="lg" variant="primary">{primaryCta.label}</Button>
          {secondaryCta && <Button href={secondaryCta.href} size="lg" variant="outline">{secondaryCta.label}</Button>}
        </div>
      </div>
    </section>
  );
}

const DottedSurfaceSection = dynamic(() => import("@/sections/DottedSurfaceSection").then((m) => m.DottedSurfaceSection), {
  ssr: false,
  loading: StaticClosing,
});

export function Closing() {
  const { c, primaryCta, secondaryCta } = useClosingProps();
  return <DottedSurfaceSection mode="dark" height="md" speed={0.5} dotSize={6} title={c.title} highlight={c.highlight} primaryCta={primaryCta} secondaryCta={secondaryCta} />;
}
```

- [ ] **Step 8: Compose `app/about/page.tsx`**

```tsx
import { AboutHero } from "@/site/about/AboutHero";
import { Orbit } from "@/site/about/Orbit";
import { Matrix } from "@/site/about/Matrix";
import { StackCarousel } from "@/site/about/StackCarousel";
import { Closing } from "@/site/about/Closing";
import { Footer } from "@/site/Footer";

export default function AboutPage() {
  return (
    <>
      <main>
        <AboutHero />
        <Orbit />
        <Matrix />
        <StackCarousel />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 9: Build and run tests**

Run: `npm run build:site && npm test`
Expected: PASS. If the "closing in static HTML" test fails, the `loading` fallback was not server-rendered. Confirm `loading: StaticClosing` is set and that `Closing` is imported by the page (not itself dynamically imported).

- [ ] **Step 10: Check three.js stays off the landing page**

Run: `grep -l "WebGLRenderer" out/_next/static/chunks/app/page-*.js || echo "ok: no three on landing"`
Expected: `ok: no three on landing`.

- [ ] **Step 11: Commit**

```bash
git add src/site/about app/about/page.tsx tests/site.test.mjs
git commit -m "feat: About page with orbit, capability matrix, stack carousel and dotted closing"
```

---

### Task 8: SEO: metadata, JSON-LD, sitemap, robots

**Files:**
- Create: `src/site/seo.ts`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/expertise/page.tsx`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: `content.seo`, `content.site`, `isSet`.
- Produces: `SITE_URL: string`, `pageMetadata(key: "landing" | "about" | "expertise", path: string): Metadata`, `jsonLd(): string`.

- [ ] **Step 1: Write the failing tests** (append)

```js
test("per-page title, description, canonical and OG", () => {
  const cases = [["index", "/", "AI for existing Java systems"], ["about", "/about", "About · Andrei Chelariu"], ["expertise", "/expertise", "Expertise · Andrei Chelariu"]];
  for (const [p, path, title] of cases) {
    const html = page(p);
    assert.match(html, new RegExp(`<title>[^<]*${title}`), p);
    assert.match(html, /<meta name="description" content="[^"]+"/, p);
    assert.match(html, new RegExp(`<link rel="canonical" href="https?://[^"]+${path === "/" ? "" : path}"`), p);
    assert.match(html, /<meta property="og:title"/, p);
    assert.match(html, /<meta name="twitter:card" content="summary"/, p);
  }
});

test("expertise is noindex, the others are indexable", () => {
  assert.match(page("expertise"), /<meta name="robots" content="noindex/);
  assert.doesNotMatch(page("index"), /noindex/);
  assert.doesNotMatch(page("about"), /noindex/);
});

test("JSON-LD Person + ProfessionalService", () => {
  const m = page("index").match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(m, "json-ld present");
  const types = JSON.parse(m[1])["@graph"].map((n) => n["@type"]);
  assert.deepEqual(types, ["Person", "ProfessionalService"]);
});

test("no page ships an unfilled placeholder in an href", () => {
  for (const p of PAGES) assert.doesNotMatch(page(p), /href="[^"]*\{\{/, p);
});

test("sitemap lists / and /about only; robots points to it", () => {
  const sitemap = readFileSync(new URL("../out/sitemap.xml", import.meta.url), "utf8");
  assert.equal(count(sitemap, /<loc>/g), 2);
  assert.doesNotMatch(sitemap, /expertise/);
  const robots = readFileSync(new URL("../out/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https?:\/\/.+\/sitemap\.xml/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run build:site && npm test`
Expected: FAIL on title/canonical.

- [ ] **Step 3: Write `src/site/seo.ts`** (no `"use client"`; imported by server files)

```ts
import type { Metadata } from "next";
import { content } from "@/content/content";
import { isSet } from "@/content/links";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || content.site.url).replace(/\/$/, "");

export function pageMetadata(key: "landing" | "about" | "expertise", path: string): Metadata {
  const { title, description } = content.seo[key];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: content.site.name, type: "website", locale: "en" },
    twitter: { card: "summary", title, description },
    ...(key === "expertise" ? { robots: { index: false, follow: true } } : {}),
  };
}

export function jsonLd(): string {
  const { name, role, linkedin, github } = content.site;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${SITE_URL}/#person`, name, jobTitle: role, url: SITE_URL, sameAs: [linkedin, github].filter(isSet) },
      { "@type": "ProfessionalService", "@id": `${SITE_URL}/#service`, name: `${name}, ${role}`, url: SITE_URL, description: content.seo.landing.description, provider: { "@id": `${SITE_URL}/#person` }, areaServed: "Worldwide" },
    ],
  };
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
```

- [ ] **Step 4: Wire the layout** — in `app/layout.tsx`, replace the metadata export and add the script:

```tsx
import { SITE_URL, jsonLd } from "@/site/seo";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };
```
Inside `<body>`, before the `.ac-root` div:
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
```

- [ ] **Step 5: Page metadata** — add to each page file:

`app/page.tsx`: `import { pageMetadata } from "@/site/seo"; export const metadata = pageMetadata("landing", "/");`
`app/about/page.tsx`: `import { pageMetadata } from "@/site/seo"; export const metadata = pageMetadata("about", "/about");`
`app/expertise/page.tsx`: `import { pageMetadata } from "@/site/seo"; export const metadata = pageMetadata("expertise", "/expertise");`

- [ ] **Step 6: `app/sitemap.ts` and `app/robots.ts`**

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about"].map((p) => ({ url: `${SITE_URL}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : 0.8 }));
}
```
```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/site/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
```

- [ ] **Step 7: Build and run tests**

Run: `npm run build:site && npm test`
Expected: PASS. If the canonical regex fails on `/` because Next renders the bare origin with or without a trailing slash, adjust the regex to accept an optional `/`. Do not change `pageMetadata`.

- [ ] **Step 8: Commit**

```bash
git add src/site/seo.ts app tests/site.test.mjs
git commit -m "feat: per-page metadata, JSON-LD, sitemap and robots"
```

---

### Task 9: Browser verification, impeccable polish, README

**Files:**
- Modify: `README.md` (append a "Freelancer site" section), and any `src/site/**` or `src/content/content.ts` spacing/copy tweaks from the polish pass
- Test: Playwright MCP checks (manual, scripted below)

**Interfaces:**
- Consumes: everything above. Produces nothing new.

- [ ] **Step 1: Serve the static export**

```bash
npm run build:site
npx --yes serve out -l 4173
```
(run the second command in the background)

- [ ] **Step 2: Mobile check at 375×812 on `/`, `/about`, `/expertise`** (Playwright `browser_resize`, `browser_navigate`, `browser_evaluate`)

For each page evaluate:
```js
() => ({
  hScroll: document.documentElement.scrollWidth > window.innerWidth,
  pinnedCta: [...document.querySelectorAll("header a")].some(a => a.textContent.trim() === "Book a call" && a.getBoundingClientRect().width > 0),
  h1: document.querySelectorAll("h1").length,
})
```
Expected on every page: `{ hScroll: false, pinnedCta: true, h1: 1 }`. Then click "Open menu", confirm the three links are visible, press Escape, and confirm the panel closes. Also run at 360×740 for the `hScroll` check only. If the orbit bubbles or the pipeline cause horizontal scroll, fix it in `content.ts` (orbit x/y/size) or `PipelineDiagram` classes.

- [ ] **Step 3: Desktop check at 1440×900**

Screenshot each page (`browser_take_screenshot`, fullPage). Confirm: the hero lines animate in on load, the pipeline chips appear after the headline, services alternate sides, and the About closing shows the dot wave. `browser_console_messages` must show no errors.

- [ ] **Step 4: Reduced motion**

`browser_emulate_media({ reducedMotion: "reduce" })`, reload `/` and `/about`, then evaluate:
```js
() => [...document.querySelectorAll("h1 *, ol li")].map(e => getComputedStyle(e).transform).filter(t => t && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)").length
```
Expected `0` after 2s (no residual translate). On `/about`, confirm the carousel track does not move: read the track's `transform` twice, 2s apart, and check both values are equal.

- [ ] **Step 5: impeccable polish pass**

Invoke the `impeccable` skill on the three pages with the screenshots from Step 3. Constraints to pass along: reuse library tokens only, no new visual primitives, and copy must follow `docs/init.md` §4 (outcome-led headlines, ≤2 lines per paragraph, no hype). Apply only changes to `src/site/**` and `src/content/content.ts`. Rerun `npm run build:site && npm test` after the changes.

- [ ] **Step 6: README section** — append to `README.md`:

```markdown
## Freelancer site (Next.js)

- `npm run dev`: local dev at http://localhost:3000
- `npm run build:site`: static export to `out/` (deploy `out/` to Vercel, Netlify or Cloudflare Pages; on Vercel use the Next.js preset)
- `npm test`: content unit tests + checks against the built HTML (run `build:site` first)

**Edit copy:** everything lives in `src/content/content.ts`. Components never hard-code text.

**Env:** `NEXT_PUBLIC_SITE_URL` (absolute URL, used for canonical, sitemap and JSON-LD; defaults to `content.site.url`).

**Placeholders to fill** in `src/content/content.ts` (unset links fall back to `/#contact` or are hidden):
`{{CAL_LINK}}` · `{{EMAIL}}` · `{{LINKEDIN}}` · `{{GITHUB}}` · `{{PHOTO}}` (image path under `public/`) · `{{YEARS}}` · `{{INDUSTRIES}}` · `{{SITE_URL}}` (`site.url`) · `{{PRICE_*}}` (shown only when `site.pricingMode = "from"`).
```

- [ ] **Step 7: Final full check and commit**

Run: `npm run typecheck && npm run build && node build-previews.mjs && npm run build:site && npm test`
Expected: all pass.
```bash
git add README.md src/site src/content
git commit -m "docs: README for the freelancer site; polish pass"
```
