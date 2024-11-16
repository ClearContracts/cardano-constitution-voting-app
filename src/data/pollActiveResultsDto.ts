import { prisma } from '@/db';

import { convertBigIntsToStrings } from '@/lib/convertBigIntsToStrings';


/**
 * Gets and formats the results of all polls - Used for coordinators
 * @param pollId - The ID of the poll to get results for
 * @returns Results of the poll
 */
export async function pollActiveResultsDto(pollId: string): Promise<{
  yes: {
    name: string;
    id: string;
  }[];
  no: {
    name: string;
    id: string;
  }[];
  abstain: {
    name: string;
    id: string;
  }[];
}> {
  const votes = await prisma.poll_vote.findMany({
    where: {
      poll_id: BigInt(pollId),
    },
    select: {
      user_id: true,
      vote: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const convertedVotes = convertBigIntsToStrings(votes);

  const formattedVotes = convertedVotes.reduce(
    (
      acc: {
        [key: string]: {
          name: string;
          id: string;
        }[];
      },
      {
        user,
        user_id,
        vote,
      }: { user: { name: string }; user_id: string; vote: string },
    ) => {
      // Initialize the array for each vote choice if it doesn't exist
      if (!acc[vote]) {
        acc[vote] = [];
      }

      // Add the user object to the appropriate vote choice array
      acc[vote].push({
        name: user.name,
        id: user_id,
      });

      return acc;
    },
    { yes: [], no: [], abstain: [] },
  );

  if (isFormattedVotesCorrect(formattedVotes)) {
    return formattedVotes;
  } else {
    return {
      yes: [],
      no: [],
      abstain: [],
    };
  }
}

type Vote = {
  name: string;
  id: string;
};

type FormattedVotes = {
  yes: Vote[];
  no: Vote[];
  abstain: Vote[];
};

function isFormattedVotesCorrect(formattedVotes: {
  [key: string]: {
    name: string;
    id: string;
  }[];
}): formattedVotes is FormattedVotes {
  // Check if formattedVotes has the keys 'yes', 'no', and 'abstain' as arrays
  if (!formattedVotes || typeof formattedVotes !== 'object') return false;

  const keys: (keyof FormattedVotes)[] = ['yes', 'no', 'abstain'];

  for (const key of keys) {
    // Ensure the key exists and is an array
    if (!Array.isArray(formattedVotes[key])) {
      return false;
    }

    // Check each element in the array for `name` and `id` properties
    for (const entry of formattedVotes[key]) {
      if (typeof entry.name !== 'string' || typeof entry.id !== 'string') {
        return false;
      }
    }
  }

  return true;
}
