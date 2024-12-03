import { defineConfig, devices } from '@playwright/test';
import { testPlanFilter } from 'allure-playwright/dist/testplan';
import { config } from 'dotenv';
import environments from './lib/constants/environments';

config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 60_000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!environments.ci,
  /* Retry on CI only */
  retries: environments.ci ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? parseInt(process.env.TEST_WORKERS || '1') : 1,
  /*use Allure Playwright's testPlanFilter() to determine the grep parameter*/
  grep: testPlanFilter(),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: environments.ci ? [['line'], ['allure-playwright']] : [['line']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: environments.baseUrl,

    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'loggedin (desktop)',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/*.independent.spec.ts'],
      dependencies: environments.ci ? ['auth setup'] : [],
    },
    {
      name: 'independent (desktop)',
      testMatch: '**/*independent.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'loggedin (mobile)',
      use: { ...devices['Pixel 5'] },
      testIgnore: ['**/*.independent.spec.ts'],
      dependencies: environments.ci ? ['auth setup'] : [],
    },
    {
      name: 'mobile',
      testMatch: '**/*independent.spec.ts',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'loggedin (tablet)',
      use: { ...devices['Galaxy Tab S4'] },
      testIgnore: ['**/*.independent.spec.ts'],
      dependencies: environments.ci ? ['auth setup'] : [],
    },
    {
      name: 'tablet',
      testMatch: '**/*independent.spec.ts',
      use: { ...devices['Galaxy Tab S4'] },
    },
    
    {
      name: 'on-chain',
      testMatch: 'y-on-chain-tests.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: environments.ci ? ['auth setup'] : [],
    },
    

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
