import { ArrowForward, Remove } from "@mui/icons-material";
import { IconButton, List, ListItemButton, ListItemText, ListSubheader, Popover, TableCell, TableRow } from "@mui/material";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Site, Task, TaskType } from "generated/client";
import LocalizationUtils from "utils/localization-utils";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS, useFreights } from "hooks/use-queries";
import { useSortable } from "@dnd-kit/sortable";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { GroupedTaskSortableData, DraggableType } from "../../../types";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  tasks: Task[];
  groupNumber: number;
  type: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
  allTasks: Task[];
};

const TaskTableRow = ({ tasks, type, site, groupNumber, taskCount, groupedTasksKey, routeId, allTasks }: Props) => {
  const { tasksApi } = useApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/drive-planning/routes" });
  const freightsQuery = useFreights();
  const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number } | undefined>();

  const { name, address, postalCode, locality } = site;

  const draggableData: GroupedTaskSortableData = useMemo(
    () => ({
      draggableType: DraggableType.GROUPED_TASK,
      draggedTasks: tasks,
      routeId: routeId,
      allTasks: allTasks,
      key: groupedTasksKey,
    }),
    [tasks, routeId, allTasks, groupedTasksKey],
  );

  const { listeners, setNodeRef, isOver, over, active, transition, transform } = useSortable({
    id: groupedTasksKey,
    data: draggableData,
  });

  const isOverGrouppableTask = () => {
    const { draggableType } = active?.data.current ?? {};
    if (draggableType === "groupedTask") return false;
    const { groupNumber, customerSiteId, type } = active?.data.current?.task ?? {};
    const activeGroupedTaskKey = `${groupNumber}-${customerSiteId}-${type}`;

    return isOver && activeGroupedTaskKey === groupedTasksKey;
  };

  const rowStyle = useMemo(
    () => ({
      outline: over?.id !== active?.id && isOverGrouppableTask() ? "2px solid #4E8A9C" : "none",
      outlineOffset: "-2px",
      borderBottom: over?.id !== active?.id && isOver && !isOverGrouppableTask() ? "2px solid #4E8A9C" : "none",
      transition: transition,
      transform: CSS.Transform.toString(transform),
    }),
    [over, active, isOver, isOverGrouppableTask, transition, transform],
  );

  const saveTask = useMutation({
    mutationFn: () =>
      Promise.all(
        tasks.map((task) => {
          if (!task.id) return Promise.reject();
          return tasksApi.updateTask({
            taskId: task.id,
            task: { ...task, routeId: undefined, orderNumber: undefined },
          });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
    },
  });

  const renderPopoverContent = useCallback(() => {
    return tasks.map((task) => {
      if (!task.freightId) return null;
      const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === task.freightId);

      if (!foundFreight?.id) return null;

      return (
        <ListItemButton
          key={task.id}
          onClick={() => navigate({ search: { freightId: foundFreight.id, date: undefined } })}
          title="Freight"
          divider
        >
          <ListItemText primary={t("drivePlanning.freights.dialog.title", { freightNumber: foundFreight.freightNumber })} />
          <ArrowForward fontSize="small" />
        </ListItemButton>
      );
    });
  }, [freightsQuery.data, navigate, t, tasks]);

  const handleTableRowClick = useCallback(
    ({ clientX, clientY, target }: React.MouseEvent<HTMLTableRowElement>) => {
      tasks.map((task) => console.log("orderNumber", task.orderNumber));
      if ((target as HTMLElement).closest("button")) return;
      if (taskCount === 1) {
        const { freightId } = tasks[0];
        const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === freightId);
        if (!foundFreight?.id) return;
        return navigate({ search: { freightId: freightId, date: undefined } });
      }

      if (taskCount > 1) {
        setMenuCoordinates({ clientX: clientX, clientY: clientY });
      }
    },
    [freightsQuery.data, navigate, taskCount, tasks],
  );

  return (
    <>
      <TableRow ref={setNodeRef} sx={{ height: "38px", ...rowStyle }} onClick={handleTableRowClick} {...listeners}>
        <TableCell>{LocalizationUtils.getLocalizedTaskType(type, t)}</TableCell>
        <TableCell>{groupNumber}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          {address}, {postalCode} {locality}
        </TableCell>
        <TableCell>{taskCount}</TableCell>
        <TableCell align="right">
          <IconButton sx={{ padding: 0 }} onClick={async () => await saveTask.mutateAsync()}>
            <Remove />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!menuCoordinates}
        onClose={() => setMenuCoordinates(undefined)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: menuCoordinates?.clientY ?? 0, left: menuCoordinates?.clientX ?? 0 }}
      >
        <List
          dense
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t("drivePlanning.routes.tasksTable.selectWaybill")}
            </ListSubheader>
          }
        >
          {renderPopoverContent()}
        </List>
      </Popover>
    </>
  );
};

export default TaskTableRow;
