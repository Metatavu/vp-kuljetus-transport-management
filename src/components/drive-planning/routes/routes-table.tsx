import { Add, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Driver, Route, Site, Task, Truck } from "generated/client";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";

type Props = {
  drivers: Driver[];
  trucks: Truck[];
  tasks: Task[];
  routes: Route[];
  sites: Site[];
  paginationModel: GridPaginationModel;
  totalResults: number;
  onPaginationModelChange: (paginationModel: GridPaginationModel) => void;
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({
  drivers,
  trucks,
  tasks,
  routes,
  sites,
  paginationModel,
  totalResults,
  onPaginationModelChange,
  onUpdateRoute,
}: Props) => {
  const { t } = useTranslation();
  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const processRowUpdate = async (newRow: Route) => await onUpdateRoute(newRow);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("drivePlanning.routes.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "tasks",
        headerName: t("drivePlanning.routes.tasks"),
        sortable: false,
        flex: 1,
        renderCell: ({ id }) => {
          const routesTasks = tasks.filter((task) => task.routeId === id);

          return routesTasks.length;
        },
      },
      {
        field: "truckId",
        headerName: t("drivePlanning.routes.truck"),
        sortable: false,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: trucks ?? [],
        getOptionLabel: ({ name, plateNumber }: Truck) => `${name} (${plateNumber})`,
        getOptionValue: ({ id }: Truck) => id,
        renderCell: ({ row: { truckId } }: GridRenderCellParams<Route>) => (truckId ? undefined : <Add />),
      },
      {
        field: "driverId",
        headerName: t("drivePlanning.routes.driver"),
        sortable: false,
        flex: 10,
        editable: true,
        type: "singleSelect",
        valueOptions: drivers ?? [],
        getOptionLabel: ({ displayName }: Driver) => displayName,
        getOptionValue: ({ id }: Driver) => id,
        renderCell: ({ row: { driverId } }: GridRenderCellParams<Route>) => (driverId ? undefined : <Add />),
      },
      {
        field: "actions",
        type: "actions",
        align: "right",
        flex: 1,
        renderHeader: () => null,
        renderCell: ({ row: { id } }) => (
          <IconButton
            onClick={() => {
              if (expandedRows.includes(id)) setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
              else setExpandedRows([...expandedRows, id]);
            }}
          >
            {expandedRows.includes(id) ? <UnfoldLess /> : <UnfoldMore />}
          </IconButton>
        ),
      },
    ],
    [t, tasks, trucks, drivers, expandedRows],
  );
  return (
    <GenericDataGrid
      editMode="row"
      paginationMode="server"
      disableRowSelectionOnClick
      columns={columns}
      rows={routes}
      rowCount={totalResults}
      rowModesModel={rowModesModel}
      paginationModel={paginationModel}
      slots={{
        row: (params) => (
          <ExpandableRoutesTableRow
            {...params}
            tasks={tasks}
            sites={sites}
            expanded={expandedRows.includes(params.row.id)}
          />
        ),
      }}
      onRowModesModelChange={handleRowModelsChange}
      onPaginationModelChange={onPaginationModelChange}
      onCellClick={handleCellClick}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default RoutesTable;
