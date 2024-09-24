import { Table, TableRow, TableCell, Typography, Stack } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";
import { theme } from "src/theme";

function AggregationsTable() {
  const { t } = useTranslation();

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
  }

  return (
    <Table>
      <TableRow>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.workingHours")}</TableCell>
        <TableCell align="right"><Typography variant="h6">60.53 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.eveningWork")}</TableCell>
        <TableCell align="right"><Typography variant="h6">4.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.vacation")}</TableCell>
        <TableCell><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.pekkanens")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.partialDailyAllowance")}</TableCell>
        <TableCell align="right"><Typography variant="h6">5 pv</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.workTime")}</TableCell>
        <TableCell align="right"><Typography variant="h6">80 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.nightWork")}</TableCell>
        <TableCell align="right"><Typography variant="h6">25.37 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.unpaid")}</TableCell>
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }}>
          <Stack direction="row" gap={1} alignItems="center" p={0.25}>
            {renderTimeInput(
              t("workingHours.workingDays.aggregationsTable.unpaid")
            )}
            <Typography variant="h6">h</Typography>
          </Stack>
        </TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.sickHours")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.fullDayAllowance")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0 pv</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeHalf")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.holiday")}</TableCell>
        <TableCell align="right"><Typography variant="h6">23.15 h</Typography></TableCell>
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell>{t("workingHours.workingDays.aggregationsTable.responsibilities")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.increasedDailyAllowance")}</TableCell>
        <TableCell align="right"><Typography variant="h6">5 pv</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.overtimeFull")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.dayOffBonus")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell>{t("workingHours.workingDays.aggregationsTable.trainingDuringWorkTime")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.abroadAllowance")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0 pv</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.waitingTime")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell sx={{ bgcolor: theme.palette.background.default, border: 0 }} />
        <TableCell>{t("workingHours.workingDays.aggregationsTable.absenceHours")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0.00 h</Typography></TableCell>
        <TableCell>{t("workingHours.workingDays.aggregationsTable.fillingHours")}</TableCell>
        <TableCell align="right"><Typography variant="h6">0 pv</Typography></TableCell>
      </TableRow>
    </Table>
  );
};

export default AggregationsTable;