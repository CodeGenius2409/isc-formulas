// The official syllabus wording on each unit, and what happens to saved formulas that left the book.
import { expect, test } from '@playwright/test';
import { openRoute, watchProblems } from './helpers';

test('a unit shows the official wording when asked, from the right unit', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/');
  await openRoute(page, 'book/physics/XI/1');
  await expect(page.locator('main h1')).toContainText('Kinematics');
  const note = page.locator('.syllabus-note');
  await expect(note.locator('.syllabus-body')).toHaveCount(0);
  await note.locator('summary').click();
  await expect(note.locator('.syllabus-body')).toContainText('Motion in a straight line');
  await expect(note.locator('.syllabus-source')).toContainText('2028');
  expect(problems).toEqual([]);
});

test('every class opens on official unit names, in official order', async ({ page }) => {
  await page.goto('/');
  await openRoute(page, 'book/chemistry/XI');
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/States of Matter/);
  expect(text).toMatch(/Some Basic Concepts of Chemistry/);
});

test('a saved formula that left the syllabus is dropped, with a note, and the rest survive', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('isc-favs', JSON.stringify(['c-xi-5-4', 'p-xi-2-4'])));
  await page.goto('/');
  await openRoute(page, 'saved');
  await expect(page.locator('main')).toContainText('1 saved');
  await expect(page.locator('main')).toContainText('no longer in the book');
  await openRoute(page, 'f/c-xi-5-4');
  await expect(page.locator('main h1')).toContainText('left the book');
});

test('Computer Science is written as Java, with no fractions anywhere it appears', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/');
  await openRoute(page, 'book/computerscience/XI/6');
  await page.locator('main .row').first().waitFor();
  await expect(page.locator('main .row .java-code').first()).toBeVisible();
  await expect(page.locator('main .katex .mfrac')).toHaveCount(0);

  // Its own page, with the right copy label.
  await openRoute(page, 'f/cs-xi-7-24');
  await expect(page.locator('.big-formula .java-code')).toContainText('9.0 / 5 * c + 32');
  await expect(page.locator('.big-formula .tok-number').first()).toBeVisible();
  await expect(page.locator('main')).toContainText('9 / 5 with ints is 1');
  await expect(page.getByRole('button', { name: 'Copy', exact: true })).toBeVisible();

  // Search results.
  await page.keyboard.press('/');
  await page.locator('.palette-input input').fill('Math.pow');
  await expect(page.locator('.palette-row .java-code').first()).toBeVisible();
  await page.keyboard.press('Escape');

  // Boolean notation stays typeset, with the Java beside it.
  await openRoute(page, 'f/cs-xi-1-13');
  await expect(page.locator('.big-formula .katex').first()).toBeVisible();
  await expect(page.locator('.big-formula .java-code')).toContainText('!(a || b)');
  expect(problems).toEqual([]);
});

test('the same entry keeps its fraction in Mathematics', async ({ page }) => {
  await page.goto('/#/f/m-xi-2-15b');
  await expect(page.locator('.big-formula .katex .mfrac').first()).toBeVisible();
});
