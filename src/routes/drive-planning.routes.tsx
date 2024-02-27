import { Button, Collapse, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, ArrowBack, ArrowForward, UnfoldLess, UnfoldMore } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import {
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRow,
  GridRowProps,
  useGridApiRef,
} from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import DataValidation from "utils/data-validation-utils";
import { Driver, Route as TRoute, Truck } from "generated/client";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";
import RoutesTasksTable from "components/drive-planning/routes/routes-tasks-table";

export const Route = createFileRoute("/drive-planning/routes")({
  component: DrivePlanningRoutes,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.title",
  }),
  validateSearch: (params: Record<string, unknown>): { date?: string | null } => ({
    date: params.date as string,
  }),
});

function DrivePlanningRoutes() {
  const { routesApi, trucksApi, driversApi, tasksApi, sitesApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dataGridRef = useGridApiRef();
  const initialDate = Route.useSearch({
    select: (params) => (params.date ? params.date : undefined),
  });

  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());

  useEffect(() => {
    if (!initialDate) return;
    setSelectedDate(DateTime.fromISO(initialDate));
  }, [initialDate]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [totalResults, setTotalResults] = useState(0);

  const { rowModesModel, handleCellClick, handleRowModelsChange } = useSingleClickRowEditMode();

  const processRowUpdate = async (newRow: TRoute) => {
    return await updateRoute.mutateAsync(newRow);
  };

  const updateRoute = useMutation({
    mutationFn: (route: TRoute) => {
      if (!route.id) return Promise.reject();
      return routesApi.updateRoute({ routeId: route.id, route });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routes", selectedDate] }),
  });

  const routesQuery = useQuery({
    queryKey: ["routes", selectedDate],
    queryFn: async () => {
      const [routes, headers] = await routesApi.listRoutesWithHeaders({
        departureAfter: selectedDate.startOf("day").toJSDate(),
        departureBefore: selectedDate.endOf("day").toJSDate(),
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return routes.sort((a, b) => b.name.localeCompare(a.name));
    },
  });

  const tasksQuery = useQueries({
    queries: (routesQuery.data ?? []).map((route) => ({
      queryKey: ["tasks", route.id],
      queryFn: () => tasksApi.listTasks({ routeId: route.id }),
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const sitesQuery = useQuery({
    queryKey: ["sites"],
    queryFn: () => sitesApi.listSites(),
  });

  const trucksQuery = useQuery({
    queryKey: ["trucks"],
    queryFn: () => trucksApi.listTrucks(),
  });

  const driversQuery = useQuery({
    queryKey: ["drivers"],
    queryFn: () => driversApi.listDrivers(),
  });

  const minusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().minus({ day: 1 });
    return currentDate?.minus({ day: 1 });
  };

  const plusOneDay = (currentDate: DateTime | null) => {
    if (currentDate === null) return DateTime.now().plus({ day: 1 });
    return currentDate?.plus({ day: 1 });
  };

  const onChangeDate = (newDate: DateTime | null) => {
    setSelectedDate(newDate ?? DateTime.now());
  };

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

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
          const tasks = tasksQuery.data.filter((task) => task.routeId === id);

          return tasks.length;
        },
      },
      {
        field: "truckId",
        headerName: t("drivePlanning.routes.truck"),
        sortable: false,
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: trucksQuery.data ?? [],
        getOptionLabel: ({ name, plateNumber }: Truck) => `${name} (${plateNumber})`,
        getOptionValue: ({ id }: Truck) => id,
        renderCell: ({ row: { truckId } }: GridRenderCellParams<TRoute>) => (truckId ? undefined : <Add />),
      },
      {
        field: "driverId",
        headerName: t("drivePlanning.routes.driver"),
        sortable: false,
        flex: 10,
        editable: true,
        type: "singleSelect",
        valueOptions: driversQuery.data ?? [],
        getOptionLabel: ({ displayName }: Driver) => displayName,
        getOptionValue: ({ id }: Driver) => id,
        renderCell: ({ row: { driverId } }: GridRenderCellParams<TRoute>) => (driverId ? undefined : <Add />),
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
    [t, tasksQuery.data, trucksQuery.data, driversQuery.data, expandedRows],
  );

  return (
    <>
      <Outlet />
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          leftToolbar={
            <Stack direction="row">
              <Typography variant="h6" sx={{ opacity: 0.6 }} alignSelf="center">
                {t("drivePlanning.routes.date")}
              </Typography>
              <IconButton onClick={() => setSelectedDate(minusOneDay)}>
                <ArrowBack />
              </IconButton>
              <DatePicker
                value={selectedDate}
                onChange={onChangeDate}
                sx={{ alignSelf: "center", padding: "4px 8px", width: "132px" }}
              />
              <IconButton onClick={() => setSelectedDate(plusOneDay)}>
                <ArrowForward />
              </IconButton>
            </Stack>
          }
          toolbarButtons={
            <Button
              size="small"
              variant="text"
              startIcon={<Add />}
              onClick={() =>
                navigate({
                  to: "/drive-planning/routes/add-route",
                  search: { date: selectedDate.toISODate() },
                })
              }
            >
              {t("drivePlanning.routes.newRoute")}
            </Button>
          }
        />
        <LoaderWrapper loading={routesQuery.isLoading}>
          <GenericDataGrid
            editMode="row"
            paginationMode="server"
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                overflow: "visible !important",
              },
            }}
            apiRef={dataGridRef}
            rows={routesQuery?.data ?? []}
            columns={columns}
            rowCount={totalResults}
            rowModesModel={rowModesModel}
            paginationModel={paginationModel}
            slots={{
              row: (row: GridRowProps) => {
                const firstColumn = row.renderedColumns[0];
                const sortedRows = dataGridRef.current.getSortedRowIds() as string[];
                const nextSiblingIndex = sortedRows.indexOf(row.id as string) + 1;
                const isNextExpanded = expandedRows.includes(sortedRows[nextSiblingIndex]);
                const borders = isNextExpanded
                  ? {
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                    }
                  : undefined;

                return (
                  <>
                    <GridRow {...row} style={{ ...borders }} />
                    <Collapse
                      in={expandedRows.includes(row.rowId as string)}
                      sx={{ marginLeft: `${firstColumn.computedWidth - 1}px` }}
                    >
                      <RoutesTasksTable
                        tasks={tasksQuery.data?.filter((task) => task.routeId === row.rowId) ?? []}
                        sites={sitesQuery.data ?? []}
                      />
                    </Collapse>
                  </>
                );
              },
            }}
            processRowUpdate={processRowUpdate}
            onRowModesModelChange={handleRowModelsChange}
            onPaginationModelChange={setPaginationModel}
            onCellClick={handleCellClick}
          />
        </LoaderWrapper>
      </Paper>
    </>
  );
}
