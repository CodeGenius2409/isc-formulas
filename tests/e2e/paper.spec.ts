// Exam-style practice and mock papers: real flows, every width in both themes, keyboard, and offline.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openRoute, setTheme, waitForServiceWorker, watchProblems } from './helpers';

const WIDTHS = [
  { width: 375, height: 780, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 1024, height: 768, touch: true },
  { width: 1440, height: 900, touch: false },
];

async function startPaper(page: import('@playwright/test').Page, subject: string, level: string) {
  await page.goto('/#/paper');
  await page.locator('#paper-subject').selectOption(subject);
  await page.locator('#paper-class').selectOption(level);
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.getByRole('timer')).toBeVisible();
}

test('a mock paper has the real structure, and is marked and broken down by topic', async ({ page }) => {
  test.setTimeout(120_000);
  const problems = watchProblems(page);
  await startPaper(page, 'physics', 'XII');

  // 14, 7, 9 and 3 questions, in four sections.
  await expect(page.locator('.paper-question')).toHaveCount(33);
  await expect(page.getByRole('heading', { name: 'Section D' })).toBeVisible();
  await expect(page.locator('section[aria-label="Section A"] .paper-question')).toHaveCount(14);
  await expect(page.locator('section[aria-label="Section C"] .paper-question')).toHaveCount(9);

  // Answer the first multiple choice question, and hand in.
  const first = page.locator('.paper-question').first();
  await first.locator('.choice').first().click();
  await expect(first.locator('.choice').first()).toHaveAttribute('aria-pressed', 'true');

  // The clock and answers survive a reload.
  await page.reload();
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(page.locator('.paper-question').first().locator('.choice').first()).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Hand in', exact: true }).click();
  await expect(page.locator('p[role="status"]')).toContainText('still blank');
  await page.getByRole('button', { name: 'Hand in the paper' }).click();
  await expect(page.getByRole('heading', { name: 'Mark your paper' })).toBeVisible();

  // Self-mark one written answer. The total moves as points are ticked.
  const point = page.locator('.mark-point input').first();
  const before = await page.locator('.paper-bar').textContent();
  await point.check();
  await expect(page.locator('.paper-bar')).not.toHaveText(before!);

  await page.getByRole('button', { name: 'Finish marking' }).click();
  await expect(page.getByRole('heading', { name: 'By topic, weakest first' })).toBeVisible();
  await expect(page.locator('h1')).toContainText(/of 70/);
  await expect(page.locator('.paper-table').nth(1).locator('tbody tr').first()).toBeVisible();

  // It lands in progress, as exam questions, with mistakes to retry.
  await page.goto('/#/practice');
  await expect(page.locator('.stat-line')).toContainText('exam questions practised');
  await expect(page.locator('.mistake').first()).toBeVisible();

  // And the result is kept.
  await page.goto('/#/paper');
  await expect(page.getByRole('heading', { name: 'Past papers' })).toBeVisible();
  expect(problems).toEqual([]);
});

for (const [subject, level, count] of [['chemistry', 'XII', 34], ['mathematics', 'XII', 39], ['mathematics', 'XI', 39], ['computerscience', 'XII', 24], ['computerscience', 'XI', 24]] as const) {
  test(`${subject} ${level}: a paper of ${count} questions draws without problems`, async ({ page }) => {
    const problems = watchProblems(page);
    await startPaper(page, subject, level);
    await expect(page.locator('.paper-question')).toHaveCount(count);
    if (subject === 'computerscience') await expect(page.getByText('Your best two count.').first()).toBeVisible();
    await page.getByRole('button', { name: 'Abandon this paper' }).click();
    await expect(page.getByRole('button', { name: 'Start the paper' })).toBeVisible();
    expect(problems).toEqual([]);
  });
}

for (const { width, height, touch } of WIDTHS) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: a paper and its marking fit, with no errors`, async ({ browser }, info) => {
      test.setTimeout(120_000);
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      await startPaper(page, 'computerscience', 'XII');
      const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.querySelector('main')!.scrollWidth <= document.querySelector('main')!.clientWidth);
      expect(await fits()).toBe(true);
      await page.screenshot({ path: info.outputPath(`paper-${width}-${theme}.png`) });
      await page.getByRole('button', { name: 'Hand in', exact: true }).click();
      await page.getByRole('button', { name: 'Hand in the paper' }).click();
      await expect(page.getByRole('heading', { name: 'Mark your paper' })).toBeVisible();
      expect(await fits()).toBe(true);
      await page.screenshot({ path: info.outputPath(`marking-${width}-${theme}.png`) });
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: the paper page and the marking page pass axe`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    const scan = async () => {
      const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.toast').analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
    };
    await page.goto('/#/paper');
    await expect(page.getByRole('button', { name: 'Start the paper' })).toBeVisible();
    await scan();
    await startPaper(page, 'chemistry', 'XII');
    await expect(page.locator('.katex, .body-expr').first()).toBeVisible();
    await scan();
    await page.getByRole('button', { name: 'Hand in', exact: true }).click();
    await page.getByRole('button', { name: 'Hand in the paper' }).click();
    await scan();
    await context.close();
  });
}

const circuits = (page: Page) => page.locator('.bank-diagram[aria-label*="Ω"], .bank-diagram[aria-label*="µF"]');

test('a circuit drawn for a question has its values, in the theme’s ink', async ({ page }) => {
  // Keep starting papers until one has a figure. Several Physics XII questions do.
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1024, height: 768 });
  let found = false;
  for (let tries = 0; tries < 15 && !found; tries++) {
    await startPaper(page, 'physics', 'XII');
    // Papers have graphs and tables too. This is about a circuit's values.
    found = (await circuits(page).count()) > 0;
    if (!found) await page.getByRole('button', { name: 'Abandon this paper' }).click();
  }
  expect(found).toBe(true);
  const diagram = circuits(page).first();
  await expect(diagram).toHaveAttribute('aria-label', /Ω|µF/);
  expect(await diagram.locator('text').count()).toBeGreaterThan(1);
  expect(await diagram.textContent()).not.toMatch(/\{/);
});

test('practising a unit asks exam-style questions, marked by point and with working', async ({ page }) => {
  test.setTimeout(120_000);
  const problems = watchProblems(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XII/0?work=practice');
  await page.getByRole('button', { name: 'Practise this unit' }).click();
  const work = page.locator('.work');
  await expect(work.locator('.bank-meta').first()).toBeVisible();

  // Work through the session in whichever order it comes. Each form has its own way to answer.
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    if (!(await work.locator('.bank-meta').count())) break;
    if (await work.locator('.choice').count()) {
      seen.add('mcq');
      await work.locator('.choice').first().click();
    } else if (await work.locator('input.num').count()) {
      seen.add('numeric');
      await work.locator('input.num').first().fill('1');
      await work.getByRole('button', { name: 'Check answer' }).click();
      await expect(work.locator('.steps').first()).toBeVisible();
    } else {
      seen.add('theory');
      await work.getByRole('button', { name: 'Show the marking scheme' }).click();
      await work.locator('.mark-point input').first().check();
      await work.getByRole('button', { name: /Save my mark: \d+ of \d+/ }).click();
    }
    await work.getByRole('button', { name: 'Next question' }).click();
  }
  expect(seen.size).toBeGreaterThanOrEqual(2);
  expect(problems).toEqual([]);
});

test('a written answer can be self-marked from the keyboard alone', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XII/8?work=practice');
  const work = page.locator('.work');
  const show = work.getByRole('button', { name: 'Show the marking scheme' });
  // The order is random, so start again until a written question comes up.
  for (let tries = 0; tries < 25; tries++) {
    await page.getByRole('button', { name: 'Practise this unit' }).click();
    await expect(work.getByRole('button', { name: 'End session' })).toBeVisible();
    if (await show.count()) break;
    await work.getByRole('button', { name: 'End session' }).click();
  }
  await show.focus();
  await page.keyboard.press('Enter');
  const box = work.locator('.mark-point input').first();
  await box.focus();
  await page.keyboard.press('Space');
  await expect(box).toBeChecked();
  const save = work.getByRole('button', { name: /Save my mark/ });
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(work.getByRole('button', { name: 'Next question' })).toBeFocused();
});

test('mock papers work with no connection', async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await openRoute(page, 'paper');
  await page.locator('#paper-subject').selectOption('chemistry');
  await page.locator('#paper-class').selectOption('XI');
  await page.getByRole('button', { name: 'Start the paper' }).click();
  await expect(page.locator('.paper-question')).toHaveCount(34);
  await context.setOffline(false);
});
