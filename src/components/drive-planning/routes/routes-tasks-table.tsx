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

  const leftOffset = dataGridApiRef.current.getColumnPosition("departureTime");

  return (
    <TableContainer sx={{ width: `calc(100% - ${leftOffset}px)`, marginLeft: `${leftOffset - 1}px` }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>
              {t("drivePlanning.routes.tasksTable.groupNumber")}
            </TableCell>
            <TableCell sx={{ minWidth: 200, maxWidth: 200 }}>
              {t("drivePlanning.routes.tasksTable.customerSite")}
            </TableCell>
            <TableCell sx={{ width: "100%" }}>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
            <TableCell sx={{ minWidth: 120, maxWidth: 120 }}>
              {t("drivePlanning.routes.tasksTable.tasksAmount")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{Object.keys(groupedTasks).map(renderTaskRow)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTasksTable;
