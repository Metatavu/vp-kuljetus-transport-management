import { ArrowForward, Remove } from "@mui/icons-material";
import { Button, IconButton, Popover, TableCell, TableRow } from "@mui/material";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Site, Task, TaskType } from "generated/client";
import LocalizationUtils from "utils/localization-utils";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS, useFreights } from "hooks/use-queries";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

type Props = {
  tasks: Task[];
  groupNumber: number;
  type: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
};

const TaskTableRow = ({ tasks, type, site, groupNumber, taskCount, groupedTasksKey }: Props) => {
  const { tasksApi } = useApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/drive-planning/routes" });
  const freightsQuery = useFreights();
  const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number } | undefined>();

  const { name, address, postalCode, locality } = site;
  const { listeners, setNodeRef, isOver, over, active, transition, transform } = useSortable({
    id: groupedTasksKey,
    data: { draggableType: "groupedTask", tasks: tasks },
  });

  console.log("active", active);
  console.log("over", over);

  const rowStyle = {
    outline: over?.id !== active?.id && isOver ? "2px solid #4E8A9C" : "none",
    outlineOffset: "-2px",
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  const saveTask = useMutation({
    mutationFn: () =>
      Promise.all(
        tasks.map((task) => {
          if (!task.id) return Promise.reject();
          return tasksApi.updateTask({ taskId: task.id, task: { ...task, routeId: undefined } });
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
        <Button
          key={task.id}
          sx={{ justifyContent: "space-between", padding: "8px 16px" }}
          endIcon={<ArrowForward />}
          fullWidth
          onClick={() => navigate({ search: { freightId: foundFreight.id, date: undefined } })}
        >
          {t("drivePlanning.freights.dialog.title", { freightNumber: foundFreight.freightNumber })}
        </Button>
      );
    });
  }, [freightsQuery.data, navigate, t, tasks]);

  const handleTableRowClick = ({ clientX, clientY }: React.MouseEvent<HTMLTableRowElement>) => {
    if (taskCount === 1) {
      const { freightId } = tasks[0];
      const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === freightId);
      if (!foundFreight?.id) return;
      return navigate({ search: { freightId: freightId, date: undefined } });
    }

    if (taskCount > 1) {
      setMenuCoordinates({ clientX: clientX, clientY: clientY });
    }
  };
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
          <IconButton sx={{ padding: 0 }} onClick={() => saveTask.mutate()}>
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
        {renderPopoverContent()}
      </Popover>
    </>
  );
};

export default TaskTableRow;
