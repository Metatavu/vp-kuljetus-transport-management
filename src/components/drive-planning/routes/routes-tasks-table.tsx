import { useDroppable } from "@dnd-kit/core";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Site, Task } from "generated/client";
import { t } from "i18next";
import { useEffect, useState } from "react";
import DraggableTaskTableRow, { TDraggableTaskTableRow } from "./draggable-task-table-row";

type Props = {
  tasks: Task[];
  sites: Site[];
  smallColumnWidth: number;
  columnWidth: number;
  routeId: string;
};

const RoutesTasksTable = ({ routeId, smallColumnWidth, columnWidth, tasks, sites }: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `${routeId}-tasks-table`,
    data: {
      routeId: routeId,
    },
  });

  const style = {
    outline: isOver ? "3px solid #ff0000" : undefined,
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
            <TableCell width={smallColumnWidth}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell width={smallColumnWidth}>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
            <TableCell width={columnWidth}>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.tasksAmount")}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedTasks).map((key) => {
            const tasks = groupedTasks[key];
            const { customerSiteId, type, groupNumber } = tasks[0];
            const foundSite = sites.find((site) => site.id === customerSiteId);
            if (!foundSite) return null;
            const taskRow: TDraggableTaskTableRow = {
              taskGroupKey: key,
              customerSite: foundSite,
              groupNumber: groupNumber,
              tasks: tasks,
              type: type,
            };

            return <DraggableTaskTableRow key={customerSiteId} taskRow={taskRow} taskCount={tasks.length} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTasksTable;
