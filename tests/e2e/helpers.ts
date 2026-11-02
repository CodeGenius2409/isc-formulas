import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, type BrowserContext, type Page } from '@playwright/test';

const GENERATED = 'src/data/generated';

/** Every formula in the book: id and name, read from the generated data. */
export function allFormulas(): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      const o = node as Record<string, unknown>;
      if (typeof o.id === 'string' && typeof o.name === 'string' && typeof o.latex === 'string') seen.set(o.id, o.name);
      else Object.values(o).forEach(walk);
    }
  };
  for (const file of readdirSync(GENERATED)) {
    if (/^(physics|chemistry|mathematics|computerscience)-X/.test(file) || file === 'shared.json') walk(JSON.parse(readFileSync(join(GENERATED, file), 'utf8')));
  }
  return [...seen].map(([id, name]) => ({ id, name }));
}

export interface UnitRoute {
  path: string;
  title: string;
}

export function bookRoutes(): { contents: string[]; units: UnitRoute[] } {
  const manifest = JSON.parse(readFileSync(join(GENERATED, 'manifest.json'), 'utf8')) as { subjects: { id: string; classes: { level: string; units: { name: string }[] }[] }[] };
  const contents: string[] = [];
  const units: UnitRoute[] = [];
  for (const subject of manifest.subjects) {
    for (const cls of subject.classes) {
      contents.push(`book/${subject.id}/${cls.level}`);
      cls.units.forEach((unit, i) => units.push({ path: `book/${subject.id}/${cls.level}/${i}`, title: unit.name.replace(/^\d+\.\s*/, '') }));
    }
  }
  return { contents, units };
}

export function simulatorIds(): string[] {
  const source = readFileSync('src/sims/registry.ts', 'utf8');
  return [...source.matchAll(/\{ id: '([a-z0-9]+)', title:/g)].map((m) => m[1]);
}

/** Collects console errors, page errors, failed requests and off-site requests. */
export function watchProblems(page: Page, origin = 'http://localhost'): string[] {
  const problems: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text().slice(0, 300)}`);
  });
  page.on('pageerror', (e) => problems.push(`page error: ${String(e).slice(0, 300)}`));
  page.on('requestfailed', (r) => problems.push(`request failed: ${r.url()} ${r.failure()?.errorText ?? ''}`));
  page.on('request', (r) => {
    const url = r.url();
    if (!url.startsWith(origin) && !url.startsWith('data:') && !url.startsWith('blob:')) problems.push(`off-site request: ${url}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  return problems;
}

export async function setTheme(context: BrowserContext, theme: 'paper' | 'board'): Promise<void> {
  await context.addInitScript((t) => {
    try {
      localStorage.setItem('isc-theme', t);
    } catch {
      // Storage may be blocked. The app copes, and so does this test.
    }
  }, theme);
}

/** Opens a route and waits until its page has really drawn. */
export async function openRoute(page: Page, route: string): Promise<void> {
  await page.evaluate((r) => {
    location.hash = `#/${r}`;
  }, route);
  await expect(page.locator('main h1, main h2').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('Opening', { exact: true })).toHaveCount(0, { timeout: 20_000 });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

export async function waitForServiceWorker(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (worker && worker.state !== 'activated') {
      await new Promise<void>((done) => worker.addEventListener('statechange', () => worker.state === 'activated' && done()));
    }
  });
}
