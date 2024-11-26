import { useEffect, useMemo, useState } from 'react';
import { CancelRounded, EditRounded, SaveRounded } from '@mui/icons-material';
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

import { User } from '@/types';
import { getRepresentatives } from '@/lib/helpers/getRepresentatives';
import { updateUser } from '@/lib/helpers/updateUser';

interface Props {
  toggleRefresh: () => void;
}

/**
 * Table for admin to manage representative information
 * @param toggleRefresh - function to toggle the refresh boolean
 * @returns Admin Manage Representatives Table
 */
export function ManageRepresentativesTable(props: Props): JSX.Element {
  const { toggleRefresh } = props;
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [reload, setReload] = useState(false);

  // loads representatives from the database
  useEffect(() => {
    async function fetchRepresentatives(): Promise<void> {
      const representatives = await getRepresentatives();
      setRepresentatives(representatives);
    }
    fetchRepresentatives();
  }, [reload]);

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
    // update user name, email, and wallet address
    const data = await updateUser(
      newRow.id,
      newRow.name,
      newRow.email,
      newRow.wallet_address,
    );
    if (data.userId !== '-1') {
      toast.success('User info updated!');
    } else {
      toast.error(data.message);
    }
    setReload(!reload);
    toggleRefresh();
    return newRow;
  }

  const handleRowModesModelChange = (
    newRowModesModel: GridRowModesModel,
  ): void => {
    setRowModesModel(newRowModesModel);
  };

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
        headerName: 'Name',
        width: 280,
        editable: true,
        flex: 0.5,
      },
      {
        field: 'email',
        headerName: 'Email',
        type: 'string',
        width: 280,
        align: 'left',
        headerAlign: 'left',
        editable: true,
        flex: 0.5,
      },
      {
        field: 'wallet_address',
        headerName: 'Stake Address',
        type: 'string',
        width: 550,
        align: 'left',
        headerAlign: 'left',
        editable: true,
        flex: 1,
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
                data-testid={`save-representative-info-${id}`}
                key={`save-representative-info-${id}`}
              />,
              <GridActionsCellItem
                icon={<CancelRounded />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
                data-testid={`cancel-representative-info-${id}`}
                key={`cancel-representative-info-${id}`}
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditRounded />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
              data-testid={`edit-representative-info-${id}`}
              key={`edit-representative-info-${id}`}
            />,
          ];
        },
      },
    ];
  }, [reload, rowModesModel]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5" fontWeight="600">
        Manage Representative Information
      </Typography>
      <Box
        sx={{
          fontFamily: 'Inter',
        }}
      >
        <DataGrid
          rows={representatives}
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
