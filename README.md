# figma-to-code

Converte qualquer página ou componente do Figma em um app React funcional usando o skill `figma-to-react-components` do Claude Code.

## O que é

Um skill do Claude Code que automatiza o fluxo design → código:

1. Extrai a estrutura, tokens e assets de qualquer nó do Figma via MCP
2. Mapeia tokens de design (cores, tipografia, espaçamento, raios, sombras)
3. Detecta suporte multi-brand quando o Figma contém múltiplos frames com paletas distintas
4. Baixa os ícones SVG diretamente do Figma
5. Gera componentes React com TypeScript e CSS baseado em tokens
6. Entrega o app pronto para rodar em `apps/<nome>/`

## Pré-requisitos

- **Claude Code** com o skill `figma-to-react-components` ativo
- **Figma MCP** configurado na sessão do Claude Code
- **Node.js** para rodar os apps gerados

## Como usar

No Claude Code, informe a URL do Figma que deseja converter:

```
Extraia essa página do figma, converta em components react e gere em /apps <url-do-figma>
```

O skill extrai o nó, mapeia os tokens, baixa os ícones e gera todos os arquivos automaticamente em `apps/<nome-do-app>/`.

## Como rodar um app gerado

```bash
cd apps/<nome-do-app>
npm install
npm run dev
```

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Bundle de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

## Estrutura gerada

Cada app gerado segue esta estrutura:

```
apps/<nome>/
├── src/
│   ├── components/        # Componentes extraídos do Figma
│   ├── pages/             # Páginas do showcase
│   ├── screens/           # Telas completas (ex: Fornecedores)
│   ├── tokens.css         # Tokens de design + overrides por brand
│   ├── tailwind.css       # Config Tailwind + keyframes
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── icons/             # SVGs baixados do Figma
├── scripts/               # Scripts de dev (screenshots, cache)
├── figma-refs/            # Referências visuais do Figma
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Quando o Figma contém múltiplos frames com paletas diferentes, o skill também gera:

- **BrandSwitcher** — overlay para alternar entre brands em runtime
- Overrides de tokens por brand via `:root[data-brand="..."]` em `tokens.css`

## Stack dos apps gerados

- **React 18** + **TypeScript**
- **Vite**
- **CSS Custom Properties** para tokens de design
- **BEM** como metodologia de nomenclatura CSS
