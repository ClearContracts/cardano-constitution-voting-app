import {
  CardanoTestWallet,
  CardanoTestWalletConfig,
} from '@cardanoapi/cardano-test-wallet/types';
import environments from '@constants/environments';
import { Page } from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-require-imports
import path = require('path');

export default async function loadEternlExtension(
  page: Page,
  enableStakeSigning?: boolean,
  supportedExtensions?: Record<string, number>[]
): Promise<void> {
  const eternlBundleScriptPath = path.resolve(
    __dirname,
    '../../node_modules/@cardanoapi/cardano-test-wallet/script.js'
  );
  const walletConfig: CardanoTestWalletConfig = {
    enableStakeSigning,
    kuberApiUrl: environments.kuber.apiUrl,
    kuberApiKey: environments.kuber.apiKey,
    networkId: parseInt(environments.networkId),
  };
  await page.addInitScript(
    ({ walletConfig, supportedExtensions }) => {
      window['cardanoTestWallet'] = {
        walletName: 'eternl',
        supportedExtensions,
        config: walletConfig,
      } as CardanoTestWallet;
    },
    { walletConfig, supportedExtensions }
  );

  await page.addInitScript({ path: eternlBundleScriptPath });
}
