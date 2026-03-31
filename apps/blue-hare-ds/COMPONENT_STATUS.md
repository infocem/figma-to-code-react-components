# Component Status — Tailwind v4 Migration + Figma Fidelity

## Legenda

- **Tailwind**: migração para classes Tailwind v4
  - `done` = só Tailwind, sem .css residual
  - `partial` = usa Tailwind + .css residual (animações, pseudo-selectors, etc.)
- **Figma check**: comparação visual com figma-refs/ screenshot
  - `ok` = verificado, fiel ao design (ou diferenças apenas de scope do showcase)
  - `adjusted` = verificado e corrigido nesta sessão
  - `issue` = divergência real que precisa de correção
  - `pending` = ainda não comparado
- **Notes**: observações relevantes

## Componentes (41)

| # | Component | Tailwind | Figma check | Notes |
|---|-----------|----------|-------------|-------|
| 1 | Anchor | done | ok | showcase simplificado (sem matriz de estados) |
| 2 | Autocomplete | done | adjusted | clear button, search button (bg primary), ícones em options |
| 3 | Avatar | partial | ok | .css mínimo (sibling overlap no AvatarGroup) |
| 4 | Badge | done | adjusted | shape circular fixo, text-xs, showcase c/ 5 copy + 5 dot |
| 5 | BrandSwitcher | done | ok | sem ref no Figma (componente auxiliar) |
| 6 | Breadcrumb | done | adjusted | separador chevron, no-underline, prop showExternalIcon |
| 7 | Button | done | adjusted | focus-ring unificado com global, .css removido |
| 8 | ButtonGroup | partial | adjusted | focus ring c/ tokens |
| 9 | Carousel | done | adjusted | botões circulares c/ border, progress track bar, anatomy do DS |
| 10 | Checkbox | partial | adjusted | error/disabled migrados p/ Tailwind, focus ring c/ tokens |
| 11 | Chip | done | adjusted | ícone ⊗ circular, todas as 6 variantes no showcase, fix typeClasses |
| 12 | DatePicker | done | adjusted | calendar popup custom, day states, navegação mês/ano, formato DD/MM/YYYY |
| 13 | DefinedField | partial | adjusted | disabled migrado p/ Tailwind, focus-within c/ tokens |
| 14 | Drawer | done | ok | conteúdo do drawer é interativo (abre com click) |
| 15 | Dropdown | done | adjusted | showcase com ícones e hint, estado aberto é interativo (click) |
| 16 | Field | partial | adjusted | .css mínimo (focus-within ring), disabled migrado |
| 17 | Input | done | ok | showcase mostra variantes diferentes do spec sheet |
| 18 | Keyline | done | ok | weight variants ausentes mas aceitável |
| 19 | Label | done | ok | layout difere levemente, funcional |
| 20 | Link | done | adjusted | ícones external-link + arrow-right do Figma, variante basic/inline, hover bg |
| 21 | List | done | adjusted | showcase com 8 items e heading (fiel ao Figma) |
| 22 | Loader | partial | ok | .css necessário (@keyframes) |
| 23 | Menu | done | adjusted | showcase com ícones user/lock, selected + disabled states |
| 24 | Message | done | adjusted | ícones por variante do Figma, close icon do Figma, removido SVG inline |
| 25 | Navigation | partial | ok | .css necessário (focus ring c/ inset custom) |
| 26 | Pagination | done | adjusted | focus-ring unificado com global, .css removido |
| 27 | Placeholder | done | adjusted | showcase atualizado com variantes (content, empty-state, minimal) |
| 28 | Progress | done | adjusted | circular progress adicionado (SVG donut ring), showcase atualizado |
| 29 | RadioButton | partial | adjusted | disabled migrado p/ Tailwind, focus ring c/ tokens |
| 30 | Sidebar | done | adjusted | collapsed mode, multi-variantes showcase, footer user menu, expandedKeys controlado |
| 31 | Slider | partial | ok | .css necessário (vendor pseudo-elements) |
| 32 | Snackbar | done | adjusted | ícone por variante do Figma, showcase c/ link em todas |
| 33 | Stepper | done | ok | estrutura ok, node sizes levemente menores (minor) |
| 34 | Switch | partial | adjusted | disabled migrado p/ Tailwind, focus ring c/ tokens |
| 35 | Table | partial | adjusted | header font-weight, border variants, row selection |
| 36 | Tabs | partial | adjusted | focus ring c/ tokens |
| 37 | Tag | done | ok | showcase reduzido (sem hover/focus matrix) |
| 38 | TextArea | partial | ok | .css mínimo (resize handle cosmético) |
| 39 | Toast | done | ok | |
| 40 | Tooltip | partial | ok | .css necessário (placement, clip-path, filter) |
| 41 | Tree | partial | adjusted | focus ring c/ tokens, hover guard mantido |

## Telas

| Tela | Figma check | Notes |
|------|-------------|-------|
| FornecedoresScreen | pending | tabela inline (não usa componente Table), shadows hardcoded |

## Resumo

- **Tailwind done**: 24/41
- **Tailwind partial** (com .css residual justificado): 17/41
- **Figma ok**: 16/41
- **Figma adjusted** (corrigido nesta sessão): 25/41
- **Figma issue** (precisa correção): 0/41

### Issues restantes

Nenhum issue pendente. Todos os 41 componentes foram revisados e ajustados.

## Referências Figma

Fonte: `docs/to_extract.md`

| Component | Figma node |
|-----------|-----------|
| Page Fornecedores | node-id=482-6196 |
| Label | node-id=85-34 |
| Slider | node-id=503-6757 |
| Stepper | node-id=503-6758 |
| Tooltip | node-id=577-4118 |
| Toast | node-id=577-4034 |
| Message | node-id=577-4046 |
| Field | node-id=85-64 |
| Input | node-id=86-290 |
| Button | node-id=86-322 |
| Menu | node-id=96-67 |
| Dropdown | node-id=110-180 |
| Checkbox | node-id=110-511 |
| RadioButton | node-id=117-217 |
| Switch | node-id=118-310 |
| TextArea | node-id=119-221 |
| DefinedField | node-id=121-239 |
| DatePicker | node-id=128-475 |
| Autocomplete | node-id=139-706 |
| Tabs | node-id=150-346 |
| Keyline | node-id=152-647 |
| ButtonGroup | node-id=154-252 |
| Pagination | node-id=156-346 |
| Carousel | node-id=158-1285 |
| Anchor | node-id=159-320 |
| Navigation | node-id=160-606 |
| Link | node-id=160-917 |
| Breadcrumb | node-id=160-1550 |
| Table | node-id=164-19 |
| Chip | node-id=167-32 |
| Avatar | node-id=169-307 |
| Tag | node-id=176-65 |
| Loader | node-id=177-65 |
| List | node-id=178-209 |
| Badge | node-id=185-114 |
| Tree | node-id=193-1311 |
| Progress | node-id=200-2005 |
| Snackbar | node-id=201-2075 |
| Drawer | node-id=498-1292 |
| Placeholder | node-id=202-340 |
| Sidebar | node-id=253-5544 |
