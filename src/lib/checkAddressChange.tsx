import type { Wallet } from '@claritydao/clarity-backend';
import { connectWallet } from '@claritydao/clarity-backend';
import * as Sentry from '@sentry/nextjs';

import { deriveStakeAddressFromRewardAddress } from '@/lib/deriveStakeAddressFromRewardAddress';

/**
 * This function checks if the user has changed their wallet since connecting
 * @param walletName - Name of the wallet to connect (ex: eternl, nami, etc)
 * @param currentStakeAddress - Current stake address of the user from the session
 * @returns boolean - True if the user has changed their wallet, false otherwise
 */
export async function checkAddressChange(
  walletName: string,
  currentStakeAddress: string,
): Promise<boolean> {
  try {
    // NOTE: After the initial connection, Yoroi returns a different wallet object than the other wallets.
    // This is why we must connect to the wallet each time we want to check the correct stake address.
    const wallet = await connectWallet(walletName);
    const { stakeAddress } = await deriveStakeAddressFromRewardAddress(wallet);

    if (currentStakeAddress !== stakeAddress) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    Sentry.captureException(error);
    return true;
  }
}
