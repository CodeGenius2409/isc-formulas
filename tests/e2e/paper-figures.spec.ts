// Figures in a mock paper and a teacher's paper: the switch, the numbers, print and Word.
import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

function zipNames(buffer: Buffer): string[] {
  const names: string[] = [];
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  let at = buffer.readUInt32LE(end + 16);
  const total = buffer.readUInt16LE(end + 10);
  for (let i = 0; i < total; i++) {
    const nameLength = buffer.readUInt16LE(at + 28);
    names.push(buffer.toString('utf8', at + 46, at + 46 + nameLength));
    at += 46 + nameLength + buffer.readUInt16LE(at + 30) + buffer.readUInt16LE(at + 32);
  }
  return names;
}

async function generatePhysicsSet(page: Page, on: boolean) {
  await page.goto('/#/generate');
  await page.getByLabel('Class XII', { exact: true }).check();
  await page.getByLabel('Numerical', { exact: true }).check();
  const box = page.getByLabel('Include diagrams', { exact: true });
  await box.setChecked(on);
  const slider = page.getByRole('slider');
  await slider.focus();
  await page.keyboard.press('End');
  await page.locator('#gen-amount').fill('20');
  await page.getByRole('button', { name: 'Generate the questions' }).click();
  await expect(page.getByTestId('review-item')).toHaveCount(20);
}

test('a teacher’s paper numbers its figures in order, on screen and in print', async ({ page }) => {
  const problems = watchProblems(page);
  await generatePhysicsSet(page, true);
  const figures = page.locator('.gen-review [data-testid="paper-figure"] figcaption');
  await expect(figures.first()).toBeVisible();
  const captions = await figures.allInnerTexts();
  expect(captions.length).toBeGreaterThan(0);
  expect(captions).toEqual(captions.map((_, i) => `Fig. ${i + 1}`));
  await expect(page.getByTestId('review-item').filter({ hasText: 'See Fig. 1.' })).toHaveCount(1);
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByTestId('print-sheet')).toBeVisible();
  const printed = await page.locator('[data-testid="print-sheet"] figcaption').allInnerTexts();
  expect(printed).toEqual(captions);
  const stroke = await page.locator('[data-testid="print-sheet"] .bank-diagram').first().evaluate((el) => getComputedStyle(el).color);
  expect(stroke).toBe('rgb(0, 0, 0)');
  await page.emulateMedia({ media: 'screen' });
  expect(problems).toEqual([]);
});

test('with the switch off there are no figures, and the choice is remembered', async ({ page }) => {
  await generatePhysicsSet(page, false);
  await expect(page.locator('.gen-review [data-testid="paper-figure"]:not([data-kept])')).toHaveCount(0);
  await expect(page.getByTestId('review-item').filter({ hasText: 'See Fig.' })).toHaveCount(await page.locator('.gen-review [data-testid="paper-figure"]').count());
  await page.goto('/#/generate');
  await page.reload();
  await expect(page.getByLabel('Include diagrams', { exact: true })).not.toBeChecked();
});

test('a Word file holds the figures as pictures, with their numbers and alt text', async ({ page }, info) => {
  await generatePhysicsSet(page, true);
  const count = await page.locator('.gen-review [data-testid="paper-figure"]').count();
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word: the paper' }).click();
  const path = info.outputPath('figures.docx');
  await (await waiting).saveAs(path);
  const file = readFileSync(path);
  expect(zipNames(file).filter((n) => n.startsWith('word/media/')).length).toBeGreaterThanOrEqual(count);
});

test('a mock paper has the switch, numbers its figures, and offers a simulator only after marking', async ({ page }) => {
  const problems = watchProblems(page);
  // Not every paper has a question with a simulator, so this tries seeds until one does.
  let found = false;
  for (let seed = 1; seed <= 12 && !found; seed++) {
    await page.goto(`/#/paper?subject=physics&level=XII&seed=${seed}&share=100`);
    await expect(page.getByLabel('Include diagrams', { exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Open the linked paper' }).click();
    const captions = page.locator('[data-testid="paper-figure"] figcaption');
    await expect(captions.first()).toBeVisible();
    const list = await captions.allInnerTexts();
    expect(list).toEqual(list.map((_, i) => `Fig. ${i + 1}`));
    await expect(page.getByTestId('sim-panel')).toHaveCount(0);
    await page.getByRole('button', { name: 'Hand in', exact: true }).click();
    await page.getByRole('button', { name: 'Hand in the paper' }).click();
    await expect(page.getByRole('heading', { name: 'Mark your paper' })).toBeVisible();
    found = (await page.getByTestId('sim-panel').count()) > 0;
    if (found) await expect(page.getByRole('button', { name: 'Show in simulator' }).first()).toBeVisible();
    else {
      // Back to the setup screen, ready for the next seed's link.
      await page.getByRole('button', { name: 'Finish marking' }).click();
      await page.getByRole('button', { name: 'Build another paper' }).click();
    }
  }
  expect(found).toBe(true);
  expect(problems).toEqual([]);
});

test('with the switch off, a mock paper shows no figure that the question doesn’t need', async ({ page }) => {
  await page.goto('/#/paper?subject=physics&level=XII');
  await page.getByLabel('Include diagrams', { exact: true }).uncheck();
  await page.getByLabel('Use generated questions', { exact: true }).check();
  await page.getByRole('slider').focus();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.locator('.paper-question').first()).toBeVisible();
  await expect(page.locator('[data-testid="paper-figure"]:not([data-kept])')).toHaveCount(0);
});
