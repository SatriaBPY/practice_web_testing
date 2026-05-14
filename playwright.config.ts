import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  globalSetup: "./setup/global_setup.ts",
  globalTeardown: "./setup/teardown_setup.ts",
  testDir: "./tests",
  // testMatch: [
  //   "e2e_login.spec.ts",
  //   "login.spec.ts",
  //   "product_overview.spec.ts",
  //   "product_detail.spec.ts",
  //   "checkout_review.spec.ts",
  //   "checkout_billing_address.spec.ts",
  //   "checkout_payment.spec.ts",
  // ],
  
  /* Run tests in files in parallel */
  expect: {
    timeout: 30_000,
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
    ["html", { outputFolder: "playwright-report" }],
    ["./custom_log/custom_reporter.ts"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: true,
        suiteTitle: false,
      },
    ],
    // ['dot'],
    // ['line']
  ],
 
  use: {
    launchOptions: {
      slowMo: 350,
    },
    
    headless: true,

    actionTimeout: 10 * 1000,

    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: "Automation Testing Chrome",
  //     use: {
  //       ...devices["Desktop Chrome"],
  //     },
  //   },
  // ],
  // 
  projects: [
      {
        name: 'Login-Suite',
        testMatch: /login\.spec\.ts/,
      },
      {
        name: 'Product-Overview',
        testMatch: /product_overview\.spec\.ts/,
        dependencies: ['Login-Suite'], 
      },
      {
        name: 'Product-Detail',
        testMatch: /product_detail\.spec\.ts/,
        dependencies: ['Product-Overview'],
      },
      {
        name: 'Checkout-Flow',
        testMatch: [
          /checkout_review\.spec\.ts/,
          /checkout_billing_address\.spec\.ts/,
          /checkout_payment\.spec\.ts/
        ],
        dependencies: ['Product-Detail'],
      },
      {
        name: 'E2E-Final-Check',
        testMatch: /e2e_login\.spec\.ts/,
        dependencies: ['Checkout-Flow'],
      },
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
