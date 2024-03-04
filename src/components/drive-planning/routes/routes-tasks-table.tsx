import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Site, Task } from "generated/client";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import TaskTableRow, { TaskRow } from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  routeId: string;
  tasks: Task[];
  sites: Site[];
};

const RoutesTasksTable = ({ routeId, tasks, sites }: Props) => {
  const dataGridApiRef = useGridApiContext();
  const { isOver, setNodeRef } = useDroppable({
    id: `routes-tasks-table-droppable-${routeId}`,
    data: { routeId: routeId },
  });
  const [groupedTasks, setGroupedTasks] = useState<Record<string, Task[]>>({});

  const tableContainerStyle = {
    outline: isOver ? "2px solid #4E8A9C" : "none",
    outlineOffset: "-3px",
  };

  useEffect(() => {
    if (!tasks.length) return;
    const groupedTasks = tasks.reduce(
      (groupedTasks, task) => {
        const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
        if (!groupedTasks[key]) {
          groupedTasks[key] = [];
        }
        groupedTasks[key].push(task);
        return groupedTasks;
      },
      {} as Record<string, Task[]>,
    );
    setGroupedTasks(groupedTasks);
  }, [tasks]);

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => {
      const tasks = groupedTasks[groupedTasksKey];
      const { customerSiteId, type, groupNumber } = tasks[0];
      const foundSite = sites.find((site) => site.id === customerSiteId);
      if (!foundSite) return null;
      const taskRow: TaskRow = {
        taskGroupKey: groupedTasksKey,
        customerSite: foundSite,
        groupNumber: groupNumber,
        tasks: tasks,
        type: type,
      };

      return <TaskTableRow key={groupedTasksKey} taskRow={taskRow} taskCount={tasks.length} />;
    },
    [groupedTasks, sites],
  );

  const baseCellWidth = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <TableContainer
      ref={setNodeRef}
      sx={{ marginLeft: `${baseCellWidth}px`, ...tableContainerStyle, maxWidth: `calc(100% - ${baseCellWidth}px)` }}
    >
      <SortableContext items={Object.keys(groupedTasks)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={baseCellWidth}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
              <TableCell width={baseCellWidth}>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
              <TableCell width={baseCellWidth * 5}>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
              <TableCell width={baseCellWidth * 5}>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
              <TableCell>{t("drivePlanning.routes.tasksTable.tasksAmount")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{Object.keys(groupedTasks).map(renderTaskRow)}</TableBody>
        </Table>
      </SortableContext>
    </TableContainer>
  );
};

export default RoutesTasksTable;
