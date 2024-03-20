import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback, useMemo } from "react";
import TaskTableRow from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { DroppableData, GroupedTask } from "../../../types";
import { Task } from "generated/client";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  routeId: string;
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ routeId, groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const getAllTasks = useCallback(() => {
    const tasks: Task[] = [];
    for (const key of Object.keys(groupedTasks)) {
      tasks.push(...groupedTasks[key].tasks);
    }
    return tasks;
  }, [groupedTasks]);

  const droppableData: DroppableData = useMemo(
    () => ({
      routeId: routeId,
      allTasks: getAllTasks(),
    }),
    [routeId, getAllTasks],
  );

  const { setNodeRef, isOver } = useDroppable({
    id: "route-header",
    data: droppableData,
  });

  const tableStyle = useMemo(
    () => ({
      borderBottom: isOver ? "2px solid #4E8A9C" : "none",
    }),
    [isOver],
  );

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => (
      <TaskTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} allTasks={getAllTasks()} />
    ),
    [groupedTasks, getAllTasks],
  );

  const baseCellWidth = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <TableContainer
      ref={setNodeRef}
      sx={{ marginLeft: `${baseCellWidth}px`, maxWidth: `calc(100% - ${baseCellWidth}px)` }}
    >
      <SortableContext items={Object.keys(groupedTasks)}>
        <Table>
          <TableHead sx={{ ...tableStyle }}>
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
