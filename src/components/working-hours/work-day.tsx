import { Button, Checkbox, Link, MenuItem, Stack, styled, TextField, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

// Styled work day row
const WorkingDayRow = styled(Stack, {
  label: "working-day-row",
})(({ theme }) => ({
  flexDirection: "row",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Styled work day cell
const Cell = styled(Stack, {
  label: "working-day-cell",
})(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: "rgba(0, 65, 79, 0.1)",
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
  flexDirection: "row",
  display: "flex",
  padding: theme.spacing(0, 0.5),
  flexWrap: "wrap",
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(1800)]: {
    padding: theme.spacing(0.25, 0.75),
  },
}));

function WorkDay() {
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
            fullWidth: true,
          },
        }}
      />
    );
  }

  const renderSelectInput = (title: string, options: string[]) => {
    return (
      <TextField
        select
        className="cell-input"
        size="small"
        aria-label={title}
        title={title}
        fullWidth
        variant="outlined"
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <WorkingDayRow>
      <Cell width={90}>
        <Link variant="body2">{"Su 28.4."}</Link>
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.shiftStarts")
        )}
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.payableWorkingHours")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.waitingTime")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.eveningWork")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.nightWork")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.holidayBonus")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.taskSpecificBonus")
        )}
      </Cell>
      <Cell flex={1}>
        {renderTimeInput(
          t("workingHours.workingDays.table.freezerBonus")
        )}
      </Cell>
      <Cell minWidth={125} flex={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Checkbox
            size="small"
            className="cell-checkbox"
            title={t("workingHours.workingHourBalances.dayOffBonus")}
            aria-label={t("workingHours.workingHourBalances.dayOffBonus")}
          />
          {renderSelectInput(t("workingHours.workingDays.table.absence"), [])}
        </Stack>
      </Cell>
      {/* <Cell width={100}>
        {renderSelectInput(t("workingHours.workingDays.table.vehicle"), [])}
      </Cell> */}
      <Cell flex={1}>
        {renderSelectInput(t("workingHours.workingDays.table.dailyAllowance"), [])}
      </Cell>
      <Cell width={90}>
        <Checkbox size="small" title="Tarkastettu" aria-label="checked" />
      </Cell>
      <Cell minWidth={275} flex={1}>
        <TextField
          className="cell-input"
          size="small"
          aria-label={t("workingHours.workingDays.table.remarks")}
          fullWidth
          variant="outlined"
        />
      </Cell>
      <Cell width={75}>
        <Button
          variant="text"
          color="primary"
        >
          {t("open")}
        </Button>
      </Cell>
    </WorkingDayRow>
  );
};

export default WorkDay;