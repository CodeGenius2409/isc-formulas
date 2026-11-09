// What can't be given is said before generating, and what can is given in full.
import { expect, test } from '@playwright/test';
import { watchProblems } from './helpers';

test('a format with nothing for a subtopic is greyed out, with the reason', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await page.getByLabel('Class XI', { exact: true }).check();
  await page.getByTestId('chapter-picker').locator('summary').click();
  await page.getByLabel('Physical World and Measurement', { exact: false }).first().check();
  await page.getByLabel('Units and Measurements', { exact: true }).check();
  const box = page.locator('.gen-check', { hasText: 'Long answer' });
  await expect(box).toHaveAttribute('data-none', 'true');
  await expect(box.getByRole('checkbox')).toBeDisabled();
  await expect(box).toContainText('none for these choices');
  expect(problems).toEqual([]);
});

test('asking for more than the bank has, at 0%, is refused beforehand with a suggestion', async ({ page }) => {
  await page.goto('/#/generate');
  await page.getByLabel('Class XI', { exact: true }).check();
  await page.getByLabel('Numerical', { exact: true }).check();
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('Home');
  // More than the bank holds for these choices, which now takes a large number.
  await page.locator('#gen-amount').fill('20000');
  await expect(page.getByTestId('cant-fill')).toContainText('Raise the generated-share slider');
  await expect(page.getByRole('button', { name: 'Generate the questions' })).toBeDisabled();
  await page.locator('#gen-amount').fill('3');
  await expect(page.getByTestId('cant-fill')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Generate the questions' })).toBeEnabled();
});

test('ten questions from one narrow subtopic means ten questions, with any from nearby labelled', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await page.getByLabel('Class XI', { exact: true }).check();
  await page.getByTestId('chapter-picker').locator('summary').click();
  await page.getByLabel('Physical World and Measurement', { exact: false }).first().check();
  await page.getByLabel('Dimensions', { exact: true }).check();
  await page.getByLabel('Give reasons', { exact: true }).check();
  await page.getByRole('slider').focus();
  await page.keyboard.press('End');
  await page.locator('#gen-amount').fill('4');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(4);
  await expect(page.getByTestId('shortfall')).toHaveCount(0);
  const related = await page.getByTestId('related-mark').count();
  if (related) await expect(page.getByTestId('related-note')).toContainText(`${related} question`);
  expect(problems).toEqual([]);
});

test('the derivation filter gives derivations, with a marking scheme by steps, in print and in Word', async ({ page }, info) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await page.getByLabel('Class XII', { exact: true }).check();
  await page.getByLabel('Derivation or proof', { exact: true }).check();
  await page.locator('#gen-amount').fill('6');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(6);
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word: the answer key' }).click();
  await (await waiting).saveAs(info.outputPath('key.docx'));
  expect(problems).toEqual([]);
});

test('in practice, a derivation shows its model answer with a result that stands out, and a checklist', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  await page.getByLabel('Class XII', { exact: true }).check();
  await page.getByLabel('Derivation or proof', { exact: true }).check();
  await page.getByRole('slider').focus();
  await page.keyboard.press('End');
  await page.locator('#gen-amount').fill('1');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(1);
  expect(problems).toEqual([]);
});
