// Search results must be visible and reachable on a tablet, with or without the on-screen keyboard.
import { expect, test, type Page } from '@playwright/test';

/** Width, height, and a typical iPad keyboard height for that shape. */
const TABLETS: [number, number, number][] = [
  [768, 1024, 313],
  [820, 1180, 313],
  [1024, 768, 398],
  [1180, 820, 398],
  [1366, 1024, 420],
];

test.use({ hasTouch: true, reducedMotion: 'reduce' });

async function search(page: Page, opener: string, query = 'velocity'): Promise<void> {
  await page.goto('/#/book/physics/XI/1');
  await page.locator('main .row').first().waitFor();
  await page.locator(opener).first().click();
  await page.locator('dialog.palette[open]').waitFor();
  await page.locator('.palette-input input').fill(query);
  await page.locator('.palette-row').first().waitFor();
  await page.waitForTimeout(150);
}

/** An on-screen keyboard shrinks only the visual viewport, so that is what this shrinks. */
async function raiseKeyboard(page: Page, keyboard: number): Promise<number> {
  return page.evaluate((height) => {
    const viewport = window.visualViewport!;
    const visible = window.innerHeight - height;
    Object.defineProperty(viewport, 'height', { configurable: true, get: () => visible });
    viewport.dispatchEvent(new Event('resize'));
    return visible;
  }, keyboard);
}

function countVisible(page: Page, visibleTo: number): Promise<number> {
  return page.evaluate((bottom) => {
    const list = document.querySelector('.palette-results')!.getBoundingClientRect();
    return [...document.querySelectorAll('.palette-row')].filter((row) => {
      const box = row.getBoundingClientRect();
      return box.top >= Math.max(list.top, 0) && box.bottom <= Math.min(list.bottom, bottom);
    }).length;
  }, visibleTo);
}

/** Scrolls the list to its end, and says whether the last row can then be seen. */
function lastRowReachable(page: Page, visibleTo: number): Promise<boolean> {
  return page.evaluate((bottom) => {
    const list = document.querySelector<HTMLElement>('.palette-results')!;
    list.scrollTop = list.scrollHeight;
    const rows = list.querySelectorAll('.palette-row');
    return rows[rows.length - 1].getBoundingClientRect().bottom <= bottom;
  }, visibleTo);
}

for (const [width, height, keyboard] of TABLETS) {
  test.describe(`${width}×${height}`, () => {
    test.use({ viewport: { width, height } });

    test('shows the first several results', async ({ page }) => {
      await search(page, '.rail-link[aria-keyshortcuts]');
      expect(await countVisible(page, height)).toBeGreaterThanOrEqual(4);
      expect(await page.locator('dialog.palette').evaluate((d) => d.matches(':modal'))).toBe(true);
      expect(await lastRowReachable(page, height)).toBe(true);
    });

    test('the keyboard hides none of them, and the list still reaches its end', async ({ page }) => {
      await search(page, '.rail-link[aria-keyshortcuts]');
      const visible = await raiseKeyboard(page, keyboard);
      const panel = await page.locator('dialog.palette').boundingBox();
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(visible + 1);
      expect(await countVisible(page, visible)).toBeGreaterThanOrEqual(3);
      expect(await lastRowReachable(page, visible)).toBe(true);
    });

    test('a result opens by touch', async ({ page }) => {
      await search(page, '.rail-link[aria-keyshortcuts]');
      await page.locator('.palette-row').first().tap();
      await expect(page).toHaveURL(/#\/f\//);
      await expect(page.locator('dialog.palette')).not.toHaveAttribute('open');
    });

    test('the arrow keys keep the chosen result in view', async ({ page }) => {
      await search(page, '.rail-link[aria-keyshortcuts]');
      const visible = await raiseKeyboard(page, keyboard);
      for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowDown');
      const box = await page.locator('.palette-row[aria-selected="true"]').boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(visible + 1);
    });
  });
}

test.describe('phone', () => {
  test.use({ viewport: { width: 375, height: 780 } });

  test('the panel fills what can be seen above the keyboard', async ({ page }) => {
    await search(page, '.dock-item:has-text("Find")');
    expect(await countVisible(page, 780)).toBeGreaterThanOrEqual(4);
    const visible = await raiseKeyboard(page, 300);
    const panel = await page.locator('dialog.palette').boundingBox();
    expect(panel!.y).toBe(0);
    expect(panel!.height).toBeLessThanOrEqual(visible + 1);
    expect(await countVisible(page, visible)).toBeGreaterThanOrEqual(3);
    expect(await lastRowReachable(page, visible)).toBe(true);
  });
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false });

  test('stays a centred panel, and the "see all" page shows results too', async ({ page }) => {
    await search(page, '.find-trigger');
    const panel = await page.locator('dialog.palette').boundingBox();
    expect(Math.abs(panel!.x + panel!.width / 2 - 720)).toBeLessThan(2);
    expect(panel!.y).toBeGreaterThan(40);
    expect(await countVisible(page, 900)).toBeGreaterThanOrEqual(5);
    await page.goto('/#/find?q=velocity');
    await expect(page.locator('main .row').first()).toBeInViewport();
  });
});
