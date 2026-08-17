import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 120000, // Maximum time one test can run for
  expect: {
    timeout: 15000, // Maximum time expect() should wait for the condition to be met
  },
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://tochucsukien-binhnguyen.space',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
