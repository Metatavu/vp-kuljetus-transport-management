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
import { Driver, Route, Task, Truck } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";
import { useDrivers, useSites, useTrucks } from "hooks/use-queries";
import { deepEqual } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";
import { TimePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

type Props = {
  paginationModel: GridPaginationModel;
  routes: Route[];
  totalRoutes: number;
  tasksByRoute: Record<string, Task[]>;
  onPaginationModelChange: (paginationModel: GridPaginationModel) => void;
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({
  paginationModel,
  routes,
  totalRoutes,
  tasksByRoute,
  onPaginationModelChange,
  onUpdateRoute,
}: Props) => {
  const { t } = useTranslation();
  const { tasksApi } = useApi();

  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode((params) => {
    if (params.field !== "tasks") return;
    if (!params.row.id) return;
    setExpandedRows((previousExpandedRows) =>
      previousExpandedRows.includes(params.row.id)
        ? previousExpandedRows.filter((id) => id !== params.row.id)
        : [...previousExpandedRows, params.row.id],
    );
  });
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const trucksQuery = useTrucks();
  const driversQuery = useDrivers();
  const sitesQuery = useSites();

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
        renderCell: ({ row: { id } }: GridRenderCellParams<Route>) => tasksByRoute[id ?? ""]?.length ?? 0,
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
      renderTruckSingleSelectCell,
      renderDriverSingleSelectCell,
      tasksApi,
      expandedRows,
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
          sites={sitesQuery.data?.sites ?? []}
          expanded={expandedRows.includes(params.rowId)}
        />
      );
    },
    [sitesQuery.data, expandedRows, tasksByRoute],
  );

  return (
    <GenericDataGrid
      editMode="cell"
      paginationMode="server"
      disableRowSelectionOnClick
      autoHeight={false}
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
      loading={trucksQuery.isFetching || driversQuery.isFetching || sitesQuery.isFetching}
    />
  );
};

export default RoutesTable;
