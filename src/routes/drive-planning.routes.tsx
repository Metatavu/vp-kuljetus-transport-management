import { Button, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add, LocalShipping } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Route as TRoute, Task } from "generated/client";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallotaced-tasks-drawer";
import RoutesTable from "components/drive-planning/routes/routes-table";
import { QUERY_KEYS, useSites } from "hooks/use-queries";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import { toast } from "react-toastify";
import {
  DraggableType,
  DroppableData,
  DroppableType,
  GroupedTaskSortableData,
  UnallocatedTaskDraggableData,
} from "../types";

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

  const initialDate = Route.useSearch({
    select: ({ date }) => date,
  });

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] });
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

  const handleAllocateTask = async (task: Task) => await updateTask.mutateAsync({ ...task });

  const handleUnallocateGroupedTasks = async (tasks: Task[]) =>
    await Promise.all(
      tasks.map((task) => updateTask.mutateAsync({ ...task, routeId: undefined, orderNumber: undefined })),
    );

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveDraggable(active);
  }, []);

  // const isDraggingGroupedTasks = (id: string) =>
  //   /^\d+\-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\-(?:LOAD|UNLOAD)/.test(id);

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      const { current: currentOver } = over?.data ?? {};
      const { current: currentActive } = active?.data ?? {};
      if (currentActive?.draggableType === DraggableType.UNALLOCATED_TASK && currentOver?.routeId) {
        const { task } = currentActive as UnallocatedTaskDraggableData;
        const { routeId, allTasks } = currentOver as DroppableData;

        handleAllocateTask({ ...task, orderNumber: allTasks.length, routeId: routeId });
      }

      if (
        currentActive?.draggableType === DraggableType.GROUPED_TASK &&
        over?.id === DroppableType.UNALLOCATED_TASKS_DROPPABLE
      ) {
        const { draggedTasks } = currentActive as GroupedTaskSortableData;

        handleUnallocateGroupedTasks(draggedTasks);
      }

      if (currentActive?.draggableType === DraggableType.GROUPED_TASK) {
        if (over?.id.toString().startsWith(DroppableType.ROUTES_TASKS_DROPPABLE)) {
        }
      }

      if (currentActive?.draggableType === DraggableType.GROUPED_TASK && currentOver?.routeId) {
        const { draggedTasks: overDraggedTasks, allTasks } = currentOver as GroupedTaskSortableData;
        const { draggedTasks: activeDraggedTasks } = currentActive as GroupedTaskSortableData;
        const lastDraggedTask = overDraggedTasks[overDraggedTasks.length - 1];
        const overIndex = allTasks.indexOf(lastDraggedTask);

        for (const [index, task] of activeDraggedTasks.entries()) {
          await handleAllocateTask({ ...task, orderNumber: overIndex + index });
        }
      }
      setActiveDraggable(null);
    },
    [handleAllocateTask, handleUnallocateGroupedTasks],
  );

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
              bypassActivationConstraint: ({ activeNode }) =>
                activeNode?.data?.current?.draggableType === "unallocatedTask",
            }),
          )}
          // Example of collision detection
          // collisionDetection={(args) => {
          //   const {
          //     active: {
          //       data: { current },
          //     },
          //   } = args;
          //   const task = current?.task as Task;
          //   const groupedKey = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
          //   const { droppableContainers } = args;
          //   const { droppableRects, pointerCoordinates } = args;
          //   if (!pointerCoordinates) return [];
          //   let closestDistance = Number.MAX_SAFE_INTEGER;
          //   let closestSide: "top" | "bottom" = "top";
          //   let closestRectangle: { id: UniqueIdentifier; rect: ClientRect } | null = null;
          //   let foundGroup: any = {};
          //   droppableContainers.forEach((container) => {
          //     const key = container.data.current?.key;
          //     if (key === groupedKey) {
          //       foundGroup = container;
          //     }
          //   });
          //   for (const [id, rect] of droppableRects.entries()) {
          //     const { top, bottom } = rect;
          //     const distanceToTop = Math.abs(top - pointerCoordinates.y);
          //     const distanceToBottom = Math.abs(bottom - pointerCoordinates.y);
          //     if (distanceToTop < closestDistance) {
          //       closestDistance = distanceToTop;
          //       closestSide = "top";
          //       closestRectangle = { id, rect };
          //     }
          //     if (distanceToBottom < closestDistance) {
          //       closestDistance = distanceToBottom;
          //       closestSide = "bottom";
          //       closestRectangle = { id, rect };
          //     }
          //   }
          //   console.log("closest", closestSide, closestRectangle?.rect);
          //   if (closestRectangle) {
          //     return [foundGroup];
          //   }
          //   return [];
          // }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ToolbarRow leftToolbar={renderLeftToolbar()} toolbarButtons={renderRightToolbar()} />
          <LoaderWrapper loading={sitesQuery.isLoading}>
            <RoutesTable
              selectedDate={selectedDate ?? DateTime.now()}
              sites={sitesQuery.data?.sites ?? []}
              onUpdateRoute={updateRoute.mutateAsync}
            />
            <UnallocatedTasksDrawer
              open={unallocatedDrawerOpen}
              sites={sitesQuery.data?.sites ?? []}
              onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
            />
          </LoaderWrapper>
          <DragOverlay modifiers={[snapCenterToCursor]}>
            {/* {activeDraggable?.data.current?.draggableType === DraggableType.UNALLOCATED_TASK ? (
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
            ) : null} */}
          </DragOverlay>
        </DndContext>
      </Paper>
    </>
  );
}
