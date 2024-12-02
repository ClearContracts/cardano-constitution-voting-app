import { prisma } from '@/db';

/**
 * Gets the TX IDs based off of a list of poll_transaction IDs from the Poll Id.
 * @param pollTransactionIds - Array of poll_transaction IDs
 * @returns Array of TX IDs for the poll_transaction IDs provided
 */
export async function pollTxsDto(pollId: string): Promise<string[]> {
  const result = await prisma.poll_transaction.findMany({
    where: {
      poll_id: BigInt(pollId),
    },
    select: {
      transaction_id: true,
    },
  });

  const txIds = result.map((tx) => tx.transaction_id);

  return txIds;
}
