#!/usr/bin/env ts-node
/**
 * Orchestrator — multi-project extraction pipeline
 *
 * Usage:
 *   npx ts-node scripts/orchestrate.ts --project blue-hare-ds
 *   npx ts-node scripts/orchestrate.ts --project blue-hare-ds --next
 *   npx ts-node scripts/orchestrate.ts --project blue-hare-ds --phase 2
 */

import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);
const projectIdx = args.indexOf("--project");
if (projectIdx === -1 || !args[projectIdx + 1]) {
  console.error("Error: --project <name> is required");
  console.error("  Example: npx ts-node scripts/orchestrate.ts --project blue-hare-ds");
  process.exit(1);
}
const PROJECT = args[projectIdx + 1];
const STATUS_FILE = path.resolve(__dirname, `../extraction/${PROJECT}/status.json`);

type Status = "pending" | "in-progress" | "done" | "failed";

interface ComponentEntry {
  name: string;
  nodeId: string;
  phase: number;
  specStatus: Status;
  generateStatus: Status;
}

interface StatusFile {
  lastUpdated: string;
  projectName: string;
  figmaFileKey: string;
  tokens: { status: Status };
  components: ComponentEntry[];
}

function loadStatus(): StatusFile {
  return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
}

function countByStatus(items: ComponentEntry[], field: keyof ComponentEntry) {
  return items.reduce(
    (acc, item) => {
      const val = item[field] as Status;
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    },
    {} as Record<Status, number>
  );
}

function printProgress(data: StatusFile) {
  const total = data.components.length + 1; // +1 for tokens
  const specDone = data.components.filter((c) => c.specStatus === "done").length;
  const genDone = data.components.filter((c) => c.generateStatus === "done").length;
  const tokensDone = data.tokens.status === "done" ? 1 : 0;

  console.log("\n=== Blue Hare DS — Extraction Pipeline ===\n");
  console.log(`Project:   ${data.projectName}`);
  console.log(`File key:  ${data.figmaFileKey}`);
  console.log(`Updated:   ${data.lastUpdated}\n`);

  console.log("── Tokens ──────────────────────────────");
  console.log(`  Status: ${data.tokens.status.toUpperCase()}\n`);

  console.log("── Components ──────────────────────────");
  console.log(`  Specs generated:    ${specDone}/${data.components.length}`);
  console.log(`  Components built:   ${genDone}/${data.components.length}`);
  const overallDone = tokensDone + genDone;
  const pct = Math.round((overallDone / total) * 100);
  console.log(`  Overall progress:   ${overallDone}/${total} (${pct}%)\n`);

  // Group by phase
  const phases = [...new Set(data.components.map((c) => c.phase))].sort();
  for (const phase of phases) {
    const items = data.components.filter((c) => c.phase === phase);
    const phaseDone = items.filter((c) => c.generateStatus === "done").length;
    const phaseLabel = phase === 8 ? `Phase ${phase} (page)` : `Phase ${phase}`;
    console.log(`  ${phaseLabel}: ${phaseDone}/${items.length} done`);
    for (const item of items) {
      const spec = item.specStatus === "done" ? "✓" : item.specStatus === "failed" ? "✗" : "·";
      const gen =
        item.generateStatus === "done"
          ? "✓"
          : item.generateStatus === "failed"
          ? "✗"
          : "·";
      console.log(
        `    [spec:${spec} gen:${gen}] ${item.name.padEnd(20)} node:${item.nodeId}`
      );
    }
    console.log();
  }
}

function printNextAction(data: StatusFile) {
  // Step 1: tokens
  if (data.tokens.status === "pending" || data.tokens.status === "failed") {
    console.log("\n── NEXT ACTION ─────────────────────────");
    console.log("  ACTION: EXTRACT TOKENS (Phase 0)\n");
    console.log(
      "  Ask Claude to extract all variable collections from the Figma file"
    );
    console.log(`  and generate token files in apps/${data.projectName}/src/tokens/\n`);
    console.log(`  Figma file key: ${data.figmaFileKey}`);
    console.log(
      "  Expected output: primitives.css, semantic.css, brands/brand-1.css, brands/brand-2.css, index.css\n"
    );
    return;
  }

  // Step 2: find first pending spec
  const pendingSpec = data.components.find(
    (c) => c.specStatus === "pending" || c.specStatus === "failed"
  );
  if (pendingSpec) {
    console.log("\n── NEXT ACTION ─────────────────────────");
    console.log(`  ACTION: EXTRACT SPEC — ${pendingSpec.name} (Phase ${pendingSpec.phase})\n`);
    console.log(
      `  Ask Claude to extract the ${pendingSpec.name} component from Figma`
    );
    console.log(
      `  and save the spec to: extraction/specs/${pendingSpec.name}.spec.json\n`
    );
    console.log(`  Figma node ID: ${pendingSpec.nodeId}`);
    console.log(`  Figma file key: ${data.figmaFileKey}\n`);

    // Show how many specs are ready for generation
    const readyToGen = data.components.filter(
      (c) => c.specStatus === "done" && c.generateStatus === "pending"
    );
    if (readyToGen.length > 0) {
      console.log(
        `  (${readyToGen.length} spec(s) ready for generation: ${readyToGen
          .map((c) => c.name)
          .join(", ")})`
      );
    }
    return;
  }

  // Step 3: find first pending generation
  const pendingGen = data.components.find(
    (c) =>
      c.specStatus === "done" &&
      (c.generateStatus === "pending" || c.generateStatus === "failed")
  );
  if (pendingGen) {
    console.log("\n── NEXT ACTION ─────────────────────────");
    console.log(
      `  ACTION: GENERATE COMPONENT — ${pendingGen.name} (Phase ${pendingGen.phase})\n`
    );
    console.log(
      `  Ask Claude to generate the ${pendingGen.name} component`
    );
    console.log(
      `  from spec: extraction/${PROJECT}/${pendingGen.name}.spec.json\n`
    );
    console.log(
      `  Output: apps/${data.projectName}/src/components/${capitalize(pendingGen.name)}/\n`
    );
    return;
  }

  console.log("\n── ALL DONE ─────────────────────────────");
  console.log("  All components have been extracted and generated.");
  console.log(`  Run the showcase: cd apps/${data.projectName} && npm run dev\n`);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const data = loadStatus();

if (args.includes("--next")) {
  printNextAction(data);
} else if (args.includes("--phase")) {
  const phaseIdx = args.indexOf("--phase");
  const phaseNum = parseInt(args[phaseIdx + 1], 10);
  const items = data.components.filter((c) => c.phase === phaseNum);
  console.log(`\nPhase ${phaseNum} (${items.length} components):`);
  for (const item of items) {
    console.log(
      `  ${item.name.padEnd(20)} spec:${item.specStatus.padEnd(11)} gen:${item.generateStatus}`
    );
  }
  console.log();
} else {
  printProgress(data);
  printNextAction(data);
}
