import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  globalSetup: './setup/global_setup.ts',
  globalTeardown: './setup/teardown_setup.ts',  
  testDir: './tests',
  testMatch: [
    "e2e_login.spec.ts",
    "login.spec.ts",
    "product_overview.spec.ts",
    "product_detail.spec.ts",
    "checkout_review.spec.ts",
    "checkout_billing_address.spec.ts",
    "checkout_payment.spec.ts",
  ],
  /* Run tests in files in parallel */
  expect: {
    timeout: 3_0000
  },
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['./custom_log/custom_reporter.ts'],
    ['allure-playwright', {
          outputFolder: 'allure-results', 
          detail: true,  
          suiteTitle: false,
      }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,

    actionTimeout: 10 * 1000,
    
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

   
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
