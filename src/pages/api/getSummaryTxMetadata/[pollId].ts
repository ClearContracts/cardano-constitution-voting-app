// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { pollPhases } from '@/constants/pollPhases';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import * as Sentry from '@sentry/nextjs';
import { getServerSession } from 'next-auth';

import { pollDto } from '@/data/pollDto';
import { pollTransactionsDto } from '@/data/pollTransactionsDto';
import { pollVotesDto } from '@/data/pollVotesDto';
import { workshopsDto } from '@/data/workshopsDto';
import { checkIfCO } from '@/lib/checkIfCO';
import { getActiveVoterCount } from '@/lib/helpers/getActiveVoterCount';

type Data = { metadata: string[] | null; message: string };

/**
 * Constructs the metadata for the CO's transaction that includes all of the vote transactions for a poll
 * @param pollId - The ID of the poll
 * @returns status - 200 if successful, 500 if failed from an internal error
 * @returns message - A message indicating the status of the request
 * @returns metadata - The metadata for the TXs
 */
export default async function getSummaryTxMetadata(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res
        .status(405)
        .json({ metadata: null, message: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        metadata: null,
        message: 'User is not logged in',
      });
    }

    const stakeAddress = session.user.stakeAddress;
    const isCO = await checkIfCO(stakeAddress);
    if (!isCO) {
      return res.status(401).json({
        metadata: null,
        message: 'User is not a convention organizer',
      });
    }

    const pollId = req.query.pollId;

    if (typeof pollId !== 'string') {
      return res.status(400).json({
        metadata: null,
        message: 'Invalid pollId',
      });
    }

    const poll = await pollDto(pollId);
    if (poll?.status !== pollPhases.concluded) {
      return res.status(400).json({
        metadata: null,
        message: 'Poll is not concluded',
      });
    }

    const pollVotes = await pollVotesDto(pollId);

    // If there are votes that have not been uploaded on-chain, return an error.
    const filteredPollVotes = pollVotes.filter(
      (vote) => vote.poll_transaction_id === null,
    );
    if (filteredPollVotes.length > 0) {
      return res.status(400).json({
        metadata: null,
        message: 'Not all votes have been uploaded on-chain',
      });
    }

    // Iterate through all poll votes and get array of unique poll_transaction IDs
    const pollTransactionIds: string[] = [];
    for (const vote of pollVotes) {
      if (vote.poll_transaction_id === null) {
        return res.status(400).json({
          metadata: null,
          message: 'Not all votes have been uploaded on-chain',
        });
      }
      if (!pollTransactionIds.includes(vote.poll_transaction_id)) {
        pollTransactionIds.push(vote.poll_transaction_id);
      }
    }

    // Iterate through poll_transaction IDs and get associated TX ID
    const txIds = await pollTransactionsDto(pollTransactionIds);

    const yesVotes = pollVotes.filter((vote) => vote.vote === 'yes').length;
    const noVotes = pollVotes.filter((vote) => vote.vote === 'no').length;
    const abstainVotes = pollVotes.filter(
      (vote) => vote.vote === 'abstain',
    ).length;

    const workshops = await workshopsDto();

    const activeWorkshops = workshops.filter(
      (workshop) => workshop.active_voter_id,
    );
    const activeVoterCount = activeWorkshops.length;

    const percentage =
      Math.round((yesVotes / (activeVoterCount - abstainVotes)) * 100) || 0;

    const constitutionHash = `Text Hash: ${poll.hashedText}`;
    const approvalString = `Approval Result: ${percentage}%`;
    const participationString = `Yes Votes: ${yesVotes}, No Votes: ${noVotes}`;
    const totalString = `Abstain Votes: ${abstainVotes}, Total Eligible Voters: ${activeVoterCount}`;

    const metadata = [
      constitutionHash,
      approvalString,
      participationString,
      totalString,
      'Transaction Hashes:',
      ...txIds,
    ];

    console.log(metadata);

    return res
      .status(200)
      .json({ metadata: metadata, message: 'Metadata constructed' });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).json({
      metadata: null,
      message: 'Error constructing metadata.',
    });
  }
}
