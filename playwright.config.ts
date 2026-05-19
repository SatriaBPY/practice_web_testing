import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  globalSetup: "./setup/global_setup.ts",
  globalTeardown: "./setup/teardown_setup.ts",
  testDir: "./tests",
  testMatch: [
    //"e2e_login.spec.ts",
    "login.spec.ts",
    "product_detail_auth.spec.ts",
    "product_overview.spec.ts",
    "product_detail.spec.ts",
    "checkout_review.spec.ts",
    "checkout_billing_address.spec.ts",
    "checkout_payment.spec.ts",
  ],
  
  /* Run tests in files in parallel */
  expect: {
    timeout: 30_000,
  },
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
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
    // ['line'],
    ['github']
  ],
 
  use: {
    launchOptions: {
      slowMo: 350,
    },
    
    headless: true,

    actionTimeout: 10 * 1000,

    trace: 'off',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Automation Testing",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        
      },
    },
  ],
  // 
  // projects: [
  //     {
  //       name: 'Login-Suite',
  //       testMatch: /login\.spec\.ts/,
  //       grep: /@smoke|@regression/, 
  //     },
  //     {
  //       name: 'Product-Overview',
  //       testMatch: /product_overview\.spec\.ts/,
  //       grep: /@smoke|@regression/,
  //       dependencies: ['Login-Suite'],
  //     },
  //     {
  //       name: 'Product-Detail',
  //       testMatch: /product_detail\.spec\.ts/,
  //       grep: /@smoke|@regression/,
  //       dependencies: ['Product-Overview'],
  //     },
  //     {
  //       name: 'Checkout-Flow',
  //       testMatch: [
  //         /checkout_review\.spec\.ts/,
  //         /checkout_billing_address\.spec\.ts/,
  //         /checkout_payment\.spec\.ts/
  //       ],
  //       grep: /@smoke|@regression/,
  //       dependencies: ['Product-Detail'],
  //     },
  //     {
  //       name: 'E2E-Final-Check',
  //       testMatch: /e2e_login\.spec\.ts/,
  //       grep: /@smoke|@regression/,
  //       dependencies: ['Checkout-Flow'],
  //     },
  //   ],
});
 
