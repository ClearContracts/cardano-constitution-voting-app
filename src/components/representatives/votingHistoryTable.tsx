import DoDisturbRounded from '@mui/icons-material/DoDisturbRounded';
import ThumbDownRounded from '@mui/icons-material/ThumbDownRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { Poll, PollVote } from '@/types';

import { DownloadUserVotesButton } from '../buttons/downloadUserVotesButton';

interface Props {
  userId: string;
  votes: PollVote[];
  polls: Poll[];
}

/**
 * A Table with a Representatives vote history in every Poll
 * @param userId - The User's ID
 * @param votes - The User's Votes
 * @param polls - The Polls
 * @returns Voting History Table for Each Poll
 */
export function VotingHistoryTable(props: Props): JSX.Element {
  const { userId, votes, polls } = props;

  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      disableColumnMenu: true,
      renderHeader: (): JSX.Element => {
        return (
          <Typography variant="h5" fontWeight="600">
            Poll #
          </Typography>
        );
      },
      renderCell: (params): JSX.Element => {
        return <Typography>{params.row.id}</Typography>;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (): JSX.Element => {
        return (
          <Typography variant="h5" fontWeight="600">
            Poll Name
          </Typography>
        );
      },
      renderCell: (params): JSX.Element => {
        return <Typography>{params.row.name}</Typography>;
      },
    },
    {
      field: 'user_vote',
      headerName: 'User Vote',
      minWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      renderHeader: (): JSX.Element => {
        return (
          <Typography variant="h5" fontWeight="600">
            User Vote
          </Typography>
        );
      },
      renderCell: (params): JSX.Element => {
        const userVoteData = votes.find(
          (vote) => vote.poll_id === params.row.id,
        );
        const userVote = userVoteData?.vote;
        return (
          <Box
            display="flex"
            flexDirection="row"
            height="100%"
            alignItems="center"
            data-testid={`user-votes-${params.row.id}`}
          >
            {userVote === 'yes' && (
              <ThumbUpRounded
                color="success"
                data-testid={`yes-${params.row.id}`}
              />
            )}
            {userVote === 'no' && (
              <ThumbDownRounded
                color="warning"
                data-testid={`no-${params.row.id}`}
              />
            )}
            {userVote === 'abstain' && (
              <DoDisturbRounded data-testid={`abstain-${params.row.id}`} />
            )}
            {!userVote && (
              <Typography data-testid={`none-${params.row.id}`}>
                None
              </Typography>
            )}
          </Box>
        );
      },
    },
  ];

  if (polls.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="600">
            Voting History
          </Typography>
          <DownloadUserVotesButton userId={userId} />
        </Box>
        <Box
          sx={{
            fontFamily: 'Inter',
          }}
        >
          <DataGrid
            rows={polls}
            columns={columns}
            sx={{
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '.MuiDataGrid-columnHeader': {
                fontFamily: 'Montserrat',
                fontSize: '1.2rem',
                backgroundColor: 'rbga(0,0,0,0)',
              },
              '.MuiDataGrid-cell': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
              '.MuiDataGrid-filler': {
                backgroundColor: 'rbga(0,0,0,0)',
              },
              borderRadius: `${theme.shape.borderRadius}px`,
            }}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No voting history found.
      </Typography>
    );
  }
}
