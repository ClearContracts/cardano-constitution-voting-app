import { useState } from 'react';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

import { startVoting } from '@/lib/helpers/startVoting';

interface Props {
  pollId: string | string[] | undefined;
}

/**
 * A button for workshop coordinators to open voting for a poll
 * @param pollId - The pollId of the poll to open voting for
 * @returns Begin Voting Button
 */
export function BeginVoteButton(props: Props): JSX.Element {
  const { pollId } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleBeginVote(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
    setIsSubmitting(true);
    // Begin Vote
    const result = await startVoting(pollId);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Poll voting is open!');
    }
    setIsSubmitting(false);
  }

  return (
    <Button
      onClick={handleBeginVote}
      variant="contained"
      disabled={isSubmitting}
      data-testid="begin-vote-button"
    >
      Begin Voting
    </Button>
  );
}
