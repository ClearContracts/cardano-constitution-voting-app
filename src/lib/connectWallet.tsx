import {
  connectWallet as connectWalletClarity,
  type Wallet,
} from '@claritydao/clarity-backend';
import { Typography } from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

import { deriveStakeAddressFromRewardAddress } from '@/lib/deriveStakeAddressFromRewardAddress';
import { getChallenge } from '@/lib/helpers/getChallenge';

/**
 * Connects the user's wallet to the application. It first connects the webapp to the wallet
 * via the CIP-30 wallet connection. The connectWallet function from clarity-backend simply
 * calls the .enable() function on the wallet provider. Once the wallet is connected, it retrieves
 * the user's stake address and signs them in using the next-auth signIn function.
 * @param walletName - Name of the wallet to connect (ex: eternl, nami, etc)
 * @param updateWallet - Function to update the wallet context
 * @returns boolean - True if the wallet was successfully signed-in, false otherwise
 */
export async function connectWallet(
  walletName: string,
  updateWallet: (wallet: Wallet) => void,
): Promise<boolean> {
  try {
    const wallet = await connectWalletClarity(walletName);
    updateWallet(wallet);
    const timestamp = new Date().toLocaleString();
    const challenge = await getChallenge();
    const message = `Sign this message to verify wallet ownership.\nTimestamp: ${timestamp}\nChallenge: ${challenge.challenge}`;
    const messageHex = Buffer.from(message).toString('hex');

    // @ts-expect-error getNetworkId exists
    const network = await wallet.getNetworkId();
    if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet' && network !== 1) {
      toast.error('Please switch to Mainnet and try again.');
      return false;
    } else if (process.env.NEXT_PUBLIC_NETWORK === 'testnet' && network !== 0) {
      toast.error('Please switch to Preview Network and try again.');
      return false;
    }

    const { stakeAddress, stakeAddressHex } =
      await deriveStakeAddressFromRewardAddress(wallet);

    // @ts-expect-error getNetworkId is actually a proper function
    const signature = await wallet.signData(stakeAddressHex, messageHex);

    // Sign in is defined here pages/api/auth/[...nextauth].ts
    const signInResponse = await signIn('credentials', {
      redirect: false,
      stakeAddress: stakeAddress,
      stakeAddressHex: stakeAddressHex,
      payload: message,
      signature: signature.signature,
      key: signature.key,
      walletName: walletName,
      challenge: challenge.challenge,
    });
    if (!signInResponse || signInResponse.status !== 200) {
      toast.error(
        <Typography
          sx={{
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            maxWidth: '300px',
          }}
        >
          {`Only Representatives need to connect their wallet. ${stakeAddress} is not registered. `}
        </Typography>,
      );
      return false;
    } else {
      return true;
    }
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}
