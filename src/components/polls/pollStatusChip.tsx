import { pollPhases } from '@/constants/pollPhases';
import { CircleRounded } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import Box from '@mui/material/Box';

interface Props {
  status: string;
  testId?: string;
}

/**
 * A Chip Representing a Poll Status
 * @param status - Poll Status (pending, voting, concluded)
 * @returns Chip with Status
 */
export function PollStatusChip(props: Props): JSX.Element {
  const { status,testId } = props;

  // If the status is not a valid poll phase, show it as unknown
  let pollStatusInfo: {
    text: 'Unknown' | 'Pending' | 'Voting' | 'Concluded';
    color: 'error' | 'warning' | 'success' | 'primary';
  } = { text: 'Concluded', color: 'primary' };
  if (!status || !Object.keys(pollPhases).includes(status)) {
    pollStatusInfo = { text: 'Unknown', color: 'error' };
  } else if (status === pollPhases.pending) {
    pollStatusInfo = { text: 'Pending', color: 'warning' };
  } else if (status === pollPhases.voting) {
    pollStatusInfo = { text: 'Voting', color: 'success' };
  }

  return (
    <Box data-testid={testId || 'poll-status-chip'}>
      <Chip
        label={
          <Box display="flex" flexDirection="row" gap={1} alignItems="center">
            <Typography>
              {pollStatusInfo.text.charAt(0).toUpperCase() +
                pollStatusInfo.text.slice(1)}
            </Typography>
            <Box
              sx={{ fontSize: '0.75rem' }}
              justifyContent="center"
              display="flex"
            >
              <CircleRounded fontSize="inherit" color={pollStatusInfo.color} />
            </Box>
          </Box>
        }
        variant="filled"
        color={
          status === pollPhases.pending
            ? 'warning'
            : status === pollPhases.voting
              ? 'success'
              : 'primary'
        }
      />
    </Box>
  );
}
