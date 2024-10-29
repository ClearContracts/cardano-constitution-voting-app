import Button from '@mui/material/Button';

import { endVoting } from '@/lib/helpers/endVoting';

interface Props {
  pollId: string;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A button for workshop coordinators to end voting for a poll
 * @returns End Voting Button
 */
export function EndVoteButton(props: Props): JSX.Element {
  const { pollId, isSubmitting, setIsSubmitting } = props;
  // call new poll api with this name & description
  async function handleEndVote(): Promise<void> {
    setIsSubmitting(true);
    // End Vote
    await endVoting(pollId);
    setIsSubmitting(false);
  }

  return (
    <Button onClick={handleEndVote} variant="contained" disabled={isSubmitting}>
      End Voting
    </Button>
  );
}