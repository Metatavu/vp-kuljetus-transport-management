import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback } from "react";
import TaskTableRow from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { GroupedTask } from "src/types";

type Props = {
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => <TaskTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} />,
    [groupedTasks],
  );

  const baseCellWidth = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <TableContainer sx={{ marginLeft: `${baseCellWidth}px` }}>
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
    </TableContainer>
  );
};

export default RoutesTasksTable;
