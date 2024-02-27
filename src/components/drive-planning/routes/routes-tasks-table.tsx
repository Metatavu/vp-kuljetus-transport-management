import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Site, Task } from "generated/client";
import { t } from "i18next";
import LocalizationUtils from "utils/localization-utils";

type Props = {
  tasks: Task[];
  sites: Site[];
};

const RoutesTasksTable = ({ tasks, sites }: Props) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("drivePlanning.routes.tasksTable.task")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.groupNumber")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.customerSite")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.address")}</TableCell>
            <TableCell>{t("drivePlanning.routes.tasksTable.tasksAmount")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => {
            const foundSite = sites.find((site) => site.id === task.customerSiteId);
            return (
              <TableRow key={task.id}>
                <TableCell>{LocalizationUtils.getLocalizedTaskType(task.type, t)}</TableCell>
                <TableCell>{task.groupNumber}</TableCell>
                <TableCell>{foundSite?.name}</TableCell>
                <TableCell>
                  {foundSite?.address}, {foundSite?.postalCode} {foundSite?.locality}
                </TableCell>
                <TableCell>0</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoutesTasksTable;
