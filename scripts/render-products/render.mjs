// Renders every product model to public/products/<id>.webp (transparent background).
// Usage: python3 -m http.server 4318 (from repo root) then: node scripts/render-products/render.mjs [playwright-require-path]
import { createRequire } from 'module';
import { mkdirSync } from 'fs';
const require = createRequire(process.argv[2] ?? import.meta.url);
const { chromium } = require('playwright');
const ids = ['d18', 'id20', 'ag125', 'cs185', 'hm2', 'case48', 'bit45', 'wr10'];
const out = process.env.OUT ?? 'scripts/render-products/out';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.on('pageerror', e => console.error('pageerror', e.message));
for (const id of ids) {
  await page.goto(`http://localhost:4318/scripts/render-products/index.html?id=${id}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__rendered === true, null, { timeout: 60000 });
  await page.locator('canvas').screenshot({ path: `${out}/${id}.png`, omitBackground: true });
  console.log('rendered', id);
}
await browser.close();
