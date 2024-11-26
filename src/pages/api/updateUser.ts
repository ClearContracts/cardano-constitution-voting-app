// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { checkIfCO } from '@/lib/checkIfCO';
import { checkIfVoting } from '@/lib/checkIfVoting';
import { getStringBytes } from '@/lib/getStringBytes';

type Data = {
  userId: string;
  message: string;
};
/**
 * Updates a user's name, email, and wallet address in the database
 * @returns UserId - The ID of the updated user
 * @returns Message - An error message if the user updating failed
 * @returns Status - 200 if successful, 400 if the user updating failed from user input, 500 if the user updating failed from an internal error
 */
export default async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ userId: BigInt(-1).toString(), message: 'Method not allowed' });
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        userId: BigInt(-1).toString(),
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        userId: BigInt(-1).toString(),
        message: 'User is not a convention organizer',
      });
    }

    const isVoting = await checkIfVoting();
    if (isVoting) {
      return res.status(401).json({
        userId: BigInt(-1).toString(),
        message:
          'You cannot update user information while a Poll is actively voting.',
      });
    }

    const { userId, name, email, wallet_address } = req.body;

    // TODO: Add data sanitization check. If fails sanitization return a message to the user.

    // validate name
    if (!name) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Name must be provided.',
      });
    }
    if (getStringBytes(name) > 64) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Name must be less than 64 characters.',
      });
    }
    // validate email
    if (!email) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Email must be provided.',
      });
    }
    if (email.length > 100) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Email must be less than 100 characters.',
      });
    }
    // validate wallet_address
    if (!wallet_address) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Wallet address must be provided.',
      });
    }
    if (wallet_address.length > 100) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Wallet address must be less than 100 characters.',
      });
    }
    if (wallet_address !== wallet_address.trim()) {
      return res.status(400).json({
        userId: BigInt(-1).toString(),
        message: 'Wallet address must not have leading or trailing whitespace.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: BigInt(userId),
      },
      data: {
        name: name,
        email: email,
        wallet_address: wallet_address,
      },
    });
    return res.status(200).json({
      userId: updatedUser.id.toString(),
      message: 'User info updated',
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      userId: BigInt(-1).toString(),
      message: 'Error updating user.',
    });
  }
}
