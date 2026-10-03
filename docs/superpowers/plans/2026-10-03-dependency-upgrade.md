# Stack Upgrade (Node 24/26 · React 19 · Next 16 · Motion · Tailwind 4 · TS 7) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every dependency and the Node toolchain to its current latest major, adjust the code so the site renders identically, and switch on the performance features the new versions provide.

**Architecture:** One upgrade per task, in dependency order: framework first (Next + React), then the libraries that sit on React, then the CSS engine, then the compiler, then opt-in performance work. A Playwright visual-regression baseline is captured on the **current** stack before anything changes; every task must keep it green, so "compatible" is something we check, not something we hope for. The site stays a static export (`output: "export"`) deployed to Vercel.

**Tech Stack (from → to, checked with `npm view` on 2026-10-03):**

| Package | Now | Target | Breaking for us? |
|---|---|---|---|
| Node (local) | 24.21 | 24 LTS for Vercel builds, 26 OK locally | Vercel builds max out at **24.x**; 26 only runs in Sandboxes |
| next | 14.2.35 | 16.3.8 | Turbopack is now the default bundler; smooth-scroll override removed; tsconfig rewritten |
| react / react-dom | 18.3.1 | 19.3.0 | `forwardRef` no longer needed; stricter types |
| @types/react(-dom) | 18.3 | 19.3 | `useRef()` needs an argument; global `JSX` is gone (we don't use either) |
| framer-motion | 11.18.2 | `motion` 14.0.0 | No API breaks in 12/13/14; the package is renamed, import `motion/react` |
| lucide-react | 0.453 | 1.51.0 | **Brand icons removed: `Linkedin`, `Github`, `Instagram`** (all other icons we use still exist; checked against the v1 `.d.ts`) |
| react-day-picker | 9.14 | 10.0.2 | Only removes APIs deprecated in v9; our `classNames` keys still exist |
| tailwindcss | 3.4.19 | 4.3.3 | New engine, CSS-first config, native cascade layers, new PostCSS plugin |
| tailwind-merge | 2.6.1 | 3.7.0 | v3 requires Tailwind 4 → upgraded together |
| typescript | 5.9.3 | 7.0.2 | Native Go compiler; `baseUrl` removed; no JS compiler API |
| esbuild | 0.23.1 | 0.28.2 | Lib bundle only |
| @types/node | 26.6.3 | 26.6.4 | — |
| @vercel/analytics, next-themes, clsx, three, fontsource | — | already latest | — |

**Spec:** The user's request in this session: *"upgrade the component library and everything to the latest version, even my Node.js version to latest, latest React 19 + latest Vercel. Plan the code adjustments needed to stay compatible and to improve performance."* No separate spec doc exists.

## Global Constraints

- The site stays a static export: `next.config.mjs` keeps `output: "export"` and `images: { unoptimized: true }`.
- No visual change: `npm run test:visual` must pass against the baseline from Task 0 after every task. If a diff is intentional (e.g. Tailwind 4 now only applies `hover:` on devices that can hover), re-baseline in its own commit and say why in the message.
- `npm run typecheck`, `npm run build` and `npm test` must pass at the end of every task.
- Vercel production builds run on **Node 24.x** until Vercel lists 26.x for builds. `engines.node` is `">=24"`, so Vercel moves to 26 by itself once it supports it.
- Privacy page: no new third-party scripts or trackers (see memory: the privacy page has to cover booking + analytics). Speed Insights is **out of scope** for that reason.
- The design-system bundle (`npm run build:lib`) still builds, and its exported names stay the same (`icons.Linkedin` and `icons.Instagram` stay available).
- One task = one commit, on branch `chore/stack-upgrade-2026`.

## Review Focus

1. **Tailwind 4 cascade layers.** Plain CSS outside a layer now beats every utility. `.ac-orbit-node` (`src/styles.css`) and anything in `tokens.css`/`globals.css` could start overriding utilities, so OrbitStatement discs must sit exactly where they do today → covered by the Task 0 visual spec (`/` at 3 widths) plus wrapping those rules in `@layer components` in Task 6.
2. **Smooth scrolling on route change.** Next 16 stops forcing `scroll-behavior: auto` during navigation. With `html { scroll-behavior: smooth }` in `globals.css`, going from `/` to `/about` would slowly scroll to the top instead of jumping → Task 2 adds `data-scroll-behavior="smooth"` and a site test for it.
3. **Footer social icons vanish.** In lucide v1, `Linkedin`/`Github` are gone, so the footer would fail to build, or render with no icon if someone swaps in a fallback → Task 0 adds a test for `lucide-linkedin`/`lucide-github` in the built HTML; Task 4 provides local icons.
4. **Carousel enter/exit animation loses its ref.** `AnimatePresence mode="popLayout"` measures each `Tile` through its ref. Without the ref, tiles jump instead of animating → Task 3 keeps a ref path and checks it by hand in the browser (step listed there).
5. **The booking calendar renders without styles.** If a react-day-picker 10 `classNames` key were renamed, the calendar would silently fall back to unstyled buttons → Task 5 has a key-existence test against the installed package's `UI` enum.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `playwright.config.ts` | Create | Visual-regression runner: serves `out/` and screenshots the 3 pages |
| `tests/visual/pages.spec.ts` | Create | The visual spec; reduced motion, WebGL canvas masked |
| `tests/visual/pages.spec.ts-snapshots/` | Create (generated) | Baseline PNGs from the pre-upgrade stack |
| `.nvmrc` | Create | `24`, the Node line Vercel builds with |
| `package.json` | Modify | Versions, `engines`, `test:visual`, `build:css` |
| `next.config.mjs` | Modify | `reactCompiler` (Task 8) |
| `app/layout.tsx` | Modify | `data-scroll-behavior="smooth"` |
| `tsconfig.json` | Modify | Drop `baseUrl`, update target/lib (TS 7) |
| `src/primitives/Button.tsx`, `src/primitives/Input.tsx`, `src/sections/LogoCarousel.tsx` | Modify | React 19 ref-as-prop |
| every file importing `framer-motion` (17 files) | Modify | Import from `motion/react` |
| `src/site/brand-icons.ts` | Create | LinkedIn/GitHub/Instagram icons built with lucide's `createLucideIcon` (paths copied from lucide 0.453, ISC licence) |
| `src/site/Footer.tsx`, `src/index.ts` | Modify | Use the local brand icons |
| `src/components/ui/calendar.tsx` | Modify | Comment says v10 |
| `src/styles.css`, `postcss.config.js` | Modify | Tailwind 4 entry, no preflight, `@config` |
| `tests/site.test.mjs`, `tests/booking.test.mts` | Modify | New regression pins |
| `README.md`, `SETUP.md` | Modify | Versions and Node requirement |

---

### Task 0: Safety net — branch, visual baseline, regression pins

**Files:**
- Create: `playwright.config.ts`, `tests/visual/pages.spec.ts`
- Modify: `package.json` (scripts + devDeps), `tests/site.test.mjs`

**Interfaces:**
- Produces: `npm run test:visual` (and `npm run test:visual -- --update-snapshots` to re-baseline). Every later task runs it.

- [ ] **Step 1: Commit the work in progress, then branch**

The working tree has many staged-but-uncommitted changes (booking, privacy page, 404…). Ask the user to commit them on `feat/freelancer-site` first; do not mix them into the upgrade. Then:

```bash
git switch -c chore/stack-upgrade-2026
```

- [ ] **Step 2: Install Playwright (dev only) and a static server**

```bash
npm i -D @playwright/test@latest serve@latest
npx playwright install chromium
```

- [ ] **Step 3: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

// Visual regression for the static export: build first, this serves out/ as Vercel would (clean URLs).
export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: "{testDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  use: { baseURL: "http://localhost:4173", reducedMotion: "reduce", colorScheme: "light" },
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"], browserName: "chromium" } },
    { name: "tablet", use: { viewport: { width: 820, height: 1180 }, browserName: "chromium" } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 }, browserName: "chromium" } },
  ],
  webServer: { command: "npx serve out -l 4173 --no-clipboard", url: "http://localhost:4173", reuseExistingServer: true },
});
```

- [ ] **Step 4: Write `tests/visual/pages.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const PAGES = [["home", "/"], ["about", "/about"], ["privacy", "/privacy"], ["404", "/does-not-exist"]] as const;

for (const [name, path] of PAGES) {
  test(`${name} looks the same`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    // Scroll through once so whileInView reveals fire, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
      window.scrollTo(0, 0);
    });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("canvas")], // three.js dotted surface is non-deterministic
    });
  });
}
```

- [ ] **Step 5: Add the script**

In `package.json` `scripts`, add:

```json
"test:visual": "playwright test"
```

- [ ] **Step 6: Add regression pins to `tests/site.test.mjs`** (append)

```js
test("footer social icons render (lucide v1 dropped brand icons)", () => {
  const html = page("index");
  assert.match(html, /lucide-linkedin/);
  assert.match(html, /lucide-github/);
});
```

- [ ] **Step 7: Build on the current stack, run everything, and record the baseline**

```bash
npm run build && npm test && npm run test:visual -- --update-snapshots && npm run test:visual
```

Expected: unit tests PASS (including the new pin); Playwright writes 12 PNGs (4 pages × 3 projects), and the second run passes. If the second run is flaky, raise `maxDiffPixelRatio` to `0.005` or mask the flaky element. Don't go further: a loose baseline can't catch anything.

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts tests/visual package.json package-lock.json tests/site.test.mjs
git commit -m "test: visual-regression baseline before the stack upgrade"
```

---

### Task 1: Node toolchain

**Files:**
- Create: `.nvmrc`
- Modify: `package.json`

- [ ] **Step 1: Install Node 26 locally next to 24 (nvm-windows is installed)**

```bash
nvm install 26
nvm install 24
nvm use 24
```

- [ ] **Step 2: Pin the line Vercel builds with**

`.nvmrc`:
```
24
```

`package.json`, top level:
```json
"engines": { "node": ">=24" }
```

In the Vercel dashboard → Project → Settings → Build and Deployment → Node.js Version: set **24.x**. Node 20 was deprecated there on 2026-10-01.

- [ ] **Step 3: Check both lines**

```bash
nvm use 24 && npm ci && npm run build && npm test
nvm use 26 && npm ci && npm run build && npm test
nvm use 24
```

Expected: PASS on both. `npm test` imports `.ts` files directly, which needs Node's built-in type stripping (on by default from 22.18 / 24), so both lines work.

- [ ] **Step 4: Commit**

```bash
git add .nvmrc package.json package-lock.json
git commit -m "chore: require Node 24+, pin Vercel builds to 24.x"
```

---

### Task 2: Next 16 + React 19

**Files:**
- Modify: `package.json`, `package-lock.json`, `app/layout.tsx`, `tsconfig.json` (Next rewrites it), `next-env.d.ts` (regenerated)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Produces: React 19 + Next 16 for every later task.

- [ ] **Step 1: Write the failing test** (append to `tests/site.test.mjs`)

```js
test("route changes jump to top instead of smooth-scrolling (Next 16 data-scroll-behavior)", () => {
  for (const p of PAGES) assert.match(page(p), /<html[^>]*data-scroll-behavior="smooth"/, p);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL on the new test.

- [ ] **Step 3: Upgrade packages with the official codemod**

```bash
npx @next/codemod@canary upgrade latest
```

Accept React 19 when asked. Then make sure the types match:

```bash
npm i next@latest react@latest react-dom@latest
npm i -D @types/react@latest @types/react-dom@latest
```

Nothing else needs the codemod here: we have no middleware, no `next lint`, no `params`/`cookies()`/`headers()`, no `webpack` key, no AMP, and `robots.ts`/`sitemap.ts` already export `dynamic = "force-static"`.

- [ ] **Step 4: Keep the old jump-to-top on navigation**

`app/layout.tsx`: change the `<html>` line to

```tsx
<html lang="en" className={mono.variable} data-scroll-behavior="smooth">
```

- [ ] **Step 5: Bump the library peer range**

`package.json`:
```json
"peerDependencies": { "react": "^19", "react-dom": "^19" }
```

- [ ] **Step 6: Build, accept Next's tsconfig edits, test**

```bash
npm run build && npm run typecheck && npm test && npm run test:visual
```

Expected: PASS. The first `next build` rewrites `tsconfig.json` (e.g. `"jsx": "react-jsx"`, adds `.next/dev/types/**/*.ts` to `include`). Keep those edits. If typecheck reports React 19 type errors, fix them in place. Likely ones: `useRef<T>()` → `useRef<T>(null)`, and `JSX.Element` → `React.JSX.Element`.

- [ ] **Step 7: Check in the browser**

`npm run dev`, open `/`, `/about`, `/privacy`. Check that: there are no hydration warnings in the console; the booking dialog opens and the calendar loads; clicking "About" in the nav lands at the top immediately.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: upgrade to Next 16 and React 19"
```

---

### Task 3: React 19 ref-as-prop (drop `forwardRef`)

`forwardRef` still works in 19 but is on the deprecation path, and the wrapper adds an extra layer to every Button render. React 19 passes `ref` as a normal prop.

**Files:**
- Modify: `src/primitives/Button.tsx:47-69`, `src/primitives/Input.tsx:17-19`, `src/sections/LogoCarousel.tsx:111-112`

- [ ] **Step 1: Button.** Replace the `forwardRef` wrapper:

```tsx
/** Pill button. Every CTA in the system is a pill; yellow is reserved for the single most important action in view. */
export function Button({
  variant = "primary", size = "md", href, iconLeft, iconRight, fullWidth, animated = true, className, children, disabled, ref, ...rest
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement> }) {
```

Keep the body as it is. Replace the closing `});` with `}`.

- [ ] **Step 2: Input.**

```tsx
export function Input({
  label, hideLabel, hint, error, tone = "light", size = "md", iconLeft, id, className, disabled, ref, ...rest
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
```

Closing `});` → `}`.

- [ ] **Step 3: LogoCarousel Tile.**

```tsx
// AnimatePresence's popLayout mode measures each tile through its ref (a plain prop in React 19).
function Tile({ item, clone, onItemClick, ref }: { item: CarouselItem; clone: boolean; onItemClick?: (i: CarouselItem) => void; ref?: React.Ref<HTMLLIElement> }) {
```

Closing `});` → `}`.

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run build && npm test && npm run test:visual
```

Then `npm run dev`, scroll to the logo carousel, click its arrows: tiles should fade/scale in and out (popLayout), not jump.

- [ ] **Step 5: Commit**

```bash
git add src/primitives/Button.tsx src/primitives/Input.tsx src/sections/LogoCarousel.tsx
git commit -m "refactor: use React 19 ref-as-prop instead of forwardRef"
```

---

### Task 4: framer-motion → motion 14, lucide-react 1.x with local brand icons

**Files:**
- Create: `src/site/brand-icons.ts`
- Modify: the 17 files that import `framer-motion`, `src/site/Footer.tsx`, `src/index.ts`, `package.json`

- [ ] **Step 1: Swap the packages**

```bash
npm uninstall framer-motion
npm i motion@latest lucide-react@latest
```

- [ ] **Step 2: Rewrite the imports** (same API, new path)

```bash
grep -rl '"framer-motion"' src app previews/src | xargs sed -i 's/"framer-motion"/"motion\/react"/'
grep -rn "framer-motion" src app previews/src
```

Expected: the second command only finds comments. Update those comments by hand, e.g. the `.ac-orbit-node` note in `src/styles.css` ("which framer-motion owns" → "which Motion owns").

- [ ] **Step 3: Run typecheck to see what breaks**

Run: `npm run typecheck`
Expected: FAIL — `Module '"lucide-react"' has no exported member 'Linkedin'` (and `Github`, `Instagram`) in `src/site/Footer.tsx` and `src/index.ts`.

- [ ] **Step 4: Create `src/site/brand-icons.ts`**

```ts
import { createLucideIcon } from "lucide-react";

// lucide v1 dropped brand icons. These are the exact v0.453 outlines (ISC), rebuilt with lucide's factory
// so they take the same props (size, strokeWidth, className) and the same `lucide-*` class as before.
export const Linkedin = createLucideIcon("Linkedin", [
  ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z", key: "c2jq9f" }],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }],
]);

export const Github = createLucideIcon("Github", [
  ["path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4", key: "tonef" }],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
]);

export const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }],
]);
```

- [ ] **Step 5: Point the imports at it**

`src/site/Footer.tsx`:
```tsx
import { Mail, FileUser } from "lucide-react";
import { Linkedin, Github } from "@/site/brand-icons";
```

`src/index.ts`: remove `Linkedin, Instagram, ` from the `lucide-react` import, and add right below it:
```ts
import { Linkedin, Instagram } from "./site/brand-icons";
```
(The `icons` object stays the same, so previews keep working.)

- [ ] **Step 6: Verify**

```bash
npm run typecheck && npm run build && npm test && npm run test:visual && npm run build:lib
```

Expected: PASS, including the Task 0 test that pins `lucide-linkedin`/`lucide-github`. Lucide v1 may also add a second class (e.g. `lucide-linkedin-icon`) to the SVGs. That doesn't affect the screenshots.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: move to motion 14 and lucide v1, keep brand icons locally"
```

---

### Task 5: react-day-picker 10

**Files:**
- Modify: `package.json`, `src/components/ui/calendar.tsx:18`
- Test: `tests/booking.test.mts`

- [ ] **Step 1: Write the test** (append to `tests/booking.test.mts`)

```ts
import { UI } from "react-day-picker";

test("every calendar classNames key still exists in react-day-picker", () => {
  const used = ["months", "month", "month_caption", "caption_label", "nav", "button_previous", "button_next",
    "month_grid", "weekday", "day", "day_button", "today", "selected", "outside", "disabled", "hidden"];
  const known = new Set<string>([...Object.values(UI), "today", "selected", "outside", "disabled", "hidden"]);
  for (const k of used) assert.ok(known.has(k), `unknown DayPicker classNames key: ${k}`);
});
```

(`today`/`selected`/`outside`/`disabled`/`hidden` are `DayFlag`/`SelectionState` keys. They're listed separately so the test only checks the `UI` enum, the part most likely to be renamed.)

- [ ] **Step 2: Run on v9 to confirm it passes there** (it guards the bump)

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Upgrade**

```bash
npm i react-day-picker@latest
```

In `calendar.tsx`, change the comment `shadcn-style Calendar on react-day-picker v9` → `v10`.

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm test && npm run build && npm run test:visual
```

Then `npm run dev` → open booking → go to next month and back, pick a day, check that disabled days can't be clicked and keyboard arrows move focus.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: upgrade react-day-picker to v10"
```

---

### Task 6: Tailwind 4 + tailwind-merge 3

The biggest task, and the most likely to cause visual regressions. Keep the existing JS config through `@config` (every token stays where it is) instead of rewriting it as CSS `@theme`.

**Do not run `npx @tailwindcss/upgrade` and keep its class renames.** It renames `rounded-sm→rounded-xs`, `shadow-sm→shadow-xs` and similar, assuming Tailwind's default scale. This project **replaces** those scales with tokens (`rounded-sm` = `var(--radius-sm)`), so the renames would break the design.

**Files:**
- Modify: `package.json`, `postcss.config.js`, `src/styles.css:1-3` and the unlayered rules at the bottom, `tailwind.config.js` (only if needed)

- [ ] **Step 1: Swap packages**

```bash
npm uninstall autoprefixer
npm i -D tailwindcss@latest @tailwindcss/postcss@latest @tailwindcss/cli@latest postcss@latest
npm i tailwind-merge@latest
```

- [ ] **Step 2: `postcss.config.js`**

```js
module.exports = { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 3: `src/styles.css` entry — replace lines 1-3**

```css
/* Tailwind 4 without preflight (we never used it): theme variables + utilities only, tokens from the JS config. */
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
@config "../tailwind.config.js";
```

`tailwind.config.js` keeps `corePlugins: { preflight: false }`. It's harmless in v4 and documents the intent. v4 finds source files on its own, and `content` is still honoured through `@config`.

- [ ] **Step 4: Put the unlayered rules in a layer**

In v4, CSS outside any layer beats every utility. In v3 the two competed by specificity and order. Move every rule in `src/styles.css` below the existing `@layer components { … }` block (the `@media (prefers-reduced-motion)` block and the `.ac-orbit-node` rules) **into** `@layer components { … }`. Leave `tokens.css` alone (only `:root` custom properties).

- [ ] **Step 5: Update the library CSS script** (`package.json`)

```json
"build:css": "tailwindcss -i src/styles.css -o dist/bundle.css --minify"
```

(`@tailwindcss/cli` provides the `tailwindcss` binary; the config now comes from `@config`, so `-c` goes away.)

- [ ] **Step 6: Build and compare**

```bash
npm run build && npm test && npm run test:visual
```

Expected: PASS. If screenshots differ, check these known v4 behaviour changes against the diff:
- `ring` / `ring-*` defaults (3px blue → 1px currentColor): `grep -rn "ring" src --include=*.tsx`; pin explicit widths/colours.
- `outline-none` now really means `outline-style: none`. Used on `Input`'s inner `<input>`; the visible focus ring lives on the wrapper (`focus-within`), so that's intended. Use `outline-hidden` if you need the old meaning.
- `hover:` now only applies where `(hover: hover)`. The phone project screenshots don't hover, so no diff is expected.
- `!` prefix (4 uses): still works in v4. Optionally move it to the end (`text-ink!`).
- Custom `fontSize` tuples with `letterSpacing`/`lineHeight` (`text-display-xl` etc.) come through `@config` unchanged. Spot-check the hero.

Fix in place. Re-baseline (`-- --update-snapshots`) only for a diff you have explained, and give it its own commit.

- [ ] **Step 7: Check tailwind-merge with the custom scale**

`cn()` is only used in `calendar.tsx`. In twMerge 3, `text-lead` (custom font size) and `text-ink` (colour) could be treated as conflicts if twMerge doesn't know the scale. Open the booking calendar: the month caption must be both `font-display text-lead` and ink-coloured. If the size is lost, extend twMerge in `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the Ac. font-size scale so `text-lead` and `text-ink` aren't treated as conflicting.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["price", "display-xl", "display-lg", "heading-xl", "heading-lg", "lead", "label-lg", "nav-lg", "body-lg", "body-md", "body", "sm", "caption", "overline", "micro", "button-lg", "button", "button-sm"] }] } },
});

/** shadcn's class helper: clsx for conditionals + tailwind-merge to resolve conflicting utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 8: Library bundle still builds**

```bash
npm run build:lib
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: upgrade to Tailwind 4 and tailwind-merge 3, keep token config via @config"
```

---

### Task 7: TypeScript 7, esbuild, @types/node

**Files:**
- Modify: `package.json`, `tsconfig.json`

- [ ] **Step 1: Upgrade**

```bash
npm i -D typescript@latest esbuild@latest @types/node@latest
```

- [ ] **Step 2: Run typecheck to see what breaks**

Run: `npm run typecheck`
Expected: FAIL on `baseUrl` (removed in TS 7).

- [ ] **Step 3: Update `tsconfig.json` `compilerOptions`**

- Delete `"baseUrl": "."`.
- `"paths": { "@/*": ["./src/*"] }` (relative to the tsconfig).
- `"target": "ES2022"`, `"lib": ["DOM", "DOM.Iterable", "ES2022"]`. Nothing is emitted (`noEmit`), Next/esbuild pick the browser output, and this unlocks typing for `Array.prototype.at`, `Object.hasOwn`, etc.
- Remove the `"plugins": [{ "name": "next" }]` entry only if TS 7 errors on it. TS 7 has no language-service plugins; editors lose Next's in-IDE hints either way.

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run build && npm test && npm run build:lib && npm run test:visual
```

Next 16 type-checks with the project's own `tsc` CLI by default (`useTypeScriptCli`), which works with TS 7.

**Fallback:** if `next build` or an editor integration can't handle TS 7, pin `typescript@^6` and add `@typescript/native-preview` for a fast `tsgo --noEmit` typecheck script. Record the reason in the commit message.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: upgrade to TypeScript 7, esbuild 0.28, @types/node 26"
```

---

### Task 8: Performance — React Compiler

Automatic memoisation. The places that benefit most are the scroll/velocity-driven `LogoCarousel` and `SiteHeader` (re-render on scroll) and the booking flow. Next 16 has it built in, but it runs through Babel, so builds get slower. Measure before and after.

**Files:**
- Modify: `next.config.mjs`, `package.json`

- [ ] **Step 1: Measure the baseline**

```bash
rm -rf .next && time npm run build
```

Write down the build time.

- [ ] **Step 2: Enable it**

```bash
npm i -D babel-plugin-react-compiler@latest
```

`next.config.mjs`:
```js
/** @type {import('next').NextConfig} */
export default { output: "export", images: { unoptimized: true }, reactStrictMode: true, reactCompiler: true };
```

- [ ] **Step 3: Verify and measure**

```bash
rm -rf .next && time npm run build && npm test && npm run test:visual
```

The compiler skips components that break the Rules of React (e.g. mutating refs during render in `dotted-surface.tsx`) instead of miscompiling them. In the browser (`npm run dev`), check the carousel drag/velocity, header hide-on-scroll, booking slot selection and the dotted surface.

- [ ] **Step 4: Keep or revert**

Keep it if everything works and the build is less than ~2× slower. Otherwise revert this task's commit and note why in the plan.

- [ ] **Step 5: Commit**

```bash
git add next.config.mjs package.json package-lock.json
git commit -m "perf: enable React Compiler"
```

---

### Task 9: Docs, final review, Vercel preview

**Files:**
- Modify: `README.md:3`, `SETUP.md:7,30`

- [ ] **Step 1: Update docs**

`README.md` line 3 → `React 19 + TypeScript 7 + Tailwind 4 + Motion 14 (Next 16). Requires Node 24+. Every Tailwind value maps to a CSS variable in \`src/tokens/tokens.css\`. There are no magic numbers in components.`

`README.md` setup step 1 → mention that `src/styles.css` is a Tailwind 4 entry (`@import` + `@config`), not `@tailwind` directives.

`SETUP.md` table row → `Tailwind CSS | ✅ already (v4, \`@config "tailwind.config.js"\` from \`src/styles.css\`)`. In the Vite line, swap `tailwindcss@3 postcss autoprefixer … init -p` for `npm i -D tailwindcss @tailwindcss/vite` and drop the `baseUrl` advice (`"paths": {"@/*": ["./src/*"]}` only).

- [ ] **Step 2: Full clean check**

```bash
rm -rf node_modules .next out && npm ci && npm run typecheck && npm run build && npm test && npm run test:visual && npm run build:lib && npm outdated
```

Expected: everything PASSES; `npm outdated` prints nothing (or only patch releases newer than this plan).

- [ ] **Step 3: Vercel preview**

Push the branch and open the Vercel preview deployment. Check the build log says Node 24.x, the build passes, `/`, `/about`, `/privacy` and a 404 render, and Analytics still records the page view (Vercel → Analytics, may take a minute).

- [ ] **Step 4: Commit**

```bash
git add README.md SETUP.md
git commit -m "docs: document the upgraded stack and Node 24+ requirement"
```

---

## Considered and left out

- **Motion `LazyMotion` + `m` components:** `LogoCarousel` uses drag/pan, which needs `domMax`. That's most of the full bundle, so the saving is small for an edit across ~17 files. Revisit only if Lighthouse flags JS size.
- **Moving the theme to CSS `@theme`:** `@config` keeps the token config working with no behaviour change. A CSS-first rewrite can be its own follow-up.
- **`@vercel/speed-insights`:** new data collection would need a privacy-page update. Out of scope.
- **Node 26 on Vercel:** not offered for builds yet; `engines: ">=24"` picks it up automatically once it is.
