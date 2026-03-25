---
name: figma-to-react-components
description: Convert Figma designs into production-ready React implementations with design
  token integration, accessibility via React Aria, and comprehensive documentation.
  Supports single components, lists of components, full-page screens, and multi-wave
  showcase apps. Use when building React components or screens from Figma designs,
  generating component implementation specs, or bridging design-to-development workflows.
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
  - showcase
  status: ready
  version: 3
---

# Figma to React Component Converter

Convert Figma designs into production-ready React + TypeScript + Vite apps with full design token integration, accessibility via React Aria, and comprehensive documentation.

Supports three input modes:
- **Single node** — one component URL/ID
- **List of nodes** — multiple component URLs/IDs (wave-based generation)
- **Full-page screen** — a Figma page/frame that composes multiple components into a real screen

## Prerequisites

- **Figma MCP** — Figma MCP server configured and running
- **React Aria** — `react-aria` and `react-stately` installed
- **Design tokens** (optional) — If the project already has a token system (SCSS, CSS vars, Tailwind, JS/TS), map to it. If not, tokens are extracted from Figma and generated as part of the workflow.
- **Storybook** (optional) — For component documentation and visual testing

---

## Phase 0: Input Parsing & Cache Check

**Before doing anything else**, parse the user's input and check the local cache.

### 0a — Parse input sources

The skill accepts three equivalent input forms:

**Form 1 — Inline URL(s)**
```
/figma-to-react-components
https://www.figma.com/design/FILE/...?node-id=86-322
App: apps/my-ds/
```

**Form 2 — File path containing URLs**
```
/figma-to-react-components
File: docs/urls_to_extract.md
App: apps/my-ds/
```
When a file path is provided, read the file and extract all Figma URLs from it. Each line of the form `label: https://www.figma.com/...?node-id=X-Y` becomes one entry: `{ name: label, nodeId: 'X-Y', fileKey: '...' }`. Lines without a Figma URL are ignored.

**Form 3 — Node ID list (manual)**
```
/figma-to-react-components
App: apps/my-ds/
- Button  node-id: 86-322
- Badge   node-id: 185-114
```

**Output directory (`App:`):**
- If provided, use as-is (e.g. `apps/my-ds/`)
- If omitted, derive from the Figma file name in the URL (the slug between `/design/<fileKey>/` and `?`), converted to kebab-case (e.g. `Blue Hare DS` → `apps/blue-hare-ds/`)
- If the file name cannot be determined (e.g. input is a bare node-id with no URL), ask the user before proceeding: *"What should the output app be named? (will be created under apps/)"*
- Never hardcode a default app name

**Extract from each URL:**
- `fileKey` — the path segment between `/design/` and `/`
- `nodeId` — the `node-id` query parameter, normalized to `NNNN-NNNN` format
- `name` — the label preceding the URL in the file, or the `node-id` value if no label

### 0b — Classify each input node

For each resolved node, determine its type:

| Type | How to detect | Output destination |
|---|---|---|
| **Component node** | Points to a COMPONENT_SET or isolated component | `src/components/[Name]/` + section in `ShowcasePage.tsx` |
| **Screen node** | Points to a full FRAME/CANVAS with multiple composed components | `src/screens/[Name]/` + entry in `ScreensPage.tsx` |

If unsure, fetch the node and check: `type: COMPONENT_SET` or `type: COMPONENT` → component. `type: FRAME` with many children and no `componentPropertyDefinitions` → screen.

> **SCREEN GUARANTEE:** Every screen node MUST produce a complete, fidelity-matched implementation that visually matches Figma. Before writing any code, extract from the Figma data: exact layout (row/column, padding, gap), exact colors, sidebar structure (icon-only vs with labels), elevation/shadows, and border-radius. Do NOT reuse assumptions from other screens or components — always read the Figma data first.

### 0b — Detect app mode (new vs extend)

Check if the output directory already exists:

- **New app** — directory does not exist → run full setup (Vite scaffold, tokens, BrandSwitcher, ShowcasePage, ScreensPage)
- **Extend app** — directory exists → add new components/screens only; extend `tokens.css` with new tokens; add sections to existing `ShowcasePage.tsx` or `ScreensPage.tsx`; never overwrite existing components

### 0c — Cache check (cache-first strategy)

Check for `.figma-cache/` in the output directory:

```
[outputDir]/.figma-cache/
  [component-name].json    ← raw Figma API response for each node
  variables.json           ← Figma variable definitions (if available)
  progress.json            ← fetch progress tracker
```

**Decision tree:**
1. Cache file exists for this node → **use it directly, skip MCP call**
2. Cache file missing → run the fetch script (see § "Fetch Script") to populate it, then proceed
3. Cache is stale (user requests refresh) → re-run fetch script with `--reset`

> **Why cache-first?** The Figma API has strict rate limits. Fetching 8+ nodes in parallel triggers 429 errors that can last 15–30 minutes. The cache decouples data fetching from code generation entirely.

### 0d — Rate limit rule (CRITICAL)

**NEVER fetch more than 2 Figma nodes in parallel via MCP.** Always use the fetch script for batches of 3 or more nodes. Violating this causes extended rate limit blocks that halt the entire session.

---

## Fetch Script

When cache is missing for one or more nodes, generate (or use the existing) fetch script at `[outputDir]/scripts/fetch-figma-cache.mjs`.

The script must:
- Accept `FIGMA_TOKEN` as an environment variable
- Fetch nodes **sequentially** with a 4-second delay between requests
- On 429: wait 60 seconds and retry (max 3 retries per node)
- Save each node's raw JSON to `.figma-cache/[name].json`
- Track progress in `.figma-cache/progress.json` so it can resume after interruption
- Accept `--reset` flag to restart from scratch

```bash
# Run (from output app directory):
FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs

# Resume after interruption:
FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs

# Start over:
FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs --reset
```

The script is generated from `references/fetch-figma-cache.mjs`. When writing the script to `[outputDir]/scripts/fetch-figma-cache.mjs`, **replace the placeholder values**:
- `'FIGMA_FILE_KEY'` → the actual file key extracted from the input URL
- `COMPONENTS` array → the actual list of `{ name, nodeId }` entries for this project

Never copy the template verbatim — always write the script with real values filled in.

---

## Non-Negotiable Deliverables

Before finishing any wave, verify all three guarantees are met:

| # | Guarantee | How to verify |
|---|---|---|
| 1 | **Screen fidelity** — every screen node has a complete, Figma-accurate implementation | Read the Figma data first; do not assume layout |
| 2 | **BrandSwitcher** — if ≥2 brand frames detected, tokens + BrandSwitcher + main.tsx wiring exist | Check `src/components/BrandSwitcher/` and `main.tsx` |
| 3 | **Icon completeness** — every `/icons/` path in TSX files exists in `public/icons/` | Run the cross-check grep (Phase 8) before declaring done |

If any guarantee is unmet, do not stop — fix it first.

---

## Workflow

Follow these phases in order. Phase 0 always runs first.

### Phase 1: Extract Figma Design Context

Read from cache (preferred) or MCP (fallback for single nodes):

**From cache (JSON files):**
Read `.figma-cache/[name].json`. The structure is:
```json
{ "nodes": { "ID:ID": { "document": { ... } } } }
```

Extract from the `document`:
- `componentPropertyDefinitions` → variant names and options
- `children[].name` → variant states (e.g., `state=Default`, `size=sm`)
- `boundVariables` → token variable IDs (use for naming; actual values are in fills/style)
- `fills[].color` → actual RGBA color values
- `style.fontSize`, `style.fontWeight`, `style.lineHeight` → typography
- `absoluteBoundingBox` → dimensions
- `cornerRadius` / `rectangleCornerRadii` → border radius
- Nodes with `type: "VECTOR"` or `fills[].imageRef` → icons/assets

**From MCP (single node, no cache):**
```
mcp__figma__get_figma_data(fileKey, nodeId)
```
Use only when cache is absent and the input is a single node. Never call in parallel for multiple nodes.

**Multi-brand detection — do this during Phase 1:**

After fetching, check if the target CANVAS/FRAME has **2 or more top-level FRAME children** with the same name or similar structure. If yes:

1. Collect all `fills` and `strokes` tokens used in each frame separately.
2. Diff the two sets: tokens only in frame A → Brand A palette; only in B → Brand B; in both → shared.
3. Resolve actual color values from the node data.
4. Record brand names from annotation nodes or frame names (look for sibling GROUP nodes with labels like "Brand X").
5. **If 2+ brands detected, Phase 2 MUST generate brand token files and a BrandSwitcher.** Not optional.

> **BRAND GUARANTEE (MANDATORY):** If multi-brand is detected, the wave is NOT COMPLETE until:
> - `tokens.css` has a `:root[data-brand="X"]` override block for every non-default brand
> - `BrandSwitcher` component exists at `src/components/BrandSwitcher/BrandSwitcher.tsx`
> - `main.tsx` renders `<BrandSwitcher />` above `<App />`
>
> **How to detect multi-brand in screen nodes:** Look at the parent CANVAS of the screen node. Count top-level FRAME children that have the same or similar structure. If ≥ 2 such frames exist, compare their primary-color fills — if they differ, multi-brand is confirmed. Annotation GROUPs with text like "Brand liber" / "Brand teste" are a strong signal even if fills are not immediately obvious.

### Phase 1b: Asset Identification & Download

Scan nodes for `type: IMAGE-SVG` and image fills. Collect instance nodeIds. Download via `mcp__figma__download_figma_images` in a **single batch call** BEFORE writing any component code.

Output:
- Downloaded files in `[outputDir]/public/icons/`
- `Icons.tsx` barrel with typed `<img>`-based wrappers

See `references/asset-download-guide.md` for the full workflow.

### Phase 2: Map Design Tokens

**If `tokens.css` already exists (extend mode):**
- Read existing tokens
- Map new component values to existing tokens where possible
- Append only new tokens at the end, grouped by component
- Never remove or rename existing tokens

**If no token files exist (new app):**
1. Extract all unique color, spacing, typography, and radius values from the cached node data
2. Check for multi-brand: if present, follow `references/brand-tokens-guide.md`
3. Generate `src/tokens.css` with 3-layer hierarchy:
   - Layer 1: primitives (raw values)
   - Layer 2: semantic (purpose-named, always reference primitives)
   - Layer 3: brand overrides (`:root[data-brand="name"]` selectors)
4. Create `tokens/index.css` if splitting into partials

**Token categories:**
- Colors (backgrounds, text, borders, icons, status)
- Spacing (padding, margins, gaps)
- Typography (font family, size, weight, line height)
- Border radius
- Elevation/shadows
- Component sizes

**If 2+ brands detected**, additionally:
- Generate brand files using **`:root[data-brand="name"]`** selectors (specificity `0,2,0` beats base `:root` at `0,1,0`)
- Import brand files at the top of `tokens/index.css` (CSS spec: `@import` must precede all rules)
- Define `--brand-primary`, `--brand-primary-hover`, `--brand-primary-active` aliases per brand
- Generate `BrandSwitcher` component (fixed overlay, top-right corner, `useButton` from React Aria)
- Wire `BrandSwitcher` into `main.tsx`, not into a page component

**Important:** Use token variable names, never raw values (see `rules/tokens-never-hardcode.md`).

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

Skip this phase for screen nodes — screens don't have isolated props docs.

**Prop naming:** Follow conventions in `references/figma-property-conventions.md`.

### Phase 4: Generate React Component Code

**For component nodes** → generate in `src/components/[Name]/[Name].tsx`

**For screen nodes** → generate in `src/screens/[Name]/[Name].tsx`
- Screen components compose existing `src/components/` where those components already exist
- If a component used in the screen doesn't exist yet in `src/components/`, generate a local version and mark it with `// TODO: replace with shared component from Wave X`

**Requirements (both types):**
- React Aria hooks for accessibility (see `rules/aria-use-react-aria-hooks.md`)
- TypeScript with explicit prop interfaces
- BEM naming convention for CSS classes (see `rules/naming-bem-methodology.md`)
- Proper disabled state handling
- Focus management with `:focus-visible` (see `rules/aria-focus-visible-only.md`)
- Build props from actual Figma data, not assumptions

### Phase 5: Generate Styles

Create `[Name].css` alongside the component.

**Structure:**
- Base styles using token references
- State modifiers (`:hover`, `:active`, `:disabled`, `:focus-visible`)
- Size variant modifiers
- Hierarchy/variant modifiers
- Use semantic token names (see `rules/tokens-use-semantic-names.md`)

### Phase 6: Update Showcase / Screens Pages

**For component nodes:**
- If `src/pages/ShowcasePage.tsx` does not exist → create it with a section for this component
- If it exists → append a new section for the component; never remove existing sections
- Each section shows all variants side-by-side with descriptive labels

**For screen nodes:**
- If `src/pages/ScreensPage.tsx` does not exist → create it with a link/preview for this screen
- If it exists → append the new screen entry

**ShowcasePage structure:**
```tsx
// Each section follows this pattern:
<section className="showcase__section">
  <h2 className="showcase__section-title">ComponentName</h2>
  <div className="showcase__variants">
    {/* all variants side by side */}
  </div>
</section>
```

### Phase 7: Create Storybook Story (optional)

Generate Storybook documentation when Storybook is present:
- Default story with primary args
- Size variants side by side
- Hierarchy/visual variants
- State demonstrations (default, disabled)
- React Aria prop controls

### Phase 8: Testing & Validation

After generating all files, run:
```bash
cd [outputDir] && npm run build
```

Validate:
- Build passes with zero TypeScript errors
- No hardcoded values remain in CSS (run: `grep -r "#[0-9a-fA-F]\{3,6\}" src/components/` — should return nothing)
- All variants are represented in ShowcasePage or ScreensPage

**Icon completeness cross-check (MANDATORY — run before declaring the wave done):**

```bash
# Find every icon path referenced in generated TSX/TSX files
grep -rh '"/icons/' src/ | grep -oP '"/icons/[^"]+' | sort -u
```

Compare the output against files in `public/icons/`. For every path referenced in code but missing from `public/icons/`:

1. Find the parent component node in Figma that uses this icon (search the cache JSON for nodes with `type: IMAGE-SVG` whose name matches the icon label).
2. Collect the **instance nodeId** (not the component ID — use the semicolon-separated path like `I482:6198;248:5310`).
3. Download via `mcp__figma__download_figma_images` with the correct instance nodeId.
4. Save the file to `public/icons/` with the exact filename referenced in the code.
5. Re-run the cross-check until no missing icons remain.

> **ICON GUARANTEE:** A wave is NOT complete if any icon path referenced in TSX does not exist as a file in `public/icons/`. Missing icons cause silent broken `<img>` tags that are invisible at build time but visible at runtime. Always run the cross-check as the last step before finishing.

### Phase 9: Cleanup Junk Files

**Remove** (temporary MCP artifacts):
- SVG or image files written outside of `[outputDir]/public/icons/`
- Any orphaned files not referenced by any component

**Keep** (intentional assets):
- Everything under `[outputDir]/public/icons/`
- `Icons.tsx` barrel and its directory
- `.figma-cache/` directory — keep for future waves
- `scripts/fetch-figma-cache.mjs` — keep for future waves

---

## Output Structure

```
[outputDir]/
  scripts/
    fetch-figma-cache.mjs    ← fetch script (always present)
  public/
    icons/                   ← downloaded Figma assets
  .figma-cache/              ← raw Figma JSON per node + progress.json
  src/
    main.tsx                 ← BrandSwitcher wired here
    App.tsx                  ← routing: / → ShowcasePage, /screens → ScreensPage
    tokens.css               ← 3-layer token system
    components/
      [ComponentName]/
        [ComponentName].tsx
        [ComponentName].css
      BrandSwitcher/
        BrandSwitcher.tsx
        BrandSwitcher.css
    screens/
      [ScreenName]/
        [ScreenName].tsx
        [ScreenName].css
    pages/
      ShowcasePage.tsx        ← all component variants
      ShowcasePage.css
      ScreensPage.tsx         ← links/previews to real screens
      ScreensPage.css
```

Artifacts delivered per component (in order):
1. **Props Documentation** (`[ComponentName]-props.md`) — skip for screens
2. **React Component** (`[ComponentName].tsx`)
3. **Styles** (`[ComponentName].css`)
4. **Storybook Story** (`[ComponentName].stories.tsx`) — only if Storybook present
5. **Brand tokens** — only when 2+ brands detected

---

## Rules

See [rules index](rules/_sections.md) for token, accessibility, and naming rules.

---

## Examples

### Single URL
```
/figma-to-react-components
https://www.figma.com/design/FILE/...?node-id=86-322
App: apps/my-ds/
```

### File with URLs (recommended for bulk imports)
```
/figma-to-react-components
File: docs/urls_to_extract.md
App: apps/blue-hare-showcase/
```
The file format expected:
```
label: https://www.figma.com/design/FILE/...?node-id=X-Y
another label: https://www.figma.com/design/FILE/...?node-id=A-B
```

### List of components (wave)
```
/figma-to-react-components
App: apps/blue-hare-showcase/

Wave 1:
- Label      node-id: 85-34
- Badge      node-id: 185-114
- Tag        node-id: 176-65
```

### Components + screen together
```
/figma-to-react-components
App: apps/blue-hare-showcase/

Components:
- Button     node-id: 86-322
- Badge      node-id: 185-114

Screen:
- Fornecedores  node-id: 441-4861
```

---

## Troubleshooting

### 429 Rate Limit from Figma API

- **Cause:** Too many MCP calls in parallel or in quick succession.
- **Solution:** Use the fetch script (`scripts/fetch-figma-cache.mjs`) to populate the cache first. The script fetches sequentially with 4-second delays and retries on 429. Once cache is populated, code generation makes zero API calls.
- **Prevention:** Never call `mcp__figma__get_figma_data` for more than 2 nodes in parallel (Phase 0d rule).

### 403 Forbidden from Figma API

- **Cause:** The Figma token doesn't have access to the file, or missing "File content: Read" scope.
- **Solution:** Generate a new token at figma.com → Settings → Security → Personal access tokens. Ensure "File content: Read" is checked. Update the token in MCP config (`~/.claude.json`) and reconnect via `/mcp`.

### Figma Tokens Not Found

- **Cause:** Token variable names in Figma differ from project token names, or no token files exist yet.
- **Solution:** First search for existing token files. If none, extract tokens from the cached JSON node data (use `fills[].color`, `style.fontSize`, etc.) and generate `tokens.css`. See `references/token-mapping-guide.md`.

### Extend Mode Overwrites Existing Component

- **Cause:** Phase 0b detection failed — app directory exists but was treated as new.
- **Solution:** Always check for the app directory before scaffolding. If `src/components/[Name]/` already exists, skip generation for that component and log a warning.

### React Aria Hook Selection Unclear

- **Cause:** Component type doesn't match a standard pattern.
- **Solution:** Check the React Aria hooks table in `rules/aria-use-react-aria-hooks.md`. For complex components, compose multiple hooks or use `useFocusRing` as baseline.

### Generated Styles Use Raw Values

- **Cause:** Token mapping was skipped or incomplete during Phase 2.
- **Solution:** Re-run token mapping. Replace every raw value with its token reference. If no token exists, add it to `tokens.css` and use the new name.

### Brand Switcher Does Not Apply Colors

- **Cause:** Brand CSS files use `[data-brand="name"]` instead of `:root[data-brand="name"]`.
- **Solution:** Always use `:root[data-brand="name"]` (specificity `0,2,0` beats base `:root` at `0,1,0`).

### Screen Uses Component Not Yet in Library

- **Cause:** A screen node references a component that hasn't been generated as a standalone component yet.
- **Solution:** Generate a local implementation inside `src/screens/[Name]/` and add `// TODO: replace with shared component from Wave X` comment. When the wave arrives, replace with the shared version.
