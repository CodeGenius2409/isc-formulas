// Structures with lone pairs: drawn from data, in the theme's ink, described in words, enlargeable, offline.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openRoute, setTheme, waitForServiceWorker, watchProblems } from './helpers';

test('a shape entry draws its structure, with lone pairs, and says what it is', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/f/c-xi-4-108');
  const svg = page.locator('svg.lewis').first();
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute('aria-label', 'Water, H₂O, bent, two lone pairs on oxygen');
  // Two lone pairs are four dots, and the labels are real text.
  await expect(svg.locator('circle')).toHaveCount(4);
  await expect(svg.locator('.lewis-atom')).toHaveText(['O', 'H', 'H']);
  expect(problems).toEqual([]);
});

test('functional groups stay skeletal, with no lone pairs', async ({ page }) => {
  await page.goto('/#/f/c-xi-10-20');
  const first = page.locator('svg.lewis').first();
  await expect(first).toBeVisible();
  await expect(page.locator('svg.lewis circle')).toHaveCount(0);
});

test('the lone pair that matters is picked out, in amines and donors', async ({ page }) => {
  await page.goto('/#/f/c-xii-9-9');
  await expect(page.locator('svg.lewis .lewis-point circle').first()).toBeVisible();
  await page.goto('/#/f/c-xii-6-96');
  await expect(page.locator('svg.lewis').first()).toHaveAttribute('aria-label', /monodentate, donating through nitrogen/);
});

test('resonance forms are drawn with an arrow between them, and open larger', async ({ page }) => {
  await page.goto('/#/f/c-xi-4-154');
  await expect(page.locator('svg.lewis')).toHaveCount(3);
  await expect(page.locator('.lewis-forms .scheme-arrow').first()).toBeVisible();
  await page.getByRole('button', { name: /Enlarge Carbonate ion/ }).click();
  const dialog = page.locator('dialog.molecule-zoom');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toHaveText('Carbonate ion');
  await expect(dialog).toContainText('trigonal planar');
  const small = await page.locator('.row-structure svg.lewis, .structures svg.lewis').first().boundingBox();
  const large = await dialog.locator('svg.lewis').first().boundingBox();
  expect(large!.width).toBeGreaterThan(small!.width * 0.9);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('a complex shows its bracket and charge once', async ({ page }) => {
  await page.goto('/#/f/c-xii-6-138');
  const svg = page.locator('svg.lewis').first();
  await expect(svg).toHaveAttribute('aria-label', /Hexaamminecobalt\(III\) ion, \[Co\(NH₃\)₆\]³⁺, octahedral/);
  await expect(svg.locator('.lewis-charge')).toHaveText(['3+']);
});

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: drawn in the theme's ink, in a unit list, and passes axe`, async ({ browser }, info) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    const problems = watchProblems(page);
    await page.goto('/#/f/c-xi-4-110');
    const svg = page.locator('svg.lewis').first();
    await expect(svg).toBeVisible();
    const match = await svg.evaluate((el) => {
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
      const probe = document.createElement('i');
      probe.style.color = ink;
      document.body.append(probe);
      const inkRgb = getComputedStyle(probe).color;
      probe.remove();
      return getComputedStyle(el).color === inkRgb;
    });
    expect(match).toBe(true);
    await page.screenshot({ path: info.outputPath(`lewis-${theme}.png`) });
    const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.toast').analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    expect(problems).toEqual([]);
    await context.close();
  });
}

for (const { width, height } of [{ width: 375, height: 780 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
  test(`${width}px: a unit full of structures fits, with no errors`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const problems = watchProblems(page);
    await page.goto('/#/book/chemistry/XI/3?s=8');
    await expect(page.locator('svg.lewis').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.evaluate(() => document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth)).toBe(true);
    expect(problems).toEqual([]);
    await context.close();
  });
}

test('structures with lone pairs work with no connection', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await openRoute(page, 'f/c-xii-6-135');
  await expect(page.locator('svg.lewis').first()).toBeVisible();
  await context.setOffline(false);
});

test('a practice question shows the structure once it is marked', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/chemistry/XI/3?work=practice');
  const work = page.locator('.work');
  let seen = false;
  for (let tries = 0; tries < 12 && !seen; tries++) {
    await page.getByRole('button', { name: 'Practise this unit' }).click();
    await expect(work.getByRole('button', { name: 'End session' })).toBeVisible();
    for (let i = 0; i < 10 && !seen; i++) {
      if (await work.locator('.choice').count()) await work.locator('.choice').first().click();
      else break;
      seen = (await work.locator('svg.lewis').count()) > 0;
      if (!seen) await work.getByRole('button', { name: 'Next question' }).click();
    }
    if (!seen && (await work.getByRole('button', { name: 'End session' }).count())) await work.getByRole('button', { name: 'End session' }).click();
    else if (!seen && (await work.getByRole('button', { name: 'Done' }).count())) await work.getByRole('button', { name: 'Done' }).click();
  }
  expect(seen).toBe(true);
});
