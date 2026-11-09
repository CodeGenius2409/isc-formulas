// On a printed page, a formula must never run over its name and note, or off the page.
import { expect, test } from '@playwright/test';

// The widest formulas in the book were in these units, at the time this was written.
const UNITS = ['physics/XI/0', 'chemistry/XI/9', 'chemistry/XII/3', 'mathematics/XI/1'];

for (const unit of UNITS) {
  test(`${unit} prints with no formula over its description`, async ({ page }) => {
    // The printable width of A4 with this site's margins.
    await page.setViewportSize({ width: 703, height: 1000 });
    await page.goto(`/#/book/${unit}`);
    await page.locator('.row').first().waitFor();
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    await expect(page.locator('.katex').first()).toBeVisible();
    await page.waitForTimeout(1500);

    const result = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.row')];
      const overlapping: string[] = [];
      const offPage: string[] = [];
      for (const row of rows) {
        const number = row.querySelector('.row-num')?.textContent ?? '?';
        const parts = [...row.querySelectorAll('.row-math .katex-html .base')].map((e) => e.getBoundingClientRect()).filter((b) => b.width > 0);
        const words = [...row.querySelectorAll('.row-name, .row-note')].map((e) => e.getBoundingClientRect());
        if (parts.some((p) => words.some((w) => p.left < w.right - 1 && p.right > w.left + 1 && p.top < w.bottom - 1 && p.bottom > w.top + 1))) overlapping.push(number);
        const edge = row.querySelector('.row-main')!.getBoundingClientRect().right;
        if (parts.some((p) => p.right > edge + 1)) offPage.push(number);
      }
      return { rows: rows.length, overlapping, offPage };
    });

    expect(result.rows).toBeGreaterThan(20);
    expect(result.overlapping).toEqual([]);
    expect(result.offPage).toEqual([]);
  });
}

test('a short formula keeps its name beside it, and a long one has it underneath', async ({ page }) => {
  await page.setViewportSize({ width: 703, height: 1000 });
  await page.goto('/#/book/physics/XI/0');
  await page.locator('.row').first().waitFor();
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.waitForTimeout(1000);
  const placeOf = (number: string) =>
    page.evaluate((n) => {
      const row = [...document.querySelectorAll('.row')].find((r) => r.querySelector('.row-num')?.textContent?.replace(/\s/g, '') === n)!;
      const math = row.querySelector('.row-math')!.getBoundingClientRect();
      const name = row.querySelector('.row-name')!.getBoundingClientRect();
      return { beside: name.left >= math.right, below: name.top >= math.bottom - 1 };
    }, number);
  expect((await placeOf('1.1.2')).beside).toBe(true);
  expect((await placeOf('1.1.3')).below).toBe(true);
});
