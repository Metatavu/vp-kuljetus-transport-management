import { Remove } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { Site, Task, TaskType } from "generated/client";
import { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import LocalizationUtils from "utils/localization-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "hooks/use-queries";

type Props = {
  tasks: Task[];
  taskType: TaskType;
  groupNumber: number;
  site: Site;
  isDragging?: boolean;
  isOverlay?: boolean;
  style?: React.CSSProperties;
};

const TasksTableRow = forwardRef(
  (
    { tasks, taskType, groupNumber, site, isDragging = false, isOverlay = false, style, ...rest }: Props,
    ref: ForwardedRef<HTMLTableRowElement>,
  ) => {
    const { tasksApi } = useApi();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { name, address, postalCode, locality } = site;

    const saveTask = useMutation({
      mutationFn: (task: Task) => (task.id ? tasksApi.updateTask({ taskId: task.id, task: task }) : Promise.reject()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
      },
    });

    const unAllocateTasks = () => {
      for (const task of tasks) {
        saveTask.mutate({ ...task, routeId: undefined, orderNumber: undefined });
      }
    };

    return (
      <TableRow ref={ref} style={{ ...style }} {...rest}>
        <TableCell>{LocalizationUtils.getLocalizedTaskType(taskType, t)}</TableCell>
        <TableCell>{groupNumber}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          {address}, {postalCode} {locality}
        </TableCell>
        <TableCell>{tasks.length}</TableCell>
        <TableCell align="right">
          <IconButton sx={{ padding: 0 }} disabled={isOverlay || isDragging} onClick={unAllocateTasks}>
            <Remove />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  },
);

export default TasksTableRow;
