# Brand Tokens Guide — White-Label / Multi-Brand

## Overview

The token system uses a 3-layer hierarchy to enable white-label support without changing any component code:

```
Layer 1: primitives.css   — raw brand values (colors, font)    ← overridden per brand
Layer 2: semantic.css     — purpose-based tokens (map to primitives + universal values)
Layer 3: brands/*.css     — per-brand primitive overrides, scoped with [data-brand="X"]
```

Components **always** reference semantic tokens (`--color-primary`, `--font-family`).
Never reference primitives directly in components.

---

## How Figma Variable Modes map to brands

In Figma, Variable Collections support **Modes** — each Mode is a brand:

```
Variable Collection: "Primitives"
├── Mode: "Liber"      → --primitive-brand-700: #1E4D6D
├── Mode: "Partner X"  → --primitive-brand-700: #4A2F7F
└── Mode: "Partner Y"  → --primitive-brand-700: #2E7D32
```

Each variable has a different value per Mode. When extracting from Figma:
- The **default Mode** (usually the first) → values go into `primitives.css` (`:root`)
- **Each additional Mode** → generates `tokens/brands/[mode-name].css` with `[data-brand="mode-name"]` scoping

---

## Setting up Figma Variable Modes (for designers)

To enable multi-brand extraction, the designer should:

1. Open the Figma file → **Assets panel** → **Local variables**
2. Select (or create) the "Primitives" Collection
3. Click **+ Add mode** → name it after the brand (e.g., "Liber", "Partner X")
4. For each variable, enter the brand-specific value in the new Mode column
5. Repeat for each brand

Once Modes are configured, the skill will detect them and generate the correct brand files automatically.

---

## Code structure (generated output)

```
src/tokens/
├── index.css          ← @import chain (primitives → semantic → brands/*)
├── primitives.css     ← default brand raw values (from Mode 1)
├── semantic.css       ← semantic mappings + universal tokens (typography scale, spacing, etc.)
└── brands/
    ├── liber.css      ← default brand, usually empty (values already in primitives.css)
    ├── partner-x.css  ← [data-brand="partner-x"] { overrides }
    └── partner-y.css  ← [data-brand="partner-y"] { overrides }
```

---

## Extracting from Figma when Modes exist

When `get_variable_defs` returns a collection with multiple Modes:

```
Collection: "Primitives"
  Mode: "liber"    (default)
    brand-primary-900: #122E41
    brand-primary-700: #1E4D6D
    ...
  Mode: "partner-x"
    brand-primary-900: #1E1035
    brand-primary-700: #3D2278
    ...
```

**Generate:**

```css
/* primitives.css — default brand (liber) */
:root {
  --primitive-brand-900: #122E41;
  --primitive-brand-700: #1E4D6D;
}

/* brands/partner-x.css */
[data-brand="partner-x"] {
  --primitive-brand-900: #1E1035;
  --primitive-brand-700: #3D2278;
}
```

---

## Runtime brand switching

The `BrandProvider` applies `data-brand` on `<html>`:

```tsx
// liber is the default — no attribute on <html>
// partner-x → <html data-brand="partner-x">

const { setBrand } = useBrand()
setBrand('partner-x')  // all CSS variables update instantly, no rebuild
```

---

## Naming conventions

| Figma Mode name | `data-brand` value | CSS file |
|---|---|---|
| "Liber" | (default, no attribute) | `brands/liber.css` (empty) |
| "Partner X" | `partner-x` | `brands/partner-x.css` |
| "Crédito Agrícole" | `credito-agricole` | `brands/credito-agricole.css` |

Rules:
- Lowercase, kebab-case
- Match Figma Mode name → kebab-case slug (e.g. "Crédito Agrícole" → `credito-agricole`)
- The first/default Mode → default `:root` in `primitives.css`

---

## Primitive token naming

Use abstract names that don't reference the brand's specific color:

```css
/* ✅ Abstract — works for any brand */
--primitive-brand-900
--primitive-brand-700
--primitive-accent-700

/* ❌ Coupled — breaks for a brand that isn't blue */
--primitive-blue-900
--primitive-green-700
```

---

## Assets per brand

Brand-specific assets (logos, illustrations) are served from:
```
public/icons/
├── logo-liber.svg
└── logo-partner-x.svg  ← add when onboarding Partner X
```

The `LogoBrand` component reads the current brand from `useBrand()` and selects the correct logo:

```tsx
export function LogoBrand({ alt, ...p }: IconProps) {
  const { brand } = useBrand()
  const src = brand === 'liber' ? '/icons/logo-liber.svg' : `/icons/logo-${brand}.svg`
  return <Icon src={src} alt={alt ?? brand} {...p} />
}
```
