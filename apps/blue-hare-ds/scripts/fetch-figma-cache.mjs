#!/usr/bin/env node
/**
 * fetch-figma-cache.mjs — Blue Hare DS
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

// ─── Project configuration ─────────────────────────────────────────────────
const FILE_KEY = '4lLdRUTtXDqo1iVOEorZIQ';

const COMPONENTS = [
  { name: 'label',            nodeId: '85-34'    },
  { name: 'slider',           nodeId: '503-6757'  },
  { name: 'stepper',          nodeId: '503-6758'  },
  { name: 'tooltip',          nodeId: '577-4118'  },
  { name: 'toast',            nodeId: '577-4034'  },
  { name: 'message',          nodeId: '577-4046'  },
  { name: 'field',            nodeId: '85-64'    },
  { name: 'input',            nodeId: '86-290'   },
  { name: 'buttons',          nodeId: '86-322'   },
  { name: 'menu',             nodeId: '96-67'    },
  { name: 'dropdown',         nodeId: '110-180'  },
  { name: 'checkbox',         nodeId: '110-511'  },
  { name: 'radio-buttons',    nodeId: '117-217'  },
  { name: 'switch',           nodeId: '118-310'  },
  { name: 'text-area',        nodeId: '119-221'  },
  { name: 'defined-field',    nodeId: '121-239'  },
  { name: 'date-picker',      nodeId: '128-475'  },
  { name: 'autocomplete',     nodeId: '139-706'  },
  { name: 'tabs',             nodeId: '150-346'  },
  { name: 'keyline',          nodeId: '152-647'  },
  { name: 'button-group',     nodeId: '154-252'  },
  { name: 'pagination',       nodeId: '156-346'  },
  { name: 'carousel',         nodeId: '158-1285' },
  { name: 'anchor',           nodeId: '159-320'  },
  { name: 'navigation',       nodeId: '160-606'  },
  { name: 'link',             nodeId: '160-917'  },
  { name: 'breadcrumb',       nodeId: '160-1550' },
  { name: 'table',            nodeId: '164-19'   },
  { name: 'chip',             nodeId: '167-32'   },
  { name: 'avatar',           nodeId: '169-307'  },
  { name: 'tag',              nodeId: '176-65'   },
  { name: 'loader',           nodeId: '177-65'   },
  { name: 'list',             nodeId: '178-209'  },
  { name: 'badge',            nodeId: '185-114'  },
  { name: 'tree',             nodeId: '193-1311' },
  { name: 'progress',         nodeId: '200-2005' },
  { name: 'snackbar',         nodeId: '201-2075' },
  { name: 'drawer-simulation',nodeId: '498-1292' },
  { name: 'placeholder',      nodeId: '202-340'  },
  { name: 'sidebar',          nodeId: '253-5544' },
];
// ──────────────────────────────────────────────────────────────────────────

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

  const reset = process.argv.includes('--reset');
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  if (reset && fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log('🔄  Progress reset.\n');
  }

  const progress = loadProgress();
  const pending = COMPONENTS.filter(c => !progress.completed.includes(c.name));

  console.log(`📦  Figma Cache Fetcher — Blue Hare DS`);
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
