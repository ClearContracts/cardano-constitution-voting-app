// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

import { pollTxsDto } from '@/data/pollTxsDto';

type Data = string[];

/**
 * Gets the onchain transactions for a poll
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 500 if poll vote count failed from an internal error
 * @returns message - An error message if getting the poll vote count failed from an internal error
 * @returns count - The number of votes for the poll, 0 if error encountered
 */
export default async function getPollTransactions(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json([]);
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json([]);
    }

    const transactions = await pollTxsDto(pollId);

    return res.status(200).json(transactions);
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json([]);
  }
}
