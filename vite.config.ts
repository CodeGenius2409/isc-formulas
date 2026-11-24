/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { pyodidePlugin, TRACER_CHUNKS, TRACER_LIST } from './scripts/lib/pyodide-files.mjs';

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
    // Pyodide's files, served from the app's own origin and never part of the offline download.
    pyodidePlugin(),
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
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,webmanifest}', `pyodide/*/${TRACER_LIST}`],
        // Nor is Pyodide, at over 10 MB, or the Python tracer's own code, which is no use without it. Both are
        // kept for offline use only if someone asks, in a cache of their own. The list of the tracer's files
        // is saved, so the page can tell offline whether they're all there.
        globIgnores: ['splash/**', 'pyodide/**/*.{mjs,wasm,zip}', ...TRACER_CHUNKS],
        runtimeCaching: [
          {
            // The Python tracer's code comes from that cache when it's there, and from the network when not.
            // When the cache exists, which is only while "Keep Python for offline use" is on, a newer copy
            // goes into it, so an update to the app keeps the tracer working offline.
            urlPattern: ({ url }) => /\/assets\/(PythonTracer|PythonEditor|python-worker)-[\w-]+\.(js|css)$/.test(url.pathname),
            handler: async ({ request }) => {
              // A host may send Vary: Origin, and a module's request carries an Origin the saved copy doesn't.
              const saved = await caches.match(request, { ignoreVary: true });
              if (saved) return saved;
              const response = await fetch(request);
              const keep = (await caches.keys()).filter((name) => name.startsWith('python-offline-'));
              if (response.ok && keep.length) await (await caches.open(keep[keep.length - 1])).put(request, response.clone());
              return response;
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    // The motion core is shared by the first screen and by pages that load later. On its own it would be one
    // more file on the first load, so it travels with the stores, which every screen loads anyway.
    // Vite's preload helper goes with them for the same reason: v8's idle imports would otherwise split it out.
    rolldownOptions: { output: { advancedChunks: { groups: [{ name: 'store', test: /src[\\/]lib[\\/](store|motion)\.ts$|preload-helper/ }] } } },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    testTimeout: 60_000,
    // A cached transform keeps a glob's old file list, which hid the bank's chapter files from the tests.
    fsModuleCache: false,
  },
});
