import { Button, Checkbox, Link, MenuItem, Stack, TextField, Typography, styled } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AbsenceType, EmployeeWorkShift, PerDiemAllowanceType, Truck } from "generated/client";
import { DateTime } from "luxon";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EmployeeWorkHoursForm } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  onClick: () => void;
  workShiftData: EmployeeWorkShift;
  trucks: Truck[];
  index: number;
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

function WorkShiftRow({ onClick, workShiftData, trucks, index }: Props) {
  const { t } = useTranslation();
  const { register, control } = useFormContext<EmployeeWorkHoursForm>();

  const getTruckById = (truckId: string) => {
    return truckId ? trucks.find((truck) => truck.id === truckId)?.name : undefined;
  };

  const renderTimeInput = (title: string, value?: Date) => {
    return (
      <TimePicker
        value={value ? DateTime.fromJSDate(value) : undefined}
        disableOpenPicker
        // onChange={(value: DateTime | null) =>
        //   value ? setValue(`${index}.date`, value.toJSDate()) : resetField(`${index}.date`)
        // }
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
  };

  const renderPerDiemAllowanceSelectInput = () => {
    const label = t("workingHours.workingDays.table.dailyAllowance");
    return (
      <TextField
        select
        className="cell-input"
        size="small"
        aria-label={label}
        title={label}
        fullWidth
        variant="outlined"
        defaultValue={workShiftData.perDiemAllowance}
        InputProps={register(`${index}.workShift.perDiemAllowance`)}
      >
        <MenuItem style={{ minHeight: 30 }} key="EMPTY" value="">
          {""}
        </MenuItem>
        {Object.values(PerDiemAllowanceType).map((option) => (
          <MenuItem style={{ minHeight: 30 }} key={option} value={option}>
            {LocalizationUtils.getPerDiemAllowanceType(option, t)}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const renderAbsenceTypeSelectInput = () => {
    const label = t("workingHours.workingDays.table.absence");
    return (
      <TextField
        select
        className="cell-input"
        size="small"
        aria-label={label}
        title={label}
        fullWidth
        defaultValue={workShiftData.absence}
        variant="outlined"
        InputProps={register(`${index}.workShift.absence`)}
      >
        <MenuItem style={{ minHeight: 30 }} key="EMPTY" value="">
          {""}
        </MenuItem>
        {Object.values(AbsenceType).map((option) => (
          <MenuItem style={{ minHeight: 30 }} key={option} value={option}>
            {LocalizationUtils.getLocalizedAbsenceType(option, t)}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  return (
    <Row>
      <Cell width={90}>
        <Link variant="body2" title={t("workingHours.workingHourBalances.toWorkHourDetails")} onClick={onClick}>
          {workShiftData.date && DateTime.fromJSDate(workShiftData.date).toFormat("dd.MM")}
        </Link>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShiftData.startedAt ? DateTime.fromJSDate(workShiftData.startedAt).toFormat("HH:mm") : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShiftData.endedAt ? DateTime.fromJSDate(workShiftData.endedAt).toFormat("HH:mm") : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.payableWorkingHours"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.waitingTime"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.eveningWork"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.nightWork"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.holidayBonus"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.taskSpecificBonus"))}</Cell>
      <Cell flex={1}>{renderTimeInput(t("workingHours.workingDays.table.freezerBonus"))}</Cell>
      <Cell minWidth={115} flex={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Controller
            name={`${index}.workShift.dayOffWorkAllowance`}
            control={control}
            defaultValue={workShiftData.dayOffWorkAllowance || false}
            render={({ field: { value, onChange, ...rest } }) => (
              <Checkbox
                onChange={(event) => onChange(event.target.checked)}
                size="small"
                className="cell-checkbox"
                title={t("workingHours.workingHourBalances.dayOffBonus")}
                aria-label={t("workingHours.workingHourBalances.dayOffBonus")}
                checked={value}
                {...rest}
              />
            )}
          />
          {renderAbsenceTypeSelectInput()}
        </Stack>
      </Cell>
      <Cell width={90}>
        <Typography variant="body2">
          {workShiftData.truckIds?.map((truckId) => getTruckById(truckId)).join(", ")}
        </Typography>
      </Cell>
      <Cell width={90}>{renderPerDiemAllowanceSelectInput()}</Cell>
      <Cell width={90}>
        <Controller
          name={`${index}.workShift.approved`}
          control={control}
          render={({ field: { value = false, onChange, ref, ...rest } }) => (
            <Checkbox
              onChange={onChange}
              size="small"
              className="cell-checkbox"
              title={t("workingHours.workingHourBalances.approved")}
              aria-label={t("workingHours.workingHourBalances.approved")}
              checked={value}
              inputRef={ref}
              {...rest}
            />
          )}
        />
      </Cell>
      <Cell minWidth={275} flex={1}>
        <TextField
          className="cell-input align-left"
          size="small"
          aria-label={t("workingHours.workingDays.table.remarks")}
          fullWidth
          variant="outlined"
          value={workShiftData.notes}
          InputProps={register(`${index}.workShift.notes`)}
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
}

export default WorkShiftRow;
