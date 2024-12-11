// eslint-disable-next-line @typescript-eslint/no-require-imports

type MockData = {
  alternates: StaticWallet[];
  delegates: StaticWallet[];
  organizers: StaticWallet[];
};

const isMainnet=(environments.networkId == '1'  || environments.networkId == 'mainnet')
const file_suffix=isMainnet?'_mainnet': ''

const staticWallets: MockData = require(`../_mock/wallets${file_suffix}.json`);
import { StaticWallet } from '@types';
import environments from './environments';

export const delegateWallets: StaticWallet[] = staticWallets.delegates;
export const alternateWallets: StaticWallet[] = staticWallets.alternates;
export const organizerWallets: StaticWallet[] = staticWallets.organizers;
