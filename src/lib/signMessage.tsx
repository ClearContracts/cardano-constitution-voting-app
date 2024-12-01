import { connectWallet as connectWalletClarity } from '@claritydao/clarity-backend';
import toast from 'react-hot-toast';

import { getChallenge } from '@/lib/helpers/getChallenge';

/**
 * Signs a message with a wallet.
 * Connects to the wallet via Clarity Backend, generates a challenge,
 * and signs the message with the wallet. Verified later with verifyWallet.
 * @param walletName - Name of the wallet to connect (ex: eternl, nami, etc)
 * @param message - Message to sign
 * @returns signature - Signature & key returned, initial payload
 * @returns challenge - Boolean Succeeded, challenge returned
 * @returns false - If the signature fails to sign
 */
export async function signMessage(
  walletName: string,
  message: string,
): Promise<
  | {
      signature: {
        signedMessage: {
          signature: string;
          key: string;
        };
        payload: string;
      };
      challenge: {
        succeeded: boolean;
        challenge: string | null;
      };
    }
  | false
> {
  const wallet = await connectWalletClarity(walletName);
  // @ts-expect-error getRewardAddresses is actually a proper function
  const stakeAddressHex = (await wallet.getRewardAddresses())[0];

  const challenge = await getChallenge();

  const messageWithChallenge = `${message}, Challenge: ${challenge.challenge}`;

  const messageHex = Buffer.from(messageWithChallenge).toString('hex');
  // @ts-expect-error signData is actually a proper function
  const signature = await wallet.signData(stakeAddressHex, messageHex);
  if (!signature.signature) {
    toast.error(
      'Failed to sign message. Please refresh the app and try again.',
    );
    return false;
  } else {
    return {
      signature: { signedMessage: signature, payload: messageWithChallenge },
      challenge: challenge,
    };
  }
}
