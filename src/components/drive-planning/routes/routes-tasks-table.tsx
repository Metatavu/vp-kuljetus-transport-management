import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { GroupedTask } from "../../../types";
import DraggableTasksTableRow from "./draggable-tasks-table-row";

type Props = {
  routeId: string;
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => <DraggableTasksTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} />,
    [groupedTasks],
  );

  const baseCellWidth = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <TableContainer sx={{ marginLeft: `${baseCellWidth}px`, maxWidth: `calc(100% - ${baseCellWidth}px)` }}>
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
