---
name: figma-to-react-components
description: Convert Figma component designs into production-ready React implementations
  with design token integration, accessibility via React Aria, and comprehensive documentation.
  Use when building React components from Figma designs, generating component implementation
  specs, or bridging design-to-development workflows.
metadata:
  category: design
  tags:
  - figma
  - react
  - design-tokens
  - component-generation
  - accessibility
  - react-aria
  - design-handoff
  status: ready
  version: 2
---

# Figma to React Component Converter

Convert Figma component designs into production-ready React components with full design token integration, accessibility support via React Aria, and comprehensive documentation. Works with any design token system (SCSS variables, CSS custom properties, Tailwind, or JavaScript tokens).

## Prerequisites

- **Figma MCP** — Figma MCP server configured and running
- **React Aria** — `react-aria` and `react-stately` installed
- **Design tokens** (optional) — If the project already has a token system (SCSS, CSS vars, Tailwind, JS/TS), map to it. If not, tokens are extracted from Figma and generated as part of the workflow.
- **Storybook** (optional) — For component documentation and visual testing

## Project Configuration

Read project defaults from `.claude/CLAUDE.md`. This file defines the stack, output paths, token format, and styling approach for the project.

If no `.claude/CLAUDE.md` exists, fall back to discovery: search the codebase for token files, styling patterns, and component directories. Ask the user for any setting that cannot be determined.

## Ordem de dependência (não pular etapas)

1. **Token files devem existir antes de qualquer geração de código**
   → Se `src/tokens/primitives.css` não existe → rodar Phase 2 (token extraction) primeiro
   → Se já existe → ir direto para Phase 1

2. **Assets devem ser baixados (Phase 1b) antes de escrever qualquer .tsx**
   → O generator nunca deve gerar um import de asset que ainda não foi baixado

3. **`component-registry.json` deve ser lido antes de qualquer Phase 4 (código)**
   → Sempre verificar se subcomponentes já existem antes de reinventá-los
   → Localização: `extraction/[project]/component-registry.json`

## Two-Agent Workflow (for batch extraction)

When extracting multiple components (e.g. a full design system), split work across two independent agents per component to avoid context overflow and allow retries without re-hitting Figma:

```
@figma-extractor  →  runs Phase 1 + 1b  →  component.spec.json
@figma-generator  →  runs Phases 2–8    →  React component files
```

- **`@figma-extractor`** (`.claude/agents/figma-extractor.md`) — fetches Figma data, maps tokens, saves spec JSON. Source of truth: Phase 1 + 1b of this skill.
- **`@figma-generator`** (`.claude/agents/figma-generator.md`) — reads spec, generates all files. Source of truth: Phases 2–8 of this skill.

The agents are thin orchestrators — all rules (tokens, aria, BEM, naming) live here in the skill. The spec JSON is the contract between both agents. See `references/spec-schema.md` for the full format.

## Workflow

Follow these phases in order:

### Phase 0: Node Classification (page vs component)

**Before Phase 1**, determine if the Figma node is a **page** or a **component**:

1. Call `mcp__figma__get_figma_data(fileKey, nodeId)`.
2. Check the result:

**It's a PAGE if ANY of these are true:**
- The result exceeds the MCP token limit and is saved to a file (payload > ~100K chars)
- The root node `type` is `CANVAS` and its direct children are **not** a single `COMPONENT_SET` — instead they are multiple distinct sections (sidebar instances, header frames, content frames, table instances)
- The metadata `componentSets` section lists **0 component sets** owned by this node (the node uses components but doesn't define them)
- The node name suggests a page/screen (e.g., "Fornecedores - perfil sacado", "Dashboard", etc.)

**It's a COMPONENT if:**
- The root node contains `COMPONENT_SET` or `COMPONENT` children defining variants
- The payload is manageable (< 100K chars)
- The metadata shows component sets owned by this node

**If it's a PAGE** → delegate to the `@page-extractor` agent (`.claude/agents/page-extractor.md`). Do NOT proceed with Phase 1-8. Pass the fileKey, nodeId, project name, and a PascalCase page name derived from the node name.

**If processing a manifest file** (multiple URLs), classify each URL before launching sub-agents. Use `@page-extractor` for pages and the standard component extraction prompt for components.

**If it's a COMPONENT** → proceed with Phase 1 below.

### Phase 1: Extract Figma Design Context

Use Figma MCP tools to gather component information:

```
Figma:get_design_context(fileKey, nodeId)   # Component structure and tokens
Figma:get_variable_defs(fileKey, nodeId)     # Variable definitions for token mapping
Figma:get_screenshot(fileKey, nodeId)        # Visual reference
```

**What to extract:**
- Component structure and hierarchy
- Applied variables/tokens (colors, spacing, typography)
- Variant properties (size, state, hierarchy)
- Interactive states (hover, pressed, disabled, focus)
- Text styles and their token mappings
- Layout constraints and spacing values
- Icons and image fills

**Multi-brand detection — do this during Phase 1:**

After fetching the page data, check if the target CANVAS node has **2 or more top-level FRAME children** with the same name or similar structure. If yes:

1. Collect all `fills:` and `strokes:` tokens used in each frame separately.
2. Diff the two sets:
   - Tokens **only in frame A** → Brand A palette
   - Tokens **only in frame B** → Brand B palette
   - Tokens **in both** → shared/neutral palette
3. Resolve the actual color values for each set from the flat token definitions at the end of the MCP payload.
4. Record the brand names from any annotation nodes (`type: TEXT`, name like "Brand X") or derive them from the frame names.
5. **If 2+ brands are detected, Phase 2 MUST generate brand token files and a BrandSwitcher component.** Do not skip this — it is not optional.

### Phase 1b: Asset Identification & Download

Scan all nodes returned by the Figma MCP for `type: IMAGE-SVG` and image fills.
Collect instance nodeIds (the semicolon-separated path IDs). Download via `mcp__figma__download_figma_images` in a **single batch call** BEFORE writing any component code.

**MANDATORY SVG sanitization after download:**
After every batch download, run this cleanup on EACH SVG in `[outputDir]/public/icons/`:

1. **Remove background white rects** — Delete any `<rect fill="white"/>` that is NOT inside `<clipPath>` or `<defs>`. These rects make mask-image render as a solid square.
2. **Replace hardcoded fills with currentColor** — For icons with `colorStrategy: "currentColor"`, replace ALL `fill="#XXXXXX"` and `stroke="#XXXXXX"` on `<path>`, `<circle>`, `<rect>`, `<polygon>` elements with `fill="currentColor"` / `stroke="currentColor"`. Leave `fill="none"` untouched. Leave fills inside `<clipPath>/<defs>` untouched.
3. **Keep fixed-color icons as-is** — For icons with `colorStrategy: "fixed"` (logos, brand marks), do NOT replace fills.
4. **Verify no white fills remain** — Scan for `fill="#FCFCFC"`, `fill="#FFFFFF"`, `fill="white"` on paths. These are invisible when used as mask-image. Replace with `fill="currentColor"`.

This step is critical — without it, mask-image icons render as solid squares or are invisible.

Output:
- Downloaded + sanitized files in `[outputDir]/public/icons/`
- `Icons.tsx` barrel with typed `<img>`-based wrappers

See `references/asset-download-guide.md` for the full step-by-step workflow.

### Phase 1c: Scaffold Font Loading

After token extraction identifies the font family (e.g., `--font-family-base: 'Montserrat'`), the scaffold MUST load the font. This step is **mandatory** — without it, all typography falls back to the browser's default sans-serif.

1. **Add Google Fonts `<link>` to `index.html`** — Include the font with all weights used in the design system. For variable fonts (e.g., Montserrat with weight 450), use the variable font URL:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
   ```
2. **If the design uses secondary fonts** (e.g., `Public Sans` in the sidebar footer), add those too.
3. **Remove Vite scaffold CSS** — Delete or empty `src/index.css` (or `src/App.css`) that contains default Vite template styles. These override design system tokens.

### Phase 2: Map Design Tokens

**If the project has existing tokens:** Cross-reference Figma variables to the project's token system using `references/token-mapping-guide.md`.

**If the project has NO token files:** Extract tokens directly from Figma and generate token files. See `references/token-mapping-guide.md` § "Extracting Tokens from Figma" for the full workflow:
1. Use `get_variable_defs` to pull all variable collections from the Figma file
2. **Check for Variable Modes** (multi-brand/white-label): If the Figma file has a variable collection with multiple Modes (e.g. "Liber", "Partner X"), follow `references/brand-tokens-guide.md` to generate one `tokens/brands/[mode-name].css` file per Mode
3. Use the format specified in `.claude/CLAUDE.md`. If not specified, ask the user.
4. Generate organized token files with the 3-layer hierarchy: `primitives.css` (brand values) → `semantic.css` (purpose mappings) → `brands/[brand].css` (per-brand overrides)
5. Create `tokens/index.css` that imports all partials in order
6. Proceed with mapping component values to the newly generated tokens

**If 2+ brands were detected in Phase 1**, additionally:

7. Generate `tokens/brands/[brand-a].css` and `tokens/brands/[brand-b].css` with brand-specific token overrides.
   - Use **`:root[data-brand="name"]`** as the selector (NOT `[data-brand="name"]`). This gives specificity `(0,2,0)` which beats the base `:root` block at `(0,1,0)`. Using the lower-specificity selector causes the brand overrides to be silently ignored.
   - Import brand files at the top of `tokens/index.css` via `@import './brands/[name].css'` (required by CSS spec — `@import` must precede all rules).
   - Define a `--brand-primary`, `--brand-primary-hover`, `--brand-primary-active` alias in each brand file so components never hardcode per-brand hex values.

8. Update all component stylesheets to use `--brand-primary` (and its hover/active variants) instead of any hardcoded color that differs between brands.

9. Generate a `BrandSwitcher` component that:
   - Renders as a fixed overlay (top-right corner) in the showcase/dev app.
   - Uses `useButton` from React Aria for each brand option.
   - On press, sets `document.documentElement.setAttribute('data-brand', brandId)` — this is what triggers the CSS override cascade.
   - Applies the initial brand via `useEffect` on mount.
   - Shows a colored dot and label for each brand, with an active state.

10. Wire `BrandSwitcher` into `main.tsx` (or the app entry point), not into a page component — it must wrap the whole app.

**Token categories to map (or generate):**
- Colors (backgrounds, text, borders, icons)
- Spacing (padding, margins, gaps)
- Typography (font family, size, weight, line height)
- Border radius
- Elevation/shadows
- Component sizes (heights, widths, icon sizes)

**Important:** Use the project's token variable names, never raw values (see `rules/tokens-never-hardcode.md`).

### Phase 3: Generate Props Documentation

Create props documentation following `references/props-template.md`.

**Required sections:**
- Overview (max 200 characters)
- Component Properties (Props table + React Aria Properties table)
- Size Variants (using typography token names)
- Hierarchy Variants
- State Variants (default, hover, pressed, disabled, focus)
- Icons (token references for icon sizes)
- Typography (token names from Figma descriptions)
- Accessibility (Focus State, Keyboard Navigation, Disabled State, Color Contrast)
- Usage Guidelines

**Prop naming:** Follow conventions in `references/figma-property-conventions.md`.

### Phase 4: Generate React Component Code

Create the component following `references/component-patterns.md`.

**Requirements:**
- React Aria hooks for accessibility (see `rules/aria-use-react-aria-hooks.md`)
- TypeScript with explicit prop interfaces
- BEM naming convention for CSS classes (see `rules/naming-bem-methodology.md`)
- Proper disabled state handling
- Focus management with `:focus-visible` (see `rules/aria-focus-visible-only.md`)
- Build props from actual Figma MCP extraction, not assumptions

**Showcase export — add to bottom of every .tsx:**
```ts
export const showcase = {
  name: 'ComponentName',
  render: () => (/* all main variants side by side */),
};
```

**Icon reference rules — MANDATORY:**
- **NEVER import SVGs from `public/`** — Use string constants: `const iconName = '/icons/filename.svg';`. Vite converts `import x from '/icons/...'` to data URIs which break mask-image.
- **ONE icon helper pattern per project** — Create a shared `MaskIcon` component in `src/components/shared/MaskIcon.tsx` during the first component generation, then reuse it everywhere. Do NOT create per-component icon helpers:
  ```tsx
  // src/components/shared/MaskIcon.tsx
  export function MaskIcon({ src, size = 24, className }: { src: string; size?: number; className?: string }) {
    return (
      <span
        className={className}
        aria-hidden="true"
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          display: 'inline-block',
          width: size,
          height: size,
          backgroundColor: 'currentColor',
        }}
      />
    );
  }
  ```
- **Fixed-color icons use `<img>`** — Only icons with `colorStrategy: "fixed"` use `<img src={iconPath} />`. All `currentColor` icons MUST use the `MaskIcon` component.
- **Do NOT use `import React from 'react'`** — With `jsx: "react-jsx"` in tsconfig, React auto-import is handled by the compiler. Only import specific named exports: `import { useState, useRef } from 'react'`. Use `import type { ... }` for type-only imports when `verbatimModuleSyntax` is enabled.

### Phase 5: Generate Styles

Create the stylesheet using the project's token system.

**Structure:**
- Import tokens from the discovered project path
- Base styles using token references
- State modifiers (`:hover`, `:active`, `:disabled`, `:focus-visible`)
- Size variant modifiers
- Hierarchy/variant modifiers
- Use semantic token names (see `rules/tokens-use-semantic-names.md`)

### Phase 6: Create Storybook Story

**Skip this phase if Storybook is not configured in the project.**

Generate Storybook documentation showing all variants:
- Default story with primary args
- Size variants side by side
- Hierarchy/visual variants
- State demonstrations (default, disabled)
- Include React Aria prop controls (`aria-label`, `aria-labelledby`, `aria-describedby`)

### Phase 7: Testing & Validation

After implementation, validate:
- Visual comparison with Figma design (within 2px tolerance)
- All variants render correctly
- Interactive states (hover, focus, pressed, disabled) work as expected
- Keyboard navigation functions properly
- No hardcoded values remain — all visual properties use tokens

### Phase 8: Cleanup & Registration

#### 8a: Register in showcase

Update `apps/[project]/src/pages/ComponentsPage.tsx`:
- Add import for the component's `showcase` named export
- Add entry to the registry array
- Keep all existing entries intact

#### 8b: Cleanup junk files

The Figma MCP sometimes generates temporary files during extraction. Distinguish between artifacts to remove and intentional assets to keep:

**Remove** (temporary MCP artifacts):
- SVG or image files written **outside** of `[outputDir]/public/icons/` (e.g., in the project root or a temp directory)
- Any orphaned files not referenced by any component

**Keep** (intentional Phase 1b assets):
- Everything under `[outputDir]/public/icons/` — these were downloaded deliberately
- `Icons.tsx` barrel file and its directory
- Any asset referenced by a generated component

### Phase 9: Page Extraction (full-page layouts)

**Use when** the Figma node is a CANVAS or top-level FRAME representing a full page (e.g., "Fornecedores - perfil sacado"), NOT an individual component.

**How to detect**: The node is a page if its Figma data exceeds ~100K chars, or if its children are composed instances of multiple DS components (sidebar + header + content + table + pagination).

**Pages are NOT components** — they are compositions of existing components with specific data. The pipeline is fundamentally different:

1. **Do NOT re-implement sub-components** — import and use existing ones
2. **Extract real data from Figma** — every text, column, row, button label comes from the Figma data
3. **Never invent content** — if it's not in the Figma, it's not in the page

**Delegate to `@page-extractor` agent** (`.claude/agents/page-extractor.md`) which implements the full methodology from `references/page-extraction-guide.md`:

- Chunked reading of large Figma payloads via python3
- Component instance → React component mapping via `componentId`
- Per-section data extraction (sidebar state, breadcrumbs, headers, tables, pagination)
- Page spec generation → mechanical TSX code generation
- Route registration in `main.tsx`

**Output**: `apps/[project]/src/pages/[PageName].tsx` + route in `main.tsx`

## Output Structure

Deliver all artifacts in this order:

1. **Props Documentation** (`[ComponentName]-props.md`)
   - All tokens referenced by variable name
   - Complete accessibility documentation

2. **React Component** (`[ComponentName].tsx`)
   - TypeScript with full type safety
   - React Aria integration
   - No inline SVG code — use the assets downloaded in Phase 1b. If the project has a confirmed icon library AND the icon exists in it, use the library's conventions. Otherwise, import from the `Icons.tsx` barrel generated in Phase 1b. Use CSS `filter` for color variation on states (e.g., selected), never hardcoded stroke. See `rules/assets-download-from-figma.md`.

3. **Styles** (`[ComponentName].[scss|module.scss|css]`)
   - Token-based styling
   - BEM methodology
   - All state variants

4. **Storybook Story** (`[ComponentName].stories.tsx`)
   - Interactive examples with React Aria props
   - All variants demonstrated

5. **Brand tokens** (only when 2+ brands detected in Phase 1)
   - `tokens/brands/[brand-a].css` and `tokens/brands/[brand-b].css`
   - `BrandSwitcher/BrandSwitcher.tsx` + `BrandSwitcher.scss`
   - Updated `main.tsx` wiring `BrandSwitcher` at app root level

## Rules

See [rules index](rules/_sections.md) for token, accessibility, and naming rules.

## Examples

### Positive Trigger

User: "Convert this Figma button component to React with all its variants and states."

Expected behavior: Use `figma-to-react-components` guidance — extract Figma context via MCP, map tokens, generate typed React component with React Aria, create styles using project tokens, and produce Storybook story.

### Non-Trigger

User: "Write unit tests for this payment service."

Expected behavior: Do not prioritize `figma-to-react-components`; choose a more relevant skill or proceed without it.

## Troubleshooting

### Ícone invisível em variantes claras

- **Causa:** SVG exportado com fill hardcoded da cor do variant default (ex: `#FCFCFC` branco).
- **Detecção:** comparar fill do ícone em variant escuro vs claro — se diferirem, é currentColor.
- **Solução:** marcar `colorStrategy: "currentColor"` no spec, usar `mask-image` no código.

### Header/seção duplicada na página gerada

- **Causa:** extrator listou o mesmo bloco (título + ações) como filho de dois containers distintos.
- **Detecção:** para containers com `space-between`, verificar se algum filho aparece em ambos os lados.
- **Solução:** usar `alignment: "left"`/`"right"` em cada filho de container `space-between`.

### Componente existente recriado como markup inline

- **Causa:** gerador não consultou `component-registry.json` antes de criar markup.
- **Detecção:** spec tem nodeId em `subComponents` → registry tem esse nodeId → gerador ignorou.
- **Solução:** obrigar consulta ao registry como primeiro passo da Phase 4.

### Gerador inventou estilos não presentes no Figma

- **Causa:** spec tinha gap e gerador preencheu com algo "plausível".
- **Detecção:** elemento gerado não tem referência no spec.
- **Solução:** spec-locked — gap no spec vira TODO no código, nunca invenção.

### Figma Tokens Not Found

- Error: Figma variables do not map to any project tokens.
- Cause: Token variable names in Figma differ from project token names, token files are in an unexpected location, or the project has no token files yet.
- Solution: First search the codebase for token files. If found, map Figma variable names to project token names using `references/token-mapping-guide.md`. If no token files exist, extract tokens from Figma using `get_variable_defs` and generate token files — see `references/token-mapping-guide.md` § "Extracting Tokens from Figma".

### React Aria Hook Selection Unclear

- Error: Unsure which React Aria hook to use for a given component.
- Cause: Component type does not match a standard pattern (Button, TextField, Select, etc.).
- Solution: Check the React Aria hooks table in `rules/aria-use-react-aria-hooks.md`. For complex components, compose multiple hooks or use `useFocusRing` as a baseline.

### Generated Styles Use Raw Values

- Error: Component styles contain hardcoded pixel values or hex colors instead of tokens.
- Cause: Token mapping was skipped or incomplete during Phase 2.
- Solution: Re-run token mapping against the project's token system. Replace every raw value with its token reference. If no token exists, flag it as a gap with a `/* TODO */` comment.

### Brand Switcher Does Not Apply Colors

- Error: Clicking brand options has no visible effect on the UI.
- Cause: Brand CSS files use `[data-brand="name"]` selector instead of `:root[data-brand="name"]`. Both selectors match the `<html>` element, but `[data-brand]` has specificity `(0,1,0)` — the same as `:root`. Since brand `@import`s must appear before the `:root {}` block (CSS spec), the `:root` block always wins the cascade.
- Solution: **Always use `:root[data-brand="name"]`** in brand token files. This raises specificity to `(0,2,0)`, which beats the base `:root` regardless of source order.

### Component Props Do Not Match Figma

- Error: Generated React props do not align with Figma component properties.
- Cause: Props were assumed instead of extracted from Figma MCP.
- Solution: Re-extract using `get_design_context` and rebuild props from actual Figma component definitions. Follow naming conventions in `references/figma-property-conventions.md`.

## Workflow

1. Identify whether the request matches a Figma-to-React conversion task.
2. Follow the 8-phase workflow: extract design context, map tokens, generate props docs, build component, create styles, write story, validate, clean up.
3. Verify all output uses project tokens (no hardcoded values) and includes React Aria accessibility.
