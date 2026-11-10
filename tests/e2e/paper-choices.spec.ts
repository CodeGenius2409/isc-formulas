// Internal choices, as the real papers set them: "OR" beside a question in mock papers and in the teacher's printed papers.
import { expect, test } from '@playwright/test';
import { watchProblems } from './helpers';

test('a mock paper offers internal choices, and only the one answered is marked', async ({ page }) => {
  test.setTimeout(120_000);
  const problems = watchProblems(page);
  await page.goto('/#/paper');
  await page.locator('#paper-subject').selectOption('physics');
  await page.locator('#paper-class').selectOption('XII');
  await expect(page.getByText('Two have an internal choice.').first()).toBeVisible();
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.getByRole('timer')).toBeVisible();

  // Two each in Sections B, C and D, and the question count stays as the real one.
  await expect(page.getByTestId('paper-or')).toHaveCount(6);
  await expect(page.locator('section[aria-label="Section A"]').getByTestId('paper-or')).toHaveCount(0);
  await expect(page.locator('section[aria-label="Section D"]').getByTestId('paper-or')).toHaveCount(2);
  await expect(page.locator('.paper-question')).toHaveCount(33);
  await expect(page.locator('.paper-alternative')).toHaveCount(6);

  // Choosing the alternative survives a reload, as a paper in progress does.
  const firstChoice = page.getByTestId('paper-or').first();
  await firstChoice.getByRole('checkbox').check();
  await page.reload();
  await expect(page.getByTestId('paper-or').first().getByRole('checkbox')).toBeChecked();

  await page.getByRole('button', { name: 'Hand in', exact: true }).click();
  await page.getByRole('button', { name: 'Hand in the paper' }).click();
  await expect(page.getByTestId('paper-or').first()).toContainText('You answered the alternative');
  await expect(page.getByTestId('paper-or').nth(1)).toContainText('You answered the first');
  // Once marked, one of each pair stays to be marked. The other is only there to read.
  await expect(page.locator('.paper-alternative details')).toHaveCount(6);
  await expect(page.getByText('of 70 so far').or(page.getByText('so far'))).toBeVisible();
  expect(problems).toEqual([]);
});

test('a teacher’s full paper prints its internal choices, and the key answers both', async ({ page }) => {
  test.setTimeout(120_000);
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await page.getByRole('button', { name: /Full paper/i }).click();
  await page.locator('main').getByRole('button', { name: /^Generate/ }).last().click();
  await expect(page.getByTestId('review-item').first()).toBeVisible({ timeout: 60_000 });
  const choices = page.getByTestId('review-or');
  await expect(choices.first()).toBeVisible();
  const before = await choices.count();
  expect(before).toBeGreaterThanOrEqual(1);
  await expect(page.getByTestId('print-or').first()).toBeAttached();
  await expect(page.getByTestId('print-alternative')).toHaveCount(before);
  // A teacher can take a choice away.
  await choices.first().getByRole('button', { name: 'Remove this choice' }).click();
  await expect(choices).toHaveCount(before - 1);
  expect(problems).toEqual([]);
});
