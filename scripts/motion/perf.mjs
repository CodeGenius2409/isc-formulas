// Frame rates of the main transitions on a throttled mid-range phone profile: 390 x 844 at 2x, touch,
// and the CPU slowed 4x (Lighthouse's mid-range setting). Run against `npm run preview`:
//   node scripts/motion/perf.mjs [part of a scenario name]      BASE=http://localhost:4173/ by default
//
// Each transition is traced. Console timestamps mark the action, the first frame anything animates,
// and the moment every animation on the page has finished. From the second to the third, every frame the GPU process drew and swapped is
// counted (Graphics.Pipeline.DrawAndSwap): those are the frames that reached the screen. A gap between
// two of them of more than one and a half frame lengths counts the frames missing from it as dropped.
// The browser runs headed, off screen, so frames are paced by a real display, with the real GPU.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const RATE = Number(process.env.CPU ?? 4);
const browser = await chromium.launch({ channel: 'msedge', headless: false, args: ['--window-position=-3000,0', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });

async function newPage(desktop = false) {
  const ctx = await browser.newContext(desktop ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem('isc-tour-test', 'off'));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}

async function settle(page, hash) {
  await page.goto(`${BASE}#/${hash}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
}

/** Waits until nothing on the page is animating, then marks the end. Infinite ones don't count. */
async function markWhenStill(page, limit = 6000) {
  await page.evaluate(async (max) => {
    const start = performance.now();
    await new Promise((r) => requestAnimationFrame(r));
    while (performance.now() - start < max) {
      const moving = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity);
      if (!moving.length) break;
      await Promise.all(moving.map((a) => a.finished.catch(() => undefined)));
    }
    console.timeStamp('motion-end');
  }, limit);
}

async function measure(name, setup, act, { desktop = false, extra = 0 } = {}) {
  const { ctx, page, cdp } = await newPage(desktop);
  await setup(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  await page.waitForTimeout(300);
  await browser.startTracing(page, { categories: ['devtools.timeline', 'viz', 'gpu', 'benchmark'] });
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    console.timeStamp('motion-start');
    // And the first frame anything is animating: the motion proper starts there.
    const look = () => {
      if (document.getAnimations().some((a) => a.playState === 'running')) console.timeStamp('anim-start');
      else requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  });
  await act(page);
  if (extra) await page.waitForTimeout(extra);
  await markWhenStill(page);
  await page.waitForTimeout(100);
  const events = JSON.parse((await browser.stopTracing()).toString()).traceEvents ?? [];
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await ctx.close();
  const stamp = (m) => events.find((e) => e.name === 'TimeStamp' && e.args?.data?.message === m)?.ts;
  // Scrolling is motion with no animation object, so a fling is measured from the gesture.
  const t0 = (name.startsWith('Long list') ? null : stamp('anim-start')) ?? stamp('motion-start');
  const t1 = stamp('motion-end');
  const startedAfter = stamp('anim-start') ? Math.round((stamp('anim-start') - stamp('motion-start')) / 1000) : null;
  const swaps = [...new Set(events.filter((e) => e.name === 'Graphics.Pipeline.DrawAndSwap' && e.ph !== 'e' && e.ts >= t0 && e.ts <= t1).map((e) => e.ts))].sort((a, b) => a - b);
  // The display's own frame length, from the median gap between frames.
  const gaps = swaps.slice(1).map((s, i) => s - swaps[i]).sort((a, b) => a - b);
  const frame = Math.max(1e6 / 144, Math.min(1e6 / 50, gaps[Math.floor(gaps.length / 2)] ?? 1e6 / 60));
  let dropped = 0;
  let longest = 0;
  let longestAt = 0;
  for (let i = 1; i < swaps.length; i++) {
    const gap = swaps[i] - swaps[i - 1];
    if (gap > longest) {
      longest = gap;
      longestAt = swaps[i - 1] - t0;
    }
    if (gap > frame * 1.5) dropped += Math.round(gap / frame) - 1;
  }
  const ms = (t1 - t0) / 1000;
  const result = {
    name,
    // From the press to the first frame of motion: the page's own work, before anything moves.
    motionStartsAfterMs: startedAfter,
    motionMs: Math.round(ms),
    frames: swaps.length,
    // Frames while it moved: from the first frame drawn to the last.
    fps: swaps.length > 1 ? +((((swaps.length - 1) * 1e6) / (swaps[swaps.length - 1] - swaps[0]))).toFixed(1) : null,
    dropped,
    refreshHz: Math.round(1e6 / frame),
    longestFrameMs: Math.round(longest / 1000),
    longestFrameAtMs: Math.round(longestAt / 1000),
  };
  console.log(JSON.stringify(result));
  return result;
}

const unitLink = (p) => p.locator('main nav[aria-label="Units"] a').nth(2).click();
const plan = [
  ['Page turn forward, contents to a unit (phone)', (p) => settle(p, 'book/physics/XI'), unitLink],
  ['Page turn back, unit to contents (phone)', async (p) => { await settle(p, 'book/physics/XI'); await unitLink(p); await p.waitForTimeout(1500); }, (p) => p.locator('main .crumbs a').first().click()],
  ['Formula row growing into its page (phone)', async (p) => { await settle(p, 'book/physics/XI/2'); await p.locator('main .row-name button').first().click(); await p.waitForTimeout(500); }, (p) => p.locator('main .row a[aria-label^="Open"]').first().click()],
  ['Between sections, Today to Tools (phone)', (p) => settle(p, ''), (p) => p.locator('.dock a', { hasText: 'Tools' }).click()],
  ['Work sheet opening (phone)', (p) => settle(p, 'book/physics/XI/2'), (p) => p.locator('.dock button', { hasText: 'Work' }).click()],
  ['Work sheet dragged and thrown down (phone)', async (p) => { await settle(p, 'book/physics/XI/2'); await p.locator('.dock button', { hasText: 'Work' }).click(); await p.waitForTimeout(1200); }, (p) => p.evaluate(async () => {
    const target = document.querySelector('.work-tabs');
    const touch = (y) => new Touch({ identifier: 1, target, clientX: 200, clientY: y });
    target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch(100)], changedTouches: [touch(100)] }));
    for (let i = 1; i <= 24; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      target.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [touch(100 + i * 14)], changedTouches: [touch(100 + i * 14)] }));
    }
    target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [], changedTouches: [touch(436)] }));
  })],
  // Scrolled from script a step a frame, which ties it to the main thread: a hard case, harder than a
  // finger, since the list draws its rows as they arrive. (A synthesized touch fling drew too few frames
  // to measure in this setup.)
  ['Long list: the biggest unit scrolled through (phone)', async (p) => { await settle(p, 'book/physics/XII/5'); }, (p) => p.evaluate(async () => {
    const m = document.querySelector('main');
    for (let i = 0; i < 60; i++) { m.scrollBy(0, 140); await new Promise((r) => requestAnimationFrame(r)); }
  })],
  ['Theme, Paper to Blackboard (phone)', (p) => settle(p, 'settings'), (p) => p.locator('main button', { hasText: 'Blackboard' }).click()],
  ['Page turn forward (desktop, 1440 px)', (p) => settle(p, 'book/physics/XI'), unitLink, { desktop: true }],
];
const only = process.argv[2];
const results = [];
for (const [name, setup, act, opts] of plan) if (!only || name.includes(only)) results.push(await measure(name, setup, act, opts));
writeFileSync(process.env.PERF_OUT ?? 'test-results/motion-perf.json', JSON.stringify({ base: BASE, cpuThrottle: RATE, results }, null, 2));
await browser.close();
