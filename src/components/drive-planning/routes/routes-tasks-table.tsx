import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback, useMemo } from "react";
import TaskTableRow from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { DroppableData, DroppableType, GroupedTask } from "../../../types";
import { Task } from "generated/client";

type Props = {
  routeId: string;
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ routeId, groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const getAllTasks = () => {
    const tasks: Task[] = [];
    for (const key of Object.keys(groupedTasks)) {
      tasks.push(...groupedTasks[key].tasks);
    }
    return tasks;
  };

  const droppableData: DroppableData = useMemo(
    () => ({
      routeId: routeId,
      allTasks: getAllTasks(),
    }),
    [routeId, getAllTasks],
  );

  const { isOver, setNodeRef } = useDroppable({
    id: `${DroppableType.ROUTES_TASKS_DROPPABLE}-${routeId}`,
    data: droppableData,
  });

  const tableContainerStyle = {
    outline: isOver ? "2px solid #4E8A9C" : "none",
    outlineOffset: "-3px",
  };

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
