import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5199', { waitUntil: 'networkidle' });

// Click on Fornecedores tab
await page.click('button:text("Fornecedores")');
await page.waitForTimeout(500);

await page.screenshot({ path: './screenshots/fornecedores-screen.png', fullPage: true });
console.log('✓ fornecedores-screen');

await browser.close();
