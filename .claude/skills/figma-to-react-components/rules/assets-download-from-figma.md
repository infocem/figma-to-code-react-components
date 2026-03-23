---
title: Always download assets from Figma MCP
impact: CRITICAL
tags:
  - assets
  - figma
  - icons
  - images
---

# Always Download Assets from Figma MCP

All SVGs, logos, and image-fill nodes MUST be downloaded via `mcp__figma__download_figma_images`. Never hand-craft SVG paths or assume an icon library contains the needed asset.

## Incorrect

```tsx
// Hand-crafted SVG approximation
const IconReceipt = () => (
  <svg viewBox="0 0 24 24">
    <path d="M..." />  {/* manually drawn — wrong geometry */}
  </svg>
);

// Assuming an icon library has the asset without verifying
import { Receipt } from 'lucide-react';  // unconfirmed
```

**Why this is wrong:** Hand-crafted SVGs diverge from the brand asset. Assumed icon libraries may not exist or may not contain the correct variant. Both produce incorrect renders that require manual fixes later.

## Correct

```tsx
// Asset downloaded via mcp__figma__download_figma_images in Phase 1b
export const IconBxReceipt = ({ className, alt = '' }: { className?: string; alt?: string }) => (
  <img src="/icons/icon-bx-receipt.svg" className={className} alt={alt} aria-hidden={!alt} />
);
```

**Why this is correct:** The file is the actual exported asset from the Figma node, with correct geometry, viewBox, and brand styling.

## Decision Tree

```
Does the project have a confirmed icon library?
├── YES: Is the specific icon present in that library?
│   ├── YES → Use library per its conventions
│   └── NO  → Download from Figma MCP (Phase 1b)
└── NO → Download from Figma MCP (Phase 1b)

Is the node a logo or brand illustration?
└── ALWAYS download from Figma MCP regardless of icon library
```

## Key Rules

1. **Use instance nodeId, not componentId.** The instance nodeId (e.g., `I482:6198;248:5310;101:214;96:71`) exports the rendered instance with its overrides. The componentId exports the master component, which may have different geometry or be blank.

2. **Download in a single batch** during Phase 1b, before writing any component code.

3. **Use `<img>` + CSS filter for color variation** — never hardcode stroke or fill colors on downloaded SVGs.

   ```scss
   // Correct: CSS filter for state-based color change
   .sidebar__item--selected img {
     filter: brightness(0) invert(1); // any SVG → white
   }

   // Incorrect: hardcoded stroke
   .sidebar__item--selected svg path {
     stroke: #ffffff;
   }
   ```

4. **All assets go to `[outputDir]/public/icons/`** — never place downloaded assets in the project root or a temp directory.

See `references/asset-download-guide.md` for the full step-by-step workflow.
