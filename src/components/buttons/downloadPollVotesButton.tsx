import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

import { downloadPollVotes } from '@/lib/helpers/downloadPollVotes';

interface Props {
  pollId: string | string[] | undefined;
}

/**
 * Downloads all votes for a single poll and exports them to a CSV file
 * @param pollId - The ID of the poll to download votes for
 * @returns Button to download votes for a poll
 */
export function DownloadPollVotesButton(props: Props): JSX.Element {
  const { pollId } = props;

  async function handleClick(): Promise<void> {
    if (typeof pollId !== 'string') {
      toast.error('Invalid poll ID');
      return;
    }
    const response = await downloadPollVotes(pollId);
    if (response.succeeded) {
      toast.success(response.message);
      return;
    } else {
      toast.error(response.message);
      return;
    }
  }

  return (
    <Button
      type="button"
      variant="outlined"
      color="primary"
      onClick={handleClick}
      data-testid="download-poll-votes-btn"
    >
      Download CSV
    </Button>
  );
}
