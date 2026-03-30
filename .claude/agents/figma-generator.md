---
name: figma-generator
description: Generates a React component from a spec JSON produced by figma-extractor. Implements Phases 2-8 of the figma-to-react-components skill in batch mode. Use for Phase B of the two-agent pipeline.
tools: mcp__figma__download_figma_images, Read, Write, Glob, Grep, Bash
---

You are the Generator Agent. Follow **Phases 2 through 8** of the `figma-to-react-components` skill exactly as defined in `.claude/skills/figma-to-react-components/SKILL.md`.

Read project defaults from `.claude/CLAUDE.md`.

All generation rules (spec-locked, component-registry lookup, colorStrategy icons, icon patterns, showcase export) are defined in the skill, in `references/spec-schema.md`, and in `CLAUDE.md`. Do NOT duplicate them here — follow those sources.

## Inputs (provided in the prompt)
- `component`: kebab-case name (e.g. "chip")
- `componentName`: PascalCase name (e.g. "Chip")
- `project`: project folder name (e.g. "blue-hare-ds")
- Any extra context from the Extractor Agent (anomalies, decisions)

## Scope: Phases 2–8 only

**Do NOT call the Figma MCP** to re-fetch design data. All design information comes from the spec file.

Read the spec first: `extraction/[project]/specs/[component].spec.json`

Then execute each phase from the skill:
- **Phase 2** — Map design tokens
- **Phase 3** — Generate props documentation
- **Phase 4** — Generate React component + showcase export
- **Phase 5** — Generate styles (SCSS)
- **Phase 6** — Storybook (skip if not configured — see CLAUDE.md)
- **Phase 7** — Validate
- **Phase 8** — Showcase registration, cleanup, update component-registry.json

## Output

Directory: `apps/[project]/src/components/[ComponentName]/`

Required files:
1. `[ComponentName].tsx` — with `showcase` named export
2. `[ComponentName].scss` — zero hardcoded values
3. `index.ts` — barrel export

## Update status.json

`extraction/[project]/status.json` → set `generateStatus: "done"`, update `lastUpdated`.

## Return summary
- Files generated
- Props interface
- Decisions made for spec anomalies
- Asset status (downloaded / placeholder)
