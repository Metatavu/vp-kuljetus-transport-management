import { ArrowForward, Remove } from "@mui/icons-material";
import { Button, IconButton, Popover, TableCell, TableRow } from "@mui/material";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Site, Task, TaskType } from "generated/client";
import LocalizationUtils from "utils/localization-utils";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS, useFreights } from "hooks/use-queries";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export type TDraggableTaskTableRow = {
  type: TaskType;
  tasks: Task[];
  taskGroupKey: string;
  customerSite: Site;
  groupNumber: number;
};

type Props = {
  taskRow: TDraggableTaskTableRow;
  taskCount: number;
};

const TaskTableRow = ({ taskRow, taskCount }: Props) => {
  const { tasksApi } = useApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const freightsQuery = useFreights();
  const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number } | undefined>();

  const { type, taskGroupKey, customerSite, groupNumber, tasks } = taskRow;
  const { name, address, postalCode, locality } = customerSite;

  const { listeners, transform, setNodeRef } = useDraggable({
    id: taskGroupKey,
    data: { draggableType: "groupedTask", tasks: tasks },
  });

  const style = {
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

  const renderPopoverContent = () => {
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
          onClick={() =>
            navigate({ to: "/drive-planning/freights/$freightId/modify", params: { freightId: task.freightId } })
          }
        >
          {t("drivePlanning.freights.dialog.title", { freightNumber: foundFreight.freightNumber })}
        </Button>
      );
    });
  };

  const handleTableRowClick = ({ clientX, clientY }: React.MouseEvent<HTMLTableRowElement>) => {
    if (taskCount === 1) {
      const { freightId } = tasks[0];
      const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === freightId);
      if (!foundFreight?.id) return;
      return navigate({ to: "/drive-planning/freights/$freightId/modify", params: { freightId: freightId } });
    }

    if (taskCount > 1) {
      setMenuCoordinates({ clientX: clientX, clientY: clientY });
    }
  };
  return (
    <>
      <TableRow ref={setNodeRef} sx={{ height: "38px", ...style }} onClick={handleTableRowClick} {...listeners}>
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
