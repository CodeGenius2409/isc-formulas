// What you've been shown is remembered on this device, can be reset, and the gap between repeats can be changed.
import { expect, test } from '@playwright/test';
import { watchProblems } from './helpers';

test('a question shown in practice is remembered after a reload, and Reset history forgets it', async ({ page }) => {
  const problems = watchProblems(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XII/5?work=practice');
  await page.locator('.work').getByRole('button', { name: 'Practise this unit' }).click();
  await expect(page.locator('.work').getByText(/of 10/)).toBeVisible();
  await page.goto('/#/settings');
  await page.reload();
  const count = page.getByTestId('fact-count');
  await expect(count).not.toContainText(/^0 facts/);
  await page.getByRole('button', { name: 'Reset history' }).click();
  await page.getByRole('button', { name: 'Keep it' }).click();
  await expect(count).not.toContainText(/^0 facts/);
  await page.getByRole('button', { name: 'Reset history' }).click();
  await page.getByRole('button', { name: 'Yes, reset' }).click();
  await expect(page.getByText('History cleared.')).toBeVisible();
  await expect(count).toHaveText('0 facts are remembered on this device.');
  await page.reload();
  await expect(count).toHaveText('0 facts are remembered on this device.');
  expect(problems).toEqual([]);
});

test('the gap between repeats can be changed, and is kept', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/settings');
  const gap = page.getByLabel('Days before a fact can come back');
  await expect(gap).toHaveValue('7');
  await gap.fill('3');
  await page.reload();
  await expect(page.getByLabel('Days before a fact can come back')).toHaveValue('3');
  expect(problems).toEqual([]);
});

test('the teacher’s generator avoids facts from recent papers by default', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await expect(page.getByLabel('Avoid facts used in my recent papers')).toBeChecked();
  expect(problems).toEqual([]);
});
