import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Site, Task } from "generated/client";
import { t } from "i18next";
import { useEffect, useState } from "react";
import TaskTableRow, { TDraggableTaskTableRow } from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";

type Props = {
  tasks: Task[];
  sites: Site[];
};

const RoutesTasksTable = ({ tasks, sites }: Props) => {
  const dataGridApiRef = useGridApiContext();

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

  const cellWidth = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <TableContainer sx={{ marginLeft: `${cellWidth}px` }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={cellWidth}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell width={cellWidth}>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
            <TableCell width={cellWidth * 5}>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
            <TableCell width={cellWidth * 5}>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
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

            return <TaskTableRow key={customerSiteId} taskRow={taskRow} taskCount={tasks.length} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTasksTable;
