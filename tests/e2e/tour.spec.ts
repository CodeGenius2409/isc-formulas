// The first-visit tour and the one-time tips. Under automation the tour opens only when a test asks, so the other
// browser tests aren't covered by it; these ask, with isc-tour-test.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { openRoute, waitForServiceWorker, watchProblems } from './helpers';

async function allowTour(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    try {
      localStorage.setItem('isc-tour-test', 'on');
    } catch {
      // Storage may be blocked; the tour copes, and so does this.
    }
  });
}

const tour = (page: Page) => page.locator('.tour');
const next = (page: Page) => tour(page).getByRole('button', { name: /^(Next|Done)$/ });

async function walk(page: Page): Promise<string[]> {
  const titles: string[] = [];
  for (let i = 0; i < 10 && (await tour(page).count()); i++) {
    await expect(tour(page).locator('h2')).toBeFocused();
    titles.push((await tour(page).locator('h2').innerText()).trim());
    await next(page).click();
  }
  return titles;
}

test('a student takes the whole tour, and it doesn’t open again', async ({ page, context }) => {
  await allowTour(context);
  const problems = watchProblems(page);
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: 'A quick look round' })).toBeVisible({ timeout: 15_000 });
  await expect(tour(page).locator('h2')).toBeFocused();
  await tour(page).getByRole('button', { name: 'I’m a student' }).click();
  const titles = await walk(page);
  expect(titles).toEqual(['The book', 'Find', 'Solve with this', 'Practice', 'Mock papers', 'Simulators and tracers', 'Your own formulas']);
  await expect(tour(page)).toHaveCount(0);
  await expect(page.locator('[data-tour-target]')).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(2500);
  await expect(tour(page)).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('a teacher sees the generator, its sets and Word export first', async ({ page, context }) => {
  await allowTour(context);
  await page.goto('/');
  await tour(page).getByRole('button', { name: 'I’m a teacher' }).click({ timeout: 15_000 });
  await expect(tour(page).locator('h2')).toHaveText('Generate questions');
  await expect(tour(page)).toContainText('Sets A, B and C');
  await expect(tour(page)).toContainText('Word');
  await expect(page).toHaveURL(/#\/generate$/);
  expect(await walk(page)).toHaveLength(6);
});

test('Skip tour ends it at once, leaves you where you were, and it stays ended', async ({ page, context }) => {
  await allowTour(context);
  await page.goto('/#/saved');
  await tour(page).getByRole('button', { name: 'I’m a student' }).click({ timeout: 15_000 });
  await next(page).click();
  await tour(page).getByRole('button', { name: 'Skip tour' }).click();
  await expect(tour(page)).toHaveCount(0);
  await expect(page).toHaveURL(/#\/saved$/);
  await page.reload();
  await page.waitForTimeout(2500);
  await expect(tour(page)).toHaveCount(0);
});

test('Escape skips it from the keyboard, and the keyboard moves it on without any movement', async ({ page, context }) => {
  await allowTour(context);
  await page.goto('/');
  await expect(tour(page).locator('h2')).toBeFocused({ timeout: 15_000 });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(tour(page).locator('h2')).toHaveText('The book');
  await expect(tour(page)).toHaveAttribute('data-instant');
  await expect(tour(page).locator('h2')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(tour(page)).toHaveCount(0);
});

test('it restarts from the ? on Today and from Settings', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Take the tour' }).click();
  await expect(page.getByRole('dialog', { name: 'A quick look round' })).toBeVisible();
  await tour(page).getByRole('button', { name: 'Skip tour' }).click();

  await openRoute(page, 'settings');
  await page.getByRole('button', { name: 'Take the tour again' }).click();
  await expect(page.getByRole('dialog', { name: 'A quick look round' })).toBeVisible();
  await tour(page).getByRole('button', { name: 'I’m a student' }).click();
  await expect(tour(page).locator('h2')).toHaveText('The book');
});

for (const { width, height } of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  test(`${width}px: every step fits the screen and points at something on it`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1440, reducedMotion: 'reduce' });
    await allowTour(context);
    const page = await context.newPage();
    await page.goto('/');
    await tour(page).getByRole('button', { name: 'I’m a student' }).click({ timeout: 15_000 });
    for (let i = 0; i < 7; i++) {
      const target = page.locator('[data-tour-target]');
      await expect(target, `step ${i + 1} has a target`).toHaveCount(1);
      const box = (await tour(page).boundingBox())!;
      const marked = (await target.boundingBox())!;
      expect(box.x, `step ${i + 1}`).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
      expect(marked.y + marked.height, `step ${i + 1}'s target is on screen`).toBeLessThanOrEqual(height + 1);
      // The note never covers what it points at.
      const overlaps = box.x < marked.x + marked.width && marked.x < box.x + box.width && box.y < marked.y + marked.height && marked.y < box.y + box.height;
      expect(overlaps, `step ${i + 1} covers its target`).toBe(false);
      if (width === 375 && i === 0) {
        await expect(target).toHaveClass(/dock-item/);
        expect(box.y + box.height).toBeLessThanOrEqual(marked.y);
      }
      await next(page).click();
    }
    await expect(tour(page)).toHaveCount(0);
    await context.close();
  });
}

test('the tour passes axe, in both themes', async ({ browser }) => {
  for (const theme of ['paper', 'board']) {
    const context = await browser.newContext();
    await allowTour(context);
    await context.addInitScript((t) => localStorage.setItem('isc-theme', t), theme);
    const page = await context.newPage();
    await page.goto('/');
    await tour(page).getByRole('button', { name: 'I’m a student' }).click({ timeout: 15_000 });
    const { violations } = await new AxeBuilder({ page }).include('.tour').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${theme} ${v.id}`)).toEqual([]);
    await context.close();
  }
});

test('the tour works offline', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await allowTour(context);
  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await page.getByRole('button', { name: 'Take the tour' }).click();
  await tour(page).getByRole('button', { name: 'I’m a student' }).click();
  expect(await walk(page)).toHaveLength(7);
  expect(problems).toEqual([]);
  await context.setOffline(false);
});

test('a tip shows the first time a tool opens, goes when dismissed, and comes back from Settings', async ({ page }) => {
  await page.goto('/#/tools/plotter');
  const tip = page.getByTestId('tip-plotter');
  await expect(tip).toBeVisible();
  await tip.getByRole('button', { name: 'Got it' }).click();
  await expect(tip).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Graph plotter' })).toBeVisible();
  await expect(tip).toHaveCount(0);

  await openRoute(page, 'settings');
  await page.getByRole('listitem').filter({ hasText: 'The graph plotter' }).getByRole('button', { name: 'Show it again' }).click();
  await openRoute(page, 'tools/plotter');
  await expect(tip).toBeVisible();

  await openRoute(page, 'generate');
  await expect(page.getByTestId('tip-generator')).toBeVisible();
  await page.goto('/#/f/p-xi-2-7?work=solve&wf=p-xi-2-7');
  await expect(page.getByTestId('tip-solver')).toBeVisible();
});
