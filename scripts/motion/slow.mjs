// Slow-motion capture: every animation runs at 1/SLOW speed through the DevTools protocol, and
// screenshots are taken in real time. Usage: node slow.mjs <scenario> <phone|desktop> [ms list]
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { scenarios } from './scenarios.mjs';

const SLOW = Number(process.env.SLOW ?? 10);
const [name, vpName = 'desktop', framesArg] = process.argv.slice(2);
const VP = { phone: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, desktop: { width: 1440, height: 900, deviceScaleFactor: 1 } }[vpName];
const frames = (framesArg ?? '0,40,80,120,180,240,320,420,520,700').split(',').map(Number);
const out = join(process.env.CAP_OUT ?? '.', 'frames', name, vpName);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({ viewport: { width: VP.width, height: VP.height }, deviceScaleFactor: VP.deviceScaleFactor, isMobile: VP.isMobile, hasTouch: VP.hasTouch, reducedMotion: process.env.REDUCED ? 'reduce' : 'no-preference', colorScheme: process.env.DARK ? 'dark' : 'light' });
await context.addInitScript(() => localStorage.setItem('isc-tour-test', 'off'));
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
const scenario = scenarios[name];
await scenario.setup(page, vpName);
await page.waitForTimeout(500);
const cdp = await context.newCDPSession(page);
await cdp.send('Animation.enable');
await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
const start = Date.now();
await scenario.act(page, vpName);
for (const t of frames) {
  const wait = start + t * SLOW - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: join(out, `${String(t).padStart(4, '0')}.png`), clip: scenario.clip?.(vpName) });
}
await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 });
const imgs = frames.map((t) => `<figure><img src="data:image/png;base64,${readFileSync(join(out, `${String(t).padStart(4, '0')}.png`)).toString('base64')}"><figcaption>${t} ms</figcaption></figure>`).join('');
const strip = await context.newPage();
const cols = vpName === 'phone' ? 5 : 3;
await strip.setViewportSize({ width: vpName === 'phone' ? 1500 : 1800, height: 800 });
await strip.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;background:#888;font:12px sans-serif}img{width:100%;display:block}figure{margin:0}figcaption{color:#fff}</style>${imgs}`);
await strip.waitForTimeout(300);
await strip.screenshot({ path: join(out, 'filmstrip.png'), fullPage: true });
writeFileSync(join(out, 'log.txt'), [`slow ${SLOW}x`, ...errors.map((e) => `ERROR ${e}`)].join('\n'));
console.log(`${name} ${vpName}: ${frames.length} frames${errors.length ? `, ERRORS: ${errors.join(' | ')}` : ''}`);
await browser.close();
