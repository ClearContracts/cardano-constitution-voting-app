import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { Parser } from '@json2csv/plainjs';
import * as Sentry from '@sentry/nextjs';

/**
 * Generates excel file with a single delegate's votes
 * @param req - Request object
 * @param res - Response object
 * @returns 405 if not POST request, 500 if error, 200 if successful
 */
const downloadUserVotes = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse> => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' });
    }

    const userId = req.body.userId as string;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing userId' });
    }

    const userVotes = await prisma.poll_vote.findMany({
      where: {
        user_id: BigInt(userId),
      },
      include: {
        poll: true,
        poll_transaction: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
    });

    const workshop = await prisma.workshop.findUnique({
      where: {
        id: user?.workshop_id,
      },
    });

    const results: {
      poll: string;
      vote: string;
      signature: string;
      message: string;
      txId: string;
    }[] = [];

    for (const vote of userVotes) {
      results.push({
        poll: vote.poll.name,
        vote: vote.vote,
        signature: vote.signature,
        message: vote.hashed_message,
        txId: vote.poll_transaction?.transaction_id || '',
      });
    }

    const opts = {
      fields: ['poll', 'vote', 'signature', 'message', 'txId'],
    };
    const parser = new Parser(opts);
    const csv = parser.parse(results);

    // Set headers to prompt download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${user?.wallet_address || 'Unknown Wallet Address'} votes.csv`,
    );
    res.setHeader(
      'file-name',
      `${user?.name} - ${workshop?.name} - ${user?.is_delegate ? 'Delegate' : 'Alternate'} Votes.csv`,
    );

    return res.status(200).send(csv);
  } catch (err) {
    Sentry.captureException(err);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to create CSV file' });
  }
};

export default downloadUserVotes;
