import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Remove } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSortable } from "@dnd-kit/sortable";
import { Site, Task, TaskType } from "generated/client";
import LocalizationUtils from "utils/localization-utils";
import { useTranslation } from "react-i18next";

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

const DraggableTaskTableRow = ({ taskRow, taskCount }: Props) => {
  const { tasksApi } = useApi();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { type, taskGroupKey, customerSite, groupNumber, tasks } = taskRow;
  const { name, address, postalCode, locality } = customerSite;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: taskGroupKey,
    data: {
      modifiers: [restrictToVerticalAxis],
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      for (const task of tasks) {
        queryClient.invalidateQueries({ queryKey: ["tasks", task.id] });
        queryClient.invalidateQueries({ queryKey: ["routes", task.routeId] });
      }
    },
  });
  return (
    <TableRow key={taskGroupKey} ref={setNodeRef} sx={{ ...style }} {...listeners} {...attributes}>
      <TableCell>{LocalizationUtils.getLocalizedTaskType(type, t)}</TableCell>
      <TableCell>{groupNumber}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        {address}, {postalCode} {locality}
      </TableCell>
      <TableCell>{taskCount}</TableCell>
      <TableCell align="right">
        <IconButton sx={{ padding: 0, zIndex: 100000000 }} onClick={() => saveTask.mutate()}>
          <Remove />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default DraggableTaskTableRow;
