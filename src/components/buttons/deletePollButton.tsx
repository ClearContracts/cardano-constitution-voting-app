import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { paths } from '@/paths';
import { archivePoll } from '@/lib/helpers/archivePoll';

interface Props {
  pollId: string | string[] | undefined;
}

/**
 * A button for workshop coordinators to delete a poll
 * @param props - Poll ID
 * @returns Delete poll Button
 */
export function DeletePollButton(props: Props): JSX.Element {
  const { pollId } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = useSession();
  const router = useRouter();

  async function handleDeleteVote(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid pollId');
      return;
    }
    // Delete Poll
    setIsSubmitting(true);
    const result = await archivePoll(pollId);
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Poll deleted!');
      router.push(paths.home);
    }
    setIsSubmitting(false);
  }

  if (session.data?.user.isCoordinator) {
    return (
      <Button
        onClick={handleDeleteVote}
        variant="contained"
        disabled={isSubmitting}
        data-testid="delete-poll-button"
        color="error"
      >
        Yes, Delete
      </Button>
    );
  } else {
    return <></>;
  }
}
