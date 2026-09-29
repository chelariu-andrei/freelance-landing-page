# Setting up shadcn / Tailwind / TypeScript

## What this codebase already had and what was added
| Requirement | Status |
|---|---|
| TypeScript | ✅ already (`tsconfig.json`, strict) |
| Tailwind CSS | ✅ already (v3, `tailwind.config.js`, `src/styles.css`) |
| shadcn structure | ➕ added: `components.json`, the `@/*` → `src/*` path alias, `src/lib/utils.ts` (`cn`), `src/components/ui/` |

Default paths are now: components go in `src/components/ui` (alias `@/components/ui`), utils in `src/lib/utils.ts` (`@/lib/utils`), and styles in `src/styles.css`.

## Why `components/ui` matters
- The shadcn CLI (`npx shadcn@latest add <name>`) writes every component to the `ui` alias from `components.json`. Registry components, including this one, import each other through `@/components/ui/...` and `@/lib/utils`. If that folder or those aliases are missing, copied components fail to resolve.
- It separates the low-level, copy-in primitives (`ui/`) from the brand's composed components (`primitives/`, `sections/`), so updating a shadcn component never touches Ac. code.

## Dependencies for DottedSurface
```bash
npm i three next-themes clsx tailwind-merge
npm i -D @types/three
```

## Starting a fresh project instead (Next.js)
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
npx shadcn@latest init          # creates components.json, lib/utils.ts, CSS variables
npm i three next-themes && npm i -D @types/three
# copy src/components/ui/dotted-surface.tsx into src/components/ui/
```
- **Vite + React:** `npm create vite@latest my-app -- --template react-ts`. Then add Tailwind (`npm i -D tailwindcss@3 postcss autoprefixer && npx tailwindcss init -p`), add `"baseUrl": "."` and `"paths": {"@/*": ["./src/*"]}` to tsconfig with the matching `resolve.alias` in `vite.config.ts`, and run `npx shadcn@latest init`.
- **Dark mode:** in Next.js, wrap the app in `<ThemeProvider attribute="class">` from `next-themes` so the dots switch colour with the theme. Without the provider it stays in light mode.
