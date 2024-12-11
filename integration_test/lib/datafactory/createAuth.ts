import { Page } from '@playwright/test';

const tempUserAuth = '.auth/tempUserAuth.json';

export async function createTempUserAuth(page: Page): Promise<string> {
  // Perform login operations here (e.g., fill login form and submit)

  await page.context().storageState({ path: tempUserAuth });
  return tempUserAuth;
}
