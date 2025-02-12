import { Box, Stack, styled } from "@mui/material";
import { useTranslation } from "react-i18next";

// Styled work day header cell
const HeaderCell = styled(Box, {
  label: "working-day-header-cell",
})(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: "rgba(0, 65, 79, 0.1)",
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(1),
  fontWeight: 500,
  fontSize: theme.typography.body2.fontSize,
  textOverflow: "ellipsis",
  overflow: "hidden",
  userSelect: "none",
}));

function WorkShiftsTableHeader() {
  const { t } = useTranslation();

  return (
    <Stack direction="row">
      <HeaderCell width={90}>{t("workingHours.workingDays.table.date")}</HeaderCell>
      <HeaderCell minWidth={75} flex={1}>
        {t("workingHours.workingDays.table.workStarted")}
      </HeaderCell>
      <HeaderCell minWidth={75} flex={1}>
        {t("workingHours.workingDays.table.workEnded")}
      </HeaderCell>
      <HeaderCell minWidth={75} flex={1}>
        {t("workingHours.workingDays.table.workingHours")}
      </HeaderCell>
      <HeaderCell minWidth={75} flex={1}>
        {t("workingHours.workingDays.table.unpaidBreak")}
      </HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.payableWorkingHours")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.waitingTime")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.eveningWork")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.nightWork")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.holidayBonus")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.taskSpecificBonus")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.table.freezerBonus")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.aggregationsTable.absenceTypes.officialDuties")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.aggregationsTable.absenceTypes.sickLeave")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.aggregationsTable.absenceTypes.training")}</HeaderCell>
      <HeaderCell flex={1}>{t("workingHours.workingDays.aggregationsTable.unpaid")}</HeaderCell>
      <HeaderCell minWidth={115} flex={1}>
        {t("workingHours.workingDays.table.absence")}
      </HeaderCell>
      <HeaderCell width={90}>{t("workingHours.workingDays.table.vehicle")}</HeaderCell>
      <HeaderCell width={90}>{t("workingHours.workingDays.table.dailyAllowance")}</HeaderCell>
      <HeaderCell width={90}>{t("workingHours.workingDays.table.inspected")}</HeaderCell>
      <HeaderCell minWidth={120} flex={1}>
        {t("workingHours.workingDays.table.remarks")}
      </HeaderCell>
    </Stack>
  );
}

export default WorkShiftsTableHeader;
