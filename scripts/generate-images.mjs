/**
 * Generates social preview images and app icons into /public.
 *
 *   npm run images
 *
 * It builds the site with the hidden card routes in src/pages/og/ enabled,
 * serves that build locally, and screenshots each card with Playwright.
 * Run it again whenever you change your headline or a project's details.
 *
 * Needs Playwright once:  npm i -D playwright && npx playwright install chromium
 */
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error(
    'Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium',
  );
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, '.og-build');
const publicDir = path.join(root, 'public');

// Run Astro's CLI through Node directly: no shell, so paths with spaces or
// quotes are safe, and it behaves the same on Windows, macOS and Linux.
const astroCli = path.join(
  path.dirname(require.resolve('astro/package.json')),
  require('astro/package.json').bin.astro,
);

console.log('Building preview cards...');
execFileSync(process.execPath, [astroCli, 'build', '--outDir', buildDir], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, OG_CARDS: '1' },
});

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.normalize(path.join(buildDir, urlPath));
  if (!file.startsWith(buildDir)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const shoot = async (slug, width, height, outFile) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(`${base}/og/${slug}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outFile });
  await page.close();
  console.log(`  ✓ ${path.relative(root, outFile)}`);
};

try {
  await mkdir(path.join(publicDir, 'og'), { recursive: true });
  // Only the card folders: the build also copies existing images from /public into og/.
  const slugs = (await readdir(path.join(buildDir, 'og'), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  for (const slug of slugs) {
    if (slug === 'icon') {
      await shoot(slug, 180, 180, path.join(publicDir, 'apple-touch-icon.png'));
      await shoot(slug, 192, 192, path.join(publicDir, 'icon-192.png'));
      await shoot(slug, 32, 32, path.join(publicDir, 'favicon-32.png'));
    } else {
      await shoot(slug, 1200, 630, path.join(publicDir, 'og', `${slug}.png`));
    }
  }
} finally {
  await browser.close();
  server.close();
  await rm(buildDir, { recursive: true, force: true });
}
console.log('Done.');
