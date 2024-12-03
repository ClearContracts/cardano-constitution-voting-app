import { CardanoTestWalletJson } from '@cardanoapi/cardano-test-wallet/types';

export type StaticWallet = CardanoTestWalletJson & {
  stakeAddress: string;
  address: string;
};
