import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CancelRounded, EditRounded, SaveRounded } from '@mui/icons-material';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowEditStopParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
  MuiBaseEvent,
  MuiEvent,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';

import { User, Workshop } from '@/types';
import { paths } from '@/paths';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';
import { getWorkshops } from '@/lib/helpers/getWorkshops';
import { updateActiveVoter } from '@/lib/helpers/updateActiveVoter';

interface Props {
  refresh: boolean;
  toggleRefresh: () => void;
}

/**
 * Allows a workshop coordinator to manage if delegates or alternates have active power from each workhsop
 * @param refresh - boolean to refresh the table
 * @param toggleRefresh - function to toggle the refresh boolean
 * @returns Admin Manage Active Power Table
 */
export function ManageActivePowerTable(props: Props): JSX.Element {
  const { refresh, toggleRefresh } = props;
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [reload, setReload] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const workshops = await getWorkshops();
      setWorkshops(workshops);
      const reps = await getRepresentatives();
      setRepresentatives(reps);
    }
    fetchData();
  }, [reload, refresh]);

  function handleRowEditStop(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: GridRowEditStopParams<any>,
    event: MuiEvent<MuiBaseEvent>,
  ): void {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  async function processRowUpdate(newRow: GridRowModel): Promise<GridRowModel> {
    // update active voter id
    const data = await updateActiveVoter(newRow.id, newRow.active_voter_id);
    if (data.userId !== '-1') {
      toast.success('Active voter updated!');
      setReload(!reload);
    } else {
      toast.error(data.message);
    }
    setReload(!reload);
    toggleRefresh();
    return newRow;
  }

  function handleRowModesModelChange(
    newRowModesModel: GridRowModesModel,
  ): void {
    setRowModesModel(newRowModesModel);
  }

  const columns: GridColDef[] = useMemo(() => {
    function handleEditClick(id: GridRowId): () => void {
      return () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.Edit },
        });
      };
    }

    function handleSaveClick(id: GridRowId): () => void {
      return () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View },
        });
      };
    }

    function handleCancelClick(id: GridRowId): () => void {
      return () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        setReload(!reload);
      };
    }

    return [
      {
        field: 'name',
        headerName: 'Workshop',
        width: 280,
        editable: false,
        flex: 0.5,
      },
      {
        field: 'delegate_id',
        headerName: 'Delegate',
        width: 280,
        editable: false,
        flex: 0.5,
        renderCell: (params): JSX.Element => {
          const delegateId = params.row.delegate_id;
          const delegate = representatives.find((rep) => {
            return rep.id === delegateId;
          });
          const isActivePower =
            params.row.delegate_id === params.row.active_voter_id;
          return (
            <Link
              href={paths.representatives.representative + delegateId}
              style={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                color: theme.palette.text.primary,
              }}
              data-testid={`delegate-name-${delegate?.id}`}
            >
              <Typography
                variant="body1"
                color={isActivePower ? 'success' : theme.palette.text.primary}
              >
                {delegate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Link>
          );
        },
      },
      {
        field: 'alternate_id',
        headerName: 'Alternate',
        width: 280,
        editable: false,
        flex: 0.5,
        renderCell: (params): JSX.Element => {
          const alternateId = params.row.alternate_id;
          const alternate = representatives.find((rep) => {
            return rep.id === alternateId;
          });
          const isActivePower =
            params.row.alternate_id === params.row.active_voter_id;
          return (
            <Link
              href={paths.representatives.representative + alternateId}
              style={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                color: theme.palette.text.primary,
              }}
              data-testid={`alternate-name-${alternate?.id}`}
            >
              <Typography
                variant="body1"
                color={isActivePower ? 'success' : theme.palette.text.primary}
              >
                {alternate?.name}
              </Typography>
              <LaunchRounded fontSize="small" />
            </Link>
          );
        },
      },
      {
        field: 'active_voter_id',
        headerName: 'Active Voter',
        width: 130,
        editable: true,
        type: 'singleSelect',
        valueOptions: (params) => [
          { value: params.row.delegate_id, label: 'Delegate' },
          { value: params.row.alternate_id, label: 'Alternate' },
        ],
        renderCell: (params): JSX.Element => {
          const activeVoterId = params.row.active_voter_id;
          const delegateId = params.row.delegate_id;
          const alternateId = params.row.alternate_id;
          return (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              height="100%"
            >
              <Typography>
                {activeVoterId == delegateId
                  ? 'Delegate'
                  : activeVoterId == alternateId
                    ? 'Alternate'
                    : ''}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Edit',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }): JSX.Element[] => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveRounded />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
                data-testid={`save-active-voter-${id}`}
                key={`save-active-voter-${id}`}
              />,
              <GridActionsCellItem
                icon={<CancelRounded />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
                data-testid={`cancel-active-voter-${id}`}
                key={`cancel-active-voter-${id}`}
              />,
            ];
          }

          return [
            <GridActionsCellItem
              data-testid={`edit-active-voter-${id}`}
              icon={<EditRounded />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
              key={`edit-active-voter-${id}`}
            />,
          ];
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    representatives,
    rowModesModel,
    theme.palette.text.primary,
    reload,
    refresh, // TS is not recognizing refresh as a dependency but it is required to properly refresh the table when info in representatives table changes
  ]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5" fontWeight="600">
        Manage Active Voters
      </Typography>
      <Box
        sx={{
          fontFamily: 'Inter',
        }}
      >
        <DataGrid
          rows={workshops}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sortModel={[{ field: 'name', sort: 'asc' }]}
          sx={{
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '.MuiDataGrid-columnHeader': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              fontFamily: 'Montserrat',
              fontSize: '1.2rem',
            },
          }}
        />
      </Box>
    </Box>
  );
}
