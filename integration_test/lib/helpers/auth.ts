import { importWallet } from '@fixtures/importWallet';
import LoginPage from '@pages/loginPage';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { StaticWallet } from '@types';
import loadEternlExtension from '@fixtures/loadExtension';

interface CreateUserProps {
  page: Page;
  context: BrowserContext;
  wallet: StaticWallet;
  auth: string;
}

export async function createAuth({
  page,
  context,
  wallet,
  auth,
}: CreateUserProps): Promise<void> {
  await importWallet(page, wallet);

  await page.route('/api/getUser/*', (route, request) => {
    const userId = request.url().split('/').pop();
    if (userId) {
      page.evaluate((id) => {
        localStorage.setItem('userId', id);
      }, userId);
    }
    route.continue();
  });

  const loginPage = new LoginPage(page);
  await loginPage.login();
  await loginPage.isLoggedIn();

  await context.storageState({ path: auth });
}

interface NewPageConfig {
  storageState?: string;
  wallet: StaticWallet;
  enableStakeSigning?: boolean;
  supportedExtensions?: Record<string, number>[];
}

export async function createNewPageWithWallet(
  browser: Browser,
  newPageConfig: NewPageConfig
): Promise<Page> {
  const { storageState, wallet, ...extensionConfig } = newPageConfig;

  const context = await browser.newContext({
    storageState,
  });
  const newPage = await context.newPage();

  await loadEternlExtension(
    newPage,
    extensionConfig.enableStakeSigning,
    extensionConfig.supportedExtensions
  );
  await importWallet(newPage, wallet);

  return newPage;
}
