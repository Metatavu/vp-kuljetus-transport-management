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
  Employee,
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

  const getChangedValues = (entry: WorkShiftChange) => {
    if (entry.reason === WorkShiftChangeReason.WorkshiftCreated) {
      return "-";
    }
    if (entry.reason === WorkShiftChangeReason.WorkshiftUpdatedApproved) {
      return `${
        entry.oldValue === "false"
          ? t("workingHours.workingDays.changeLog.approvedStatus.notApproved")
          : t("workingHours.workingDays.changeLog.approvedStatus.approved")
      } -> ${
        entry.newValue === "false"
          ? t("workingHours.workingDays.changeLog.approvedStatus.notApproved")
          : t("workingHours.workingDays.changeLog.approvedStatus.approved")
      }`;
    }
    if (entry.reason === WorkShiftChangeReason.WorkeventUpdatedType) {
      return `${LocalizationUtils.getLocalizedWorkEventType(
        (entry.oldValue as WorkEventType) ?? "-",
        t,
      )} -> ${LocalizationUtils.getLocalizedWorkEventType((entry.newValue as WorkEventType) ?? "-", t)}`;
    }
    return `${entry.oldValue ?? 0} -> ${entry.newValue ?? 0}`;
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
        workEvents?.find((workEvent) => workEvent.id === entry.workEventId)?.time ?? DateTime.now().toJSDate(),
      ).toFormat("HH:mm")})`;
    }
    return entry.reason ? LocalizationUtils.getWorkShiftChangeReason(entry.reason, t) : "-";
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
        <Typography>{`${workShiftDate ? DateTime.fromJSDate(workShiftDate).toFormat("EEE dd.MM") : "-"} | ${
          changeSets[0].createdAt && DateTime.fromJSDate(changeSets[0].createdAt).toFormat("dd.MM.yyyy HH:mm")
        }`}</Typography>
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
