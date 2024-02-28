import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, ArrowBack, ArrowForward } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { GridPaginationModel } from "@mui/x-data-grid";
import DataValidation from "utils/data-validation-utils";
import { Route as TRoute, Task } from "generated/client";
import { Active, DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallotaced-tasks-drawer";
import RoutesTable from "components/drive-planning/routes/routes-table";

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
  const [unallocatedDrawerOpen, setUnallocatedDrawerOpen] = useState(true);
  const [activeDraggable, setActiveDraggable] = useState<Active>();

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

  const saveTask = useMutation({
    mutationFn: (task: Task) => {
      if (!task.id) return Promise.reject();
      return tasksApi.updateTask({ taskId: task.id, task: task });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
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

  const renderLeftToolbar = () => (
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
  );

  const onDragEnd = ({ over, active }: DragEndEvent) => {
    const overRouteId = over?.data.current?.routeId;
    const draggedTask = active?.data.current?.task;
    if (!overRouteId || !draggedTask) return;
    saveTask.mutate({ ...draggedTask, routeId: overRouteId });
  };

  return (
    <>
      <Outlet />
      <Paper sx={{ minHeight: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
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
                  search: { date: selectedDate.toISODate() },
                })
              }
            >
              {t("drivePlanning.routes.newRoute")}
            </Button>
          }
        />
        <LoaderWrapper loading={routesQuery.isLoading}>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={activeDraggable?.data.current ? activeDraggable.data.current.modifiers : []}
            onDragStart={({ active }) => setActiveDraggable(active)}
            onDragEnd={onDragEnd}
          >
            <RoutesTable
              drivers={driversQuery.data ?? []}
              trucks={trucksQuery.data ?? []}
              tasks={tasksQuery.data ?? []}
              routes={routesQuery.data ?? []}
              sites={sitesQuery.data ?? []}
              paginationModel={paginationModel}
              totalResults={totalResults}
              onPaginationModelChange={setPaginationModel}
              onUpdateRoute={updateRoute.mutateAsync}
            />
            <UnallocatedTasksDrawer
              open={unallocatedDrawerOpen}
              tasks={tasksQuery.data ?? []}
              sites={sitesQuery.data ?? []}
              onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
            />
          </DndContext>
        </LoaderWrapper>
      </Paper>
    </>
  );
}
