// Load once, go offline, reload, and confirm that everything still works.
import { expect, test } from '@playwright/test';
import { allFormulas, bookRoutes, openRoute, simulatorIds, waitForServiceWorker, watchProblems } from './helpers';

test.describe.configure({ mode: 'serial' });

test('every page and simulator works with no connection', async ({ page, context }) => {
  test.setTimeout(600_000);
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.getByText('Everything in the book still works.')).toBeVisible();

  const { contents, units } = bookRoutes();
  for (const route of ['find', 'saved', 'practice', 'settings', 'tools', ...contents]) await openRoute(page, route);

  for (const { path, title } of units) {
    await openRoute(page, path);
    await expect(page.locator('main h1').first(), path).toContainText(title);
    await expect(page.locator('main .row').first(), path).toBeVisible();
    await expect(page.locator('main .katex, main .body-expr').first(), `${path}: formula drawn`).toBeVisible();
  }

  const sims = simulatorIds();
  expect(sims.length).toBe(41);
  for (const id of sims) {
    await openRoute(page, `tools/${id}`);
    await expect(page.locator('main h1').first(), id).not.toContainText('No tool');
    const body = await page.locator('main').innerText();
    expect(body.length, `${id} has content`).toBeGreaterThan(60);
  }
  expect(problems).toEqual([]);
});

test('search, the solver and practice work with no connection', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await expect(page.locator('main h1')).toBeVisible();

  // Search runs in a worker, whose code must also be in the cache.
  await page.keyboard.press('/');
  await page.getByRole('combobox', { name: 'Find a formula' }).fill('escape velocty');
  await expect(page.getByRole('listbox', { name: 'Results' }).getByRole('option').first()).toContainText(/escape/i);
  await page.keyboard.press('Escape');

  // The solver needs the maths engine, which loads lazily.
  await openRoute(page, 'f/p-xi-2-7');
  await page.goto('/#/?work=solve&wf=p-xi-2-7');
  await expect(page.locator('form button[type="submit"]')).toBeVisible();

  expect(problems).toEqual([]);
});

test('every formula opens and typesets with no connection', async ({ page, context }) => {
  test.setTimeout(1_500_000);
  const formulas = allFormulas();
  expect(formulas.length).toBe(7828);
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await expect(page.locator('main h1')).toBeVisible();

  const failures = await page.evaluate(async (list) => {
    const failed: string[] = [];
    const pause = () => new Promise((done) => setTimeout(done, 0));
    for (const { id, name } of list) {
      location.hash = `#/f/${id}`;
      const opened = () => document.querySelector(`main [data-formula="${CSS.escape(id)}"]`);
      // Wait for this formula's own page, with its maths typeset.
      for (let tries = 0; tries < 2000 && !opened()?.querySelector('.big-formula .katex, .big-formula .katex-error, .big-formula .body-expr'); tries++) await pause();
      const page = opened();
      if (!page) failed.push(`${id}: its page did not open`);
      else if (!page.querySelector('h1')?.textContent?.includes(name.trim())) failed.push(`${id}: heading "${page.querySelector('h1')?.textContent}" instead of "${name}"`);
      else if (page.querySelector('.big-formula .katex-error')) failed.push(`${id}: KaTeX could not typeset it`);
      else if (!page.querySelector('.big-formula .katex, .big-formula .body-expr')) failed.push(`${id}: nothing shown`);
    }
    return failed;
  }, formulas);

  expect(failures, `${failures.length} formulas failed`).toEqual([]);
  expect(problems).toEqual([]);
});
