import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Site } from "generated/client";
import { useTasks } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import DraggableUnallocatedTasksTableRow2 from "./draggable-unallocated-tasks-table-row-2";

type Props = {
  sites: Site[];
};
const UnallocatedTasksTable2 = ({ sites }: Props) => {
  const { t } = useTranslation();
  const tasksQuery = useTasks({ assignedToRoute: false });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "1%" }} />
            <TableCell sx={{ width: 156 }}>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell sx={{ width: 156 }}>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
            <TableCell sx={{ width: 509 }}>{t("drivePlanning.routes.unallocatedTasksTable.freightNumber")}</TableCell>
            <TableCell sx={{ width: 509 }}>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
            <TableCell sx={{ width: 509 }}>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
            <TableCell sx={{ width: 332 }}>{t("drivePlanning.routes.unallocatedTasksTable.contents")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(tasksQuery.data?.tasks ?? []).map((task) => (
            <DraggableUnallocatedTasksTableRow2 tasks={tasksQuery?.data?.tasks ?? []} sites={sites} task={task} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnallocatedTasksTable2;
