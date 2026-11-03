// Every main page at four widths in both themes. Saves screenshots for a person to look
// at, and fails on console errors, off-site requests or sideways scrolling.
import { expect, test } from '@playwright/test';
import { openRoute, setTheme, watchProblems } from './helpers';

const WIDTHS = [
  { width: 375, height: 780, touch: true },
  { width: 768, height: 1024, touch: true },
  { width: 1024, height: 768, touch: true },
  { width: 1440, height: 900, touch: false },
];
const THEMES = ['paper', 'board'] as const;
const ROUTES: [string, string][] = [
  ['today', ''],
  ['contents', 'book/physics/XI'],
  ['unit', 'book/physics/XI/1'],
  ['unit-chemistry', 'book/chemistry/XII/0'],
  ['unit-maths', 'book/mathematics/XI/2'],
  ['unit-cs', 'book/computerscience/XII/0'],
  ['formula', 'f/p-xi-2-7'],
  ['find', 'find?q=velocity'],
  ['saved', 'saved'],
  ['progress', 'practice'],
  ['mock-paper', 'paper'],
  ['your-formulas', 'mine'],
  ['add-formula', 'mine/new'],
  ['tools', 'tools'],
  ['projectile', 'tools/projectile'],
  ['circuits', 'tools/circuits'],
  ['titration', 'tools/titration'],
  ['plotter', 'tools/plotter'],
  ['java', 'tools/java'],
  ['settings', 'settings'],
  ['solve', 'f/p-xi-2-7?work=solve&wf=p-xi-2-7'],
  ['check', 'book/physics/XI/1?work=check'],
  ['practice', 'book/physics/XI/1?work=practice'],
];

for (const { width, height, touch } of WIDTHS) {
  for (const theme of THEMES) {
    test(`${width}px ${theme}: no errors, no sideways scrolling`, async ({ browser }) => {
      test.setTimeout(240_000);
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      const problems = watchProblems(page);
      await page.goto('/');
      for (const [name, route] of ROUTES) {
        await openRoute(page, route);
        await page.waitForTimeout(250);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${name} scrolls sideways`).toBeLessThanOrEqual(0);
        await page.screenshot({ path: `test-screens/${name}-${width}-${theme}.png` });
      }

      await openRoute(page, 'book/physics/XI/1');
      await page.keyboard.press('Control+k');
      await page.getByRole('combobox', { name: 'Find a formula' }).fill('energy');
      await expect(page.getByRole('option').first()).toBeVisible();
      await page.screenshot({ path: `test-screens/palette-${width}-${theme}.png` });

      expect(problems).toEqual([]);
      await context.close();
    });
  }
}
