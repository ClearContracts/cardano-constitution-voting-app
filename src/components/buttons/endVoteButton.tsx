import { useState } from 'react';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { endVoting } from '@/lib/helpers/endVoting';
import { getPollResults } from '@/lib/helpers/getPollResults';

interface Props {
  pollId: string | string[] | undefined;
  updatePollResults: (newPollResults: {
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
  }) => void;
  onClick: () => void;
}

/**
 * A button for workshop coordinators to end voting for a poll
 * @param pollId - The pollId of the poll to end voting for
 * @param updatePollResults - Function to update the poll results after voting ends
 * @returns End Voting Button
 */
export function EndVoteButton(props: Props): JSX.Element {
  const { pollId, updatePollResults, onClick } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = useSession();

  async function handleEndVote(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
    setIsSubmitting(true);
    // End Vote
    const result = await endVoting(pollId);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      const pollResults = await getPollResults(pollId);
      if (!pollResults.votes) {
        toast.error('Error fetching poll results');
      } else {
        updatePollResults(pollResults.votes);
      }
      toast.success('Voting ended!');
    }
    setIsSubmitting(false);
    onClick();
  }

  if (session.data?.user.isCoordinator) {
    return (
      <Button
        onClick={handleEndVote}
        variant="contained"
        disabled={isSubmitting}
        data-testid="confirm-end-vote-button"
      >
        End Voting
      </Button>
    );
  } else {
    return <></>;
  }
}
