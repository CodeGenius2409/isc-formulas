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
