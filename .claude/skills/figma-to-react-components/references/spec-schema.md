# Component Spec Schema

Every extracted component produces a `[name].spec.json` in `extraction/specs/`.
This is the contract between the Extractor Agent and the Generator Agent.

## Full Schema

```json
{
  "meta": {
    "name": "Label",
    "componentName": "Label",
    "figmaName": "Label",
    "nodeId": "85-34",
    "fileKey": "4lLdRUTtXDqo1iVOEorZIQ",
    "extractedAt": "2026-03-28T12:00:00Z",
    "phase": 1
  },

  "variants": [
    {
      "property": "Size",
      "values": ["sm", "md", "lg"],
      "default": "md",
      "propName": "size"
    },
    {
      "property": "Hierarchy",
      "values": ["primary", "secondary", "tertiary"],
      "default": "primary",
      "propName": "hierarchy"
    }
  ],

  "tokens": {
    "colors": {
      "text": "--color-text-primary",
      "textSecondary": "--color-text-secondary",
      "background": "--color-surface-default"
    },
    "spacing": {
      "paddingX": "--spacing-3",
      "paddingY": "--spacing-1",
      "gap": "--spacing-2"
    },
    "typography": {
      "fontFamily": "--font-family-base",
      "fontSizeSm": "--font-size-xs",
      "fontSizeMd": "--font-size-sm",
      "fontSizeLg": "--font-size-md",
      "fontWeight": "--font-weight-medium",
      "lineHeight": "--line-height-tight"
    },
    "border": {
      "radius": "--radius-sm",
      "color": "--color-border-default",
      "width": "--border-width-1"
    },
    "elevation": {
      "shadow": "--shadow-none"
    },
    "icon": {
      "sizeSm": "--icon-size-sm",
      "sizeMd": "--icon-size-md"
    }
  },

  "interactions": {
    "states": ["default", "hover", "pressed", "disabled", "focus"],
    "stateTokens": {
      "hover": {
        "background": "--color-surface-hover"
      },
      "pressed": {
        "background": "--color-surface-pressed"
      },
      "disabled": {
        "opacity": "--opacity-disabled",
        "cursor": "not-allowed"
      },
      "focus": {
        "outline": "--focus-ring-default"
      }
    }
  },

  "assets": [
    {
      "type": "icon",
      "figmaNodeId": "85-34;123-456",
      "name": "icon-chevron-right",
      "outputPath": "public/icons/icon-chevron-right.svg",
      "colorStrategy": "currentColor",
      "colorNote": "Cor herdada do texto do variant pai via currentColor. SVG deve ter fills removidos."
    }
  ],

  "aria": {
    "role": "label",
    "reactAriaHook": "useLabel",
    "keyboardNav": ["Tab to focus", "Enter/Space to activate"],
    "labelRequired": false,
    "notes": "Wrap in <label> when associated with a form control"
  },

  "brands": {
    "detected": true,
    "brand1": {
      "name": "brand-1",
      "overrides": {
        "--color-text-primary": "#1A2B3C",
        "--color-surface-default": "#FFFFFF"
      }
    },
    "brand2": {
      "name": "brand-2",
      "overrides": {
        "--color-text-primary": "#2C3E50",
        "--color-surface-default": "#F8F9FA"
      }
    }
  },

  "layout": {
    "display": "flex",
    "direction": "row",
    "alignItems": "center",
    "gap": "--spacing-2",
    "hasLeadingIcon": true,
    "hasTrailingIcon": false,
    "hasLabel": true,
    "topBar": {
      "justifyContent": "space-between",
      "children": [
        { "type": "logo", "alignment": "left" },
        { "type": "breadcrumb", "alignment": "right" }
      ]
    },
    "table": {
      "thead": {
        "columns": [
          {
            "label": "Acionistas",
            "sortable": true,
            "cellContent": {
              "type": "text+icon",
              "iconName": "calendar",
              "iconNodeId": "...",
              "iconPosition": "trailing"
            }
          },
          {
            "label": "Status",
            "sortable": false,
            "cellContent": {
              "type": "component",
              "componentNodeId": "221:5281",
              "note": "Chip component — consultar component-registry.json"
            }
          }
        ]
      }
    }
  },

  "subComponents": {
    "nodeId": {
      "componentRef": "ComponentName",
      "import": "@components/ComponentName/ComponentName",
      "props": {}
    }
  },

  "notes": "Free-text observations from the extractor agent — edge cases, Figma inconsistencies, open questions."
}
```

## Rules for the Extractor Agent

1. **Never use raw values** — every color, spacing, radius must reference a token variable name.
   If the token does not exist yet (tokens phase not done), flag with `"TODO: map to token"`.
2. **assets array must be complete** — list every icon and image fill found in any variant.
   For each asset, set `colorStrategy`:
   - Compare the icon's `fill`/`stroke` value across at least two variants with different backgrounds.
   - If the color **differs** between variants → `"colorStrategy": "currentColor"` (remove fills from SVG).
   - If the color is **always the same** → `"colorStrategy": "fixed"` (keep fills as-is).
3. **brands section** — only include if Figma has multiple variable modes or the component
   has visually distinct brand frames.
4. **notes** — document anything unusual (e.g. "disabled state uses opacity on the wrapper,
   not on individual children").
5. **component-registry.json** — read `extraction/[project]/component-registry.json` before
   finalizing the spec. For each nodeId found in the component tree:
   - If registered → add it to `subComponents` with `"componentRef"` pointing to the component name
     instead of describing its internal structure.
6. **layout alignment** — for every container with `mainAxisAlignItems = SPACE_BETWEEN`:
   - Mark children on the left side with `"alignment": "left"`.
   - Mark children on the right side with `"alignment": "right"`.
   - Never list them as a plain sequence without alignment.
7. **table cells** — for each column, capture:
   - Icon in cell? → register `iconNodeId`, `iconName`, `iconPosition` (leading/trailing).
   - Cell uses a DS component (Chip, Badge, Tag)? → register `componentNodeId` + consult registry.
   - Cell text is a link? → register the color token used.
   - Multiple stacked elements? → describe the stack explicitly.

## Rules for the Generator Agent

1. Read `meta`, `variants`, `tokens`, `interactions`, `aria`, `layout` to build the component.
2. Read `assets` — all must be downloaded before writing component code.
3. Do not re-call Figma MCP — all needed information is in the spec.
4. Output to `apps/[project]/src/components/[ComponentName]/`.
5. **spec-locked** — no element (markup, style, color, icon) may be created without an explicit
   reference in the spec. If the information is missing, add a `{/* TODO: not mapped in spec */}`
   comment — never invent a plausible implementation.
6. **component-registry.json** — read `extraction/[project]/component-registry.json` before
   generating any sub-component markup. For each nodeId in `subComponents`, `cellContent`, or
   `statusComponents`:
   - If found in registry → import and use the registered component.
   - If not found → create own markup AND add a TODO to replace it when the component is generated.
7. **colorStrategy icons** — if an asset has `"colorStrategy": "currentColor"`:
   - Do NOT use `<img src={icon} />` (img does not respond to `color`).
   - Use `mask-image` + `background-color: currentColor` technique (see SKILL.md for snippet).
8. **Phase 8 — update registry** — after generating the component, merge all variant nodeIds
   from `spec.variantDetails` into `extraction/[project]/component-registry.json`.
   Format: `"nodeId": { "component": "Name", "import": "@components/Name/Name", "props": { ...variant props } }`
   Never overwrite existing entries.
