import {
  alternateWallets,
  delegateWallets,
  organizerWallets,
} from '@constants/staticWallets';
import { importWallet } from '@fixtures/importWallet';
import loadDemosExtension from '@fixtures/loadExtension';
import { Browser, Page } from '@playwright/test';
import { StaticWallet } from '@types';

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

  await loadDemosExtension(
    newPage,
    extensionConfig.enableStakeSigning,
    extensionConfig.supportedExtensions
  );
  await importWallet(newPage, wallet);

  return newPage;
}

export async function newDelegatePage(browser: Browser, index: number) {
  return await createNewPageWithWallet(browser, {
    storageState: `.auth/delegate${index + 1}.json`,
    wallet: delegateWallets[index],
  });
}

export async function newAlternatePage(browser: Browser, index: number) {
  return await createNewPageWithWallet(browser, {
    storageState: `.auth/alternate${index + 1}.json`,
    wallet: alternateWallets[index],
  });
}

export async function newOrganizerPage(browser: Browser, index: number) {
  return await createNewPageWithWallet(browser, {
    storageState: `.auth/organizer${index + 1}.json`,
    wallet: organizerWallets[index],
  });
}

export async function newOrganizer1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/organizer1.json',
    wallet: organizerWallets[0],
  });
}

export async function newDelegate1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate1.json',
    wallet: delegateWallets[0],
  });
}

export async function newAlternate1Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate1.json',
    wallet: alternateWallets[0],
  });
}

export async function newDelegate2Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate2.json',
    wallet: delegateWallets[1],
  });
}
export async function newAlternate2Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate2.json',
    wallet: alternateWallets[1],
  });
}

export async function newDelegate3Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/delegate3.json',
    wallet: delegateWallets[2],
  });
}

export async function newAlternate3Page(browser) {
  return await createNewPageWithWallet(browser, {
    storageState: '.auth/alternate3.json',
    wallet: alternateWallets[2],
  });
}
