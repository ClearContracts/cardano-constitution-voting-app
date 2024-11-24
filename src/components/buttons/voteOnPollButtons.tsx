import { useEffect, useState } from 'react';
import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import { Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { castVote } from '@/lib/helpers/castVote';
import { getPollVote } from '@/lib/helpers/getPollVote';

interface Props {
  pollName: string;
  pollId: string;
  isActiveVoter: boolean;
  hashedText: string;
  link: string;
}

/**
 * Yes, No, Abstain buttons to vote on a poll
 * @param pollName - The name of the poll
 * @param pollId - The ID of the poll
 * @param isActiveVoter - Whether the user is the active voter
 * @returns Vote on Poll Buttons
 */
export function VoteOnPollButtons(props: Props): JSX.Element {
  const { pollName, pollId, isActiveVoter, hashedText, link } = props;
  const [vote, setVote] = useState('');
  const [disabled, setDisabled] = useState(false);

  const session = useSession();
  const theme = useTheme();

  async function handleVote(vote: string): Promise<void> {
    setDisabled(true);
    const result = await castVote(
      pollName,
      pollId,
      hashedText,
      link,
      vote,
      session.data?.user.stakeAddress,
      session.data?.user.walletName,
    );
    if (result.succeeded === false) {
      toast.error(result.message);
    } else {
      toast.success('Vote recorded!');
    }
    setDisabled(false);
  }

  // get the user's vote from the db
  useEffect(() => {
    async function getVote(): Promise<void> {
      if (session.data?.user.id) {
        const recordedVote = await getPollVote(session.data.user.id, pollId);
        setVote(recordedVote.vote);
      }
    }
    // only fetch the vote after the vote has been recorded
    if (session.data?.user.id && disabled == false) {
      getVote();
    }
  }, [session.data?.user.id, pollId, disabled]);

  return (
    <>
      {session.status == 'authenticated' && (
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          {vote && isActiveVoter && (
            <Box display="flex" flexDirection="row" gap={1}>
              <Typography variant="h5" fontWeight="bold">
                Your Vote:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                data-testid="vote-status"
                color={
                  vote === 'yes'
                    ? 'success'
                    : vote === 'no'
                      ? 'warning'
                      : theme.palette.text.primary
                }
              >
                {vote.toUpperCase()}
              </Typography>
            </Box>
          )}
          {!isActiveVoter && !session.data?.user.isCoordinator && (
            <Typography variant="h6" fontWeight="bold">
              You are not the active voter for your workshop. Only the active
              voter can vote.
            </Typography>
          )}
          {isActiveVoter && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              alignItems="center"
            >
              <Typography color={!isActiveVoter ? 'textDisabled' : ''}>
                {vote ? 'Re-cast' : 'Cast'} your vote:
              </Typography>
              <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  color="success"
                  sx={{
                    width: '150px',
                  }}
                  endIcon={<ThumbUpRounded />}
                  size="large"
                  onClick={() => handleVote('yes')}
                  disabled={disabled || !isActiveVoter}
                  data-testid="vote-yes-button"
                >
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{
                    width: '150px',
                  }}
                  endIcon={<ThumbDownRounded />}
                  size="large"
                  onClick={() => handleVote('no')}
                  disabled={disabled || !isActiveVoter}
                  data-testid="vote-no-button"
                >
                  No
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    width: '150px',
                  }}
                  endIcon={<DoDisturbRounded />}
                  size="large"
                  onClick={() => handleVote('abstain')}
                  disabled={disabled || !isActiveVoter}
                  data-testid="vote-abstain-button"
                >
                  Abstain
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
