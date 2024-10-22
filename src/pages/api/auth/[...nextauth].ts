/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// the shape of the user session object is defined in /types/next-auth.d.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      type: 'credentials',
      credentials: {
        stakeAddress: { label: 'Stake Address', type: 'text' },
        stakeAddressHex: { label: 'Stake Address Hex', type: 'text' },
        payload: { label: 'Payload', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        key: { label: 'Key', type: 'text' },
        walletName: { label: 'Wallet Name', type: 'text' },
        challenge: { label: 'Challenge', type: 'text' },
        isHardwareWallet: { label: 'Is Hardware Wallet', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        // let valid = false;

        // valid = await verifyWallet(
        //   credentials.payload,
        //   { signature: credentials.signature, key: credentials.key },
        //   credentials.challenge,
        //   '', // Just pass empty string here since it will always be a cardano wallet here
        // );

        if (true) {
          return {
            id: credentials.stakeAddress,
            stakeAddress: credentials.stakeAddress,
            walletName: credentials.walletName,
            isHardwareWallet: credentials.isHardwareWallet === 'true',
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.stakeAddress = user.stakeAddress;
        token.walletName = user.walletName;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.stakeAddress === 'string')
        session.user.stakeAddress = token.stakeAddress;
      if (typeof token.walletName === 'string')
        session.user.walletName = token.walletName;

      return Promise.resolve(session);
    },
    async signIn() {
      // https://next-auth.js.org/configuration/callbacks#sign-in-callback
      // TODO: ADD CHECK TO MAKE SURE THE USER HAS BEEN REGISTERED
      return true;
    },
  },
};

// // https://next-auth.js.org/configuration/initialization#advanced-initialization
export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<typeof NextAuth> {
  // https://next-auth.js.org/getting-started/client#additional-parameters
  return NextAuth(req, res, authOptions);
}