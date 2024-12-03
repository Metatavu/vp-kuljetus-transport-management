import { Stack, Table, TableBody, TableCell, TableRow, Typography, styled } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AbsenceType, Employee, PerDiemAllowanceType, WorkShiftHours, WorkType } from "generated/client";
import { useTranslation } from "react-i18next";
import { EmployeeWorkHoursFormRow } from "src/types";

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

function AggregationsTable({ workShiftsData, employee }: Props) {
  const { t } = useTranslation();

  const getSumOfWorktHours = (workType: WorkType) => {
    return workShiftsData
      .reduce((acc, row) => {
        const workShiftHours = row.workShiftHours[workType] as WorkShiftHours;
        return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
      }, 0)
      .toFixed(2);
  };

  const getPerDiemAllowanceCount = (perDiemAllowance: PerDiemAllowanceType) => {
    return workShiftsData.filter((row) => row.workShift?.perDiemAllowance === perDiemAllowance).length.toString();
  };

  const getFillingHours = () => {
    if (!employee?.regularWorkingHours) return 0;
    const regularWorkingHours = employee?.regularWorkingHours;
    const paidWorkHours = parseFloat(getSumOfWorktHours(WorkType.PaidWork));
    if (paidWorkHours < regularWorkingHours) {
      return (regularWorkingHours - paidWorkHours).toFixed(2);
    }
    return 0;
  };

  const getOverTimeHours = () => {
    if (!employee?.regularWorkingHours) return { overTimeHalf: 0, overTimeFull: 0 };
    const regularWorkingHours = employee?.regularWorkingHours;
    const paidWorkHours = parseFloat(getSumOfWorktHours(WorkType.PaidWork));
    if (paidWorkHours <= regularWorkingHours) {
      return { overTimeHalf: 0, overTimeFull: 0 };
    }
    //Check if paid work hours are between regular working hours and regular working hours + 12
    if (paidWorkHours > regularWorkingHours && paidWorkHours <= regularWorkingHours + 12) {
      return { overTimeHalf: (paidWorkHours - regularWorkingHours).toFixed(2), overTimeFull: 0 };
    }
    //Check if paid work hours are over regular working hours + 12
    if (paidWorkHours > regularWorkingHours + 12) {
      return { overTimeHalf: 12, overTimeFull: (paidWorkHours - 12 - regularWorkingHours).toFixed(2) };
    }

    return { overTimeHalf: 0, overTimeFull: 0 };
  };

  const getAbsenceHours = (absence: AbsenceType) => {
    return workShiftsData
      .filter((row) => row.workShift?.absence === absence)
      .reduce((acc, row) => {
        const workShiftHours = row.workShiftHours[WorkType.PaidWork] as WorkShiftHours;
        return acc + (workShiftHours?.actualHours ?? workShiftHours?.calculatedHours ?? 0);
      }, 0)
      .toFixed(2);
  };

  const renderTimeInput = (title: string) => {
    return (
      <TimePicker
        disableOpenPicker
        slotProps={{
          textField: {
            "aria-label": title,
            variant: "outlined",
            className: "cell-input",
            size: "small",
            title: title,
            fullWidth: false,
          },
        }}
      />
    );
  };

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.PaidWork)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.eveningWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.EveningAllowance)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.vacation")}</TableCell>
          <TableCell>
            <Typography variant="h6">{`${getAbsenceHours(AbsenceType.Vacation)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.pekkanens")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getAbsenceHours(AbsenceType.CompensatoryLeave)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.partialDailyAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getPerDiemAllowanceCount(PerDiemAllowanceType.Partial)} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.workTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${employee?.regularWorkingHours ?? ""} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.nightWork")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.NightAllowance)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.unpaid")}</TableCell>
          <EmptyCell>
            <Stack direction="row" gap={1} alignItems="center" p={0.25}>
              {renderTimeInput(t("workingHours.workingDays.aggregationsTable.unpaid"))}
              <Typography variant="h6">h</Typography>
            </Stack>
          </EmptyCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.sickHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getAbsenceHours(AbsenceType.SickLeave)} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fullDayAllowance")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getPerDiemAllowanceCount(PerDiemAllowanceType.Full)} pv`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeHalf")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getOverTimeHours().overTimeHalf} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.holiday")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.HolidayAllowance)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.responsibilities")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getAbsenceHours(AbsenceType.OfficialDuties)} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeFull")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getOverTimeHours().overTimeFull} h`}</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.dayOffBonus")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.HolidayAllowance)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getAbsenceHours(AbsenceType.Training)} h`}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.waitingTime")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getSumOfWorktHours(WorkType.Standby)} h`}</Typography>
          </TableCell>
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <EmptyCell />
          <TableCell>{t("workingHours.workingDays.aggregationsTable.absenceHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">0.00 h</Typography>
          </TableCell>
          <TableCell>{t("workingHours.workingDays.aggregationsTable.fillingHours")}</TableCell>
          <TableCell align="right">
            <Typography variant="h6">{`${getFillingHours()} h`}</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default AggregationsTable;
