import { Button, Paper, Stack, Typography, styled } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, Refresh } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Route as TRoute, Task } from "generated/client";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallocated-tasks-drawer";
import RoutesTable from "components/drive-planning/routes/routes-table";
import { QUERY_KEYS, useRoutes, useSites } from "hooks/use-queries";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import { toast } from "react-toastify";
import { DraggableType, DroppableType, DraggedTaskData } from "../types";
import { GridPaginationModel } from "@mui/x-data-grid";
import DataValidation from "utils/data-validation-utils";
import DraggedTaskOverlay from "components/drive-planning/routes/dragged-task-overlay";
import DragAndDropUtils, { TRouteTasks } from "src/utils/drag-and-drop-utils";

// Styled components
const Root = styled(Paper, {
  label: "drive-planning-routes--root",
})(() => ({
  minHeight: "100%",
  maxHeight: "100%",
  display: "flex",
  flexDirection: "column",
}));

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
  const { routesApi, tasksApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const sitesQuery = useSites();

  const [unallocatedDrawerOpen, setUnallocatedDrawerOpen] = useState(true);
  const [activeDraggable, setActiveDraggable] = useState<Active | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [localTasks, setLocalTasks] = useState<TRouteTasks>({});
  const [lastRefreshedAt, setLastRefreshedAt] = useState<DateTime>();

  const localTasksBeforeDrag = useRef<TRouteTasks | null>(null);
  const activeDraggedTasksBeforeDrag = useRef<Task[]>([]);
  const activeRouteIdBeforeDrag = useRef<string | null>(null);
  const currentNewIndex = useRef<number | null>(null);

  const selectedDate = Route.useSearch({
    select: ({ date }) => date ?? DateTime.now(),
  });

  const routesQuery = useRoutes(
    {
      departureAfter: selectedDate?.startOf("day").toJSDate(),
      departureBefore: selectedDate?.endOf("day").toJSDate(),
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    },
    !!selectedDate && activeDraggable === null,
    10_000,
    () => setLastRefreshedAt(DateTime.now()),
  );

  const routeTasks = useQueries({
    queries: (routesQuery.data?.routes ?? []).map((route) => ({
      queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, route.id],
      queryFn: () => tasksApi.listTasks({ routeId: route.id }),
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  useEffect(() => {
    if (routeTasks.data) {
      const tasks: Record<string, Task[]> = {};
      for (const task of routeTasks.data) {
        if (!task.routeId) continue;
        tasks[task.routeId] = [...(tasks[task.routeId] ?? []), task];
      }
      setLocalTasks(tasks);
    }
  }, [routeTasks.data]);

  const updateRoute = useMutation({
    mutationFn: (route: TRoute) => {
      if (!route.id) return Promise.reject();
      return routesApi.updateRoute({ routeId: route.id, route });
    },
    onSuccess: (route) => {
      toast.success(t("drivePlanning.routes.successToast"));
      const routeDate = DateTime.fromJSDate(route.departureTime);
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.ROUTES,
          {
            departureAfter: routeDate.startOf("day").toJSDate(),
            departureBefore: routeDate.endOf("day").toJSDate(),
          },
        ],
      });
    },
    onError: () => toast.error(t("drivePlanning.routes.errorToast")),
  });

  const updateTask = useMutation({
    mutationFn: (task: Task) => {
      if (!task.id) return Promise.reject();
      return tasksApi.updateTask({ taskId: task.id, task });
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.routes.taskMovedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE] });
    },
  });

  const renderLeftToolbar = useCallback(
    () => (
      <DatePickerWithArrows
        buttonsWithText
        labelVisible={false}
        date={selectedDate ?? DateTime.now().startOf("day")}
        setDate={(date) => navigate({ search: (search) => ({ ...search, date: date }) })}
      />
    ),
    [selectedDate, navigate],
  );

  const renderRightToolbar = useCallback(
    () => (
      <Stack direction={"row"} gap={2} alignItems="center">
        <Typography variant="caption" color="primary">
          {t("drivePlanning.routes.lastRefreshedAt", {
            lastRefreshedAt: lastRefreshedAt?.toFormat("HH:mm"),
          })}
        </Typography>
        <LoadingButton
          variant="text"
          loading={routesQuery.isLoading}
          onClick={() => routesQuery.refetch()}
          title={t("drivePlanning.routes.refresh")}
        >
          <Refresh />
        </LoadingButton>
        <Button
          size="small"
          variant="text"
          startIcon={<Add />}
          onClick={() =>
            navigate({
              to: "/drive-planning/routes/add-route",
              search: { date: selectedDate ?? DateTime.now() },
            })
          }
        >
          {t("drivePlanning.routes.newRoute")}
        </Button>
      </Stack>
    ),
    [navigate, selectedDate, t, routesQuery, lastRefreshedAt],
  );

  const handleAllocateTask = useCallback(async (task: Task) => await updateTask.mutateAsync({ ...task }), [updateTask]);

  const handleUnallocateGroupedTasks = useCallback(
    async (tasks: Task[]) => {
      for (const task of tasks) {
        await updateTask.mutateAsync({ ...task, routeId: undefined, orderNumber: undefined });
      }
    },
    [updateTask],
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const { tasks, routeId } = active.data.current as DraggedTaskData;
      activeDraggedTasksBeforeDrag.current = tasks;
      localTasksBeforeDrag.current = { ...localTasks };
      activeRouteIdBeforeDrag.current = routeId;
      setActiveDraggable(active);
    },
    [localTasks],
  );

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      const { id: activeId } = active;
      const { id: overId } = over ?? {};
      const { draggableType: activeDraggableType } = activeDraggable?.data?.current ?? {};
      const { routeId: overRouteId } = over?.data.current ?? {};
      const newIndex = currentNewIndex.current ?? 0;
      const draggedTasks = activeDraggedTasksBeforeDrag.current ?? [];

      if (activeId === overId) return;

      // Dragged task is unallocated, newIndex is set within the handleDragOver function. Assign new index to task.
      if (activeDraggableType === DraggableType.UNALLOCATED_TASK && overRouteId) {
        await handleAllocateTask({ ...draggedTasks[0], orderNumber: newIndex, routeId: overRouteId });
        return;
      }
      // Dragged task is grouped task and overId is unallocated tasks droppable. Unallocate dragged tasks.
      if (activeDraggableType === DraggableType.GROUPED_TASK && overId === DroppableType.UNALLOCATED_TASKS_DROPPABLE) {
        handleUnallocateGroupedTasks(draggedTasks);
        return;
      }
      // Dragged task is grouped task and overId is routeId. Assign new index to task. Backend handles the rest.
      if (activeDraggableType === DraggableType.GROUPED_TASK && overRouteId) {
        for (let i = 0; i < draggedTasks.length; i++) {
          const task = draggedTasks[i];
          await handleAllocateTask({ ...task, orderNumber: newIndex + i, routeId: overRouteId });
        }
        return;
      }

      setLocalTasks(localTasksBeforeDrag.current ?? {});
      activeRouteIdBeforeDrag.current = null;
      currentNewIndex.current = null;
      setActiveDraggable(null);
      activeDraggedTasksBeforeDrag.current = [];
    },
    [activeDraggable, handleAllocateTask, handleUnallocateGroupedTasks],
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      const { id: activeId } = active;
      const { id: overId } = over || {};

      if (activeId === overId) return;

      const { routeId: activeRouteId } = active.data.current ?? {};
      const { routeId: overRouteId, tasks: overTasks } = over?.data.current ?? {};
      const draggedTasksBeforeDrag = activeDraggedTasksBeforeDrag.current ?? [];

      // Check whether the dragged task is below the over item.
      const isBelowOverItem =
        over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

      // If the dragged task is below the over item, add 1 to the new index.
      const modifier = isBelowOverItem ? 1 : 0;

      const firstOverTaskIndex = localTasks[overRouteId]?.findIndex((task) => task.id === overTasks?.at(0)?.id) ?? 0;
      const newIndex = firstOverTaskIndex >= 0 ? firstOverTaskIndex + modifier : (overTasks?.length ?? 0) + 1;
      currentNewIndex.current = newIndex;

      // Dragged task is unallocated OR it belongs to another route.
      if (activeRouteId !== overRouteId && draggedTasksBeforeDrag?.length) {
        // Currently over grouped tasks. Assign new index to task.
        if (overTasks?.length) {
          // Dragged task is unallocated. Add it to the corresponding routes tasks client-side.
          if (!activeRouteId && overRouteId) {
            const newLocalTasks = DragAndDropUtils.moveUnallocatedTasksToRoute(
              overRouteId,
              newIndex,
              localTasks,
              draggedTasksBeforeDrag,
            );
            setLocalTasks(newLocalTasks);
          } else if (activeRouteId && overRouteId) {
            // Dragged task belongs to another route. Remove it from the active route and add it to the over route.
            const newLocalTasks = DragAndDropUtils.moveTaskFromRouteToRoute(
              activeRouteId,
              overRouteId,
              newIndex,
              localTasks,
              draggedTasksBeforeDrag,
            );
            setLocalTasks(newLocalTasks);
          }
        } else {
          // Not over grouped tasks. Assign dragged task(s) to corresponding routes tasks client-side.
          const newLocalTasks = DragAndDropUtils.moveTaskFromRouteToBottomOfRoute(
            activeRouteId,
            overRouteId,
            localTasks,
            draggedTasksBeforeDrag,
          );
          setLocalTasks(newLocalTasks);
        }
      } else if (!over && !activeRouteId) {
        const newLocalTasks = DragAndDropUtils.removeTasksFromRoute(localTasks, draggedTasksBeforeDrag);
        setLocalTasks(newLocalTasks);
      }
    },
    [localTasks],
  );

  const handleDragCancel = useCallback(() => {
    setLocalTasks(localTasksBeforeDrag.current ?? {});
    localTasksBeforeDrag.current = null;
    setActiveDraggable(null);
    activeDraggedTasksBeforeDrag.current = [];
    currentNewIndex.current = null;
    activeRouteIdBeforeDrag.current = null;
  }, []);

  const renderDragOverlay = useCallback(() => {
    if (!activeDraggable) return null;
    const { tasks, routeId } = (activeDraggable?.data.current as DraggedTaskData) ?? {};
    if (!tasks || routeId) return null;
    const [task] = tasks;
    const { type, groupNumber, customerSiteId } = task;
    const foundSite = sitesQuery.data?.sites.find((site) => site.id === customerSiteId);
    if (!foundSite) return null;

    return <DraggedTaskOverlay tasks={tasks} taskType={type} groupNumber={groupNumber} site={foundSite} />;
  }, [activeDraggable, sitesQuery.data?.sites]);

  return (
    <>
      <Outlet />
      <Root>
        <DndContext
          sensors={useSensors(
            useSensor(PointerSensor, {
              activationConstraint: {
                delay: 250,
                tolerance: 5,
                distance: 15,
              },
            }),
          )}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <ToolbarRow leftToolbar={renderLeftToolbar()} toolbarButtons={renderRightToolbar()} />
          <RoutesTable
            paginationModel={paginationModel}
            routes={routesQuery.data?.routes ?? []}
            tasksByRoute={localTasks}
            totalRoutes={routesQuery.data?.totalResults ?? 0}
            onPaginationModelChange={setPaginationModel}
            onUpdateRoute={updateRoute.mutateAsync}
          />
          <UnallocatedTasksDrawer
            open={unallocatedDrawerOpen}
            sites={sitesQuery.data?.sites ?? []}
            onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
          />
          <DragOverlay>{renderDragOverlay()}</DragOverlay>
        </DndContext>
      </Root>
    </>
  );
}
