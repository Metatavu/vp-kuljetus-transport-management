import { Add, ExpandLess, ExpandMore, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridRenderEditCellParams,
  GridRowProps,
} from "@mui/x-data-grid";
import { TimePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { deepEqual } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Driver, Route, Task, Truck } from "generated/client";
import { getListDriversQueryOptions, getListSitesQueryOptions, getListTrucksQueryOptions } from "hooks/use-queries";
import { useSingleClickCellEditMode } from "hooks/use-single-click-cell-edit-mode";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";

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

  const onTasksCellClick = useCallback(({ field, row }: GridCellParams) => {
    if (field !== "tasks" || !row.id) return;
    setExpandedRows((previousExpandedRows) =>
      previousExpandedRows.includes(row.id)
        ? previousExpandedRows.filter((id) => id !== row.id)
        : [...previousExpandedRows, row.id],
    );
  }, []);

  const { cellModesModel, handleCellClick, handleCellModelsChange } = useSingleClickCellEditMode(onTasksCellClick);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const trucksQuery = useQuery(getListTrucksQueryOptions());
  const driversQuery = useQuery(getListDriversQueryOptions());
  const sitesQuery = useQuery(getListSitesQueryOptions());

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

  const columns: GridColDef<Route>[] = useMemo(
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
        align: "center",
        sortable: false,
        width: 100,
        cellClassName: "clickable",
        renderCell: ({ row: { id } }) => {
          if (!id) return null;
          return (
            <Stack direction="row" alignItems="center" flex={1}>
              <Typography sx={{ flex: 1 }} variant="subtitle2">
                {tasksByRoute[id ?? ""]?.length ?? 0}
              </Typography>
              <Tooltip
                title={
                  expandedRows.includes(id)
                    ? t("drivePlanning.routes.collapseTasks")
                    : t("drivePlanning.routes.expandTasks")
                }
                placement="right-start"
              >
                <IconButton size="small">{expandedRows.includes(id) ? <ExpandLess /> : <ExpandMore />}</IconButton>
              </Tooltip>
            </Stack>
          );
        },
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
        renderCell: ({ row: { truckId } }) => (truckId ? undefined : <Add />),
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
        renderCell: ({ row: { driverId } }) => (driverId ? undefined : <Add />),
        renderEditCell: renderDriverSingleSelectCell,
      },
      {
        field: "actions",
        type: "actions",
        align: "right",
        width: 180,
        renderHeader: () => null,
        renderCell: ({ row: { id } }) => {
          if (!id) return null;
          return (
            <IconButton
              size="small"
              title={
                expandedRows.includes(id)
                  ? t("drivePlanning.routes.collapseTasks")
                  : t("drivePlanning.routes.expandTasks")
              }
              onClick={() =>
                setExpandedRows(
                  expandedRows.includes(id) ? expandedRows.filter((rowId) => rowId !== id) : [...expandedRows, id],
                )
              }
            >
              {expandedRows.includes(id) ? <UnfoldLess /> : <UnfoldMore />}
            </IconButton>
          );
        },
      },
    ],
    [
      t,
      trucksQuery.data?.trucks,
      driversQuery.data?.drivers,
      renderTruckSingleSelectCell,
      renderDriverSingleSelectCell,
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
