import Link from 'next/link';
import { Box, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import type { User, Workshop } from '@/types';
import { paths } from '@/paths';
import { abbreviateName } from '@/lib/helpers/abbreviateName';

interface Props {
  representatives: User[];
  workshops: Workshop[];
}

/**
 * A Table with all Representatives grouped by their Workshop
 * @param representatives - List of Representatives
 * @param workshops - List of Workshops
 * @returns Representatives Table
 */
export function RepresentativesTable(props: Props): JSX.Element {
  const { representatives, workshops } = props;

  const theme = useTheme();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 125,
      flex: 1,
      renderCell: (params): JSX.Element => {
        return <Typography fontWeight="500">{params.row.name}</Typography>;
      },
    },
    {
      field: 'Delegate',
      headerName: 'Delegate',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const delegateId = params.row.delegate_id;
        const delegate = representatives.find((rep) => rep.id === delegateId);
        const activeVoterId = params.row.active_voter_id;
        const name = abbreviateName(delegate?.name || '');
        return (
          <Link
            href={paths.representatives.representative + delegateId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`delegate-name-${delegate?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
              sx={{
                height: '100%',
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },
              }}
            >
              <Typography color={delegateId === activeVoterId ? 'success' : ''}>
                {name}
              </Typography>
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'alternate',
      headerName: 'Alternate',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const alternateId = params.row.alternate_id;
        const alternate = representatives.find((rep) => rep.id === alternateId);
        const activeVoterId = params.row.active_voter_id;
        const name = abbreviateName(alternate?.name || '');
        return (
          <Link
            href={paths.representatives.representative + alternateId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`alternate-name-${alternate?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
              sx={{
                height: '100%',
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },
              }}
            >
              <Typography
                color={alternateId === activeVoterId ? 'success' : ''}
              >
                {name}
              </Typography>
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'active_voter',
      headerName: 'Active Voter',
      minWidth: 125,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params): JSX.Element => {
        const activeVoterId = params.row.active_voter_id;
        const activeVoter = representatives.find(
          (rep) => rep.id === activeVoterId,
        );
        const name = abbreviateName(activeVoter?.name || '');
        return (
          <Link
            href={paths.representatives.representative + activeVoterId}
            style={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              height: '100%',
            }}
            data-testid={`active-voter-name-${activeVoter?.id}`}
          >
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={{
                xs: 0,
                sm: 1,
              }}
              sx={{
                height: '100%',
                justifyContent: {
                  xs: 'center',
                  sm: 'flex-start',
                },
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },
              }}
            >
              <Typography noWrap>{name}</Typography>
            </Box>
          </Link>
        );
      },
    },
  ];

  if (representatives.length > 0) {
    return (
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Representatives
        </Typography>
        <Box
          sx={{
            fontFamily: 'Chivo',
          }}
        >
          <DataGrid
            rows={workshops.filter(
              (workshop) => workshop.name !== 'Convention Organizer',
            )}
            columns={columns}
            hideFooter
            columnVisibilityModel={{
              id: false,
            }}
            sortModel={[
              {
                field: 'name',
                sort: 'asc',
              },
            ]}
            sx={{
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '.MuiDataGrid-columnHeader': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                fontFamily: 'Chivo',
                fontSize: '1.2rem',
              },
              '.MuiDataGrid-cell': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            }}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Typography variant="h4" textAlign="center">
        No representatives found.
      </Typography>
    );
  }
}
