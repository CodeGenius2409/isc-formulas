// Run against `npm run preview` (port 4173): node scripts/motion/capture.mjs <scenario> <phone|desktop> [ms,...]
// Frames go to CAP_OUT/frames/<scenario>/<viewport>, with a filmstrip.png of all of them.
// Frame-by-frame capture of a transition: run an action, freeze every animation the moment it
// starts (View Transition pseudo-elements included), then step through time, screenshotting each.
// Usage: node capture.mjs <scenario> <phone|desktop> [frames ms, comma-separated]
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { scenarios } from './scenarios.mjs';

const [name, vpName = 'desktop', framesArg] = process.argv.slice(2);
const VP = { phone: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, desktop: { width: 1440, height: 900, deviceScaleFactor: 1 } }[vpName];
const frames = (framesArg ?? '0,40,80,120,160,220,280,360,460,600').split(',').map(Number);
const out = join(process.env.CAP_OUT ?? '.', 'frames', name, vpName);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({ viewport: { width: VP.width, height: VP.height }, deviceScaleFactor: VP.deviceScaleFactor, isMobile: VP.isMobile, hasTouch: VP.hasTouch, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference', colorScheme: process.env.DARK ? 'dark' : 'light' });
await context.addInitScript(() => {
  localStorage.setItem('isc-tour-test', 'off');
  // Freeze animations as soon as any start, after the action is armed.
  window.__freeze = () =>
    new Promise((resolve) => {
      const tick = () => {
        const anims = document.getAnimations().filter((a) => a.playState === 'running');
        if (anims.length) {
          anims.forEach((a) => a.pause());
          resolve(anims.length);
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => resolve(0), 3000);
    });
  window.__seek = (t) => {
    const anims = document.getAnimations();
    anims.forEach((a) => {
      a.pause();
      a.currentTime = t;
    });
    return anims.map((a) => `${a.effect?.pseudoElement ?? a.effect?.target?.className?.toString?.().slice(0, 30) ?? '?'}:${a.animationName ?? a.transitionProperty ?? 'waapi'}`).join(' | ');
  };
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
const scenario = scenarios[name];
await scenario.setup(page, vpName);
await page.waitForTimeout(400);
const frozen = page.evaluate(() => window.__freeze());
await scenario.act(page, vpName);
const count = await frozen;
const log = [`animations frozen: ${count}`];
for (const t of frames) {
  const what = await page.evaluate((t) => window.__seek(t), t);
  await page.waitForTimeout(30);
  await page.screenshot({ path: join(out, `${String(t).padStart(4, '0')}.png`), clip: scenario.clip?.(vpName) });
  if (t === frames[0]) log.push(what);
}
// A strip of every frame, for looking at in one go.
const imgs = frames.map((t) => `<figure><img src="data:image/png;base64,${readFileSync(join(out, `${String(t).padStart(4, '0')}.png`)).toString('base64')}"><figcaption>${t} ms</figcaption></figure>`).join('');
const strip = await context.newPage();
const cols = vpName === 'phone' ? 5 : 3;
await strip.setViewportSize({ width: vpName === 'phone' ? 1500 : 1800, height: 800 });
await strip.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;background:#888;font:12px sans-serif}img{width:100%;display:block}figure{margin:0}figcaption{color:#fff}</style>${imgs}`);
await strip.waitForTimeout(300);
await strip.screenshot({ path: join(out, 'filmstrip.png'), fullPage: true });
log.push(...errors.map((e) => `ERROR ${e}`));
writeFileSync(join(out, 'log.txt'), log.join('\n'));
console.log(log.join('\n'));
await browser.close();
