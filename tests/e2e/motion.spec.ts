// The motion system's promises (DESIGN.md, Motion): reduced motion moves nothing, a keyboard action
// waits on nothing, an interrupted transition leaves the right page, and the first load stays small.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, test, type Page } from '@playwright/test';
import { watchProblems } from './helpers';

/**
 * Records every animation that runs from now on, with the properties its keyframes move.
 * View Transition pseudo-elements are included, since document.getAnimations() sees them.
 */
async function recordAnimations(page: Page): Promise<void> {
  await page.evaluate(() => {
    const seen = new Map<Animation, { target: string; moves: string[] }>();
    (window as unknown as { __anims: typeof seen }).__anims = seen;
    const MOVES = /translate|scale|rotate|matrix|skew/;
    const look = () => {
      for (const a of document.getAnimations()) {
        if (seen.has(a)) continue;
        const effect = a.effect as KeyframeEffect | null;
        const frames = effect?.getKeyframes?.() ?? [];
        // A property moves something only if its keyframes differ and one of them isn't at rest.
        const moves = ['transform', 'translate', 'scale', 'rotate'].flatMap((k) => {
          const values = frames.map((f) => (f as Record<string, unknown>)[k]).filter((v): v is string => typeof v === 'string');
          const distinct = new Set(values);
          const away = values.some((v) => MOVES.test(v) && !/^(none|translate\(0px(, 0px)?\)|matrix\(1, 0, 0, 1, 0, 0\))$/.test(v));
          return distinct.size > 1 && away ? [`${k}: ${[...distinct].join(' → ')}`] : [];
        });
        const target = `${(effect?.target as Element | null)?.className?.toString?.() ?? ''}${effect?.pseudoElement ?? ''}`;
        seen.set(a, { target, moves });
      }
      requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  });
}

async function movingAnimations(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const seen = (window as unknown as { __anims: Map<Animation, { target: string; moves: string[] }> }).__anims;
    return [...seen.values()].filter((a) => a.moves.length).map((a) => `${a.target} ${a.moves.join('; ')}`);
  });
}

async function openBook(page: Page, hash = 'book/physics/XI'): Promise<void> {
  await page.goto(`/#/${hash}`);
  await expect(page.locator('main h1')).toBeVisible();
  // Page turns load just after first paint.
  await page.waitForFunction(() => document.styleSheets.length > 1 && [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.cssText.includes('turn-in')); } catch { return false; } }));
}

test.describe('reduced motion', () => {
  test('from the device: page changes, sheets and lists move nothing, but still fade', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', hasTouch: true });
    const page = await context.newPage();
    const problems = watchProblems(page);
    await openBook(page);
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('reduce');
    await recordAnimations(page);
    await page.locator('main nav[aria-label="Units"] a').nth(2).click();
    await expect(page.locator('main h1')).toHaveText('Laws of Motion');
    await page.locator('.dock button', { hasText: 'Work' }).click();
    await expect(page.getByRole('tab', { name: 'Solve' })).toBeVisible();
    await page.locator('.work-close').click();
    // Up a level, by the running head: a page turn back.
    await page.locator('main .crumbs a').first().click();
    await expect(page.locator('main h1')).toContainText('Physics, Class XI');
    await page.waitForTimeout(600);
    expect(await movingAnimations(page)).toEqual([]);
    // Something did change gently: a cross-fade ran for the page change.
    expect(await page.evaluate(() => [...(window as unknown as { __anims: Map<Animation, { target: string }> }).__anims.values()].some((a) => a.target.includes('view-transition')))).toBe(true);
    expect(problems).toEqual([]);
    await context.close();
  });

  test('the setting overrides the device, both ways, and survives a reload', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/#/settings');
    const group = page.getByRole('group', { name: 'Reduce motion' });
    await expect(group.getByRole('button', { name: 'Match device' })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('full');
    await group.getByRole('button', { name: 'Reduced' }).click();
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('reduce');
    await page.reload();
    // Set before the app's own code runs, so the first paint already has it.
    expect(await page.evaluate(() => document.documentElement.dataset.motion)).toBe('reduce');
    await context.close();

    const reducing = await browser.newContext({ reducedMotion: 'reduce' });
    const second = await reducing.newPage();
    await second.goto('/#/settings');
    expect(await second.evaluate(() => document.documentElement.dataset.motion)).toBe('reduce');
    await second.getByRole('group', { name: 'Reduce motion' }).getByRole('button', { name: 'Full' }).click();
    expect(await second.evaluate(() => document.documentElement.dataset.motion)).toBe('full');
    await reducing.close();
  });

  test('with Reduced chosen, a page change moves nothing', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await context.addInitScript(() => localStorage.setItem('isc-motion', 'reduce'));
    const page = await context.newPage();
    await openBook(page);
    await recordAnimations(page);
    await page.locator('main nav[aria-label="Units"] a').nth(1).click();
    await expect(page.locator('main h1')).toHaveText('Kinematics');
    await page.waitForTimeout(600);
    expect(await movingAnimations(page)).toEqual([]);
    await context.close();
  });
});

test.describe('motion with full motion on', () => {
  test('a page change from a pointer is a page turn, and it ends cleanly', async ({ page }) => {
    await openBook(page);
    await recordAnimations(page);
    await page.locator('main nav[aria-label="Units"] a').nth(2).click();
    await expect(page.locator('main h1')).toHaveText('Laws of Motion');
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.page ?? 'done')).toBe('done');
    const moving = await movingAnimations(page);
    expect(moving.some((m) => m.includes('view-transition-new(page)'))).toBe(true);
    // Nothing is left named or marked once it's over.
    expect(await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]')].filter((el) => el.style.viewTransitionName).length)).toBe(0);
  });

  test('the app answers clicks while a page is turning', async ({ page }) => {
    await openBook(page);
    // Slow every animation right down, so the turn is certainly still running.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Animation.enable');
    await cdp.send('Animation.setPlaybackRate', { playbackRate: 0.05 });
    await page.locator('main nav[aria-label="Units"] a').nth(2).click();
    await expect(page.locator('main h1')).toHaveText('Laws of Motion');
    expect(await page.evaluate(() => document.documentElement.dataset.page)).toBe('forward');
    // The new page's own controls take the click mid-turn.
    await page.locator('main .row-name button').first().click();
    await expect(page.locator('main .row[data-open="true"]')).toHaveCount(1);
    await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 });
  });
});

test.describe('keyboard actions never wait', () => {
  test('Find opens at once from / and from Ctrl+K, with nothing animating it', async ({ page }) => {
    await page.goto('/#/book/physics/XI');
    await expect(page.locator('main h1')).toBeVisible();
    // Find is put on the page, closed, once the browser is idle, so the first opening is instant too.
    await page.locator('dialog.palette').waitFor({ state: 'attached' });
    for (const keys of ['/', 'Control+k']) {
      await page.waitForTimeout(300);
      const opened = await page.evaluate(async (k) => {
        const start = performance.now();
        const [key, ctrl] = k === '/' ? ['/', false] : ['k', true];
        window.dispatchEvent(new KeyboardEvent('keydown', { key, ctrlKey: ctrl, bubbles: true }));
        // Open within a frame or two of the key.
        for (let i = 0; i < 20; i++) {
          const dialog = document.querySelector<HTMLDialogElement>('dialog.palette');
          if (dialog?.open) {
            return { ms: performance.now() - start, moving: dialog.getAnimations().length, opacity: getComputedStyle(dialog).opacity };
          }
          await new Promise((r) => requestAnimationFrame(r));
        }
        return null;
      }, keys);
      expect(opened, `${keys} opened Find`).not.toBeNull();
      // The first opening draws Find for the first time (v7 took about 390 ms here); after that it's a frame.
      expect(opened!.ms).toBeLessThan(keys === '/' ? 200 : 60);
      expect(opened!.moving).toBe(0);
      expect(opened!.opacity).toBe('1');
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog.palette[open]')).toHaveCount(0);
    }
  });

  test('a link followed with Enter changes the page at once, with no page turn', async ({ page }) => {
    await openBook(page);
    await recordAnimations(page);
    const link = page.locator('main nav[aria-label="Units"] a').nth(1);
    await link.focus();
    const ms = await page.evaluate(async () => {
      const start = performance.now();
      (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      (document.activeElement as HTMLAnchorElement).click();
      for (let i = 0; i < 30; i++) {
        if (document.querySelector('main h1')?.textContent === 'Kinematics') return performance.now() - start;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return -1;
    });
    expect(ms).toBeGreaterThanOrEqual(0);
    expect(ms).toBeLessThan(400);
    await page.waitForTimeout(300);
    expect((await movingAnimations(page)).filter((m) => m.includes('view-transition'))).toEqual([]);
  });

  test('the working sheet opens and closes from the keyboard with nothing moving', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await openBook(page, 'book/physics/XI/2');
    await recordAnimations(page);
    await page.locator('.dock button', { hasText: 'Work' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tab', { name: 'Solve' })).toBeVisible();
    await expect(page.locator('dialog.sheet.work')).toHaveAttribute('data-instant', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.sheet.work[open]')).toHaveCount(0);
    expect((await movingAnimations(page)).filter((m) => m.includes('sheet'))).toEqual([]);
    await context.close();
  });
});

test.describe('interrupting a transition', () => {
  test('a second page change mid-turn lands on the second page, with nothing left over', async ({ page }) => {
    const problems = watchProblems(page);
    await openBook(page);
    await page.locator('main nav[aria-label="Units"] a').nth(2).click();
    // At once, before the first turn ends.
    await page.evaluate(() => {
      window.location.hash = '#/tools';
    });
    await expect(page.locator('main h1')).toHaveText('Tools');
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.page ?? 'done')).toBe('done');
    expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect as KeyframeEffect | null)?.pseudoElement?.includes('view-transition')).length)).toBe(0);
    expect(await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[style]')].filter((el) => el.style.viewTransitionName).length)).toBe(0);
    // And back, twice quickly, lands where history says.
    await page.goBack();
    await expect(page.locator('main h1')).toHaveText('Laws of Motion');
    await page.goBack();
    await expect(page.locator('main h1')).toContainText('Physics, Class XI');
    expect(problems).toEqual([]);
  });

  test('a sheet closed while it opens, and opened while it closes, ends in the right state', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await context.newPage();
    await openBook(page, 'book/physics/XI/2');
    const sheet = page.locator('dialog.sheet.work');
    const work = page.locator('.dock button', { hasText: 'Work' });
    // Open, then close before it lands: its content arrives a frame after the slide starts.
    await work.click();
    await page.locator('.work-close').click({ timeout: 2000 });
    await expect(sheet).not.toHaveAttribute('open', '');
    await page.waitForTimeout(800);
    expect(await sheet.evaluate((d) => getComputedStyle(d).display)).toBe('none');
    // Open, close, and open again before it has gone: it ends open, in place, with its content.
    await work.click();
    await page.waitForTimeout(60);
    await page.locator('.work-close').click();
    await page.waitForTimeout(60);
    await work.click();
    await expect(sheet).toHaveAttribute('open', '');
    await page.waitForTimeout(900);
    await expect(page.getByRole('tab', { name: 'Solve' })).toBeVisible();
    const box = await sheet.boundingBox();
    expect(box!.y).toBeLessThan(844 * 0.2);
    expect(await sheet.evaluate((d) => d.getAnimations().filter((a) => a.playState === 'running').length)).toBe(0);
    await context.close();
  });

  test('a swipe down on a phone sheet closes it, and a short one lets it settle back', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await openBook(page, 'book/physics/XI/2');
    await page.locator('.dock button', { hasText: 'Work' }).click();
    const sheet = page.locator('dialog.sheet.work');
    await expect(page.getByRole('tab', { name: 'Solve' })).toBeVisible();
    await page.waitForTimeout(700);
    const swipe = (distance: number, steps: number) =>
      page.evaluate(
        async ([d, n]) => {
          const target = document.querySelector('.work-tabs')!;
          const point = (y: number) => new Touch({ identifier: 1, target, clientX: 200, clientY: y });
          const fire = (type: string, y: number | null) =>
            target.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: y === null ? [] : [point(y)], changedTouches: [point(y ?? 120 + d)] }));
          fire('touchstart', 120);
          for (let i = 1; i <= n; i++) {
            fire('touchmove', 120 + (d * i) / n);
            await new Promise((r) => setTimeout(r, 16));
          }
          fire('touchend', null);
        },
        [distance, steps] as const,
      );
    // A short, slow pull settles back.
    await swipe(60, 12);
    await page.waitForTimeout(700);
    await expect(sheet).toHaveAttribute('open', '');
    expect((await sheet.boundingBox())!.y).toBeLessThan(120);
    // A quick flick closes it, even though it's short of a third.
    await swipe(140, 4);
    await expect(sheet).not.toHaveAttribute('open', '');
    await expect(page).not.toHaveURL(/work=/);
    await context.close();
  });
});

test('the first load stays within 2 KB (gzipped) of v7', async () => {
  // v7's first load, measured byte for byte from its build with Tailwind scanning src/ only
  // (v8's first commit), the same way as below: HTML, CSS and JS the first screen asks for.
  const V7_FIRST_LOAD_GZIP = 291_994;
  const dist = 'dist';
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const names = new Set([...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]));
  names.add('index.html');
  let gzip = 0;
  for (const name of names) gzip += gzipSync(readFileSync(join(dist, name)), { level: 9 }).length;
  expect(gzip - V7_FIRST_LOAD_GZIP).toBeLessThanOrEqual(2048);
});
