# Asset Download Guide

Step-by-step workflow for identifying, downloading, and integrating Figma assets (icons, logos, illustrations) into generated React components.

---

## Step 1 — Identify Asset Nodes

During Phase 1 (Extract Figma Design Context), scan **every node** returned by the Figma MCP and collect:

| What to look for | How to identify |
|---|---|
| Icon SVGs | `type: "IMAGE-SVG"` or vector nodes used as icons |
| Logos / brand marks | Top-level frame or component named with "logo", "brand", or similar |
| Image fills | Nodes where `fills[].type === "IMAGE"` |

For each asset, record:

```
node.name        → human-readable name (e.g., "bx-receipt")
instance nodeId  → full path ID with semicolons (e.g., "I482:6198;248:5310;101:214;96:71")
componentId      → master component ID (for reference only — do NOT use for download)
category         → icon | logo | illustration
```

> **Critical:** You need the **instance nodeId**, not the `componentId`. The instance nodeId looks like a semicolon-separated path (e.g., `I482:6198;248:5310`). The componentId is a simple number. Exporting via componentId yields the master component, which may have different dimensions or be blank. Always use the instance nodeId.

---

## Step 2 — Derive Filenames

Convert node names to kebab-case with a category prefix:

| Category | Prefix | Example node name | Filename |
|---|---|---|---|
| icon | `icon-` | `bx-receipt` | `icon-bx-receipt.svg` |
| icon | `icon-` | `arrow right` | `icon-arrow-right.svg` |
| logo | `logo-` | `logo liber` | `logo-liber.svg` |
| illustration | `illustration-` | `empty state` | `illustration-empty-state.svg` |

Rules:
- Lowercase only
- Spaces → hyphens
- Remove special characters except hyphens
- Strip category words already in the prefix (e.g., don't produce `logo-logo-liber.svg`)

---

## Step 3 — Download in a Single Batch

Make **one** call to `mcp__figma__download_figma_images` with all collected assets:

```
mcp__figma__download_figma_images({
  fileKey: "[figma-file-key]",
  nodes: [
    { nodeId: "I482:6198;248:5310;101:214;96:71", fileName: "icon-bx-receipt.svg" },
    { nodeId: "I482:6198;248:5311;101:215;96:72", fileName: "icon-arrow-right.svg" },
    { nodeId: "I123:4567",                         fileName: "logo-liber.svg" }
  ],
  localPath: "[outputDir]/public/icons/"
})
```

- `localPath` is always `[outputDir]/public/icons/` — never the project root or a temp dir.
- One batch call is preferred over multiple individual calls.
- Wait for all downloads to complete before proceeding to Phase 2.

---

## Step 4 — Create the Icons Barrel (`Icons.tsx`)

Create a single barrel file that exports typed wrapper components for every downloaded asset:

```tsx
// [outputDir]/src/components/Icons/Icons.tsx

// Naming: PascalCase from filename
// icon-bx-receipt.svg    → IconBxReceipt
// icon-arrow-right.svg   → IconArrowRight
// logo-liber.svg         → LogoLiber

export const IconBxReceipt = ({
  className,
  alt = '',
}: {
  className?: string;
  alt?: string;
}) => (
  <img
    src="/icons/icon-bx-receipt.svg"
    className={className}
    alt={alt}
    aria-hidden={!alt}
  />
);

export const IconArrowRight = ({
  className,
  alt = '',
}: {
  className?: string;
  alt?: string;
}) => (
  <img
    src="/icons/icon-arrow-right.svg"
    className={className}
    alt={alt}
    aria-hidden={!alt}
  />
);

export const LogoLiber = ({
  className,
  alt = 'Liber',
}: {
  className?: string;
  alt?: string;
}) => (
  <img
    src="/icons/logo-liber.svg"
    className={className}
    alt={alt}
    aria-hidden={!alt}
  />
);
```

**Accessibility rules for `alt` and `aria-hidden`:**

| Icon usage | `alt` value | `aria-hidden` |
|---|---|---|
| Decorative (label nearby) | `""` (default) | `true` |
| Standalone (no label) | Descriptive text | `false` |
| Logo | Brand name (e.g., `"Liber"`) | `false` |

---

## Step 5 — Import in Components

```tsx
import { IconBxReceipt, IconArrowRight } from '../Icons/Icons';

// Decorative icon (label is the adjacent text)
<IconBxReceipt className="sidebar__icon" />

// Standalone icon (no adjacent label)
<IconArrowRight className="button__icon" alt="Go to next page" />
```

---

## Using CSS Filter for Color Variation

When an icon needs to change color based on state (e.g., selected, active), use CSS `filter` — never hardcode fill or stroke on the SVG file.

```scss
// Default state — icon uses its original colors
.sidebar__item img {
  // no filter needed
}

// Selected state — force white
.sidebar__item--selected img {
  filter: brightness(0) invert(1);
}

// Disabled state — reduce opacity
.sidebar__item--disabled img {
  opacity: 0.4;
}
```

Common filter recipes:

| Desired color | CSS filter |
|---|---|
| White | `brightness(0) invert(1)` |
| Black | `brightness(0)` |
| Reduced opacity | `opacity(0.4)` |
| Brand color (approx) | Use `sepia() saturate() hue-rotate()` chain |

> For precise brand-color filters, use a CSS filter generator tool with the target hex color. Inline SVG is NOT required — `<img>` + filter covers the vast majority of use cases.

---

## Troubleshooting

**Download returns an error for a nodeId:**
→ Move up one level in the Figma node hierarchy and try the parent nodeId. The target node may be inside a group that must be exported as a unit.

**Downloaded SVG is blank or has no visible content:**
→ You used the `componentId` instead of the instance `nodeId`. Find the actual instance in the Figma tree (it will have a semicolon-separated ID) and retry.

**SVG has hardcoded fill colors that break CSS filter:**
→ The SVG was exported with explicit fill attributes (e.g., `fill="#000000"`). Either clean the SVG by removing explicit fills, or use a more targeted filter chain.

**Multiple icons share the same visual but different instance nodeIds:**
→ Download once, reuse the same filename and wrapper component. Map all instance nodeIds to the same filename in the batch.

---

## Checklist

Before proceeding to Phase 2 (Map Design Tokens):

- [ ] All `IMAGE-SVG` nodes identified during Phase 1 extraction
- [ ] All image-fill nodes identified
- [ ] Instance nodeIds collected (not componentIds)
- [ ] Filenames derived with correct category prefix and kebab-case
- [ ] Single batch download completed to `[outputDir]/public/icons/`
- [ ] `Icons.tsx` barrel created with typed wrappers
- [ ] `alt`/`aria-hidden` correct for each usage context
- [ ] CSS filter used for color variation (no hardcoded stroke/fill)
- [ ] Assets in `public/icons/` excluded from Phase 8 cleanup
