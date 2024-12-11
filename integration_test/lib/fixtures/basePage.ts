import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Set up the fixture.
    await page.goto('/');

    // Use the fixture value in the test.
    await use(page);
  },
});
