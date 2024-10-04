import { Button, Checkbox, Link, MenuItem, Stack, styled, TextField, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

// Styled work shift row
const Row = styled(Stack, {
  label: "work-shift-row",
})(({ theme }) => ({
  flexDirection: "row",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Styled work shift cell
const Cell = styled(Stack, {
  label: "work-shift-cell",
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

function WorkShiftRow({ onClick }: Props) {
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
    <Row>
      <Cell width={90}>
        <Link
          variant="body2"
          title={t("workingHours.workingHourBalances.toWorkHourDetails")}
          onClick={onClick}
        >
          {"Su 28.4."}
        </Link>
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
      <Cell minWidth={115} flex={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Checkbox
            size="small"
            className="cell-checkbox"
            title={t("workingHours.workingHourBalances.dayOffBonus")}
            aria-label={t("workingHours.workingHourBalances.dayOffBonus")}
          />
          {renderSelectInput(t("workingHours.workingDays.table.absence"), ["SL", "PK"])}
        </Stack>
      </Cell>
      <Cell width={90}>
        {renderSelectInput(t("workingHours.workingDays.table.vehicle"), ["21", "222"])}
      </Cell>
      <Cell width={90}>
        {renderSelectInput(t("workingHours.workingDays.table.dailyAllowance"), ["Osa", "Koko"])}
      </Cell>
      <Cell width={90}>
        <Checkbox size="small" title="Tarkastettu" aria-label="checked" />
      </Cell>
      <Cell minWidth={275} flex={1}>
        <TextField
          className="cell-input align-left"
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
          title={t("workingHours.workingHourBalances.toWorkHourDetails")}
          onClick={onClick}
        >
          {t("open")}
        </Button>
      </Cell>
    </Row>
  );
};

export default WorkShiftRow;