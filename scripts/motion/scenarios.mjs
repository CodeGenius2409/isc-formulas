const BASE = 'http://localhost:4173/';
const go = async (page, hash) => {
  await page.goto(`${BASE}#/${hash}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(900);
};
const isPhone = (vp) => vp === 'phone';

export const scenarios = {
  // Contents to a unit: forward, the unit title growing out of its line in the contents.
  'unit-forward': {
    setup: (page) => go(page, 'book/physics/XI'),
    act: (page) => page.locator('main nav[aria-label="Units"] a').nth(2).click(),
  },
  // A formula row's Open, into the formula page: the formula grows into the page's big formula.
  'formula-open': {
    setup: async (page, vp) => {
      await go(page, 'book/physics/XI/2');
      if (isPhone(vp)) await page.locator('main .row-name button').first().click();
      await page.waitForTimeout(300);
    },
    act: (page) => page.locator('main .row a[aria-label^="Open"]').first().click(),
  },
  // Back from a formula to its unit: the top sheet lifted away.
  'formula-back': {
    setup: async (page, vp) => {
      await go(page, 'book/physics/XI/2');
      if (isPhone(vp)) await page.locator('main .row-name button').first().click();
      await page.locator('main .row a[aria-label^="Open"]').first().click();
      await page.waitForTimeout(1200);
    },
    act: (page) => page.goBack(),
  },
  // Today to Tools: between main sections.
  lateral: {
    setup: (page) => go(page, ''),
    act: (page, vp) => (isPhone(vp) ? page.locator('.dock a', { hasText: 'Tools' }).click() : page.locator('.rail a', { hasText: 'Tools' }).click()),
  },
  // A subject on Today into the subject's contents.
  subject: {
    setup: (page) => go(page, ''),
    act: (page) => page.locator('main .title-grid a').first().click(),
  },
  // A tool in the list into its page.
  tool: {
    setup: (page) => go(page, 'tools'),
    act: (page) => page.locator('main .tool-link').first().click(),
  },
  // The work sheet on a phone, and the contents sheet.
  'sheet-open': {
    setup: (page) => go(page, 'book/physics/XI/2'),
    act: (page, vp) => (isPhone(vp) ? page.locator('.dock button', { hasText: 'Work' }).click() : page.locator('.rail button', { hasText: 'Work' }).click()),
  },
  'sheet-close': {
    setup: async (page, vp) => {
      await go(page, 'book/physics/XI/2');
      await (isPhone(vp) ? page.locator('.dock button', { hasText: 'Work' }).click() : page.locator('.rail button', { hasText: 'Work' }).click());
      await page.waitForTimeout(800);
    },
    act: (page) => page.locator('.work-close').click(),
  },
  theme: {
    setup: (page) => go(page, 'settings'),
    act: (page) => page.locator('main button', { hasText: 'Blackboard' }).click(),
  },
  'seg-slide': {
    setup: (page) => go(page, 'settings'),
    act: (page) => page.locator('main button', { hasText: 'High' }).click(),
    clip: () => ({ x: 0, y: 0, width: 900, height: 420 }),
  },
};

// Later additions: the solver, marking, the first sight of Today, a list arriving, segments.
Object.assign(scenarios, {
  solver: {
    setup: async (page) => {
      await go(page, 'book/physics/XI/1');
      await page.locator('aside.work').getByRole('button', { name: /Average velocity/ }).first().click();
      await page.waitForTimeout(600);
      const fields = page.locator('aside.work .var-row input.field');
      for (let i = 0; i < (await fields.count()); i++) await fields.nth(i).fill(String(12 + i * 3));
    },
    act: (page) => page.locator('aside.work button[type="submit"]').click(),
    clip: () => ({ x: 1040, y: 0, width: 400, height: 900 }),
  },
  'solver-unknown': {
    setup: async (page) => {
      await go(page, 'book/physics/XI/1');
      await page.locator('aside.work').getByRole('button', { name: /Average velocity/ }).first().click();
      await page.waitForTimeout(900);
    },
    act: (page) => page.locator('aside.work .var-sym[aria-pressed="false"]').last().click(),
    clip: () => ({ x: 1040, y: 0, width: 400, height: 600 }),
  },
  answer: {
    setup: async (page) => {
      await go(page, 'book/physics/XI/1');
      await page.locator('main .row button[aria-label^="Practise"]').first().click();
      await page.waitForTimeout(1200);
    },
    act: async (page) => {
      const choice = page.locator('aside.work .choice').first();
      if (await choice.count()) await choice.click();
      else {
        const input = page.locator('aside.work #answer-value');
        if (await input.count()) {
          await input.fill('1');
          await page.locator('aside.work button', { hasText: 'Check answer' }).click();
        } else await page.locator('aside.work button', { hasText: /Check|Show/ }).first().click();
      }
    },
    clip: () => ({ x: 1040, y: 0, width: 400, height: 900 }),
  },
  today: {
    setup: (page) => page.goto('about:blank'),
    act: (page) => page.goto(BASE),
  },
  'list-arrives': {
    setup: (page) => go(page, 'saved'),
    act: (page) => page.evaluate(() => { location.hash = '#/find?q=velocity'; }),
  },
});
