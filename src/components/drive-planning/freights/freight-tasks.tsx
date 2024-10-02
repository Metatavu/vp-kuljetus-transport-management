import GenericDataGrid from "components/generic/generic-data-grid";
import { GridColDef, GridRenderCellParams, useGridApiRef } from "@mui/x-data-grid";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";
import { Route, Site, Task } from "generated/client";
import { DateTime } from "luxon";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import { QUERY_KEYS, useRoutes } from "hooks/use-queries";
import RoutesDropdown from "./routes-dropdown";
import { deepEqual } from "@tanstack/react-router";
import AsyncDataGridCell from "../../generic/async-data-grid-cell";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "hooks/use-api";
import { IconButton, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  customerSites: Site[];
  tasks: Task[];
  onEditTask: (task: Task) => void;
};

const FreightTasks = ({ tasks, customerSites, onEditTask }: Props) => {
  const { routesApi } = useApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dataGridApiRef = useGridApiRef();

  const [selectedDepartureDate, setSelectedDepartureDate] = useState<DateTime | null>(DateTime.now());

  const routesQuery = useRoutes({
    departureAfter: selectedDepartureDate?.startOf("day").toJSDate(),
    departureBefore: selectedDepartureDate?.endOf("day").toJSDate(),
  });

  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

  const processRowUpdate = (newRow: Task, oldRow: Task) => {
    if (deepEqual(oldRow, newRow)) return oldRow;
    onEditTask(newRow);

    if (oldRow.routeId === undefined && newRow.routeId !== undefined) {
      newRow.orderNumber = 9999;
    } else if (oldRow.routeId !== undefined && newRow.routeId === undefined) {
      newRow.orderNumber = undefined;
    }

    return newRow;
  };

  const onClearRoute = useCallback(
    (e: MouseEvent, task: Task) => {
      e.stopPropagation();
      dataGridApiRef.current.updateRows([{ ...task, routeId: undefined, orderNumber: undefined }]);
      onEditTask({ ...task, routeId: undefined, orderNumber: undefined });
    },
    [dataGridApiRef, onEditTask],
  );

  const renderRouteCell = useCallback(
    ({ row }: GridRenderCellParams<Task>) => {
      const { routeId } = row;
      return (
        <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
          <AsyncDataGridCell
            promise={routeId ? queryClient.fetchQuery({
              queryKey: [QUERY_KEYS.ROUTES, routeId],
              queryFn: () => routesApi.findRoute({ routeId: routeId }),
            }) : Promise.resolve(undefined)}
            valueGetter={(route) => route?.name ?? t("noSelection")}
          />
          {routeId && (
            <IconButton onClick={(e) => onClearRoute(e, row)}>
              <ClearIcon />
            </IconButton>
          )}
        </Stack>
      );
    },
    [t, queryClient, routesApi, onClearRoute],
  );

  const columns: GridColDef<Task>[] = useMemo(
    () => [
      {
        field: "type",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.tasks"),
        flex: 1,
        sortable: false,
        renderCell: ({ row: { type } }) => LocalizationUtils.getLocalizedTaskType(type, t),
      },
      {
        field: "groupNumber",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.groupNumber"),
        flex: 1,
        sortable: false,
        editable: true,
        type: "number",
        align: "left",
      },
      {
        field: "customerSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.customerSite"),
        flex: 3,
        sortable: false,
        editable: true,
        type: "singleSelect",
        valueOptions: customerSites,
        getOptionLabel: ({ name }: Site) => name,
        getOptionValue: ({ id }: Site) => id,
        valueFormatter: ({ value }) => customerSites.find((site) => site.id === value)?.name ?? t("noSelection"),
      },
      {
        field: "routeId",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.route"),
        flex: 3,
        sortable: false,
        editable: true,
        type: "singleSelect",
        getOptionLabel: ({ name }: Route) => name ?? t("noSelection"),
        getOptionValue: ({ id }: Route) => id,
        renderCell: renderRouteCell,
        renderEditCell: (params) => (
          <RoutesDropdown
            {...params}
            routes={routesQuery.data?.routes ?? []}
            selectedDepartureDate={selectedDepartureDate}
            setSelectedDepartureDate={setSelectedDepartureDate}
          />
        ),
      },
      {
        field: "departureTime",
        headerAlign: "center",
        headerName: t("drivePlanning.tasks.date"),
        flex: 1,
        sortable: false,
        renderCell: ({ row: { routeId } }) => (
          <AsyncDataGridCell
            promise={routeId ? queryClient.fetchQuery({
              queryKey: [QUERY_KEYS.ROUTES, routeId],
              queryFn: () => (routeId ? routesApi.findRoute({ routeId: routeId }) : undefined),
            }) : Promise.resolve(undefined)}
            valueGetter={(route) =>
              route?.departureTime ? DateTime.fromJSDate(route?.departureTime).toFormat("dd-MM-yyyy") : ""
            }
          />
        ),
      },
    ],
    [t, customerSites, renderRouteCell, routesQuery.data?.routes, queryClient, routesApi, selectedDepartureDate],
  );

  return (
    <GenericDataGrid
      apiRef={dataGridApiRef}
      editMode="row"
      processRowUpdate={processRowUpdate}
      onCellClick={handleCellClick}
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModelsChange}
      rows={tasks}
      columns={columns}
      hideFooter
      disableRowSelectionOnClick
    />
  );
};

export default FreightTasks;
