import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { t } from "i18next";
import { useCallback, useMemo } from "react";
import { useGridApiContext } from "@mui/x-data-grid";
import { SortableContext } from "@dnd-kit/sortable";
import { GroupedTask } from "../../../types";
import DraggableRoutesTasksTableRow from "./draggable-routes-tasks-table-row";

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

  const baseCellWidth = useMemo(() => dataGridApiRef.current.getColumnPosition("tasks"), [dataGridApiRef]);
  const hasRows = useMemo(() => Object.keys(groupedTasks).length > 0, [groupedTasks]);
  const cellWidth = useMemo(() => {
    if (hasRows) return baseCellWidth + 15;
    return baseCellWidth;
  }, [baseCellWidth, hasRows]);

  return (
    <TableContainer sx={{ marginLeft: `${baseCellWidth}px`, maxWidth: `calc(100% - ${baseCellWidth}px)` }}>
      <SortableContext items={Object.keys(groupedTasks)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={cellWidth} colSpan={hasRows ? 2 : 1}>
                {t("drivePlanning.routes.tasksTable.task")}
              </TableCell>
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
