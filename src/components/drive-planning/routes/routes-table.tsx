import { Add, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { IconButton, MenuItem, TextField } from "@mui/material";
import {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowProps,
} from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Driver, Route, Site, Task, Truck } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";
import { QUERY_KEYS, useDrivers, useTrucks } from "hooks/use-queries";
import { deepEqual } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";
import AsyncDataGridCell from "components/generic/async-data-grid-cell";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  paginationModel: GridPaginationModel;
  sites: Site[];
  routes: Route[];
  totalRoutes: number;
  tasksByRoute: Record<string, Task[]>;
  onPaginationModelChange: (paginationModel: GridPaginationModel) => void;
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({
  paginationModel,
  sites,
  routes,
  totalRoutes,
  tasksByRoute,
  onPaginationModelChange,
  onUpdateRoute,
}: Props) => {
  const { t } = useTranslation();
  const { tasksApi } = useApi();
  const queryClient = useQueryClient();

  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode((params) => {
    if (params.field !== "tasks") return;
    if (!params.row.id) return;
    setExpandedRows((prev) =>
      prev.includes(params.row.id) ? prev.filter((id) => id !== params.row.id) : [...prev, params.row.id],
    );
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const trucksQuery = useTrucks();
  const driversQuery = useDrivers();

  const processRowUpdate = async (newRow: Route, oldRow: Route) => {
    if (deepEqual(oldRow, newRow)) return oldRow;

    return await onUpdateRoute(newRow);
  };

  const renderTruckSingleSelectCell = useCallback(
    ({ api, id, field, value }: GridRenderEditCellParams) => {
      const { setEditCellValue } = api;
      return (
        <TextField
          select
          SelectProps={{ defaultOpen: true }}
          defaultValue={value}
          onChange={({ target: { value } }) => setEditCellValue({ id: id, field: field, value: value })}
        >
          {trucksQuery.data?.trucks.map((truck) => (
            <MenuItem key={truck.id} value={truck.id}>
              {truck.name} ({truck.plateNumber})
            </MenuItem>
          ))}
        </TextField>
      );
    },
    [trucksQuery],
  );

  const renderDriverSingleSelectCell = useCallback(
    ({ api, id, field, value }: GridRenderEditCellParams) => {
      const { setEditCellValue } = api;
      return (
        <TextField
          select
          SelectProps={{ defaultOpen: true }}
          defaultValue={value}
          onChange={({ target: { value } }) => setEditCellValue({ id: id, field: field, value: value })}
        >
          {driversQuery.data?.drivers.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              {driver.displayName}
            </MenuItem>
          ))}
        </TextField>
      );
    },
    [driversQuery],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("drivePlanning.routes.name"),
        sortable: false,
        flex: 1,
        editable: true,
        type: "string",
      },
      {
        field: "tasks",
        headerName: t("drivePlanning.routes.tasks"),
        sortable: false,
        flex: 1,
        renderCell: ({ row: { id } }: GridRenderCellParams<Route>) => {
          if (!id) return null;
          return (
            <AsyncDataGridCell
              promise={queryClient.fetchQuery({
                queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, id],
                queryFn: () => tasksApi.listTasks({ routeId: id }),
              })}
              valueGetter={(tasks) => tasks.length.toString()}
            />
          );
        },
      },
      {
        field: "truckId",
        headerName: t("drivePlanning.routes.truck"),
        sortable: false,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: trucksQuery.data?.trucks ?? [],
        getOptionLabel: ({ name, plateNumber }: Truck) => `${name} (${plateNumber})`,
        getOptionValue: ({ id }: Truck) => id,
        renderCell: ({ row: { truckId } }: GridRenderCellParams<Route>) => (truckId ? undefined : <Add />),
        renderEditCell: renderTruckSingleSelectCell,
      },
      {
        field: "driverId",
        headerName: t("drivePlanning.routes.driver"),
        sortable: false,
        flex: 10,
        editable: true,
        type: "singleSelect",
        valueOptions: driversQuery.data?.drivers ?? [],
        getOptionLabel: ({ displayName }: Driver) => displayName,
        getOptionValue: ({ id }: Driver) => id,
        renderCell: ({ row: { driverId } }: GridRenderCellParams<Route>) => (driverId ? undefined : <Add />),
        renderEditCell: renderDriverSingleSelectCell,
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
    [
      t,
      trucksQuery.data?.trucks,
      driversQuery.data?.drivers,
      renderTruckSingleSelectCell,
      renderDriverSingleSelectCell,
      tasksApi,
      expandedRows,
      queryClient,
    ],
  );

  const renderExpandableRoutesTableRow = useCallback(
    (params: GridRowProps) => {
      if (!params.rowId || typeof params.rowId !== "string") return null;
      return (
        <ExpandableRoutesTableRow
          {...params}
          routeId={params.rowId}
          tasks={tasksByRoute[params.rowId] ?? []}
          sites={sites}
          expanded={expandedRows.includes(params.rowId)}
        />
      );
    },
    [sites, expandedRows, tasksByRoute],
  );

  return (
    <GenericDataGrid
      editMode="cell"
      paginationMode="server"
      disableRowSelectionOnClick
      fullScreen={false}
      columns={columns}
      rows={routes}
      rowCount={totalRoutes}
      cellModesModel={cellModesModel}
      paginationModel={paginationModel}
      slots={{ row: renderExpandableRoutesTableRow }}
      onPaginationModelChange={onPaginationModelChange}
      onCellModesModelChange={handleCellModelsChange}
      onCellClick={handleCellClick}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default RoutesTable;
