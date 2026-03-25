# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A Claude Code skill (`figma-to-react-components`) that converts Figma design system nodes into production-ready React + TypeScript + Vite applications. Generated apps live under `apps/` (gitignored via `apps*/`).

## How to Use the Skill

Invoke the skill in Claude Code:
```
/figma-to-react-components
```
Then provide a Figma URL or node ID. The skill runs an 8-phase workflow that produces a complete React app under `apps/<appname>/`.

## Running Generated Apps

Each generated app is self-contained under `apps/<appname>/`:

```bash
cd apps/<appname>
npm install
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # TypeScript check + production bundle → dist/
npm run preview   # Preview production build
```

## Skill Architecture

The skill lives at `.claude/skills/figma-to-react-components/`:

- **`SKILL.md`** — 8-phase workflow (source of truth)
- **`rules/`** — Enforced constraints (CRITICAL/HIGH/MEDIUM priority)
- **`references/`** — Implementation guides and code patterns

### 8-Phase Workflow Summary

1. **Extract Figma Design Context** — structure, tokens, variants, interactive states
2. **Asset Identification & Download** — batch download all `IMAGE-SVG` nodes and image fills via `mcp__figma__download_figma_images` into `public/icons/`
3. **Map Design Tokens** — Figma variables → `tokens.css` (3-layer hierarchy)
4. **Generate Props Documentation** — TypeScript interfaces and accessibility notes
5. **Generate React Components** — TypeScript + React Aria hooks + BEM classes
6. **Generate Styles** — Token-based CSS using BEM methodology
7. **Create Storybook Story** — all variants documented
8. **Cleanup** — remove MCP temp artifacts, keep intentional assets

## Critical Rules (never violate)

- **No hardcoded values** — all colors, spacing, radii, shadows must use CSS custom properties from `tokens.css`
- **Assets from Figma only** — icons/logos must be downloaded via `mcp__figma__download_figma_images`; never hand-crafted or pulled from icon libraries
- **React Aria for interactions** — use `useButton`, `useCheckbox`, `useSelect`, etc. for all interactive components
- **`:focus-visible` not `:focus`** — keyboard-only focus rings

## Token System (3-Layer Hierarchy)

```css
/* Layer 1: Primitives (brand-specific raw values) */
:root { --color-blue-600: #1E4D6D; }
:root[data-brand="other"] { --color-blue-600: #007D57; }

/* Layer 2: Semantic (always reference primitives) */
:root { --color-primary: var(--color-blue-600); }

/* Components always reference semantic tokens, never primitives */
.button { background: var(--color-primary); }
```

Multi-brand switching at runtime: `document.documentElement.setAttribute('data-brand', 'other')`.

## Asset Pipeline

1. Use **instance nodeIds** (semicolon-separated paths like `I482:6198;248:5310`) — NOT componentIds
2. Single batch call to `mcp__figma__download_figma_images`
3. Assets land in `public/icons/`
4. Create `Icons.tsx` barrel with typed wrapper components
5. Color variation via CSS `filter`, never hardcoded SVG fill/stroke

## Naming Conventions

- CSS classes: BEM — `.block__element--modifier`
- Icon components: `PascalCase` (e.g., `DashboardIcon`)
- Semantic token names: `--color-primary`, `--spacing-md` (never `--color-blue`, `--spacing-16`)

## Multi-Brand Detection

If the Figma canvas has 2+ top-level frames with different token palettes, the skill automatically:
- Generates brand-specific token overrides using `[data-brand="X"]` CSS selectors
- Creates a `BrandSwitcher` component for runtime switching
