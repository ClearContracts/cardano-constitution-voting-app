import { prisma } from '@/db';

import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';

/**
 * Gets and formats the votes of all users for a poll from the DB
 * @param pollId - The ID of the poll
 * @returns String indicating how the user voted
 */
export async function pollVotesDto(pollId: string): Promise<
  {
    user: {
      is_delegate: boolean;
      workshop_id: string;
      name: string;
      wallet_address: string;
      id: string;
    };
    poll_transaction: {
      transaction_id: string;
    } | null;
    poll_id: string;
    user_id: string;
    vote: string;
    signature: string;
    hashed_message: string;
    poll_transaction_id: string | null;
  }[]
> {
  const pollVotes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
      poll: {
        status: 'concluded',
      },
    },
    include: {
      poll_transaction: {
        select: {
          transaction_id: true,
        },
      },
      user: {
        select: {
          name: true,
          workshop_id: true,
          wallet_address: true,
          is_delegate: true,
          id: true,
        },
      },
    },
  });

  const convertedPollVotes = convertBigIntsToStrings(pollVotes);

  return convertedPollVotes;
}
