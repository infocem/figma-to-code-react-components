# Plan: Pipeline Fidelity Gaps & Next Steps

## Context

Extraímos 40 componentes + 1 página (Fornecedores) do Figma Blue Hare DS. A página gerada tem divergências visuais do Figma que o pipeline não consegue detectar nem corrigir automaticamente. Este plano documenta os gaps identificados, suas causas raiz, e as ações para resolvê-los.

## Gaps identificados (por prioridade)

### P0 — Bloqueiam fidelidade

#### 1. Sem validation loop visual
- **Sintoma**: Página gerada difere do Figma em spacing, variantes, composição
- **Causa**: Pipeline é `Figma data → spec → código → confia`. Não existe `render → screenshot → comparar → corrigir`
- **Fix**: Adicionar Playwright para screenshot automático + comparação com screenshot do Figma
- **Arquivos**: novo `playwright.config.ts`, novo `tests/visual/` dir, update `package.json`
- **Dependência**: Precisa de Playwright instalado

#### 2. componentProperties nem sempre refletem o visual
- **Sintoma**: Pagination diz `status=jumper` nas properties mas renderiza como numbered no Figma
- **Causa**: Designer pode sobrepor visual sem alterar property. O extractor confia cegamente
- **Fix**: Adicionar regra no `page-extraction-guide.md`: quando houver conflito entre property e estrutura visual dos filhos (ex: pagination com filhos numerados = numbered), a estrutura de filhos prevalece
- **Arquivos**: `references/page-extraction-guide.md` Step 3

#### 3. Dropdown chip não existe como componente
- **Sintoma**: Status chips na tabela Figma têm borda + chevron integrado; nosso é Chip + MaskIcon ad-hoc
- **Causa**: Chip foi extraído sem variante dropdown. Na página, o "dropdown chip" é uma composição que não tem componente dedicado
- **Fix opção A**: Criar componente `ChipDropdown` no DS
- **Fix opção B**: Documentar o pattern "dropdown-chip" como cell type no guide com SCSS dedicado na página
- **Arquivos**: `src/components/Chip/Chip.tsx` ou `references/page-extraction-guide.md` Step 7

### P1 — Afetam qualidade visual

#### 4. Table row spacing difere
- **Sintoma**: Rows mais comprimidas que no Figma
- **Causa**: `--table-cell-padding-y` pode não corresponder ao valor exato do Figma (o extractor de componente usou um valor genérico)
- **Fix**: Re-extrair Table com focus nos valores de padding do Figma. Comparar `layout_` values de `trow` cells com tokens atuais
- **Arquivos**: `src/tokens/semantic.css` (table tokens), `src/components/Table/Table.scss`

#### 5. Sidebar colapsado falta footer "Powered by"
- **Sintoma**: No Figma colapsado aparece "Powered by" pequeno; no nosso some
- **Causa**: MenuSacado.tsx esconde o texto do footer quando collapsed, mas o Figma mostra
- **Fix**: Ajustar MenuSacado para mostrar footer text mesmo em collapsed (sem o logo, como faz o Figma)
- **Arquivos**: `src/components/MenuSacado/MenuSacado.tsx` linhas ~287-298

#### 6. Logo "liber" no topbar com cor errada
- **Sintoma**: Logo aparece cinza claro (#9AAACB); no Figma parece mais escuro
- **Causa**: `logo-text.svg` foi baixado com fill fixo `#9AAACB` (que é a cor Light/Text/Disabled). No Figma da página pode usar outra cor
- **Fix**: Verificar o fill do logo no contexto da página vs no componente isolado
- **Arquivos**: `public/icons/logo-text.svg`

### P2 — Melhorias de pipeline

#### 7. Detecção de variant por estrutura de filhos (não só por properties)
- **Sintoma**: Pagination variant errada
- **Causa**: Extractor usa só `componentProperties`
- **Fix**: Adicionar ao guide: "Para componentes com variantes visuais ambíguas, verificar a ESTRUTURA DE FILHOS como source of truth. Ex: Pagination com filhos `numeric item` = numbered; com filho `input` = jumper"
- **Arquivos**: `references/page-extraction-guide.md` Step 3, Step 6

#### 8. Page-level spacing extraction
- **Sintoma**: Gaps/padding entre seções da página não batem
- **Causa**: PageLayout usa tokens genéricos que não foram calibrados com os valores exatos da página no Figma
- **Fix**: O page-extractor deve extrair `gap` e `padding` dos FRAMEs estruturais da página e comparar com os tokens. Se diferirem, adicionar override no page SCSS
- **Arquivos**: `references/page-extraction-guide.md` Step 4, `.claude/agents/page-extractor.md` Phase C

#### 9. Visual regression testing
- **Sintoma**: Sem forma automatizada de detectar regressões
- **Setup proposto**:
  ```
  apps/blue-hare-ds/
    tests/
      visual/
        fornecedores.spec.ts    # Playwright test
        screenshots/
          fornecedores.ref.png  # Reference from Figma
  ```
- **Flow**: `npx playwright test` → abre página → screenshot → compara com referência → report de diff
- **Arquivos**: novo setup Playwright

## Ordem de execução sugerida

```
Fase 1 — Fixes de fidelidade imediata (sem tooling novo)
  [x] Documentar gap de componentProperties vs visual (P0.2)
  [ ] Criar ChipDropdown ou documentar pattern (P0.3)
  [ ] Ajustar table cell padding tokens (P1.4)
  [ ] Ajustar MenuSacado collapsed footer (P1.5)
  [ ] Fix pagination para numbered na FornecedoresPage (P0.2)
  [ ] Verificar logo color (P1.6)

Fase 2 — Pipeline improvements (guide + agents)
  [ ] Atualizar page-extraction-guide com regra de child-structure (P2.7)
  [ ] Atualizar page-extraction-guide com page-level spacing (P2.8)
  [ ] Atualizar page-extractor agent para implementar novas regras

Fase 3 — Visual regression testing (tooling novo)
  [ ] Instalar Playwright
  [ ] Criar teste visual para FornecedoresPage
  [ ] Integrar screenshot do Figma como referência
  [ ] Adicionar ao guide como Phase K do page-extractor
```

## Verificação

Após Fase 1: re-comparar screenshot da página com Figma — as 7 diferenças identificadas devem estar resolvidas
Após Fase 2: rodar `@page-extractor` numa nova página e verificar que as regras novas produzem resultado mais fiel
Após Fase 3: `npx playwright test` passa com diff < 5% contra referência
