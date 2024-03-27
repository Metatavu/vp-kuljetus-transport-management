import { Button, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Route as TRoute, Task } from "generated/client";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallotaced-tasks-drawer";
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
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import { toast } from "react-toastify";
import { DraggableType, DroppableType, DraggedTaskData } from "../types";
import TasksTableRow from "components/drive-planning/routes/tasks-table-row";
import { GridPaginationModel } from "@mui/x-data-grid";
import DataValidation from "utils/data-validation-utils";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sitesQuery = useSites();

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(DateTime.now());
  const [unallocatedDrawerOpen, setUnallocatedDrawerOpen] = useState(true);
  const [activeDraggable, setActiveDraggable] = useState<Active | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [localTasks, setLocalTasks] = useState<Record<string, Task[]>>({});

  const localTasksBeforeDrag = useRef<null | Record<string, Task[]>>(null);

  const initialDate = Route.useSearch({
    select: ({ date }) => date,
  });

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  const routesQuery = useRoutes(
    {
      departureAfter: selectedDate?.startOf("day").toJSDate(),
      departureBefore: selectedDate?.endOf("day").toJSDate(),
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    },
    !!selectedDate,
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
    onSuccess: () => {
      toast.success(t("drivePlanning.routes.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] });
    },
    onError: () => toast.error(t("drivePlanning.routes.errorToast")),
  });

  const updateTask = useMutation({
    mutationFn: (task: Task) => {
      if (!task.id) return Promise.reject();
      return tasksApi.updateTask({ taskId: task.id, task });
    },
    onSuccess: () => {
      toast.success("Tehtävän siirto onnistui!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE] });
    },
  });

  const renderLeftToolbar = useCallback(
    () => (
      <Stack direction="row">
        <Typography variant="h6" sx={{ opacity: 0.6 }} alignSelf="center">
          {t("drivePlanning.routes.date")}
        </Typography>
        <DatePickerWithArrows labelVisible={false} date={selectedDate} setDate={setSelectedDate} />
      </Stack>
    ),
    [selectedDate, t],
  );

  const renderRightToolbar = useCallback(
    () => (
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
    ),
    [navigate, selectedDate, t],
  );

  const handleAllocateTask = useCallback(async (task: Task) => await updateTask.mutateAsync({ ...task }), [updateTask]);

  const handleUnallocateGroupedTasks = useCallback(
    async (tasks: Task[]) =>
      await Promise.all(
        tasks.map((task) => updateTask.mutateAsync({ ...task, routeId: undefined, orderNumber: undefined })),
      ),
    [updateTask],
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      localTasksBeforeDrag.current = { ...localTasks };
      setActiveDraggable(active);
    },
    [localTasks],
  );

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      console.log(over);
      const { id: activeId } = active;
      const { id: overId } = over ?? {};
      if (activeId === overId) return;
      const {
        draggedTasks: activeDraggedTasks,
        draggableType: activeDraggableType,
        newIndex: activeNewIndex,
      } = active.data.current ?? {};
      const { routeId: overRouteId, sortable } = over?.data.current ?? {};
      const { index: overIndex } = sortable ?? {};
      const overRouteTasks = localTasks[overRouteId] ?? [];
      // Dragged task is unallocated, newIndex is set within the handleDragOver function. Assign new index to task.
      if (activeDraggableType === DraggableType.UNALLOCATED_TASK && overRouteId) {
        const newIndex = activeNewIndex === undefined ? overRouteTasks.length : activeNewIndex;
        handleAllocateTask({ ...activeDraggedTasks[0], orderNumber: newIndex, routeId: overRouteId });
        return;
      }
      // Dragged task is grouped task and overId is unallocated tasks droppable. Unallocate dragged tasks.
      if (activeDraggableType === DraggableType.GROUPED_TASK && overId === DroppableType.UNALLOCATED_TASKS_DROPPABLE) {
        handleUnallocateGroupedTasks(activeDraggedTasks);
        return;
      }
      // Dragged task is grouped task and overId is routeId. Assign new index to task. Backend handles the rest.
      if (activeDraggableType === DraggableType.GROUPED_TASK && overRouteId) {
        const newIndex = overRouteTasks.length ? overIndex : 0;
        handleAllocateTask({ ...activeDraggedTasks[0], orderNumber: newIndex, routeId: overRouteId });
        return;
      }
    },
    [handleAllocateTask, handleUnallocateGroupedTasks, localTasks],
  );

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const { id: activeId } = active;
    const { id: overId } = over || {};
    if (activeId === overId) return;
    const { routeId: activeRouteId, draggedTasks: activeDraggedTasks } = active.data.current ?? {};
    const { routeId: overRouteId, draggedTasks: overDraggedTasks } = over?.data.current ?? {};
    // Dragged task is unallocated OR it belongs to another route.
    if (activeRouteId !== overRouteId && activeDraggedTasks?.length) {
      // Currently over grouped tasks. Assign new index to task.
      if (overDraggedTasks?.length) {
        const firstOverTaskIndex =
          localTasks[overRouteId]?.findIndex((task) => task.id === overDraggedTasks[0].id) ?? -1;
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        const newIndex = firstOverTaskIndex >= 0 ? firstOverTaskIndex + modifier : overDraggedTasks.length + 1;
        // Save new index to active draggable data. To be used within handleDragEnd function.
        if (active.data.current) {
          active.data.current.newIndex = newIndex;
        }
        // Dragged task is unallocated. Add it to the corresponding routes tasks client-side.
        if (!activeRouteId && overRouteId) {
          setLocalTasks((previousLocalTasks) => {
            return {
              ...previousLocalTasks,
              [overRouteId]: [
                ...previousLocalTasks[overRouteId].slice(0, newIndex),
                ...activeDraggedTasks,
                ...previousLocalTasks[overRouteId].slice(newIndex, previousLocalTasks[overRouteId].length),
              ],
            };
          });
        } else if (activeRouteId && overRouteId) {
          // Dragged task belongs to another route. Remove it from the active route and add it to the over route.
          setLocalTasks((previousLocalTasks) => {
            const tasks = previousLocalTasks[activeRouteId] ?? [];
            const activeDraggedTaskIds = activeDraggedTasks.map((task: Task) => task.id);
            const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
            return {
              ...previousLocalTasks,
              [activeRouteId]: newTasks,
              [overRouteId]: [
                ...previousLocalTasks[overRouteId].slice(0, newIndex),
                ...activeDraggedTasks,
                ...previousLocalTasks[overRouteId].slice(newIndex, previousLocalTasks[overRouteId].length),
              ],
            };
          });
        }
      } else {
        // Not over grouped tasks. Assign dragged task(s) to corresponding routes tasks client-side.
        setLocalTasks((previousLocalTasks) => {
          const tasks = previousLocalTasks[activeRouteId] ?? [];
          const activeDraggedTaskIds = activeDraggedTasks.map((task: Task) => task.id);
          const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
          return {
            ...previousLocalTasks,
            [activeRouteId]: newTasks,
            [overRouteId]: [...(previousLocalTasks[overRouteId] ?? []), ...activeDraggedTasks],
          };
        });
      }
    }
  };

  const handleDragCancel = useCallback(() => {
    setLocalTasks(localTasksBeforeDrag.current ?? {});
    localTasksBeforeDrag.current = null;
    setActiveDraggable(null);
  }, []);

  const renderDragOverlay = useCallback(() => {
    if (!activeDraggable) return null;
    const { draggedTasks, routeId } = (activeDraggable?.data.current as DraggedTaskData) ?? {};
    if (!draggedTasks || routeId) return null;
    const [task] = draggedTasks;
    const { type, groupNumber, customerSiteId } = task;
    const foundSite = sitesQuery.data?.sites.find((site) => site.id === customerSiteId);
    if (!foundSite) return null;

    return <TasksTableRow tasks={[task]} taskType={type} groupNumber={groupNumber} site={foundSite} isOverlay />;
  }, [activeDraggable, sitesQuery.data?.sites]);

  return (
    <>
      <Outlet />
      <Paper sx={{ minHeight: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
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
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <ToolbarRow leftToolbar={renderLeftToolbar()} toolbarButtons={renderRightToolbar()} />
          <LoaderWrapper loading={sitesQuery.isLoading}>
            <RoutesTable
              paginationModel={paginationModel}
              sites={sitesQuery.data?.sites ?? []}
              routes={routesQuery.data?.routes ?? []}
              tasksByRoute={localTasks}
              totalRoutes={routesQuery.data?.totalResults ?? 0}
              onPaginationModelChange={setPaginationModel}
              onUpdateRoute={updateRoute.mutateAsync}
            />
            <UnallocatedTasksDrawer
              open={unallocatedDrawerOpen}
              sites={sitesQuery.data?.sites ?? []}
              allocatedTasks={routeTasks.data ?? []}
              onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
            />
          </LoaderWrapper>
          <DragOverlay modifiers={[snapCenterToCursor]}>{renderDragOverlay()}</DragOverlay>
        </DndContext>
      </Paper>
    </>
  );
}
