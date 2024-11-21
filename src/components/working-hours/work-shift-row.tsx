import { Button, Checkbox, Link, MenuItem, Stack, TextField, Typography, styled } from "@mui/material";
import { AbsenceType, PerDiemAllowanceType, Truck, WorkShiftHours, WorkType } from "generated/client";
import { DateTime } from "luxon";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EmployeeWorkHoursForm, EmployeeWorkHoursFormRow } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  onClick: () => void;
  workShiftData: EmployeeWorkHoursFormRow;
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
  const { register } = useFormContext<EmployeeWorkHoursForm>();

  const getTruckById = (truckId: string) => {
    return truckId ? trucks.find((truck) => truck.id === truckId)?.name : undefined;
  };

  const renderWorkHourInput = (title: string, workShiftHours: WorkShiftHours) => (
    <TextField
      className="cell-input"
      size="small"
      aria-label={title}
      title={title}
      fullWidth
      variant="outlined"
      defaultValue={workShiftHours?.actualHours}
      placeholder={workShiftHours?.calculatedHours?.toString()}
      InputProps={register(`${index}.workShiftHours.${workShiftHours.workType}.actualHours`)}
    />
  );

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
        defaultValue={workShiftData.workShift.perDiemAllowance}
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
        defaultValue={workShiftData.workShift.absence}
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
          {workShiftData.workShift.date && DateTime.fromJSDate(workShiftData.workShift.date).toFormat("dd.MM")}
        </Link>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShiftData.workShift.startedAt
            ? DateTime.fromJSDate(workShiftData.workShift.startedAt).toFormat("HH:mm")
            : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShiftData.workShift.endedAt
            ? DateTime.fromJSDate(workShiftData.workShift.endedAt).toFormat("HH:mm")
            : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.payableWorkingHours"),
          workShiftData.workShiftHours[WorkType.PaidWork],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.waitingTime"),
          workShiftData.workShiftHours[WorkType.Standby],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.eveningWork"),
          workShiftData.workShiftHours[WorkType.EveningAllowance],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.nightWork"),
          workShiftData.workShiftHours[WorkType.NightAllowance],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.holidayBonus"),
          workShiftData.workShiftHours[WorkType.HolidayAllowance],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.taskSpecificBonus"),
          workShiftData.workShiftHours[WorkType.JobSpecificAllowance],
        )}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(
          t("workingHours.workingDays.table.freezerBonus"),
          workShiftData.workShiftHours[WorkType.FrozenAllowance],
        )}
      </Cell>
      <Cell minWidth={115} flex={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Checkbox
            size="small"
            className="cell-checkbox"
            title={t("workingHours.workingHourBalances.dayOffBonus")}
            aria-label={t("workingHours.workingHourBalances.dayOffBonus")}
            defaultChecked={workShiftData.workShift.dayOffWorkAllowance}
            {...register(`${index}.workShift.dayOffWorkAllowance`)}
          />
          {renderAbsenceTypeSelectInput()}
        </Stack>
      </Cell>
      <Cell width={90}>
        <Typography variant="body2">
          {workShiftData.workShift.truckIds?.map((truckId) => getTruckById(truckId)).join(", ")}
        </Typography>
      </Cell>
      <Cell width={90}>{renderPerDiemAllowanceSelectInput()}</Cell>
      <Cell width={90}>
        <Checkbox
          size="small"
          className="cell-checkbox"
          title={t("workingHours.workingHourBalances.approved")}
          aria-label={t("workingHours.workingHourBalances.approved")}
          defaultChecked={workShiftData.workShift.approved}
          {...register(`${index}.workShift.approved`)}
        />
      </Cell>
      <Cell minWidth={275} flex={1}>
        <TextField
          className="cell-input align-left"
          size="small"
          aria-label={t("workingHours.workingDays.table.remarks")}
          fullWidth
          variant="outlined"
          defaultValue={workShiftData.workShift.notes}
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
