// The edge of the working area can be dragged, or moved with the keyboard, and the reading page takes up the room.
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

const panel = (page: Page) => page.locator('aside.work');
const handle = (page: Page) => page.getByRole('separator', { name: 'Resize the working area' });
const widthOf = async (page: Page, selector: string) => (await page.locator(selector).boundingBox())!.width;

/** Drags the handle sideways by a distance, in steps, as a hand would. */
async function dragBy(page: Page, dx: number) {
  const box = (await handle(page).boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y, { steps: 6 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/book/physics/XI');
  await expect(handle(page)).toBeVisible();
});

test('dragging right gives the reading page more room, and dragging left gives it back', async ({ page }) => {
  const problems = watchProblems(page);
  const startPanel = await widthOf(page, 'aside.work');
  const startMain = await widthOf(page, 'main');
  expect(startPanel).toBeCloseTo(444, 0);

  await dragBy(page, 80);
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(startPanel - 80, 0);
  expect(await widthOf(page, 'main')).toBeCloseTo(startMain + 80, 0);

  await dragBy(page, -160);
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(startPanel + 80, 0);
  expect(await widthOf(page, 'main')).toBeCloseTo(startMain - 80, 0);
  expect(problems).toEqual([]);
});

test('it stops at its limits, and nothing spills out at the narrowest', async ({ page }) => {
  await dragBy(page, 600);
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(320, 0);
  for (const tab of ['Solve', 'Check units', 'Practice']) {
    await page.getByRole('tab', { name: tab }).click();
    const spill = await page.locator('.work-body').evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(spill, tab).toBeLessThanOrEqual(0);
  }
  await dragBy(page, -2000);
  expect(await widthOf(page, 'main')).toBeCloseTo(384, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the width is remembered, and double-clicking resets it', async ({ page }) => {
  await dragBy(page, 100);
  const chosen = await widthOf(page, 'aside.work');
  await page.reload();
  await expect(handle(page)).toBeVisible();
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(chosen, 0);

  await handle(page).dblclick();
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(444, 0);
  await page.reload();
  await expect(handle(page)).toBeVisible();
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(444, 0);
});

test('it works from the keyboard, and says how wide the panel is', async ({ page }) => {
  await handle(page).focus();
  await expect(handle(page)).toHaveAttribute('aria-valuenow', '444');
  await page.keyboard.press('ArrowRight');
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(428, 0);
  await expect(handle(page)).toHaveAttribute('aria-valuenow', '428');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(460, 0);
  await page.keyboard.press('Home');
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(320, 0);
  await page.keyboard.press('End');
  expect(await widthOf(page, 'main')).toBeCloseTo(384, 0);
  await page.keyboard.press('Enter');
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(444, 0);
});

test('a wide panel gives way when the window shrinks, and comes back', async ({ page }) => {
  await dragBy(page, -300);
  const wide = await widthOf(page, 'aside.work');
  await page.setViewportSize({ width: 1280, height: 800 });
  expect(await widthOf(page, 'main')).toBeGreaterThanOrEqual(383);
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await widthOf(page, 'aside.work')).toBeCloseTo(wide, 0);
});

test('below the wide layout, the drawer has no handle and keeps its own width', async ({ page }) => {
  await dragBy(page, 100);
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(panel(page)).toHaveCount(0);
  await expect(page.getByRole('separator', { name: 'Resize the working area' })).toHaveCount(0);
  await expect(page.locator('main')).toBeVisible();
});
