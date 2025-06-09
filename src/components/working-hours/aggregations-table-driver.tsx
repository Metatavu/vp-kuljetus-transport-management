import { Table, TableBody, TableCell, TableRow, Typography, styled } from "@mui/material";
import { Employee, SalaryPeriodTotalWorkHours } from "generated/client";
import { useTranslation } from "react-i18next";
import WorkShiftsUtils from "src/utils/workshift-utils";

// Styled empty cell component
const EmptyCell = styled(TableCell, {
  label: "empty-cell",
})(({ theme }) => ({
  background: theme.palette.background.default,
  border: 0,
}));

type Props = {
  employee: Employee | undefined;
  employeeAggregatedHours?: SalaryPeriodTotalWorkHours | undefined;
};

function AggregationsTableForDriver({ employee, employeeAggregatedHours }: Props) {
  if (!employee) return null;
  const { t } = useTranslation();

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.workingHours.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.eveningWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.eveningWork.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.vacation")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.vacation.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.pekkanens")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.compensatoryLeave.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.partialDailyAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.partialDailyAllowance} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getRegularWorkingHoursOnWorkPeriod(
              employee,
              employeeAggregatedHours?.unpaid ?? 0,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.nightWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.nightWork.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.unpaid")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.unpaid.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.sickHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.sickHours.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fullDayAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.fullDailyAllowance} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeHalf")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.overTimeHalf.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.holiday")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.holiday.toFixed(2)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.responsibilities")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.responsibilities.toFixed(2)} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeFull")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.overTimeFull.toFixed(2)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.dayOffBonus")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.dayOffBonus.toFixed(2)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.trainingDuringWorkTime.toFixed(2)} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.waitingTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.waitingTime.toFixed(2)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fillingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employeeAggregatedHours?.waitingTime.toFixed(2)} h`}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default AggregationsTableForDriver;
