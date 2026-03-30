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
| Ícones (assets) | `apps/[project]/public/icons/` |
| Specs extraídos | `extraction/[project]/specs/` |
| Component registry | `extraction/[project]/component-registry.json` |
| Status de extração | `extraction/[project]/status.json` |
| Showcase registry | `apps/[project]/src/pages/ComponentsPage.tsx` |

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

Registrar em `apps/[project]/src/pages/ComponentsPage.tsx` (import + entry no array).
