#!/usr/bin/env node
/**
 * fetch-figma-cache.mjs — TEMPLATE (agnostic)
 *
 * This file lives in references/ as a template.
 * When the skill runs, it copies this to [outputDir]/scripts/fetch-figma-cache.mjs
 * and fills in FILE_KEY and COMPONENTS for the specific project.
 *
 * Fetches Figma node data sequentially with rate-limit awareness.
 * Saves raw JSON to .figma-cache/ and tracks progress so it can resume.
 *
 * Usage (from the app root directory):
 *   FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs
 *   FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs --reset
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Script lives at [outputDir]/scripts/ → cache lives at [outputDir]/.figma-cache/
const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, '.figma-cache');
const PROGRESS_FILE = path.join(CACHE_DIR, 'progress.json');

// ─── Configure per project ────────────────────────────────────────────────────
const FILE_KEY = 'FIGMA_FILE_KEY'; // e.g. '4lLdRUTtXDqo1iVOEorZIQ'

const COMPONENTS = [
  // { name: 'button', nodeId: '86-322' },
  // { name: 'badge',  nodeId: '185-114' },
];
// ─────────────────────────────────────────────────────────────────────────────

const DELAY_MS = 4000;        // 4 s between requests
const RETRY_DELAY_MS = 60000; // 60 s wait on 429
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function fetchNode(token, nodeId, retries = 0) {
  const id = nodeId.replace('-', ':');
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${id}`;

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });

  if (res.status === 429) {
    if (retries >= MAX_RETRIES) throw new Error('MAX_RETRIES exceeded on 429');
    console.log(`  ⚠️  429 rate limit — waiting ${RETRY_DELAY_MS / 1000}s...`);
    await sleep(RETRY_DELAY_MS);
    return fetchNode(token, nodeId, retries + 1);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error('❌  FIGMA_TOKEN env var is required.');
    console.error('   Usage: FIGMA_TOKEN=figd_xxx node scripts/fetch-figma-cache.mjs');
    process.exit(1);
  }

  if (FILE_KEY === 'FIGMA_FILE_KEY') {
    console.error('❌  FILE_KEY not configured. Edit scripts/fetch-figma-cache.mjs and set FILE_KEY.');
    process.exit(1);
  }

  if (COMPONENTS.length === 0) {
    console.error('❌  COMPONENTS list is empty. Edit scripts/fetch-figma-cache.mjs and add entries.');
    process.exit(1);
  }

  const reset = process.argv.includes('--reset');
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  if (reset && fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log('🔄  Progress reset.\n');
  }

  const progress = loadProgress();
  const pending = COMPONENTS.filter(c => !progress.completed.includes(c.name));

  console.log(`📦  Figma Cache Fetcher`);
  console.log(`    File:  ${FILE_KEY}`);
  console.log(`    Cache: ${CACHE_DIR}`);
  console.log(`    Total: ${COMPONENTS.length} components`);
  console.log(`    Done:  ${progress.completed.length}`);
  console.log(`    Todo:  ${pending.length}\n`);

  if (pending.length === 0) {
    console.log('✅  All components already cached!');
    return;
  }

  for (let i = 0; i < pending.length; i++) {
    const { name, nodeId } = pending[i];
    const cacheFile = path.join(CACHE_DIR, `${name}.json`);
    const idx = progress.completed.length + i + 1;

    process.stdout.write(`[${idx}/${COMPONENTS.length}] ${name} (${nodeId})... `);

    try {
      const data = await fetchNode(token, nodeId);
      fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
      progress.completed.push(name);
      saveProgress(progress);
      console.log('✅');
    } catch (err) {
      progress.failed.push({ name, nodeId, error: err.message });
      saveProgress(progress);
      console.log(`❌  ${err.message}`);
    }

    if (i < pending.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n─────────────────────────────────');
  console.log(`✅  Cached: ${progress.completed.length}/${COMPONENTS.length}`);
  if (progress.failed.length > 0) {
    console.log(`❌  Failed: ${progress.failed.length}`);
    progress.failed.forEach(f => console.log(`   • ${f.name}: ${f.error}`));
  }
  console.log(`\nCache saved to: ${CACHE_DIR}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
