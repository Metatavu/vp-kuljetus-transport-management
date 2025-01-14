import { Table, TableBody, TableCell, TableRow, Typography, styled } from "@mui/material";
import { AbsenceType, Employee, PerDiemAllowanceType, WorkType } from "generated/client";
import { useTranslation } from "react-i18next";
import { EmployeeWorkHoursFormRow } from "src/types";
import WorkShiftsUtils from "src/utils/workshift-utils";

// Styled empty cell component
const EmptyCell = styled(TableCell, {
  label: "empty-cell",
})(({ theme }) => ({
  background: theme.palette.background.default,
  border: 0,
}));

type Props = {
  workShiftsData: EmployeeWorkHoursFormRow[];
  employee: Employee | undefined;
};

function AggregationsTableForDriver({ workShiftsData, employee }: Props) {
  if (!employee) return null;
  const { t } = useTranslation();

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalWorkHoursByType(
              workShiftsData,
              WorkType.PaidWork,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.eveningWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalWorkHoursByType(
              workShiftsData,
              WorkType.EveningAllowance,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.vacation")}</TableCell>
          <TableCell>
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalHoursByAbsenseType(
              workShiftsData,
              AbsenceType.Vacation,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.pekkanens")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalHoursByAbsenseType(
              workShiftsData,
              AbsenceType.CompensatoryLeave,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.partialDailyAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getPerDiemAllowanceCount(
              workShiftsData,
              PerDiemAllowanceType.Partial,
            )} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employee?.regularWorkingHours ?? ""} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.nightWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalWorkHoursByType(
              workShiftsData,
              WorkType.NightAllowance,
            )} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.sickHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalHoursByAbsenseType(
              workShiftsData,
              AbsenceType.SickLeave,
            )} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fullDayAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getPerDiemAllowanceCount(
              workShiftsData,
              PerDiemAllowanceType.Full,
            )} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeHalf")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${
              WorkShiftsUtils.getOverTimeHoursForDriver(workShiftsData, employee).overTimeHalf
            } h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.holiday")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalWorkHoursByType(
              workShiftsData,
              WorkType.HolidayAllowance,
            )} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.responsibilities")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalHoursByAbsenseType(
              workShiftsData,
              AbsenceType.OfficialDuties,
            )} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeFull")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${
              WorkShiftsUtils.getOverTimeHoursForDriver(workShiftsData, employee).overTimeFull
            } h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.dayOffBonus")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getDayOffWorkAllowanceHours(workShiftsData)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalHoursByAbsenseType(
              workShiftsData,
              AbsenceType.Training,
            )} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.waitingTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getTotalWorkHoursByType(
              workShiftsData,
              WorkType.Standby,
            )} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fillingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${WorkShiftsUtils.getFillingHours(workShiftsData, employee)} h`}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default AggregationsTableForDriver;
