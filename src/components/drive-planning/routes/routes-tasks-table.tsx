import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { t } from "i18next";
import TaskTableRow from "./task-table-row";
import { useGridApiContext } from "@mui/x-data-grid";
import { GroupedTask } from "src/types";

type Props = {
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const renderTaskRow = (groupedTasksKey: string) => (
    <TaskTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} />
  );

  const leftOffset = dataGridApiRef.current.getColumnPosition("departureTime");

  return (
    <Box display="flex" alignItems="stretch">
      <Box width={leftOffset - 1} bgcolor="rgba(0, 0, 0, .025)" borderBottom="1px solid rgba(0, 0, 0, 0.12)" />
      <TableContainer sx={{ width: `calc(100% - ${leftOffset}px)` }}>
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
              <TableCell sx={{ minWidth: 60, maxWidth: 60 }} />
            </TableRow>
          </TableHead>
          <TableBody>{Object.keys(groupedTasks).map(renderTaskRow)}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RoutesTasksTable;
