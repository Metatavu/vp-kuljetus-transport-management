import { Remove } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Site, Task, TaskType } from "generated/client";
import LocalizationUtils from "utils/localization-utils";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS } from "hooks/use-queries";

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
  const { type, taskGroupKey, customerSite, groupNumber, tasks } = taskRow;
  const { name, address, postalCode, locality } = customerSite;

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

  return (
    <TableRow key={taskGroupKey}>
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
  );
};

export default TaskTableRow;
