import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, ArrowBack, ArrowForward, LocalShipping } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Route as TRoute, Task } from "generated/client";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallotaced-tasks-drawer";
import RoutesTable from "components/drive-planning/routes/routes-table";
import { QUERY_KEYS, useSites, useTasks } from "hooks/use-queries";
import { Active, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

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
  const { routesApi, tasksApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const tasksQuery = useTasks();
  const sitesQuery = useSites();

  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());
  const [unallocatedDrawerOpen, setUnallocatedDrawerOpen] = useState(true);
  const [activeDraggable, setActiveDraggable] = useState<Active | null>(null);

  const initialDate = Route.useSearch({
    select: (params) => (params.date ? params.date : undefined),
  });

  useEffect(() => {
    if (!initialDate) return;
    setSelectedDate(DateTime.fromISO(initialDate));
  }, [initialDate]);

  const updateRoute = useMutation({
    mutationFn: (route: TRoute) => {
      if (!route.id) return Promise.reject();
      return routesApi.updateRoute({ routeId: route.id, route });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] }),
  });

  const updateTask = useMutation({
    mutationFn: (task: Task) => {
      if (!task.id) return Promise.reject();
      return tasksApi.updateTask({ taskId: task.id, task });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] });
    },
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

  const renderRightToolbar = () => (
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
  );

  const handleAllocateTask = async (task: Task, routeId: string) =>
    await updateTask.mutateAsync({ ...task, routeId: routeId });

  const handleUnallocateGroupedTasks = async (tasks: Task[]) =>
    await Promise.all(tasks.map((task) => updateTask.mutateAsync({ ...task, routeId: undefined })));

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDraggable(active);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    const { routeId } = over?.data.current ?? {};
    const { task, draggableType, tasks } = active?.data.current ?? {};
    if (draggableType === "unallocatedTask" && routeId) {
      handleAllocateTask(task, routeId);
    }
    if (draggableType === "groupedTask") {
      handleUnallocateGroupedTasks(tasks);
    }
    setActiveDraggable(null);
  };

  return (
    <>
      <Outlet />
      <Paper sx={{ minHeight: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <ToolbarRow leftToolbar={renderLeftToolbar()} toolbarButtons={renderRightToolbar()} />
          <LoaderWrapper loading={tasksQuery.isLoading || sitesQuery.isLoading}>
            <RoutesTable
              selectedDate={selectedDate}
              tasks={tasksQuery.data?.tasks ?? []}
              sites={sitesQuery.data?.sites ?? []}
              onUpdateRoute={updateRoute.mutateAsync}
            />
            <UnallocatedTasksDrawer
              open={unallocatedDrawerOpen}
              tasks={tasksQuery.data?.tasks ?? []}
              sites={sitesQuery.data?.sites ?? []}
              onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
            />
          </LoaderWrapper>
          <DragOverlay modifiers={[snapCenterToCursor]}>
            {activeDraggable ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
              >
                <LocalShipping fontSize="large" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Paper>
    </>
  );
}
