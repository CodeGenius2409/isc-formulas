// A new version is published while an old page is open. The old page's files go away when the new service
// worker takes over, and it must never run a mix of the two.
import { copyFileSync, cpSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
// @ts-expect-error A plain .mjs helper shared with scripts/lighthouse.mjs.
import { serveStatic } from '../../scripts/lib/static-server.mjs';
import { waitForServiceWorker, watchProblems } from './helpers';

const NEW = 'n3w';

/** Publishes a new version: every code file gets a new name, as a real build's changed hashes would, and the old ones are gone. */
function publishNewVersion(dir: string): void {
  const assets = join(dir, 'assets');
  const names = readdirSync(assets).filter((name) => /\.(js|css)$/.test(name));
  const textFiles = [...names.map((name) => join(assets, name)), join(dir, 'index.html'), join(dir, 'sw.js')];
  for (const file of textFiles) {
    let text = readFileSync(file, 'utf8');
    for (const name of names) text = text.split(name).join(`${NEW}${name}`);
    if (file.endsWith('sw.js')) text = text.replace(/url:"index\.html",revision:"[^"]+"/, `url:"index.html",revision:"${NEW}"`);
    writeFileSync(file, text);
  }
  for (const name of names) renameSync(join(assets, name), join(assets, `${NEW}${name}`));
}

test('another tab presses Update now: an open page moves whole to the new version, and keeps what was typed', async ({ browser }) => {
  test.setTimeout(180_000);
  const dir = mkdtempSync(join(tmpdir(), 'isc-mix-'));
  cpSync('dist', dir, { recursive: true });
  const server = await serveStatic(dir);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const openPage = await context.newPage();
  const otherTab = await context.newPage();
  try {
    for (const tab of [openPage, otherTab]) {
      await tab.goto(server.url);
      await waitForServiceWorker(tab);
      await tab.reload();
    }
    await openPage.goto(`${server.url}#/mine/new?subject=chemistry&level=XII&unit=8`);
    await openPage.getByLabel('Name', { exact: true }).fill('Written before the update');
    await expect(openPage.getByRole('heading', { name: 'Structure', exact: true })).toBeVisible();
    const requested: string[] = [];
    openPage.on('response', (r) => {
      if (r.url().includes('/assets/') && openPage.url()) requested.push(`${r.status()} ${r.url()}`);
    });

    publishNewVersion(dir);
    await otherTab.reload();
    await otherTab.getByRole('button', { name: 'Update now' }).click({ timeout: 30_000 });
    const isNew = (tab: typeof otherTab) => tab.evaluate(() => [...document.scripts].some((s) => s.src.includes('n3w'))).catch(() => false);
    await expect.poll(() => isNew(otherTab), { timeout: 30_000 }).toBe(true);
    await expect.poll(() => isNew(openPage), { timeout: 30_000 }).toBe(true);

    // It came back on the new version, with the draft in place, and everything still loads.
    await expect(openPage.getByLabel('Name', { exact: true })).toHaveValue('Written before the update');
    await expect(openPage.getByRole('heading', { name: 'Structure', exact: true })).toBeVisible();
    await openPage.locator('#custom-mode').selectOption('smiles');
    await openPage.getByLabel('SMILES', { exact: true }).fill('CCO');
    await expect(openPage.getByTestId('smiles-formula')).toHaveText('C2H6O');
    const loaded = requested.filter((r) => r.includes('n3w'));
    expect(loaded.length).toBeGreaterThan(0);
    expect(requested.filter((r) => !r.startsWith('200'))).toEqual([]);
  } finally {
    await context.close();
    await server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a page whose next piece of code has gone explains, offers Retry, and a reload brings everything back', async ({ browser }) => {
  test.setTimeout(180_000);
  const dir = mkdtempSync(join(tmpdir(), 'isc-gone-'));
  cpSync('dist', dir, { recursive: true });
  // With nothing in the browser's own cache, a file taken away is really gone.
  const server = await serveStatic(dir, 0, { noStore: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const assets = join(dir, 'assets');
  const engine = readdirSync(assets).find((name) => name.startsWith('smiles-drawer'))!;
  const spare = join(dir, 'kept.js');
  try {
    await page.goto(server.url);
    await waitForServiceWorker(page);
    await page.reload();
    await page.goto(`${server.url}#/mine/new?subject=chemistry&level=XII&unit=8`);
    await page.getByLabel('Name', { exact: true }).fill('Still here');

    // The drawing engine has gone from the device and from the site, as it does after a deploy.
    copyFileSync(join(assets, engine), spare);
    rmSync(join(assets, engine));
    await page.evaluate(async (name) => {
      for (const key of await caches.keys()) {
        const cache = await caches.open(key);
        for (const request of await cache.keys()) if (request.url.includes(name)) await cache.delete(request);
      }
    }, engine);

    // A tab that missed the update is told about it.
    await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
    await expect(page.getByText('The book was updated in another tab.')).toBeVisible();

    await page.locator('#custom-mode').selectOption('smiles');
    await page.getByLabel('SMILES', { exact: true }).fill('CCO');
    const message = page.getByText("Couldn't load the structure editor. Try again.");
    await expect(message).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Structure', exact: true })).toBeVisible();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Still here');

    await page.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByRole('button', { name: 'Reload the page' })).toBeVisible({ timeout: 30_000 });
    copyFileSync(spare, join(assets, engine));
    await page.getByRole('button', { name: 'Reload the page' }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Still here');
    await expect(page.locator('#custom-mode')).toHaveValue('smiles');
    await expect(page.getByLabel('SMILES', { exact: true })).toHaveValue('CCO');
    await expect(page.getByTestId('smiles-formula')).toHaveText('C2H6O', { timeout: 30_000 });
    await expect(message).toHaveCount(0);
  } finally {
    await context.close();
    await server.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a page that had a brief failure recovers when you come back, without a reload', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let refuse = true;
  await page.route('**/assets/Saved-*', (route) => (refuse ? route.abort() : route.continue()));
  await page.goto('/#/saved');
  await expect(page.getByRole('alert')).toContainText('This page could not open', { timeout: 20_000 });
  await page.getByRole('link', { name: 'Tools' }).click();
  await expect(page.locator('main h1')).toHaveText('Tools');
  refuse = false;
  await page.evaluate(() => {
    location.hash = '#/saved';
  });
  await expect(page.getByRole('heading', { name: 'Saved formulas', exact: true })).toBeVisible({ timeout: 20_000 });
  await context.close();
});

test('a reload keeps a half-written formula, and Cancel throws it away', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/book/physics/XI/1');
  await expect(page.locator('.section-head').first()).toBeVisible();
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
  await page.getByLabel('Name', { exact: true }).fill('Half done');
  await page.reload();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Half done');
  // A second reload still has it: taking it back doesn't use it up early.
  await page.reload();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Half done');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('.section-head').first()).toBeVisible();
  await page.goto('/#/mine/new?subject=chemistry&level=XII&unit=8');
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
  expect(problems).toEqual([]);
});
