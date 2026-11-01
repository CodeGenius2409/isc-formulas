// Installability, the iOS tags, the update prompt and the print stylesheet.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, expect, test } from '@playwright/test';
// @ts-expect-error A plain .mjs helper shared with scripts/lighthouse.mjs.
import { serveStatic } from '../../scripts/lib/static-server.mjs';
import { waitForServiceWorker, watchProblems } from './helpers';

test('the browser considers the app installable', async () => {
  // A normal Playwright context counts as incognito, where nothing can be installed.
  const profile = mkdtempSync(join(tmpdir(), 'isc-install-'));
  const context = await chromium.launchPersistentContext(profile, { channel: 'msedge' });
  try {
    const page = context.pages()[0] ?? (await context.newPage());
    const problems = watchProblems(page);
    await page.goto('http://localhost:4173/');
    await waitForServiceWorker(page);
    const cdp = await context.newCDPSession(page);
    const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
    expect(installabilityErrors).toEqual([]);
    expect(problems).toEqual([]);
  } finally {
    await context.close();
    rmSync(profile, { recursive: true, force: true });
  }
});

test('the manifest and iOS tags are complete, and every file they name exists', async ({ page, request }) => {
  await page.goto('/');
  const head = page.locator('head');
  await expect(head.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute('content', 'yes');
  await expect(head.locator('meta[name="apple-mobile-web-app-title"]')).toHaveCount(1);
  await expect(head.locator('meta[name="theme-color"]')).toHaveCount(1);
  await expect(head.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);

  const links = await page.locator('link[rel="apple-touch-icon"], link[rel="apple-touch-startup-image"], link[rel="icon"]').evaluateAll((els) => els.map((e) => (e as HTMLLinkElement).href));
  expect(links.length).toBeGreaterThanOrEqual(13);
  for (const url of links) expect((await request.get(url)).ok(), url).toBe(true);

  const manifestUrl = await page.locator('link[rel="manifest"]').evaluate((e) => (e as HTMLLinkElement).href);
  const manifest = await (await request.get(manifestUrl)).json();
  expect(manifest.display).toBe('standalone');
  const icons = manifest.icons as { src: string; sizes: string; purpose: string }[];
  expect(icons.some((i) => i.purpose === 'maskable' && i.sizes === '512x512')).toBe(true);
  expect(icons.some((i) => i.purpose === 'any' && i.sizes === '512x512')).toBe(true);
  for (const icon of icons) expect((await request.get(new URL(icon.src, manifestUrl).href)).ok(), icon.src).toBe(true);
});

test('a new version asks first, then updates when told to', async ({ browser }) => {
  const dir = mkdtempSync(join(tmpdir(), 'isc-update-'));
  cpSync('dist', dir, { recursive: true });
  const server = await serveStatic(dir);
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(server.url);
    await waitForServiceWorker(page);
    await page.reload();
    await expect(page.getByText('A new version of the book is ready.')).toHaveCount(0);

    // Publish a new version: change one page, and the service worker that lists it.
    const htmlPath = join(dir, 'index.html');
    writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace('<title>ISC Formula Book</title>', '<title>ISC Formula Book v2</title>'));
    const swPath = join(dir, 'sw.js');
    const sw = readFileSync(swPath, 'utf8');
    const changed = sw.replace(/url:"index\.html",revision:"[^"]+"/, 'url:"index.html",revision:"new-version"');
    expect(changed).not.toBe(sw);
    writeFileSync(swPath, changed);

    await page.reload();
    const note = page.getByText('A new version of the book is ready.');
    await expect(note).toBeVisible({ timeout: 30_000 });
    await expect(page).toHaveTitle(/^(?!.*v2)/);

    await page.getByRole('button', { name: 'Update now' }).click();
    await expect(note).toHaveCount(0, { timeout: 30_000 });
    await expect.poll(() => page.evaluate(() => fetch('./index.html').then((r) => r.text()).then((t) => t.includes('v2')))).toBe(true);
  } finally {
    await context.close();
    await server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('printing a unit shows every formula and none of the interface', async ({ page }) => {
  await page.goto('/#/book/physics/XI/1');
  await expect(page.locator('main .row').first()).toBeVisible();
  const virtualRows = await page.locator('main .row').count();
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect.poll(() => page.locator('main .row').count()).toBeGreaterThan(virtualRows);
  // Unit 2 of Physics XI has 225 formulas in the manifest.
  expect(await page.locator('main .row').count()).toBe(225);
  await expect(page.locator('.rail, .dock').first()).toBeHidden();
  const pdf = await page.pdf({ format: 'A4' });
  expect(pdf.length).toBeGreaterThan(10_000);
});

test('the same build works from a sub-path, as on GitHub Pages, including offline', async ({ browser }) => {
  const dir = mkdtempSync(join(tmpdir(), 'isc-subpath-'));
  cpSync('dist', join(dir, 'isc-formulas'), { recursive: true });
  const server = await serveStatic(dir);
  const context = await browser.newContext();
  const page = await context.newPage();
  const problems = watchProblems(page);
  try {
    await page.goto(`${server.url}isc-formulas/`);
    await expect(page.locator('main h1')).toBeVisible();
    await waitForServiceWorker(page);
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(scope).toBe(`${server.url}isc-formulas/`);

    await context.setOffline(true);
    await page.reload();
    await page.evaluate(() => {
      location.hash = '#/book/physics/XI/1';
    });
    await expect(page.locator('main .katex').first()).toBeVisible();
    await page.evaluate(() => {
      location.hash = '#/tools/java';
    });
    await expect(page.locator('.code-pane')).toBeVisible();
    expect(problems).toEqual([]);
  } finally {
    await context.close();
    await server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
