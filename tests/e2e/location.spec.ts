// The contents, running head and URL follow the reader's scroll, in a list where most rows aren't in the DOM.
import { expect, test, type Page } from '@playwright/test';
import { openRoute, watchProblems } from './helpers';

const UNIT = 'book/physics/XI/1';

const highlighted = (page: Page) => page.locator('.toc-sub[aria-current="location"] .toc-num').innerText();
const runningHead = (page: Page) => page.locator('.running-head .here').innerText();
const sections = (page: Page) => page.locator('.toc-sub');

async function nameOfSection(page: Page, n: number): Promise<string> {
  return (await sections(page).nth(n - 1).locator('span').nth(1).innerText()).trim();
}

/** Wheels the list one way, until the highlight reaches `stop`. Returns each section passed. */
async function wheelTo(page: Page, stop: string, by: number): Promise<string[]> {
  const seen = [await highlighted(page)];
  await page.locator('main').hover();
  for (let i = 0; i < 400 && seen.at(-1) !== stop; i++) {
    await page.mouse.wheel(0, by);
    await page.waitForTimeout(40);
    const now = await highlighted(page);
    if (now !== seen.at(-1)) seen.push(now);
  }
  return seen;
}

async function expectHeadBelowRunningHead(page: Page, subtopic: number): Promise<void> {
  await expect
    .poll(() =>
      page.evaluate((s) => {
        const head = document.querySelector(`.section-head[data-subtopic="${s}"]`);
        const bar = document.querySelector('.running-head');
        return head && bar ? Math.abs(head.getBoundingClientRect().top - bar.getBoundingClientRect().bottom) <= 1 : false;
      }, subtopic),
    )
    .toBe(true);
}

test.describe('at 1440 px', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('click a section, scroll through the next two, and back', async ({ page }) => {
    const problems = watchProblems(page);
    await page.goto('/');
    await openRoute(page, UNIT);
    await sections(page).nth(2).click();
    await expect.poll(() => highlighted(page)).toBe('2.3');
    await expectHeadBelowRunningHead(page, 2);
    expect(page.url()).toContain('s=2');

    const down = await wheelTo(page, '2.5', 120);
    expect(down).toEqual(['2.3', '2.4', '2.5']);
    expect(await runningHead(page)).toBe(await nameOfSection(page, 5));
    expect(page.url()).toContain('s=4');

    const up = await wheelTo(page, '2.3', -120);
    expect(up).toEqual(['2.5', '2.4', '2.3']);
    expect(await runningHead(page)).toBe(await nameOfSection(page, 3));
    expect(page.url()).toContain('s=2');
    expect(problems).toEqual([]);
  });

  test('a jump to rows that were not in the DOM reports the right section', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await page.locator('main .row').first().waitFor();
    for (const fraction of [0.25, 0.5, 0.75, 0.4]) {
      await page.evaluate((f) => {
        const main = document.querySelector('main')!;
        main.scrollTop = main.scrollHeight * f;
      }, fraction);
      await page.waitForTimeout(250);
      // The first row under the running head says which section it belongs to.
      const fromRows = await page.evaluate(() => {
        const bar = document.querySelector('.running-head')!.getBoundingClientRect().bottom;
        const rows = [...document.querySelectorAll('[data-index]')];
        const row = rows.map((r) => ({ r, box: r.getBoundingClientRect() })).sort((a, b) => a.box.top - b.box.top).find((x) => x.box.bottom > bar + 1);
        return row?.r.querySelector('.row-num-section')?.textContent ?? row?.r.querySelector('.section-head .row-num')?.textContent ?? null;
      });
      expect(fromRows).not.toBeNull();
      await expect.poll(() => highlighted(page)).toBe(fromRows);
    }
  });

  test('clicking never flickers through other sections, even from far away', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await page.locator('main .row').first().waitFor();
    await page.evaluate(() => {
      const w = window as unknown as { seen: string[] };
      w.seen = [];
      const toc = document.querySelector('.toc')!;
      new MutationObserver(() => {
        const here = toc.querySelector('[aria-current="location"] .toc-num')?.textContent;
        if (here) w.seen.push(here);
      }).observe(toc, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    });
    await sections(page).nth(9).click();
    await page.waitForTimeout(900);
    const seen = await page.evaluate(() => (window as unknown as { seen: string[] }).seen);
    expect(new Set(seen)).toEqual(new Set(['2.10']));
    await expectHeadBelowRunningHead(page, 9);
  });

  test('the last section stays highlighted after a click, though it cannot reach the top', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await page.locator('main .row').first().waitFor();
    const count = await sections(page).count();
    await sections(page).nth(count - 1).click();
    await page.waitForTimeout(500);
    await expect.poll(() => highlighted(page)).toBe(`2.${count}`);
    expect(page.url()).toContain(`s=${count - 1}`);
  });

  test('scrolling adds no history, and a reload comes back to the section', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await sections(page).nth(3).click();
    await expect.poll(() => highlighted(page)).toBe('2.4');
    const before = await page.evaluate(() => history.length);
    await wheelTo(page, '2.7', 200);
    expect(await page.evaluate(() => history.length)).toBe(before);

    await page.reload();
    await expect.poll(() => highlighted(page)).toBe('2.7');
    await expect(page.locator('.running-head .here')).toHaveText(await nameOfSection(page, 7));
    await expectHeadBelowRunningHead(page, 6);

    await page.goBack();
    await expect(page).not.toHaveURL(/book\/physics\/XI\/1\?s=/);
  });

  test('a section link you are already on still takes you back to its start', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await sections(page).nth(4).click();
    await expect.poll(() => highlighted(page)).toBe('2.5');
    await page.locator('main').hover();
    await page.mouse.wheel(0, 60);
    await page.waitForTimeout(150);
    expect(await highlighted(page)).toBe('2.5');
    await sections(page).nth(4).click();
    await expectHeadBelowRunningHead(page, 4);
  });

  test('the top of a unit has no section, and the unit link goes back to it', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await page.locator('main .row').first().waitFor();
    await expect(page.locator('.toc-sub[aria-current="location"]')).toHaveCount(0);
    await expect(page.locator('.toc-unit[aria-current="location"]')).toHaveCount(1);
    expect(page.url()).not.toContain('s=');
    await sections(page).nth(5).click();
    await expect.poll(() => highlighted(page)).toBe('2.6');
    await page.locator('.toc-unit[data-open]').click();
    await expect.poll(() => page.evaluate(() => document.querySelector('main')!.scrollTop)).toBe(0);
    await expect(page.locator('.toc-sub[aria-current="location"]')).toHaveCount(0);
  });

  test('opening the working area does not move the page', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await sections(page).nth(3).click();
    await expect.poll(() => highlighted(page)).toBe('2.4');
    await wheelTo(page, '2.5', 120);
    await page.waitForTimeout(200);
    const top = await page.evaluate(() => document.querySelector('main')!.scrollTop);
    // A click from script, as Playwright's own click would scroll to the row first.
    await page.evaluate(() => {
      const bar = document.querySelector('.running-head')!.getBoundingClientRect().bottom;
      const row = [...document.querySelectorAll('main .row')].find((r) => r.getBoundingClientRect().top > bar);
      row!.querySelector<HTMLElement>('[aria-label^="Practise "]')!.click();
    });
    await page.waitForTimeout(300);
    expect(Math.abs((await page.evaluate(() => document.querySelector('main')!.scrollTop)) - top)).toBeLessThan(3);
    expect(page.url()).toContain('work=practice');
    expect(page.url()).toContain('s=4');
  });

  test('opening the syllabus note does not throw the reading place off', async ({ page }) => {
    await page.goto('/');
    await openRoute(page, UNIT);
    await page.locator('.syllabus-note summary').click();
    await page.locator('.syllabus-body').waitFor();
    await sections(page).nth(5).click();
    await expect.poll(() => highlighted(page)).toBe('2.6');
    await expectHeadBelowRunningHead(page, 5);
  });
});

test('a short window keeps the current section visible in the contents', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 500 });
  await page.goto('/');
  await openRoute(page, UNIT);
  await page.locator('main .row').first().waitFor();
  const count = await sections(page).count();
  await page.evaluate(() => {
    const main = document.querySelector('main')!;
    main.scrollTop = main.scrollHeight;
  });
  await expect.poll(() => highlighted(page)).toBe(`2.${count}`);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const box = document.querySelector('.toc')!.getBoundingClientRect();
        const here = document.querySelector('.toc-sub[aria-current="location"]')!.getBoundingClientRect();
        return here.top >= box.top && here.bottom <= box.bottom;
      }),
    )
    .toBe(true);
});

test('the phone sheet opens on the section being read, with it in view', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 780 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/#/book/physics/XI/1?s=11');
  await expect(page.locator('.section-head[data-subtopic="11"]')).toBeVisible();
  await page.evaluate(() => {
    const main = document.querySelector('main')!;
    main.scrollTop -= 1400;
  });
  await page.waitForTimeout(250);
  const head = await runningHead(page);
  await page.locator('.dock-item').filter({ hasText: 'Book' }).click();
  const here = page.locator('.sheet-contents .toc-sub[aria-current="location"]');
  await expect(here).toBeVisible();
  await expect(here).toContainText(head);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const box = document.querySelector('.sheet-contents .toc')!.getBoundingClientRect();
        const item = document.querySelector('.sheet-contents .toc-sub[aria-current="location"]')!.getBoundingClientRect();
        return item.top >= box.top && item.bottom <= box.bottom;
      }),
    )
    .toBe(true);
  await context.close();
});

test('a keyboard jump does not animate the contents', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 500 });
  await page.goto('/');
  await openRoute(page, UNIT);
  await page.locator('main .row').first().waitFor();
  await page.evaluate(() => {
    const w = window as unknown as { asked: string[] };
    w.asked = [];
    const toc = document.querySelector('.toc')!;
    const original = toc.scrollBy.bind(toc) as (o: ScrollToOptions) => void;
    (toc as unknown as { scrollBy: (o: ScrollToOptions) => void }).scrollBy = (o) => {
      w.asked.push(o.behavior ?? 'auto');
      original(o);
    };
  });
  await sections(page).nth(12).focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => highlighted(page)).toBe('2.13');
  const asked = await page.evaluate(() => (window as unknown as { asked: string[] }).asked);
  expect(asked).not.toContain('smooth');
});
