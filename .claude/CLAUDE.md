# figma-to-code

Projeto de pipeline para converter componentes Figma em código React production-ready.

## Stack padrão

| Camada | Tecnologia |
|---|---|
| Bundler | Vite |
| Framework | React (`jsx: "react-jsx"` — não usar `import React from 'react'`) |
| Routing | React Router (`react-router-dom`) |
| Tokens | CSS custom properties (`primitives.css` → `semantic.css` → `brands/[brand].css`) |
| Styling | SCSS (`.scss`) com BEM methodology e `var(--token)` |
| Accessibility | React Aria (`react-aria`, `react-stately`) |
| Storybook | Não configurado — pular Phase 6 |

**Este projeto NÃO usa Tailwind.**

## Convenções de path

| O quê | Onde |
|---|---|
| App de showcase | `apps/[project]/` |
| Componentes | `apps/[project]/src/components/[ComponentName]/` |
| Tokens | `apps/[project]/src/tokens/` |
| Brand tokens | `apps/[project]/src/tokens/brands/[brand].css` |
| Ícones (assets) | `apps/[project]/public/icons/` |
| Specs extraídos | `extraction/[project]/specs/` |
| Component registry | `extraction/[project]/component-registry.json` |
| Status de extração | `extraction/[project]/status.json` |
| **Showcase registry** | `apps/[project]/src/showcase/registry.ts` |
| Showcase layout | `apps/[project]/src/showcase/ShowcaseLayout.tsx` |
| Showcase views | `apps/[project]/src/showcase/AllComponentsView.tsx`, `ComponentView.tsx`, `PagesView.tsx` |
| Pages extraídas | `apps/[project]/src/pages/[PageName].tsx` |

## Regras de ícones

1. **NUNCA** `import x from '/icons/...'` — Vite converte para data URI, quebra mask-image. Usar string constants: `const icon = '/icons/file.svg'`
2. **Um único `MaskIcon`** compartilhado em `src/components/shared/MaskIcon.tsx` — reusar em todo componente
3. `<img>` apenas para `colorStrategy: "fixed"` (logos). Todos os demais → `MaskIcon`
4. **NÃO** `import React from 'react'` — usar imports nomeados (`import { useState } from 'react'`)

## Showcase

Todo componente exporta um `showcase` no final do `.tsx`:
```ts
export const showcase = {
  name: 'ComponentName',
  render: () => (/* all main variants side by side */),
};
```

Registrar em `apps/[project]/src/showcase/registry.ts`:
1. Adicionar import do showcase
2. Adicionar `entry(showcaseVar, 'Category')` no array `components`
3. Categorias disponíveis: `Forms`, `Actions`, `Navigation`, `Data Display`, `Feedback`, `Overlay`

| Categoria | Componentes típicos |
|-----------|-------------------|
| Forms | Input, Field, TextArea, Dropdown, Autocomplete, Checkbox, Radio, Switch, Slider, DatePicker, Label |
| Actions | Button, ButtonGroup, Chip, Tag, Link, Anchor |
| Navigation | Tabs, Breadcrumb, Pagination, Stepper |
| Data Display | Table, List, Tree, Badge, Avatar, Placeholder, Keyline |
| Feedback | Toast, Message, Snackbar, Tooltip, Loader, ProgressBar, ProgressCircle |
| Overlay | Drawer, Carousel |

Pages extraídas são registradas no array `pages` do mesmo `registry.ts`, com rota em `main.tsx` fora do `ShowcaseLayout` (full-screen) e envolvidas em `PageWrapper` para ter botão "Back to Showcase".

**NÃO usar `ComponentsPage.tsx`** — este arquivo é obsoleto. O showcase usa a estrutura em `src/showcase/`.
