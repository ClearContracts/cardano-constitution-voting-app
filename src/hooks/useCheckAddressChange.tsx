import { useEffect } from 'react';
import { useWalletContext } from '@/context/WalletContext';
import { connectWallet } from '@claritydao/clarity-backend';
import { signOut, useSession } from 'next-auth/react';

import { checkAddressChange } from '@/lib/checkAddressChange';

let globalIntervalRef: NodeJS.Timeout | null = null;

/**
 * This hook checks if the user has changed their wallet since connecting.
 * If the user has changed their wallet, it will sign them out.
 */
export function useCheckAddressChange(): void {
  const { data: session } = useSession();
  const { wallet, updateWallet } = useWalletContext();

  useEffect(() => {
    checkAddress();

    async function checkAddress() {
      if (!wallet && session) {
        const walletObject = await connectWallet(session.user.walletName);
        updateWallet(walletObject);
      }

      async function handler(): Promise<void> {
        if (session && wallet) {
          const hasChanged = await checkAddressChange(
            session.user.walletName,
            session.user.stakeAddress,
          );
          if (hasChanged) {
            await signOut({ callbackUrl: '/' });
          }
        }
      }

      if (globalIntervalRef) {
        // Clear existing interval if one exists
        clearInterval(globalIntervalRef);
      }
      // Run the function every 3 seconds
      globalIntervalRef = setInterval(handler, 3000);

      // Cleanup the interval when the component unmounts
      return (): void => {
        if (globalIntervalRef) {
          clearInterval(globalIntervalRef);
          globalIntervalRef = null;
        }
      };
    }
  }, [session, wallet, updateWallet]);
}
