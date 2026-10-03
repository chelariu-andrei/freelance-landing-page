# Ac. design system — source

React 19 + TypeScript 7 + Tailwind 4 + Motion 14 (Next 16). Requires Node 24. Every Tailwind value maps to a CSS variable in `src/tokens/tokens.css`. There are no magic numbers in components.

## Use in an app
1. `import "./src/tokens/tokens.css"` and add `src/styles.css` to your Tailwind entry. It is a Tailwind 4 entry (`@import` + `@config`, not `@tailwind` directives) and holds the focus ring, skeleton and notch helpers.
   - Tailwind 4 is required. Pasting `src/styles.css` into a Tailwind 3 entry breaks on its `@import` and `@config` lines.
   - The bundle CSS (`dist/bundle.css`) is wrapped in cascade layers (`@layer theme, base, components, utilities`) and uses `@property`. A host page's unlayered CSS beats Ac. utilities, so import it into your own layer order.
   - It needs Tailwind 4's browser floor: Safari 16.4+, Chrome 111+, Firefox 128+.
2. Extend your Tailwind config with `tailwind.config.js`, or use it as-is. Add your app's files to `content`.
3. Load the fonts: `@fontsource-variable/urbanist` and `@fontsource-variable/inter`.
4. Wrap the app in `<div className="ac-root">` and import components from `src/index.ts`.

## Tree
```
src/
  tokens/     tokens.css (CSS variables) · motion.ts (durations, easings, distances, stagger)
  lib/        cx.ts
  motion/     Reveal.tsx — Reveal, Stagger, StaggerItem, usePressMotion
  primitives/ Button, ArrowCta, Badge, Chip, Input, Card, Icon (+IconCircle), StepPill,
              SectionHeading, HighlightText, Divider, AvatarStack, Logo, Skeleton
  widgets/    Sparkline, MediaPanel, SignalCard, CampaignCard, TrendingTopics, ChannelCard, ScoreMeter
  layout/     Container (+Grid), Section, SiteHeader, SiteFooter
  sections/   HeroSection, FeatureStep, ProcessLoop, StatStatement, CtaSection, LogoCarousel
  components/ui/  shadcn-style primitives — dotted-surface.tsx (three.js)
  sections/DottedSurfaceSection.tsx  standalone dot-wave section (light / cream / dark)
  components/demos/ dotted-surface-demo.tsx
  lib/utils.ts    cn() for shadcn components
  styles.css  Tailwind entry + component-layer helpers
  index.ts    public exports
previews/src/ usage examples for every component + Showcase.tsx (all variants)
tailwind.config.js · tsconfig.json · build.mjs (IIFE bundle → window.Ac)
```
See SETUP.md for the shadcn / Tailwind / TypeScript setup.

Props interfaces live next to each component. The design-system artifact carries the guidelines, live previews and generated API cards.

## Freelancer site (Next.js)

- `npm run dev`: local dev at http://localhost:3000
- `npm run build`: static export to `out/` (`build:site` is kept as an alias)
- `npm test`: content unit tests + checks against the built HTML (run `build` first)

**Deploy:**
| Host | Build command | Output / publish directory |
|---|---|---|
| Vercel | Next.js preset, build `npm run build` | `out` |
| Netlify | build `npm run build` | `out` |
| Cloudflare Pages | build `npm run build` | `out` |

**Edit copy:** everything lives in `src/content/content.ts`. Components never hard-code text.

**Env:** `NEXT_PUBLIC_SITE_URL` (absolute URL, used for canonical, sitemap and JSON-LD; defaults to `content.site.url`).

**Placeholders to fill** in `src/content/content.ts` (unset links fall back to `/#contact` or are hidden):
`{{CAL_LINK}}` · `{{EMAIL}}` · `{{LINKEDIN}}` · `{{GITHUB}}` · `{{PHOTO}}` (image path under `public/`) · `{{YEARS}}` · `{{INDUSTRIES}}` · `{{SITE_URL}}` (`site.url`) · `{{PRICE_*}}` (shown only when `site.pricingMode = "from"`).
