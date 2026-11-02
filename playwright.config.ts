import { defineConfig } from '@playwright/test';

// Uses the Edge already installed on this machine, so nothing extra is downloaded.
// PW_BROWSER=webkit runs Safari's engine instead, after `npx playwright install webkit`.
const webkit = process.env.PW_BROWSER === 'webkit';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    ...(webkit ? { browserName: 'webkit' as const } : { channel: 'msedge' }),
    trace: 'off',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
