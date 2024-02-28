import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Remove } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { Site, Task } from "generated/client";
import { t } from "i18next";
import { useEffect, useState } from "react";
import LocalizationUtils from "utils/localization-utils";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DataValidation from "utils/data-validation-utils";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  tasks: Task[];
  sites: Site[];
};

const DraggableTaskTableRow = ({ task, taskCount, site }: { task: Task; taskCount: number; site: Site }) => {
  const { customerSiteId, type, groupNumber } = task;
  const { name, address, postalCode, locality } = site;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id ?? "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow key={customerSiteId} ref={setNodeRef} sx={{ ...style }} {...listeners} {...attributes}>
      <TableCell>{LocalizationUtils.getLocalizedTaskType(type, t)}</TableCell>
      <TableCell>{groupNumber}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        {address}, {postalCode} {locality}
      </TableCell>
      <TableCell>{taskCount}</TableCell>
      <TableCell align="right">
        <IconButton sx={{ padding: 0 }}>
          <Remove />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const RoutesTasksTable = ({ tasks, sites }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id: "routes-tasks-table" });

  const style = {
    backgroundColor: isOver ? "#ff0000" : undefined,
  };

  const [groupedTasks, setGroupedTasks] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    if (!tasks.length) return;
    setGroupedTasks(
      tasks.reduce(
        (acc, task) => {
          const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(task);
          return acc;
        },
        {} as Record<string, Task[]>,
      ),
    );
  }, [tasks]);

  return (
    <TableContainer>
      <Table ref={setNodeRef} sx={{ ...style }}>
        <TableHead>
          <TableRow>
            <TableCell>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.tasksAmount")}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <SortableContext
            items={Object.keys(groupedTasks)
              .map((key) => groupedTasks[key][0].id)
              .filter(DataValidation.validateValueIsNotUndefinedNorNull)}
          >
            {Object.keys(groupedTasks).map((key) => {
              const tasks = groupedTasks[key];
              const { customerSiteId, type, groupNumber } = tasks[0];
              const foundSite = sites.find((site) => site.id === customerSiteId);
              if (!foundSite) return null;

              return (
                <DraggableTaskTableRow key={customerSiteId} site={foundSite} task={tasks[0]} taskCount={tasks.length} />
              );
            })}
          </SortableContext>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTasksTable;
