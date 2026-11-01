/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/** KaTeX's stylesheet also lists .woff and .ttf files. Every browser that can run
 *  this app reads woff2, so the others would only bloat the offline precache. */
function katexWoff2Only(): Plugin {
  return {
    name: 'katex-woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('katex') || !id.split('?')[0].endsWith('.css')) return null;
      return code.replace(/,url\(fonts\/[^)]+\.woff\) format\("woff"\),url\(fonts\/[^)]+\.ttf\) format\("truetype"\)/g, '');
    },
  };
}

// `base: './'` keeps every asset URL relative, so the same dist/ folder works at
// a domain root (Vercel) and under a sub-path (GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [
    katexWoff2Only(),
    react(),
    tailwindcss(),
    VitePWA({
      // The app asks before updating, since reloading could end a practice session.
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: './',
        name: 'ISC Formula Book',
        short_name: 'ISC Formulas',
        description: 'Every ISC formula for Physics, Chemistry, Mathematics and Computer Science, with a problem solver, practice and simulators. Works offline.',
        lang: 'en',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f7f8f4',
        theme_color: '#eef1ea',
        categories: ['education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Today', url: './#/' },
          { name: 'Find a formula', url: './#/find' },
          { name: 'Progress', url: './#/practice' },
          { name: 'Tools', url: './#/tools' },
        ],
      },
      workbox: {
        // Everything the app can ask for, so every route works after one visit. The
        // splash images are left out: iOS reads those once, when it installs the app.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,webmanifest}'],
        globIgnores: ['splash/**'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 900 },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    testTimeout: 60_000,
  },
});
