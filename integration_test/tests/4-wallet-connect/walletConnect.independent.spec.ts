import { setAllureEpic } from '@helpers/allure';
import LoginPage from '@pages/loginPage';
import { test } from '@fixtures/walletExtension';
import { organizerWallets } from '@constants/staticWallets';
import { expect } from '@playwright/test';

test.beforeEach(async () => {
  await setAllureEpic('4. Wallet connect');
});

test.use({ wallet: organizerWallets[0] });

test('4-1A. Should connect wallet if stake key is registered', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.isLoggedIn();
});

test('4-1B. Should disconnect Wallet When connected', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();

  await loginPage.logout();
  await expect(page.getByTestId('create-poll-button').first()).toBeVisible();
});
