// Automated accessibility rules on the main pages, in both themes and at two widths.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openRoute, setTheme } from './helpers';

const ROUTES = ['', 'book/physics/XI', 'book/physics/XI/1', 'book/chemistry/XII/0', 'f/p-xi-2-7', 'find?q=velocity', 'saved', 'practice', 'tools', 'tools/projectile', 'tools/circuits', 'tools/titration', 'tools/plotter', 'tools/java', 'tools/lcr', 'tools/logic', 'settings', 'f/p-xi-2-7?work=solve&wf=p-xi-2-7', 'book/physics/XI/1?work=check', 'book/physics/XI/1?work=practice'];

for (const width of [375, 1440]) {
  for (const theme of ['paper', 'board'] as const) {
    test(`${width}px ${theme}: no WCAG A or AA violations`, async ({ browser }) => {
      test.setTimeout(300_000);
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 780 : 900 }, hasTouch: width < 768, reducedMotion: 'reduce' });
      await setTheme(context, theme);
      const page = await context.newPage();
      await page.goto('/');
      const found: string[] = [];
      for (const route of ROUTES) {
        await openRoute(page, route);
        await page.waitForTimeout(250);
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        for (const v of violations) {
          found.push(`#/${route} ${v.id} (${v.impact}): ${v.nodes.length} node(s). e.g. ${v.nodes[0].target.join(' ')}: ${(v.nodes[0].failureSummary ?? '').replace(/\s+/g, ' ').slice(0, 200)}`);
        }
      }
      expect(found).toEqual([]);
      await context.close();
    });
  }
}
