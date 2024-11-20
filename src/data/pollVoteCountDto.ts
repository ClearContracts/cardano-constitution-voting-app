import { prisma } from '@/db';

/**
 * Gets the number of unique voters for a poll.
 * @param pollId - The poll id
 * @returns Number of unique voters for the poll
 */
export async function pollVoteCountDto(pollId: string): Promise<number> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
    },
    select: {
      user_id: true,
      user: {
        select: {
          workshop_user_workshop_idToworkshop: {
            select: {
              active_voter_id: true,
            },
          },
        },
      },
    },
  });

  // Only consider votes where the user is an active voter
  const activeVotes = votes.filter(
    (vote) =>
      Number(vote.user.workshop_user_workshop_idToworkshop.active_voter_id) ===
      Number(vote.user_id),
  );

  return activeVotes.length;
}
