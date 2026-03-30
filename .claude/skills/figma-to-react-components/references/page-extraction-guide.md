# Page Extraction Guide

Pages are fundamentally different from components. A component is extracted as new code. A page is a **composition of existing components with specific data from Figma**.

## The problem

Page nodes are massive (500K–1M+ chars). No agent can read the full payload in one pass. Without reading the full data, agents "guess" content and produce unfaithful results.

## Core principles

1. **Extract, don't invent** — every text, icon, variant, column MUST come from Figma data. Zero invention.
2. **Map instances to existing components** — don't re-implement; import and pass exact props.
3. **Props from `componentProperties`** — the Figma INSTANCE node has the exact variant/prop values. Use them.
4. **Brand-agnostic pages** — page TSX never hardcodes colors. Brand differences live in token overrides only.

---

## Step 1: Brand Detection

**Before any content extraction**, check if the page has multiple brand variants.

```python
# Find top-level FRAME children of the CANVAS
frames = re.findall(r'      - id: (\S+)\n\s+name: (.+)\n\s+type: FRAME', text)
```

**Multi-brand indicator**: 2+ top-level FRAMEs with the **same or similar name** (e.g., "Fornecedores - perfil sacado" appearing twice) plus GROUP nodes labeled "Brand X" / "Brand Y".

If detected:
1. **Diff the fills** between Frame A and Frame B:
   ```python
   fills_A = set(re.findall(r'fills: (\S+)', frame_a_text))
   fills_B = set(re.findall(r'fills: (\S+)', frame_b_text))
   only_A = fills_A - fills_B  # Brand A palette
   only_B = fills_B - fills_A  # Brand B palette
   shared = fills_A & fills_B  # Neutral palette
   ```
2. **Resolve actual hex values** from the `globalVars.styles` section
3. **Generate brand token files** (see Step 6 below)
4. **Use only Frame A for page structure extraction** — the layout is identical, only colors differ

If NOT detected: single-brand page, skip Step 6.

## Step 2: Build the Component Instance Map

Map Figma `componentId` → our React component + default props.

**Pass 1 — Extract metadata**:
```python
# From the metadata section, build: componentId → componentName
# From metadata.componentSets: componentSetId → componentSetName
components = re.findall(r"    (\S+):\n\s+id: \S+\n\s+key: \S+\n\s+name: (.+)\n\s+componentSetId: (\S+)", text)
```

**Pass 2 — Cross-reference with existing React components**:
```bash
# List existing components
ls src/components/
# For each, check the component name in the Figma metadata
```

Build a lookup table like:
```
componentId 248:5306 → MenuSacado (variant: collapsed)
componentId 96:76    → MenuItem (variant: not selected)
componentId 96:186   → MenuItem (variant: selected)
componentId 156:xxx  → Pagination
```

## Step 3: Extract Instance Props (the fidelity key)

For every INSTANCE node in the page, extract its **`componentProperties`**. This is the single most important step for fidelity.

```python
# Find all INSTANCE nodes and their componentProperties
# Pattern in the YAML:
#   type: INSTANCE
#   componentId: 96:76
#   componentProperties:
#     - name: label#96:4
#       value: Dashboard
#       type: TEXT
#     - name: status
#       value: Default
#       type: VARIANT
#     - name: Type
#       value: not selected
#       type: VARIANT
```

**Mapping rules**:
- `type: VARIANT` props → React component variant/enum props
- `type: TEXT` props → React string props (labels, values, placeholders)
- `type: BOOLEAN` props → React boolean props (showIcon, isRequired, etc.)
- `type: INSTANCE_SWAP` props → which sub-component/icon is swapped in

**For composite cells** (e.g., a chip with a chevron-down child):
- If a COMPONENT instance has a child `type: IMAGE-SVG` that is a chevron, the cell is a "dropdown chip", not a plain chip
- Extract both the chip label AND the child icon to render the composite correctly

## Step 4: Extract Page Structure via Chunked Reads

Process the Figma data in targeted python3 passes:

### Pass 1 — Top-level layout
Identify the main sections: sidebar (INSTANCE), main area (FRAME), and their arrangement.

For the sidebar, extract `componentProperties` to determine:
- `state: collapsed` or `state: expandend` → `collapsed={true|false}`
- Which menu item is selected (look for `.items` with `Type: selected`)

### Pass 2 — Topbar
Find the topbar FRAME. Extract:
- Breadcrumb items (INSTANCE of breadcrumb component → extract TEXT children in order)
- Logo presence (IMAGE-SVG node with logo componentId)

### Pass 3 — Content header
Find the content header section. Extract:
- Title and subtitle TEXT nodes (exact strings)
- Action buttons: for each INSTANCE of button component, extract `componentProperties`:
  - Variant (primary/outline/transparent)
  - Label text
  - Icon (if any IMAGE-SVG child exists, note which icon)
  - Order (preserve left-to-right order from Figma)

### Pass 4 — Toolbar (if present)
Find the toolbar/filter bar. Extract:
- Text actions (e.g., "Redefinir")
- Icon buttons (download each icon nodeId, note their order)
- Disabled state (check componentProperties for disabled variant)

### Pass 5 — Table structure
**Column headers**: Find `thead` FRAME → iterate child cells → extract TEXT value + check for sort icon (IMAGE-SVG child of sort type)

**Row data**: Find `body` FRAME → iterate `trow` FRAMEs → for each cell:
- **Plain text cell**: single TEXT node → extract `text:` value
- **Two-line cell**: two TEXT nodes → extract both (primary = first, secondary = second)
- **Chip cell**: INSTANCE of chip component → extract `componentProperties` for label + type variant. Check for chevron-down child → if present, render as dropdown chip
- **Icon cell**: IMAGE-SVG node → note which icon
- **Composite cell**: text + icon together → extract both

### Pass 6 — Pagination
Find Pagination INSTANCE → extract `componentProperties`:
- Which variant (numbered vs jumper)
- Total pages (count page number items or extract from text)
- Current page (which item has selected variant)

## Step 5: Generate the Page Spec

Output a structured spec that captures EVERY detail needed. This spec is the contract between extraction and generation — the generator follows it mechanically.

```json
{
  "pageName": "Fornecedores - perfil sacado",
  "brands": ["liber", "teste"],
  "layout": {
    "sidebar": {
      "component": "MenuSacado",
      "props": { "collapsed": true, "activeItemId": "fornecedores" }
    },
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
        { "label": "Redefinir", "type": "text", "disabled": true },
        { "type": "icon-button", "icon": "/icons/filter-right.svg", "ariaLabel": "Filtrar" },
        { "type": "icon-button", "icon": "/icons/download.svg", "ariaLabel": "Download" },
        { "type": "icon-button", "icon": "/icons/upload.svg", "ariaLabel": "Upload" }
      ]
    },
    "table": {
      "columns": [
        { "key": "empresa", "label": "Empresa", "sortable": true, "cellType": "two-line" },
        { "key": "contato", "label": "Contato", "sortable": true, "cellType": "text" },
        { "key": "acionistas", "label": "Acionistas", "cellType": "text-with-icon", "icon": "/icons/library.svg" },
        { "key": "status", "label": "Status", "sortable": true, "cellType": "dropdown-chip" },
        { "key": "categoria", "label": "Categoria", "cellType": "text" },
        { "key": "regras", "label": "Regras da Plataforma", "cellType": "text" },
        { "key": "credito", "label": "Crédito", "cellType": "text" },
        { "key": "opcoes", "label": "Opções", "cellType": "icon-button", "icon": "/icons/info-circle.svg" }
      ],
      "rows": [
        {
          "empresa": { "primary": "Nova Era Transportes", "secondary": "12.345.678/0001-90" },
          "contato": "financeiro@novaera.com",
          "acionistas": "3/3",
          "status": { "label": "Pendente", "chipType": "warning" },
          "categoria": "Grupo Beta",
          "regras": "Ativo",
          "credito": "R$ 50.000,00"
        }
      ]
    },
    "pagination": {
      "variant": "numbered",
      "totalPages": 3,
      "currentPage": 1
    }
  }
}
```

## Step 6: Generate Brand Tokens (multi-brand only)

If Step 1 detected 2+ brands:

1. **Create brand token files** for each brand:
   ```
   src/tokens/brands/liber.css    → :root[data-brand="liber"] { --brand-primary: #1E4D6D; ... }
   src/tokens/brands/teste.css    → :root[data-brand="teste"] { --brand-primary: #082452; ... }
   ```

2. **Use `:root[data-brand="name"]`** selector (specificity `(0,2,0)`, beats base `:root`).

3. **Map brand-specific fills to semantic tokens**:
   ```
   only_A fills → brand A token values
   only_B fills → brand B token values
   shared fills → base semantic tokens (no brand override needed)
   ```

4. **Common brand tokens to define**:
   - `--brand-primary`, `--brand-primary-hover`, `--brand-primary-active`
   - `--brand-bg-page` (page background)
   - `--brand-sidebar-selected-bg`
   - `--brand-success-bg`, `--brand-success-text`
   - Any fill that differs between frames

5. **Update component SCSS** to use `--brand-*` tokens where brand-specific colors are used (sidebar selected, primary buttons, status chips backgrounds).

6. **Import brand files** at top of `tokens/index.css`:
   ```css
   @import './brands/liber.css';
   @import './brands/teste.css';
   ```

7. **Generate BrandSwitcher component** (dev-only overlay):
   ```tsx
   // Sets document.documentElement.setAttribute('data-brand', brandId)
   ```

8. **Wire BrandSwitcher into main.tsx** at app root level.

**The page TSX itself NEVER changes between brands.** It uses semantic tokens that resolve to different values per brand via CSS custom property overrides.

## Step 7: Generate the Page TSX

With the spec in hand, generation is **mechanical** — no decisions, no creativity:

1. Import existing components by name from the spec
2. Define data arrays exactly as specified in `spec.content.table.rows`
3. For each `cellType` in the spec, use the matching render pattern:
   - `"text"` → `<Cell>{value}</Cell>`
   - `"two-line"` → `<Cell><div className="two-line"><span>{primary}</span><span>{secondary}</span></div></Cell>`
   - `"dropdown-chip"` → `<Cell><span className="dropdown-chip"><Chip .../><MaskIcon src={chevronDown}/></span></Cell>`
   - `"text-with-icon"` → `<Cell><span>{text} <MaskIcon src={icon}/></span></Cell>`
   - `"icon-button"` → `<Cell><button><MaskIcon src={icon}/></button></Cell>`
4. For pagination, use `variant={spec.content.pagination.variant}` — NOT the other variant
5. For sidebar, use exact props: `collapsed={spec.layout.sidebar.props.collapsed}`

## Fidelity Checklist

Before considering the page complete, verify EVERY item:

- [ ] Sidebar: correct collapsed/expanded state
- [ ] Sidebar: correct active menu item
- [ ] Breadcrumb: exact labels and count
- [ ] Logo: present/absent matching Figma
- [ ] Content header: exact title text
- [ ] Content header: exact subtitle text
- [ ] Action buttons: exact labels, exact variants, exact order, exact icons
- [ ] Toolbar: exact actions with correct labels/icons
- [ ] Table: exact column count
- [ ] Table: exact column labels
- [ ] Table: sort indicators on correct columns
- [ ] Table: cell types match (two-line, chip, icon-button, etc.)
- [ ] Table: row count matches Figma
- [ ] Table: row data matches Figma text values
- [ ] Status chips: correct type variant (warning/success/error)
- [ ] Status chips: includes chevron if Figma shows it
- [ ] Pagination: correct variant (numbered vs jumper)
- [ ] Pagination: correct total pages
- [ ] No extra UI elements that don't exist in Figma
- [ ] Brand tokens generated (if multi-brand detected)
- [ ] All brand-specific colors use `--brand-*` tokens
- [ ] BrandSwitcher wired (if multi-brand)

## Key Rules

1. **Sidebar state comes from `componentProperties`** — check the INSTANCE's `state` variant prop
2. **No tabs unless Figma has tabs** — don't add UI elements that aren't in the design
3. **Table columns match exactly** — same count, same labels, same order
4. **Cell types come from node structure** — child nodes determine the render pattern
5. **Chip variant comes from `componentProperties`** — not from the fill color name
6. **Composite cells** — if a chip INSTANCE has a chevron-down IMAGE-SVG child, render chip + chevron together
7. **Pagination variant comes from which componentSetId is used** — match to the correct React prop
8. **Data is extracted, not invented** — use actual text strings from Figma TEXT nodes
9. **Missing icons** — download in a batch before generating code
10. **Pages are brand-agnostic** — brand differences live ONLY in CSS token overrides, never in TSX
