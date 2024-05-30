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
import { Driver, Route, Truck } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";
import { DateTime } from "luxon";
import { QUERY_KEYS, useDrivers, useRoutes, useSites, useTrucks } from "hooks/use-queries";
import { deepEqual } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useApi } from "hooks/use-api";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";
import { TimePicker } from "@mui/x-date-pickers";

type Props = {
  selectedDate: DateTime;
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({ selectedDate, onUpdateRoute }: Props) => {
  const { t } = useTranslation();
  const { tasksApi } = useApi();
  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const trucksQuery = useTrucks();
  const driversQuery = useDrivers();
  const sitesQuery = useSites();

  const routesQuery = useRoutes({
    departureAfter: selectedDate.startOf("day").toJSDate(),
    departureBefore: selectedDate.endOf("day").toJSDate(),
    first: paginationModel.pageSize * paginationModel.page,
    max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
  });

  const routeTaskLengths = useQueries({
    queries: (routesQuery.data?.routes ?? []).map((route) => ({
      queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, route.id],
      enabled: !!route.id,
      queryFn: async () => {
        if (!route.id) throw Error("Route id is missing");
        return tasksApi.listTasks({ routeId: route.id });
      },
    })),
    combine: (results) =>
      results.reduce((map, { data }, index) => {
        const routeId = routesQuery.data?.routes.at(index)?.id;
        if (data && routeId) map.set(routeId, data.length);
        return map;
      }, new Map<string, number>()),
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
              {truck.name && truck.plateNumber ? `${truck.name} (${truck.plateNumber})` : ""}
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
        width: 100,
        editable: true,
        type: "string",
      },
      {
        field: "departureTime",
        headerName: t("drivePlanning.routes.departureTime"),
        sortable: false,
        width: 100,
        editable: true,
        renderCell: ({ value }) => DateTime.fromJSDate(value).toFormat("HH:mm"),
        renderEditCell: ({ value, api, id, field }) => (
          <TimePicker
            autoFocus
            value={DateTime.fromJSDate(value)}
            onChange={(newValue) => newValue && api.setEditCellValue({ id, field, value: newValue.toJSDate() })}
            disableOpenPicker
            onAccept={() => api.stopCellEditMode({ id, field })}
            slotProps={{
              textField: { variant: "outlined" },
              inputAdornment: { sx: { marginRight: 1 } },
            }}
          />
        ),
      },
      {
        field: "tasks",
        headerName: t("drivePlanning.routes.tasks"),
        sortable: false,
        width: 100,
        renderCell: ({ row: { id } }: GridRenderCellParams<Route>) => routeTaskLengths.get(id ?? "") ?? 0,
      },
      {
        field: "truckId",
        headerName: t("drivePlanning.routes.truck"),
        sortable: false,
        width: 200,
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
        flex: 1,
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
        width: 180,
        renderHeader: () => null,
        renderCell: ({ row: { id } }) => (
          <IconButton
            onClick={() =>
              setExpandedRows(
                expandedRows.includes(id) ? expandedRows.filter((rowId) => rowId !== id) : [...expandedRows, id],
              )
            }
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
      expandedRows,
      tasksApi,
      routeTaskLengths,
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
          sites={sitesQuery.data?.sites ?? []}
          expanded={expandedRows.includes(params.row.id)}
        />
      );
    },
    [sitesQuery.data, expandedRows],
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
      loading={routesQuery.isFetching || trucksQuery.isFetching || driversQuery.isFetching || sitesQuery.isFetching}
    />
  );
};

export default RoutesTable;
