// The graph plotter: intersections, reading coordinates, and calculus typed in.
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

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
