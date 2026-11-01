// Draws the app icons and iOS splash screens into public/. Run by hand when the
// artwork changes (`node scripts/make-icons.mjs`); the results are committed, so a
// normal build doesn't need a browser.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const PAPER = '#f7f8f4';
const RULE = '#c7d3dc';
const MARGIN = '#a8152d';
const INK = '#15202b';

// A slab-serif sigma, the sum of a page of formulas. Drawn as a path so that the SVG
// favicon doesn't depend on any font being present.
const SIGMA = 'M176 116H396L408 196H392C384 160 366 146 322 146H240L322 252L232 366H330C372 366 390 350 400 312H416L400 396H176V384L276 258L176 128Z';

function rules() {
  let out = '';
  for (let y = 92; y < 512; y += 64) out += `<rect x="0" y="${y}" width="512" height="5" fill="${RULE}"/>`;
  return `${out}<rect x="112" y="0" width="9" height="512" fill="${MARGIN}"/>`;
}

/** Full-bleed artwork. Everything that matters sits inside the maskable safe circle. */
const fullBleed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="${PAPER}"/>${rules()}<path d="${SIGMA}" fill="${INK}"/></svg>`;

/** The same artwork with rounded corners, for places that show the icon as it is. */
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><clipPath id="c"><rect width="512" height="512" rx="88"/></clipPath></defs><g clip-path="url(#c)"><rect width="512" height="512" fill="${PAPER}"/>${rules()}<path d="${SIGMA}" fill="${INK}"/></g></svg>`;

const ICONS = [
  ['public/icons/icon-192.png', rounded, 192],
  ['public/icons/icon-512.png', rounded, 512],
  ['public/icons/maskable-192.png', fullBleed, 192],
  ['public/icons/maskable-512.png', fullBleed, 512],
  // iOS applies its own mask and shows transparency as black.
  ['public/icons/apple-touch-icon.png', fullBleed, 180],
];

// Physical pixel sizes of the iPhones index.html lists.
const SPLASH = [[1320, 2868], [1206, 2622], [1290, 2796], [1179, 2556], [1284, 2778], [1170, 2532], [1125, 2436], [1242, 2688], [828, 1792], [750, 1334]];

mkdirSync('public/icons', { recursive: true });
mkdirSync('public/splash', { recursive: true });
writeFileSync('public/icons/favicon.svg', rounded);

const browser = await chromium.launch({ channel: 'msedge' });

for (const [path, svg, size] of ICONS) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path, omitBackground: true });
  await page.close();
}

const font = readFileSync('node_modules/@fontsource-variable/besley/files/besley-latin-wght-normal.woff2').toString('base64');
for (const [w, h] of SPLASH) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const icon = Math.round(w * 0.24);
  const title = Math.round(w * 0.066);
  await page.setContent(`<!doctype html><style>
    @font-face { font-family: Besley; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 400 900; }
    html, body { margin: 0; height: 100%; background: ${PAPER}; }
    body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${Math.round(w * 0.05)}px; }
    svg { width: ${icon}px; height: ${icon}px; display: block; }
    p { margin: 0; font: 700 ${title}px Besley, serif; color: ${INK}; }
  </style>${rounded}<p>ISC Formula Book</p>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/splash/splash-${w}x${h}.png` });
  await page.close();
}

await browser.close();
console.log(`Wrote ${ICONS.length} icons, a favicon and ${SPLASH.length} splash screens.`);
