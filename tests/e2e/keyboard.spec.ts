// The whole journey with no pointer: search, open a formula, solve it, then practise.
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

/** Presses Tab until focus reaches a control whose name matches. Only ever uses keys. */
async function tabTo(page: Page, name: RegExp, max = 120): Promise<void> {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? (el.getAttribute('aria-label') ?? el.innerText ?? '').trim() : '';
    });
    if (name.test(label)) return;
  }
  throw new Error(`Tab never reached ${name}`);
}

const focusVisible = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return false;
    const style = getComputedStyle(el);
    return el.matches(':focus-visible') && (style.outlineStyle !== 'none' || style.boxShadow !== 'none');
  });

for (const [label, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['tablet', { width: 900, height: 1100 }],
] as const) {
  test(`${label}: search, open, solve and practise using only the keyboard`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const problems = watchProblems(page);
    await page.goto('/');
    await expect(page.locator('main h1')).toBeVisible();

    // Search
    await page.keyboard.press('/');
    const input = page.getByRole('combobox', { name: 'Find a formula' });
    await expect(input).toBeFocused();
    await page.keyboard.type('average velocty');
    await expect(page.getByRole('listbox', { name: 'Results' }).getByRole('option').first()).toContainText(/average velocity/i);
    await page.keyboard.press('Enter');

    // Open
    await expect(page).toHaveURL(/#\/f\//);
    await expect(page.locator('main h1')).toContainText(/average velocity/i);

    // Solve
    await tabTo(page, /^Solve with this/);
    expect(await focusVisible(page)).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Find average velocity' })).toBeVisible();

    const fields = page.locator('.var-row input');
    const count = await fields.count();
    expect(count).toBeGreaterThan(0);
    // Choosing a formula puts the cursor in its first box, ready to type.
    await expect(fields.first()).toBeFocused();
    for (let i = 0; i < count; i++) {
      for (let tab = 0; tab < 12 && !(await fields.nth(i).evaluate((el) => el === document.activeElement)); tab++) {
        await page.keyboard.press('Tab');
      }
      await expect(fields.nth(i)).toBeFocused();
      await page.keyboard.type(String((i + 1) * 10));
    }
    await page.keyboard.press('Enter');
    await expect(page.getByRole('list', { name: 'Worked solution' })).toBeVisible();

    // Practice
    await tabTo(page, /^Solve$/);
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Practice' })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Ten new formulas' })).toBeVisible();
    await tabTo(page, /Ten new formulas/);
    await page.keyboard.press('Enter');

    // Answer three questions, whichever kind they turn out to be.
    for (let q = 0; q < 3; q++) {
      const number = page.locator('#answer-value');
      const reveal = page.getByRole('button', { name: 'Show the formula' });
      await expect(number.or(page.getByRole('group', { name: 'Options' })).or(reveal).first()).toBeVisible();
      if (await number.count()) {
        await expect(number).toBeFocused();
        await page.keyboard.type('1');
        await page.keyboard.press('Enter');
      } else if (await reveal.count()) {
        await expect(reveal).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('group', { name: 'Rate your recall' })).toBeVisible();
        await expect(page.getByRole('button', { name: /forgot/i })).toBeFocused();
        await page.keyboard.press('Enter');
      } else {
        await page.keyboard.press('1');
      }
      const next = page.getByRole('button', { name: 'Next question' });
      await expect(next).toBeFocused();
      await page.keyboard.press('Enter');
    }

    expect(problems).toEqual([]);
    await context.close();
  });
}

test('skip link and Escape behave', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.keyboard.press('Control+k');
  await expect(page.getByRole('combobox', { name: 'Find a formula' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('combobox', { name: 'Find a formula' })).toBeHidden();
});
