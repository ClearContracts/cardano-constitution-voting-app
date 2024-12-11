import { CardanoTestWalletJson } from '@cardanoapi/cardano-test-wallet/types';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { StaticWallet } from '@types';
import loadEternlExtension from './loadExtension';
import LoginPage from '@pages/loginPage';

export async function injectWalletExtension(
  page: Page,
  wallet: StaticWallet | CardanoTestWalletJson
): Promise<void> {
  await page.addInitScript((wallet) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(window.cardanoTestWallet){
          //@ts-ignore
      window.cardanoTestWallet.wallet=wallet
    }else{
      //@ts-ignore
      window.cardanoTestWallet={wallet}
    }
   
    //@ts-ignore

  }, wallet);
}


export async function pageWithInjectedWallet(context:BrowserContext|Browser, wallet:StaticWallet): Promise<Page> {
  const page = await context.newPage();
  await loadEternlExtension(page);

  await injectWalletExtension(page, wallet);

  const loginPage = new LoginPage(page);
  await loginPage.login();
  return page;
}
export const importWallet = injectWalletExtension