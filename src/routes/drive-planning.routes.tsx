import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, ArrowBack, ArrowForward, UnfoldMore } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import GenericDataGrid from "components/generic/generic-data-grid";
import DataValidation from "utils/data-validation-utils";
import { Driver, Route as TRoute, Truck } from "generated/client";
import { useSingleClickRowEditMode } from "hooks/use-single-click-row-edit-mode";

export const Route = createFileRoute("/drive-planning/routes")({
  component: DrivePlanningRoutes,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.title",
  }),
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : undefined,
  }),
});

function DrivePlanningRoutes() {
  const { routesApi, trucksApi, driversApi, tasksApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialDate = Route.useSearch({
    select: ({ date }) => date,
  });

  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
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
        renderCell: () => (
          <IconButton>
            <UnfoldMore />
          </IconButton>
        ),
      },
    ],
    [t, tasksQuery.data, trucksQuery.data, driversQuery.data],
  );

  const renderLeftToolbar = useCallback(
    () => (
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
    ),
    [selectedDate, t, onChangeDate, minusOneDay, plusOneDay],
  );

  return (
    <>
      <Outlet />
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          leftToolbar={renderLeftToolbar()}
          toolbarButtons={
            <Button
              size="small"
              variant="text"
              startIcon={<Add />}
              onClick={() =>
                navigate({
                  to: "/drive-planning/routes/add-route",
                  search: { date: selectedDate },
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
            rows={routesQuery?.data ?? []}
            columns={columns}
            rowCount={totalResults}
            rowModesModel={rowModesModel}
            paginationModel={paginationModel}
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
