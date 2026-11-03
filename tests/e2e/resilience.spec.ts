// What happens when things go wrong, and whether small screens and large text still work.
import { expect, test } from '@playwright/test';
import { openRoute, setTheme, watchProblems } from './helpers';

const ROUTES = ['', 'book/physics/XI', 'book/physics/XI/1', 'f/p-xi-2-7', 'find?q=velocity', 'saved', 'practice', 'paper', 'tools', 'tools/projectile', 'tools/circuits', 'tools/titration', 'tools/plotter', 'tools/java', 'tools/logic', 'settings', 'f/p-xi-2-7?work=solve&wf=p-xi-2-7', 'book/physics/XI/1?work=check', 'book/physics/XI/1?work=practice'];

test('the app works with browser storage blocked', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: blocked });
    Object.defineProperty(window, 'sessionStorage', { get: blocked });
  });
  const page = await context.newPage();
  const problems = watchProblems(page);
  await page.goto('/');
  for (const route of ROUTES) await openRoute(page, route);
  expect(problems).toEqual([]);
  await context.close();
});

test('a page whose code cannot load explains itself, instead of going blank', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.route('**/assets/UnitView-*', (route) => route.abort());
  await page.goto('/#/book/physics/XI/1');
  await expect(page.getByRole('alert')).toContainText('This page could not open');
  const reload = page.getByRole('button', { name: 'Reload' });
  await expect(reload).toBeVisible();

  // The rest of the app still works, and moving elsewhere recovers.
  await page.getByRole('link', { name: 'Tools' }).click();
  await expect(page.locator('main h1')).toHaveText('Tools');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await context.close();
});

test('a unit whose formulas cannot load says so', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.route('**/assets/physics-XI-*', (route) => route.abort());
  await page.goto('/#/book/physics/XI/1');
  await expect(page.locator('main')).toContainText('This unit could not load. Reload the page to try again.');
  await context.close();
});

test('the Java tracer survives programs that never stop', async ({ page }) => {
  await page.goto('/#/tools/java');
  await page.getByRole('button', { name: 'Edit code' }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.insertText('class T {\n  static int f(int n) { return f(n + 1); }\n  public static void main(String[] a) {\n    int i = 0;\n    while (i < 5) { System.out.print(""); }\n  }\n}');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText('infinite loop');
});

for (const theme of ['paper', 'board'] as const) {
  test(`${theme}: at 320 px wide nothing is cut off`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: { width: 320, height: 700 }, hasTouch: true, reducedMotion: 'reduce' });
    await setTheme(context, theme);
    const page = await context.newPage();
    await page.goto('/');
    const cut: string[] = [];
    for (const route of ROUTES) {
      await openRoute(page, route);
      const over = await page.evaluate(() => {
        const main = document.querySelector('main');
        return Math.max(document.documentElement.scrollWidth - window.innerWidth, main ? main.scrollWidth - main.clientWidth : 0);
      });
      if (over > 0) cut.push(`#/${route} +${over}px`);
    }
    expect(cut).toEqual([]);
    await context.close();
  });
}

test('touch targets on a phone are at least 44 px', async ({ browser }) => {
  test.setTimeout(120_000);
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const small = new Set<string>();
  for (const route of ROUTES) {
    await openRoute(page, route);
    const found = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll<HTMLElement>('a[href], button, input:not([type=hidden]), select, textarea, [role=tab], summary')) {
        const style = getComputedStyle(el);
        let box = el.getBoundingClientRect();
        if (!box.width || !box.height || style.visibility === 'hidden') continue;
        // Exempt: a hidden file input behind a real button, and links within running
        // text, which WCAG also exempts.
        if (el.classList.contains('sr-only')) continue;
        if (el.tagName === 'A' && style.display === 'inline' && (el.parentElement?.textContent?.length ?? 0) > (el.textContent?.length ?? 0) + 10) continue;
        const input = el as HTMLInputElement;
        if (input.type === 'checkbox' || input.type === 'radio') box = el.closest('label')?.getBoundingClientRect() ?? box;
        // These extend their hit area with ::after, without changing the layout.
        const extra = parseFloat(getComputedStyle(el, '::after').top) < 0 ? 2 * Math.abs(parseFloat(getComputedStyle(el, '::after').top)) : 0;
        if (box.height + extra < 43.5 || box.width < 43.5) out.push(`${el.tagName} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(box.width)}x${Math.round(box.height + extra)}`);
      }
      return out;
    });
    for (const f of found) small.add(`${f} on #/${route}`);
  }
  expect([...small]).toEqual([]);
  await context.close();
});

test('with reduced motion, the projectile rests at its landing point and nothing moves', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/#/tools/projectile');
  await expect(page.locator('canvas').first()).toBeVisible();
  // GSAP is not even fetched when no motion is wanted.
  const fetched = await page.evaluate(() => performance.getEntriesByType('resource').some((r) => /gsap/.test(r.name)));
  expect(fetched).toBe(false);
  const shot = () => page.locator('canvas').first().screenshot();
  const first = await shot();
  await page.waitForTimeout(500);
  expect((await shot()).equals(first)).toBe(true);
  await context.close();
});
