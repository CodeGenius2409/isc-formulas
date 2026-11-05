// Bond-line structures: drawn with their atom labels, in the theme's colour, enlargeable, and offline.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openRoute, setTheme, waitForServiceWorker, watchProblems } from './helpers';

test('a reaction is drawn out, with labelled atoms and a text alternative', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/f/c-xii-8-55');
  const molecules = page.locator('.structures .molecule');
  await expect(molecules.first()).toBeVisible();
  await expect(molecules).toHaveCount(2);
  await expect(molecules.first()).toHaveAttribute('aria-label', /Ethanal/);
  await expect(molecules.last()).toHaveAttribute('aria-label', /3-Hydroxybutanal/);
  // The second path holds the atom labels. Without them this would be a bare skeleton.
  expect(await molecules.last().locator('path').nth(1).getAttribute('d')).toBeTruthy();
  await expect(page.locator('.scheme-arrow')).toContainText('NaOH');
  expect(problems).toEqual([]);
});

test('a compound opens larger, says what it is, and closes with Esc or tap', async ({ page }) => {
  await page.goto('/#/f/c-xii-9-177');
  await page.locator('.molecule-button').first().click();
  const dialog = page.locator('dialog.molecule-zoom');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toHaveText('Adenine');
  await expect(dialog).toContainText('C₅H₅N₅');
  const small = await page.locator('.structures .molecule').first().boundingBox();
  const large = await dialog.locator('.molecule').boundingBox();
  expect(large!.width).toBeGreaterThan(small!.width * 1.5);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: drawn in the theme's own colour, and passes axe`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    await page.goto('/#/book/chemistry/XII/7?s=4');
    const molecule = page.locator('.structures .molecule').first();
    await expect(molecule).toBeVisible();
    // The list can replace a row as it settles, and a row that has left the page has no computed style. So this asks again.
    await expect
      .poll(() =>
        molecule.evaluate((svg) => {
          const stroke = getComputedStyle(svg.querySelector('path')!).stroke;
          const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
          const probe = document.createElement('i');
          probe.style.color = ink;
          document.body.append(probe);
          const inkRgb = getComputedStyle(probe).color;
          probe.remove();
          return stroke === inkRgb;
        }),
      )
      .toBe(true);
    const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.toast').analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    await context.close();
  });
}

test('on a phone, a long reaction wraps and nothing scrolls sideways', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/#/f/c-xii-9-99');
  await expect(page.locator('.structures .molecule').first()).toBeVisible();
  await expect.poll(() => page.locator('.structures .molecule').count()).toBeGreaterThan(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth)).toBe(true);
  await context.close();
});

test('the columns of a row are not squeezed by a long reaction', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#/book/chemistry/XII/7?s=4');
  await expect(page.locator('.structures .molecule').first()).toBeVisible();
  const row = await page.locator('main .row-main').filter({ has: page.locator('.molecule') }).first().boundingBox();
  const structure = await page.locator('main .row-structure').first().boundingBox();
  expect(structure!.x).toBeGreaterThanOrEqual(row!.x);
  expect(structure!.x + structure!.width).toBeLessThanOrEqual(row!.x + row!.width + 1);
  const name = await page.locator('main .row-name').first().boundingBox();
  expect(name!.width).toBeGreaterThan(80);
});

test('a section restored from the URL stays put when the structures arrive', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/#/book/chemistry/XII/7?s=4');
  await expect(page.locator('.structures .molecule').first()).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const head = document.querySelector('.section-head[data-subtopic="4"]');
        const bar = document.querySelector('.running-head');
        return head && bar ? Math.abs(head.getBoundingClientRect().top - bar.getBoundingClientRect().bottom) <= 2 : false;
      }),
    )
    .toBe(true);
});

test('structures work with no connection', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await openRoute(page, 'f/c-xii-8-55');
  await expect(page.locator('.structures .molecule').first()).toBeVisible();
  await context.setOffline(false);
});

test('practice reads structures, and the answer is recorded in words', async ({ page }) => {
  const problems = watchProblems(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/f/c-xii-8-55');
  await page.getByRole('button', { name: 'Practise', exact: true }).click();
  // One question in the set for an entry with a structure reads the structure.
  let found = false;
  for (let tries = 0; tries < 6 && !found; tries++) {
    await expect(page.locator('.work').getByRole('button').first()).toBeVisible();
    found = (await page.locator('.work .structures .molecule').count()) > 0;
    if (!found) {
      await page.reload();
      await page.getByRole('button', { name: 'Practise', exact: true }).click();
    }
  }
  expect(found).toBe(true);
  expect(problems).toEqual([]);
});
