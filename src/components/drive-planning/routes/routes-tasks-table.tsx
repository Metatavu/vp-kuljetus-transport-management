import { SortableContext } from "@dnd-kit/sortable";
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid";
import { t } from "i18next";
import { useCallback } from "react";
import { theme } from "src/theme";
import { GroupedTask } from "../../../types";
import DraggableRoutesTasksTableRow from "./draggable-routes-tasks-table-row";

const EmptyCell = styled(TableCell, {
  label: "styled-empty-cell",
})(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minWidth: 45,
  maxWidth: 45,
  borderLeft: `1px solid ${theme.palette.background.default}`,
}));

const FlexTableContainer = styled(TableContainer, {
  label: "styled-flex-table-container",
})(() => ({
  display: "flex",
  flex: 1,
}));

type Props = {
  routeId: string;
  groupedTasks: Record<string, GroupedTask>;
};

const RoutesTasksTable = ({ routeId, groupedTasks }: Props) => {
  const dataGridApiRef = useGridApiContext();

  const renderTaskRow = useCallback(
    (groupedTasksKey: string) => (
      <DraggableRoutesTasksTableRow key={groupedTasksKey} {...groupedTasks[groupedTasksKey]} routeId={routeId} />
    ),
    [groupedTasks, routeId],
  );

  const leftOffset = dataGridApiRef.current.getColumnPosition("tasks");

  return (
    <Stack direction="row">
      <Box
        width={leftOffset - 56}
        bgcolor={theme.palette.background.default}
        borderBottom="1px solid rgba(0, 0, 0, 0.12)"
      />
      <FlexTableContainer>
        <SortableContext items={Object.keys(groupedTasks).map((key) => `${key}-${routeId}`)}>
          <Table>
            <TableHead>
              <TableRow>
                <EmptyCell />
                <TableCell sx={{ minWidth: 100, maxWidth: 100 }}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
                <TableCell sx={{ minWidth: 200, maxWidth: 200 }}>
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
        </SortableContext>
      </FlexTableContainer>
    </Stack>
  );
};

export default RoutesTasksTable;
