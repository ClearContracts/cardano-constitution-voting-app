import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

import { downloadUserVotes } from '@/lib/helpers/downloadUserVotes';

interface Props {
  userId: string | string[] | undefined;
}

/**
 * Downloads all votes for a single delegate and exports them to a CSV file
 * @param userId - The ID of the user to download votes for
 * @returns Button to download votes
 */
export function DownloadUserVotesButton(props: Props): JSX.Element {
  const { userId } = props;

  async function handleClick(): Promise<void> {
    if (typeof userId !== 'string') {
      toast.error('Invalid user ID');
      return;
    }
    const response = await downloadUserVotes(userId);
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
      data-testid="download-user-votes-btn"
    >
      Download CSV
    </Button>
  );
}
