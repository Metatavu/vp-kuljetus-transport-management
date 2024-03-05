import { Add, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridPaginationModel, GridRenderCellParams, GridRowProps } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Driver, Route, Site, Task, Truck } from "generated/client";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import ExpandableRoutesTableRow from "./expandable-routes-table-row";
import { DateTime } from "luxon";
import { useDrivers, useRoutes, useTrucks } from "hooks/use-queries";
import { deepEqual } from "@tanstack/react-router";

type Props = {
  selectedDate: DateTime;
  tasks: Task[];
  sites: Site[];
  onUpdateRoute: (route: Route) => Promise<Route>;
};

const RoutesTable = ({ selectedDate, tasks, sites, onUpdateRoute }: Props) => {
  const { t } = useTranslation();
  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

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
        valueOptions: trucksQuery.data?.trucks ?? [],
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
        valueOptions: driversQuery.data?.drivers ?? [],
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
    [t, tasks, trucksQuery, driversQuery, expandedRows],
  );

  const renderExpandableRoutesTableRow = useCallback(
    (params: GridRowProps) => {
      if (!params.row?.id) return null;
      return (
        <ExpandableRoutesTableRow
          {...params}
          tasks={tasks}
          sites={sites}
          expanded={expandedRows.includes(params.row.id)}
        />
      );
    },
    [tasks, sites, expandedRows],
  );

  return (
    <GenericDataGrid
      editMode="row"
      paginationMode="server"
      disableRowSelectionOnClick
      fullScreen={false}
      columns={columns}
      rows={routesQuery.data?.routes ?? []}
      rowCount={routesQuery.data?.totalResults ?? 0}
      rowModesModel={rowModesModel}
      paginationModel={paginationModel}
      slots={{ row: renderExpandableRoutesTableRow }}
      onRowModesModelChange={handleRowModelsChange}
      onPaginationModelChange={setPaginationModel}
      onCellClick={handleCellClick}
      processRowUpdate={processRowUpdate}
    />
  );
};

export default RoutesTable;
