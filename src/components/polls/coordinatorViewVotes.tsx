import { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { User, Workshop } from '@/types';

interface Props {
  votes: {
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
  };
  workshops: Workshop[];
  representatives: User[];
}

export function CoordinatorViewVotes(props: Props): JSX.Element {
  const { votes, workshops, representatives } = props;

  const workshopsWithVotes = useMemo(() => {
    return workshops.map((workshop) => {
      const activeVoterId = workshop.active_voter_id;
      let activeVoterVote;
      if (activeVoterId) {
        activeVoterVote = votes.yes.some((vote) => vote.id === activeVoterId)
          ? 'yes'
          : votes.no.some((vote) => vote.id === activeVoterId)
            ? 'no'
            : votes.abstain.some((vote) => vote.id === activeVoterId)
              ? 'abstain'
              : undefined;
      }
      const activeVoterName =
        representatives.find((rep) => rep.id === activeVoterId)?.name ||
        'Not Found';

      return {
        ...workshop,
        vote: activeVoterVote,
        activeVoterName,
      };
    });
  }, [representatives, votes.abstain, votes.no, votes.yes, workshops]);

  const rows = useMemo(() => {
    return workshopsWithVotes
      .filter((workshop) => workshop.name !== 'Convention Organizer')
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [workshopsWithVotes]);

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 280,
        renderCell: (params) => (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography>{params.row.name}</Typography>
          </Box>
        ),
      },
      {
        field: 'activeVoterName',
        headerName: 'Active Voter',
        minWidth: 280,
        renderCell: (params) => (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography>{params.row.activeVoterName}</Typography>
          </Box>
        ),
      },
      {
        field: 'vote',
        headerName: 'Vote',
        width: 200,
        renderCell: (params) => (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
          >
            <Typography
              color={
                params.row.vote === 'yes'
                  ? 'success'
                  : params.row.vote === 'no'
                    ? 'warning'
                    : ''
              }
            >
              {params.row.vote?.toUpperCase()}
            </Typography>
          </Box>
        ),
      },
    ];
  }, []);

  return (
    <>
      {rows.length > 0 ? (
        <DataGrid
          autoHeight={true} // deprecated but prevents size jumping
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          sx={{
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '.MuiDataGrid-columnHeader': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              fontFamily: 'Chivo',
              fontSize: '1.2rem',
            },
          }}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
}
