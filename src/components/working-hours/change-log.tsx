import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  AbsenceType,
  Employee,
  PerDiemAllowanceType,
  WorkEvent,
  WorkEventType,
  WorkShiftChange,
  WorkShiftChangeReason,
  WorkShiftChangeSet,
  WorkShiftHours,
  WorkType,
} from "generated/client";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  changeSets: WorkShiftChangeSet[];
  workShiftDate: Date | undefined;
  employees?: Employee[];
  workShiftHours?: Record<WorkType, WorkShiftHours>;
  workEvents?: WorkEvent[];
};

function ChangeLog({ changeSets, workShiftDate, employees, workShiftHours, workEvents }: Props) {
  const { t } = useTranslation();

  if (!changeSets) {
    return null;
  }

  // Sort changeSets by createdAt in descending order
  changeSets.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) {
      return 0;
    }
    const dateA = DateTime.fromJSDate(a.createdAt);
    const dateB = DateTime.fromJSDate(b.createdAt);
    return dateB.toMillis() - dateA.toMillis();
  });

  const getEmployeeFullName = (creatorId: string | undefined) => {
    if (!employees) {
      return creatorId;
    }
    const employee = employees.find((employee) => employee.id === creatorId);
    if (!employee) {
      return creatorId;
    }

    return `${employee.firstName} ${employee.lastName}`;
  };

  const formatChange = (oldValue: string | undefined, newValue: string | undefined) => {
    return `${oldValue ?? "-"} → ${newValue ?? "-"}`;
  };

  const getChangedValues = (entry: WorkShiftChange) => {
    switch (entry.reason) {
      case WorkShiftChangeReason.WorkshiftCreated:
        return "-";

      case WorkShiftChangeReason.WorkshiftUpdatedDayoffworkallowance:
        return formatChange(
          entry.oldValue === "false"
            ? t("workingHours.workingDays.changeLog.allowanceStatus.noDayOffWorkAllowance")
            : t("workingHours.workingDays.changeLog.allowanceStatus.dayOffWorkAllowance"),
          entry.newValue === "false"
            ? t("workingHours.workingDays.changeLog.allowanceStatus.noDayOffWorkAllowance")
            : t("workingHours.workingDays.changeLog.allowanceStatus.dayOffWorkAllowance"),
        );

      case WorkShiftChangeReason.WorkshiftUpdatedNotes:
        return formatChange(entry.oldValue === "null" ? "-" : entry.oldValue, entry.newValue ?? "-");

      case WorkShiftChangeReason.WorkshiftUpdatedApproved:
        return formatChange(
          entry.oldValue === "false"
            ? t("workingHours.workingDays.changeLog.approvedStatus.notApproved")
            : t("workingHours.workingDays.changeLog.approvedStatus.approved"),
          entry.newValue === "false"
            ? t("workingHours.workingDays.changeLog.approvedStatus.notApproved")
            : t("workingHours.workingDays.changeLog.approvedStatus.approved"),
        );

      case WorkShiftChangeReason.WorkshiftUpdatedAbsence:
        return formatChange(
          LocalizationUtils.getLocalizedAbsenceType(entry.oldValue as AbsenceType, t) ?? "-",
          LocalizationUtils.getLocalizedAbsenceType(entry.newValue as AbsenceType, t) ?? "-",
        );

      case WorkShiftChangeReason.WorkshiftUpdatedPerdiemallowance:
        return formatChange(
          LocalizationUtils.getPerDiemAllowanceType(entry.oldValue as PerDiemAllowanceType, t) ?? "-",
          LocalizationUtils.getPerDiemAllowanceType(entry.newValue as PerDiemAllowanceType, t) ?? "-",
        );

      case WorkShiftChangeReason.WorkeventUpdatedType:
        return formatChange(
          LocalizationUtils.getLocalizedWorkEventType(entry.oldValue as WorkEventType, t) ?? "-",
          LocalizationUtils.getLocalizedWorkEventType(entry.newValue as WorkEventType, t) ?? "-",
        );

      default:
        return formatChange(entry.oldValue, entry.newValue);
    }
  };

  const getChangeReason = (entry: WorkShiftChange) => {
    if (entry.reason === WorkShiftChangeReason.WorkshifthoursUpdatedActualhours && entry.workShiftHourId) {
      const workShiftHour = workShiftHours
        ? Object.values(workShiftHours).find((workShiftHour) => workShiftHour.id === entry.workShiftHourId)
        : undefined;
      return `${LocalizationUtils.getWorkShiftChangeReason(entry.reason, t)} (${
        workShiftHour ? LocalizationUtils.getLocalizedWorkType(workShiftHour.workType, t) : "-"
      })`;
    }
    if (entry.reason === WorkShiftChangeReason.WorkeventUpdatedType) {
      return `${LocalizationUtils.getWorkShiftChangeReason(entry.reason, t)} (${DateTime.fromJSDate(
        // biome-ignore lint/style/noNonNullAssertion: Date always exists
        workEvents?.find((workEvent) => workEvent.id === entry.workEventId)?.time!,
      ).toFormat("HH:mm")})`;
    }
    return entry.reason ? LocalizationUtils.getWorkShiftChangeReason(entry.reason, t) : "-";
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
        <Typography>{`${workShiftDate ? DateTime.fromJSDate(workShiftDate).toFormat("EEE dd.MM") : "-"}`}</Typography>
        <Typography sx={{ marginLeft: 2 }}>
          {`${t("workingHours.workingDays.changeLog.lastEdited")}: ${
            changeSets[0].createdAt && DateTime.fromJSDate(changeSets[0].createdAt).toFormat("dd.MM.yyyy HH:mm")
          }`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {changeSets.map((changeSet) => (
          <Table key={changeSet.id} size="small" sx={{ marginBottom: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell width={100}>{t("workingHours.workingDays.changeLog.time")}</TableCell>
                <TableCell width={150} align="center">
                  {t("workingHours.workingDays.changeLog.user")}
                </TableCell>
                <TableCell width={150} align="center">
                  {t("workingHours.workingDays.changeLog.reviewed")}
                </TableCell>
                <TableCell width={150}>{t("workingHours.workingDays.changeLog.affectedValues")}</TableCell>
                <TableCell width={150}>{t("workingHours.workingDays.changeLog.explanation")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {changeSet.entries?.map((entry, index) => (
                <TableRow key={changeSet.id ?? index}>
                  <TableCell>
                    {entry?.createdAt ? DateTime.fromJSDate(entry?.createdAt).toFormat("dd.MM.yyyy HH:mm") : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Typography>{getEmployeeFullName(changeSet.creatorId)}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography>
                      {entry.reason === WorkShiftChangeReason.WorkshiftUpdatedApproved
                        ? getEmployeeFullName(changeSet.creatorId)
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{getChangedValues(entry)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{getChangeReason(entry)}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default ChangeLog;
