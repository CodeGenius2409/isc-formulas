// A question from an unreviewed blueprint says so, on screen and in print, and "Only reviewed questions" is there,
// off by default, on the mock paper screen and in the teacher's generator.
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

const setShare = (page: Page, value: number) => page.getByTestId('share-slider').locator('input[type="range"]').evaluate((el, v) => {
  const input = el as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  setter.call(input, String(v));
  input.dispatchEvent(new Event('input', { bubbles: true }));
}, value);

test('a mock paper: the option is off by default, and an unreviewed question is marked on screen and in print', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/paper');
  await page.locator('#paper-subject').selectOption('physics');
  await page.locator('#paper-class').selectOption('XII');
  await page.getByLabel('Use generated questions').check();
  const only = page.getByLabel('Only reviewed questions');
  await expect(only).not.toBeChecked();
  await setShare(page, 50);
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.getByRole('heading', { name: /Physics XII, 70 marks/ })).toBeVisible();
  // The paper is kept on this device. Marking one of its generated questions as unreviewed shows how it looks.
  await page.evaluate(() => {
    const paper = JSON.parse(localStorage.getItem('isc-paper-current')!);
    const q = paper.sections.flatMap((s: { questions: { item: { generated?: { unreviewed?: boolean } } }[] }) => s.questions).find((x: { item: { generated?: object } }) => x.item.generated);
    q.item.generated.unreviewed = true;
    localStorage.setItem('isc-paper-current', JSON.stringify(paper));
  });
  await page.reload();
  const mark = page.getByTestId('unreviewed-mark').first();
  await expect(mark).toContainText('Not yet reviewed');
  await expect(page.getByTestId('paper-legend')).toContainText('Not yet reviewed');
  await page.emulateMedia({ media: 'print' });
  await expect(mark).toBeVisible();
  await expect(page.getByTestId('paper-legend')).toBeVisible();
  expect(problems).toEqual([]);
});

test('a mock paper with only reviewed questions has none marked unreviewed, and remembers the choice', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/paper');
  await page.getByLabel('Use generated questions').check();
  await page.getByLabel('Only reviewed questions').check();
  await page.reload();
  await expect(page.getByLabel('Only reviewed questions')).toBeChecked();
  await page.locator('#paper-subject').selectOption('chemistry');
  await page.locator('#paper-class').selectOption('XII');
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.getByRole('heading', { name: /Chemistry XII, 70 marks/ })).toBeVisible();
  // Unreviewed ones only fill a place nothing reviewed can, and then the paper says so.
  if ((await page.getByTestId('review-note').count()) === 0) await expect(page.getByTestId('unreviewed-mark')).toHaveCount(0);
  else await expect(page.getByTestId('review-note')).toContainText('not yet reviewed');
  expect(problems).toEqual([]);
});

test('the teacher’s generator has "Only reviewed questions", off by default', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('/#/generate');
  const only = page.getByLabel('Only reviewed questions');
  await expect(only).not.toBeChecked();
  await only.check();
  await page.reload();
  await expect(page.getByLabel('Only reviewed questions')).toBeChecked();
  expect(problems).toEqual([]);
});
