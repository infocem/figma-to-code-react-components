# Page Extraction Guide

Pages are fundamentally different from components. A component is extracted as new code. A page is a **composition of existing components with specific data from Figma**.

## The problem

Page nodes are massive (500K–1M+ chars). No agent can read the full payload in one pass. Without reading the full data, agents "guess" content and produce unfaithful results.

## Core principle: Extract, don't invent

Every text, every icon, every variant, every column in the generated page MUST come from the Figma data. If it's not in the Figma data, it's not in the page. Zero invention.

## Methodology

### Step 1: Build a Component Map

Before reading any page data, build a mapping of existing components:

```bash
# Scan existing components to build a lookup
grep -rn "export function\|export const showcase" src/components/*/
```

Cross-reference with the `componentSetId` and `componentId` values in the Figma `metadata.components` and `metadata.componentSets` sections. This tells you: "Figma component X = our React component Y".

### Step 2: Extract page structure via chunked reads

The Figma data is a JSON array. Use python/jq to extract it in structured passes:

**Pass 1 — Metadata + top-level structure** (first ~5K chars of the YAML text):
- Page name, top-level children (sidebar, main, etc.)
- Component and componentSet definitions (the lookup table)

**Pass 2 — Region identification** (search for key structural markers):
```python
# Find all top-level FRAME/INSTANCE children and their names
# This gives you: sidebar, topbar, content-header, table-area, pagination, footer, etc.
```

**Pass 3 — Per-region data extraction** (targeted reads for each section):
For each region, extract:
- Which `componentId` / `componentSetId` is used → maps to our React component
- `componentProperties` → maps to React props
- `text:` values → actual content strings
- `fills:` / `textStyle:` → which variant is active
- `type: IMAGE-SVG` nodes → which icons are shown
- Layout details (gap, padding) only if they differ from the DS component defaults

**Pass 4 — Table/list data extraction** (the most detail-heavy part):
Tables are the biggest data source in pages. Extract:
- Column headers (text values from header row cells)
- Each row's cell values (iterate through body rows)
- Cell types: plain text, two-line (name + subtitle), chip/badge (variant + label), icon button, link
- Sort indicators on columns

### Step 3: Generate the Page Spec

Output a structured JSON that captures everything needed to generate the page:

```json
{
  "pageName": "Fornecedores - perfil sacado",
  "layout": {
    "sidebar": { "component": "MenuSacado", "props": { "collapsed": true, "activeItemId": "fornecedores-todos" } },
    "topbar": {
      "breadcrumbs": [
        { "label": "Fornecedores", "href": "#" },
        { "label": "Todos os fornecedores", "isCurrent": true }
      ],
      "showLogo": true
    },
    "contentHeader": {
      "title": "Todos os fornecedores",
      "subtitle": "Visualize todos fornecedores",
      "actions": [
        { "component": "Button", "props": { "variant": "transparent", "children": "Atualizar limites" } },
        { "component": "Button", "props": { "variant": "outline", "children": "Ver grupo de fornecedores" } },
        { "component": "Button", "props": { "variant": "primary", "children": "Adicionar fornecedores", "iconEnd": "/icons/plus.svg" } }
      ]
    }
  },
  "content": {
    "toolbar": {
      "actions": [
        { "label": "Redefinir", "type": "text" },
        { "type": "icon-button", "icon": "/icons/filter.svg" },
        { "type": "icon-button", "icon": "/icons/download.svg" },
        { "type": "icon-button", "icon": "/icons/download-alt.svg" }
      ]
    },
    "table": {
      "columns": [
        { "key": "empresa", "label": "Empresa", "sortable": true, "cellType": "two-line" },
        { "key": "contato", "label": "Contato", "sortable": true },
        { "key": "acionistas", "label": "Acionistas" },
        { "key": "status", "label": "Status", "sortable": true, "cellType": "dropdown-chip" },
        { "key": "categoria", "label": "Categoria" },
        { "key": "regras", "label": "Regras da Plataforma" },
        { "key": "credito", "label": "Crédito" },
        { "key": "opcoes", "label": "Opções", "cellType": "icon-button" }
      ],
      "rows": ["...extracted from Figma row by row..."]
    },
    "pagination": { "totalPages": 3, "currentPage": 1 }
  }
}
```

### Step 4: Generate the page TSX

With the spec in hand, generation is mechanical:
1. Import existing components (MenuSacado, Button, Table, Pagination, etc.)
2. Define mock data arrays from the spec's row data
3. Compose the layout using PageLayout + imported components
4. Pass exact props from the spec — no creative additions

### Key rules

1. **Sidebar state comes from Figma** — check if the sidebar instance is collapsed or expanded by checking its layout width or variant props
2. **No tabs unless Figma has tabs** — don't add UI elements that aren't in the design
3. **Table columns match exactly** — same count, same labels, same order
4. **Cell types match** — if Figma shows two-line cells (name + CNPJ), the code renders two-line cells
5. **Action buttons match** — same labels, same variants, same icons, same order
6. **Data is extracted, not invented** — use the actual text strings from Figma nodes
7. **Missing icons** — if the page uses icons not yet in `public/icons/`, download them in a batch before generating code
