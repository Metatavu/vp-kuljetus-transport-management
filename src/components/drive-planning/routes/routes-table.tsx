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
import { Driver, Route, Site, Truck } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";
import { DateTime } from "luxon";
import { QUERY_KEYS, useDrivers, useRoutes, useTrucks } from "hooks/use-queries";
import { deepEqual } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import AsyncDataGridCell from "components/generic/async-data-grid-cell";
import { useApi } from "hooks/use-api";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";

type Props = {
  selectedDate: DateTime;
  sites: Site[];
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({ selectedDate, sites, onUpdateRoute }: Props) => {
  const { t } = useTranslation();
  const { tasksApi } = useApi();
  const queryClient = useQueryClient();
  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const trucksQuery = useTrucks();
  const driversQuery = useDrivers();
  const routesQuery = useRoutes({
    departureAfter: selectedDate.startOf("day").toJSDate(),
    departureBefore: selectedDate.endOf("day").toJSDate(),
    first: paginationModel.pageSize * paginationModel.page,
    max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
  });

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
        renderCell: ({ row: { id } }: GridRenderCellParams<Route>) => (
          <AsyncDataGridCell
            promise={queryClient.fetchQuery({
              queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, id],
              queryFn: id ? () => tasksApi.listTasks({ routeId: id }) : undefined,
            })}
            valueGetter={(tasks) => tasks.length.toString()}
          />
        ),
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
      trucksQuery,
      driversQuery,
      expandedRows,
      tasksApi,
      queryClient,
      renderTruckSingleSelectCell,
      renderDriverSingleSelectCell,
    ],
  );

  const renderExpandableRoutesTableRow = useCallback(
    (params: GridRowProps) => {
      if (!params.row?.id) return null;
      return (
        <ExpandableRoutesTableRow
          {...params}
          routeId={params.row.id}
          sites={sites}
          expanded={expandedRows.includes(params.row.id)}
        />
      );
    },
    [sites, expandedRows],
  );

  return (
    <GenericDataGrid
      editMode="cell"
      paginationMode="server"
      disableRowSelectionOnClick
      autoHeight={false}
      fullScreen={false}
      columns={columns}
      rows={routesQuery.data?.routes ?? []}
      rowCount={routesQuery.data?.totalResults ?? 0}
      cellModesModel={cellModesModel}
      paginationModel={paginationModel}
      slots={{ row: renderExpandableRoutesTableRow }}
      onPaginationModelChange={setPaginationModel}
      onCellModesModelChange={handleCellModelsChange}
      onCellClick={handleCellClick}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default RoutesTable;
