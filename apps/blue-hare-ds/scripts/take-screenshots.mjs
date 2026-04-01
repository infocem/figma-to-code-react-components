import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const dir = './screenshots';
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5199', { waitUntil: 'networkidle' });

// Get all sections by finding h2 elements
const sections = await page.$$eval('section', els =>
  els.map(el => {
    const h2 = el.querySelector('h2');
    return h2 ? h2.textContent.trim() : null;
  }).filter(Boolean)
);

console.log(`Found ${sections.length} sections:`, sections);

for (const name of sections) {
  const section = await page.$(`section:has(h2:text-is("${name}"))`);
  if (section) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await section.screenshot({ path: `${dir}/${slug}.png` });
    console.log(`✓ ${slug}`);
  }
}

// Full page too
await page.screenshot({ path: `${dir}/full-page.png`, fullPage: true });
console.log('✓ full-page');

await browser.close();
