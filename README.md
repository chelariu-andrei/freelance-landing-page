# Ac. design system — source

React 18 + TypeScript + Tailwind 3 + Framer Motion 11. Every Tailwind value maps to a CSS variable in `src/tokens/tokens.css`. There are no magic numbers in components.

## Use in an app
1. `import "./src/tokens/tokens.css"` and add `src/styles.css` to your Tailwind entry (it holds the @tailwind layers, focus ring, skeleton and notch helpers).
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
