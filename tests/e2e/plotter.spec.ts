// The graph plotter: intersections, reading coordinates, and calculus typed in.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { setTheme, waitForServiceWorker, watchProblems } from './helpers';

async function open(page: Page) {
  await page.goto('/#/tools/plotter');
  await expect(page.getByRole('textbox', { name: 'Function 1' })).toBeVisible();
}

async function setFunctions(page: Page, a: string, b: string) {
  await page.getByRole('textbox', { name: 'Function 1' }).fill(a);
  await page.getByRole('textbox', { name: 'Function 2' }).fill(b);
}

test('intersections show and hide, have coordinates, and the choice lasts the session', async ({ page }) => {
  const problems = watchProblems(page);
  await open(page);
  await setFunctions(page, 'x^2', 'x + 2');
  const toggle = page.getByRole('button', { name: 'Hide intersections' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('crossings')).toHaveText('(−1, 1) (2, 4)');

  await toggle.click();
  const show = page.getByRole('button', { name: 'Show intersections' });
  await expect(show).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('crossings')).toHaveCount(0);

  // Off stays off through a reload in the same session.
  await page.reload();
  await expect(page.getByRole('button', { name: 'Show intersections' })).toBeVisible();
  await page.getByRole('button', { name: 'Show intersections' }).click();

  await setFunctions(page, 'sin(x)', 'cos(x)');
  await expect(page.getByTestId('crossings')).toContainText('(0.785, 0.707)');
  expect(problems).toEqual([]);
});

test('intersections follow zoom and panning', async ({ page }) => {
  await open(page);
  await setFunctions(page, 'sin(x)', 'cos(x)');
  await expect(page.getByTestId('crossings')).toContainText('(−8.639');
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'Zoom in' }).click();
  await expect(page.getByTestId('crossings')).not.toContainText('(−8.639');
});

test('a function that blows up gives no false intersections', async ({ page }) => {
  await open(page);
  await setFunctions(page, '1/x', '-1/x');
  await expect(page.getByTestId('crossings')).toHaveText('none in view');
});

async function hover(page: Page, fx: number, fy = 0.5) {
  const box = (await page.locator('.plot canvas').first().boundingBox())!;
  await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy);
}

test('hovering reads both coordinates of every curve, in each curve\'s colour', async ({ page }) => {
  const problems = watchProblems(page);
  await open(page);
  await setFunctions(page, 'x^2', 'sin(x)');
  await hover(page, 0.6);
  const readout = page.getByTestId('plot-readout');
  await expect(readout).toBeVisible();
  await expect(readout).toContainText(/f1\(x\): \(.+, .+\)/);
  await expect(readout).toContainText(/f2\(x\): \(.+, .+\)/);
  const colours = await readout.locator('div').evaluateAll((rows) => rows.map((r) => getComputedStyle(r).color));
  expect(new Set(colours).size).toBe(2);
  await page.mouse.move(0, 0);
  await expect(readout).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('an undefined value says undefined, not a wrong number', async ({ page }) => {
  await open(page);
  await setFunctions(page, 'sqrt(x)', 'x');
  await hover(page, 0.2);
  await expect(page.getByTestId('plot-readout')).toContainText(/f1\(x\): undefined at x = /);
  await expect(page.getByTestId('plot-readout')).toContainText(/f2\(x\): \(/);
});

test('it snaps to a named point and says what it is', async ({ page }) => {
  await open(page);
  await setFunctions(page, 'x^2', 'x + 2');
  await page.getByRole('button', { name: 'Hide intersections' }).click();
  // Keyboard: the graph takes focus, then up jumps to the first named point.
  await page.locator('.plot').first().focus();
  const readout = page.getByTestId('plot-readout');
  let found = false;
  for (let i = 0; i < 6 && !found; i++) {
    await page.keyboard.press('ArrowUp');
    found = ((await readout.textContent()) ?? '').includes('Intersection of f1 and f2');
  }
  expect(found).toBe(true);
  await expect(readout).toContainText('(−1, 1)');
  // The pointer snaps too.
  const box = (await page.locator('.plot canvas').first().boundingBox())!;
  const spot = await page.evaluate(() => {
    const plot = document.querySelector('.plot')!;
    return { w: plot.clientWidth, h: plot.clientHeight };
  });
  const px = 52 + ((2 + 10) / 20) * (spot.w - 66);
  const py = 12 + ((6 - 4) / 12) * (spot.h - 50);
  await page.mouse.move(box.x + px + 4, box.y + py + 3);
  await expect(readout).toContainText('Intersection of f1 and f2');
  await expect(readout).toContainText('(2, 4)');
});

test('the keyboard moves x step by step, and it is announced politely', async ({ page }) => {
  await open(page);
  await page.locator('.plot').first().focus();
  await page.keyboard.press('ArrowRight');
  const readout = page.getByTestId('plot-readout');
  await expect(readout).toContainText('f1(x): (0,');
  await page.keyboard.press('ArrowRight');
  await expect(readout).toContainText('f1(x): (0.2,');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(readout).toContainText('f1(x): (−0.2,');
  const spoken = page.getByTestId('plot-spoken');
  await expect(spoken).toHaveAttribute('aria-live', 'polite');
  await expect(spoken).toContainText('x = −0.2.');
  await page.keyboard.press('Escape');
  await expect(readout).toHaveCount(0);
});

test('touch: press and drag reads, and two fingers move the graph', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page);
  const canvas = page.locator('.plot canvas').first();
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  const fire = (type: string, id: number, fx: number) =>
    canvas.evaluate(
      (el, { type, id, x, y }) => {
        const c = el as HTMLCanvasElement;
        c.setPointerCapture = () => undefined;
        c.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: id, pointerType: 'touch', clientX: x, clientY: y }));
      },
      { type, id, x: box.x + box.width * fx, y: box.y + box.height / 2 },
    );
  await fire('pointerdown', 1, 0.5);
  const readout = page.getByTestId('plot-readout');
  await expect(readout).toBeVisible();
  const first = await readout.textContent();
  await fire('pointermove', 1, 0.7);
  await expect(readout).not.toHaveText(first!);
  // The readout stays inside the graph, and doesn't cover the markers.
  const inside = await readout.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const p = el.parentElement!.getBoundingClientRect();
    return r.left >= p.left && r.right <= p.right && r.top >= p.top && r.bottom <= p.bottom;
  });
  expect(inside).toBe(true);
  await fire('pointerup', 1, 0.7);
  await context.close();
});

for (const { width, height } of [{ width: 375, height: 780 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: the readout stays inside the graph at both edges`, async ({ browser }, info) => {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      await open(page);
      await page.locator('.plot').first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
      for (const fx of [0.18, 0.5, 0.93]) {
        await hover(page, fx);
        const readout = page.getByTestId('plot-readout');
        await expect(readout).toBeVisible();
        const inside = await readout.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const p = el.parentElement!.getBoundingClientRect();
          return r.left >= p.left && r.right <= p.right && r.top >= p.top && r.bottom <= p.bottom;
        });
        expect(inside, `at ${fx}`).toBe(true);
      }
      await page.locator('.plot').first().screenshot({ path: info.outputPath(`readout-${width}-${theme}.png`) });
      expect(problems).toEqual([]);
      await context.close();
    });
  }
}

const box1 = (page: Page) => page.getByRole('textbox', { name: 'Function 1' });

test('typing shows a live preview, and a clear error when it can\'t be read', async ({ page }) => {
  const problems = watchProblems(page);
  await open(page);
  await box1(page).fill('2x sin(x)');
  await expect(page.getByTestId('preview-f1').locator('.katex').first()).toBeVisible();
  await box1(page).fill('sin(x');
  await expect(page.getByTestId('error-f1')).toHaveText('A closing bracket ) is missing.');
  await expect(page.getByTestId('preview-f1')).toHaveCount(0);
  await box1(page).fill('y + 1');
  await expect(page.getByTestId('error-f1')).toContainText('"y" has no value');
  expect(problems).toEqual([]);
});

test('a derivative shows its symbolic form and draws its own curve', async ({ page }) => {
  await open(page);
  await box1(page).fill('d/dx(x^3)');
  await expect(page.getByTestId('preview-f1').locator('.katex-mathml').first()).toContainText('3');
  const text = await page.getByTestId('preview-f1').locator('annotation').first().textContent();
  expect(text).toContain('3\\,x^{2}');
  // Reading the curve at x = 2 gives 12, since the curve drawn is the derivative.
  await page.locator('.plot').first().focus();
  for (let i = 0; i < 11; i++) await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('plot-readout')).toContainText('f1(x): (2, 12)');
});

const pixelAlpha = (page: Page, x: number, y: number) =>
  page.locator('.plot canvas').first().evaluate(
    (el, [wx, wy]) => {
      const c = el as HTMLCanvasElement;
      const css = c.getBoundingClientRect();
      const v = { left: 52, right: css.width - 14, top: 12, bottom: css.height - 38 };
      const px = v.left + ((wx + 10) / 20) * (v.right - v.left);
      const py = v.bottom - ((wy + 6) / 12) * (v.bottom - v.top);
      const scale = c.width / css.width;
      // Takes a small patch, since hatching makes single pixels misleading.
      const data = c.getContext('2d')!.getImageData(Math.round(px * scale) - 6, Math.round(py * scale) - 6, 12, 12).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) sum += data[i];
      return sum / (data.length / 4);
    },
    [x, y],
  );

test('a definite integral shows its value, and shades both sides of the axis', async ({ page }) => {
  await open(page);
  await box1(page).fill('∫ from 0 to π of sin(x)');
  await expect(page.getByTestId('area-f1')).toContainText('2.0000');
  await box1(page).fill('∫ from -1 to 1 of x');
  await page.getByRole('textbox', { name: 'Function 2' }).fill('');
  await page.getByRole('button', { name: 'Hide intersections' }).click();
  await expect(page.getByTestId('area-f1')).toHaveText('Value 0.0000: 0.5000 above the axis, take away 0.5000 below it.');
  // Shaded just right of 0 above the axis, and just left of it below, with nothing outside.
  expect(await pixelAlpha(page, 0.7, 0.3)).toBeGreaterThan(10);
  expect(await pixelAlpha(page, -0.7, -0.3)).toBeGreaterThan(10);
});

test('an indefinite integral is labelled + C', async ({ page }) => {
  await open(page);
  await box1(page).fill('∫ x^2');
  await expect(page.locator('.legend')).toContainText('∫ x^2 + C');
  await expect(page.getByTestId('preview-f1')).toContainText('C = 0');
  await box1(page).fill('∫ exp(x^2)');
  await expect(page.getByTestId('preview-f1')).toContainText('Found numerically');
  await expect(page.getByTestId('preview-f1')).toContainText('F(0) = 0');
});

test('the keypad inserts at the cursor, with the cursor inside', async ({ page }) => {
  await open(page);
  await box1(page).fill('2 + ');
  await box1(page).focus();
  await page.getByRole('button', { name: 'Insert square root' }).click();
  await expect(box1(page)).toHaveValue('2 + sqrt()');
  await expect(box1(page)).toBeFocused();
  await page.keyboard.type('x');
  await expect(box1(page)).toHaveValue('2 + sqrt(x)');
  await box1(page).fill('');
  await page.getByRole('button', { name: 'Insert d/dx, derivative' }).click();
  await page.keyboard.type('x^2');
  await expect(box1(page)).toHaveValue('d/dx(x^2)');
  // Goes in the box last used, not always the first.
  const second = page.getByRole('textbox', { name: 'Function 2' });
  await second.fill('x');
  await page.getByRole('button', { name: 'Insert pi' }).click();
  await expect(second).toHaveValue('xπ');
  // With limits. Text already in the box becomes what is integrated.
  await second.fill('sin(x)');
  await page.getByRole('button', { name: 'Insert integral' }).click();
  await page.getByLabel('To', { exact: true }).fill('π/2');
  await page.getByRole('button', { name: 'Insert with limits' }).click();
  await expect(second).toHaveValue('∫ from 0 to π/2 of sin(x)');
  await expect(page.getByTestId('area-f2')).toContainText('1.0000');
});

test('the keypad works from the keyboard alone', async ({ page }) => {
  await open(page);
  await box1(page).fill('');
  await box1(page).focus();
  const first = page.getByRole('button', { name: 'Insert x', exact: true });
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Insert pi' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(box1(page)).toHaveValue('π');
  await expect(box1(page)).toBeFocused();
});

test('on a phone the keypad is a compact row that opens, with big enough keys', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const problems = watchProblems(page);
  await open(page);
  await expect(page.getByRole('button', { name: 'Insert sin, sine' })).toHaveCount(0);
  const more = page.getByRole('button', { name: 'More symbols' });
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await more.click();
  await expect(page.getByRole('button', { name: 'Insert sin, sine' })).toBeVisible();
  for (const key of await page.locator('.keypad-key').all()) {
    const size = (await key.boundingBox())!;
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(problems).toEqual([]);
  await context.close();
});

test('the plotter passes axe, and still works offline, calculus included', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  await page.reload();
  await open(page);
  await box1(page).fill('∫ from 0 to π of sin(x)');
  await expect(page.getByTestId('area-f1')).toContainText('2.0000');
  await page.locator('.plot').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('plot-readout')).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.toast').analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes[0].target.join(' ')}`)).toEqual([]);
  await context.setOffline(false);
});
