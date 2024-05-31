import { Button, Paper, styled } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add } from "@mui/icons-material";
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
  const [localTasks, setLocalTasks] = useState<Record<string, Task[]>>({});

  const localTasksBeforeDrag = useRef<null | Record<string, Task[]>>(null);
  const activeDraggedTasksBeforeDrag = useRef<Task[]>([]);

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
      toast.success("Tehtävän siirto onnistui!");
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
      const { draggedTasks } = active.data.current as DraggedTaskData;
      activeDraggedTasksBeforeDrag.current = draggedTasks;
      localTasksBeforeDrag.current = { ...localTasks };
      setActiveDraggable(active);
    },
    [localTasks],
  );

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      const { id: activeId } = active;
      const { id: overId } = over ?? {};
      const {
        draggedTasks: activeDraggedTasks,
        draggableType: activeDraggableType,
        newIndex: activeNewIndex,
      } = active.data.current ?? {};
      const { routeId: overRouteId, draggableType: overDraggableType, sortable } = over?.data.current ?? {};
      if (activeId === overId && activeDraggableType === overDraggableType) return;
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
        const newIndex = overRouteTasks.length ? overIndex ?? overRouteTasks.length : 0;
        handleAllocateTask({ ...activeDraggedTasks[0], orderNumber: newIndex, routeId: overRouteId });
        return;
      }
      setActiveDraggable(null);
      activeDraggedTasksBeforeDrag.current = [];
    },
    [handleAllocateTask, handleUnallocateGroupedTasks, localTasks],
  );

  const handleDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      const { id: activeId } = active;
      const { id: overId } = over || {};
      if (activeId === overId) return;
      const { routeId: activeRouteId, draggedTasks: activeDraggedTasks } = active.data.current ?? {};
      const { routeId: overRouteId, draggedTasks: overDraggedTasks } = over?.data.current ?? {};
      const draggedTasksBeforeDrag = activeDraggedTasksBeforeDrag.current ?? [];

      // Check whether the dragged task is below the over item.
      const isBelowOverItem =
        over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

      // If the dragged task is below the over item, add 1 to the new index.
      const modifier = isBelowOverItem ? 1 : 0;

      // Restrict dragging grouped tasks away from any route as that for some reason drops all the
      // if (!overRouteId && activeDraggableType === DraggableType.GROUPED_TASK) return;
      const firstOverTaskIndex =
        localTasks[overRouteId]?.findIndex((task) => task.id === overDraggedTasks?.at(0)?.id) ?? -1;
      const newIndex = firstOverTaskIndex >= 0 ? firstOverTaskIndex + modifier : (overDraggedTasks?.length ?? 0) + 1;

      // Dragged task is unallocated OR it belongs to another route.
      if (activeRouteId !== overRouteId && draggedTasksBeforeDrag?.length) {
        // Currently over grouped tasks. Assign new index to task.
        if (overDraggedTasks?.length) {
          // Save new index to active draggable data. To be used within handleDragEnd function.
          if (active.data.current) {
            active.data.current.newIndex = newIndex;
          }
          // Dragged task is unallocated. Add it to the corresponding routes tasks client-side.
          if (!activeRouteId && overRouteId) {
            console.log("1");
            setLocalTasks((previousLocalTasks) => {
              const tasks = previousLocalTasks[overRouteId] ?? [];
              const activeDraggedTaskIds = activeDraggedTasks.map((task: Task) => task.id);
              const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
              return {
                ...previousLocalTasks,
                [overRouteId]: [
                  ...newTasks.slice(0, newIndex),
                  ...activeDraggedTasks,
                  ...newTasks.slice(newIndex, newTasks.length),
                ].filter((task, index, self) => index === self.findIndex((t) => t.id === task.id)),
              };
            });
          } else if (activeRouteId && overRouteId) {
            // Dragged task belongs to another route. Remove it from the active route and add it to the over route.
            const newLocalTasks = [
              ...localTasks[overRouteId].slice(0, newIndex),
              ...activeDraggedTasks,
              ...localTasks[overRouteId].slice(newIndex, localTasks[overRouteId].length),
            ];
            console.log("2");
            setLocalTasks((previousLocalTasks) => {
              const tasks = previousLocalTasks[activeRouteId] ?? [];
              const activeDraggedTaskIds = activeDraggedTasks.map((task: Task) => task.id);
              const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
              return {
                ...previousLocalTasks,
                [activeRouteId]: newTasks.filter(
                  (task, index, self) => index === self.findIndex((t) => t.id === task.id),
                ),
                [overRouteId]: newLocalTasks.filter(
                  (task, index, array) => index === array.findIndex((t) => t.id === task.id),
                ),
              };
            });
          }
        } else {
          // Not over grouped tasks. Assign dragged task(s) to corresponding routes tasks client-side.
          console.log("3");
          setLocalTasks((previousLocalTasks) => {
            const tasks = previousLocalTasks[activeRouteId] ?? [];
            const activeDraggedTaskIds = draggedTasksBeforeDrag.map((task: Task) => task.id);
            const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
            return {
              ...previousLocalTasks,
              [activeRouteId]: newTasks,
              [overRouteId]: [...(previousLocalTasks[overRouteId] ?? []), ...draggedTasksBeforeDrag],
            };
          });
        }
      } else if (!over && !activeRouteId) {
        const newLocalTasks: Record<string, Task[]> = {};
        for (const key of Object.keys(localTasks)) {
          const tasks = localTasks[key];
          const activeDraggedTaskIds = (activeDraggedTasks ?? draggedTasksBeforeDrag).map((task: Task) => task.id);
          const newTasks = tasks.filter((task) => !activeDraggedTaskIds.includes(task.id));
          newLocalTasks[key] = newTasks;
        }
        console.log("4");
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
  }, []);

  const renderDragOverlay = useCallback(() => {
    if (!activeDraggable) return null;
    const { draggedTasks, routeId } = (activeDraggable?.data.current as DraggedTaskData) ?? {};
    if (!draggedTasks || routeId) return null;
    const [task] = draggedTasks;
    const { type, groupNumber, customerSiteId } = task;
    const foundSite = sitesQuery.data?.sites.find((site) => site.id === customerSiteId);
    if (!foundSite) return null;

    return <DraggedTaskOverlay tasks={draggedTasks} taskType={type} groupNumber={groupNumber} site={foundSite} />;
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
