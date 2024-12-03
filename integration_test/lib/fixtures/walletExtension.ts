import { test as base } from '@playwright/test';
import { StaticWallet } from '@types';
import { importWallet } from './importWallet';
import loadEternlExtension from './loadExtension';

type WalletExtensionTestOptions = {
  wallet?: StaticWallet;
  enableStakeSigning: boolean;
  supportedExtensions: Record<string, number>[];
};

export const test = base.extend<WalletExtensionTestOptions>({
  wallet: [null, { option: true }],

  enableStakeSigning: [true, { option: true }],

  supportedExtensions: [],

  page: async (
    { page, wallet, enableStakeSigning, supportedExtensions },
    use
  ) => {
    await loadEternlExtension(page, enableStakeSigning, supportedExtensions);

    if (wallet) {
      await importWallet(page, wallet);
    }

    await use(page);
  },
});
