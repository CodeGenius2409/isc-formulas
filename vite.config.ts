/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
  plugins: [katexWoff2Only(), react(), tailwindcss()],
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 900 },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    testTimeout: 60_000,
  },
});
