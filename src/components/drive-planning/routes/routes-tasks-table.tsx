import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback } from "react";
import TaskTableRow from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { GroupedTask } from "src/types";

type Props = {
  routeId: string;
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ routeId, groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();
  const { isOver, setNodeRef } = useDroppable({
    id: `routes-tasks-table-droppable-${routeId}`,
    data: { routeId: routeId },
  });

  const tableContainerStyle = {
    outline: isOver ? "2px solid #4E8A9C" : "none",
    outlineOffset: "-3px",
  };

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => <TaskTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} />,
    [groupedTasks],
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
