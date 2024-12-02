import { Button, Checkbox, Link, MenuItem, Stack, TextField, Tooltip, Typography, alpha, styled } from "@mui/material";
import {
  AbsenceType,
  EmployeeWorkShift,
  PerDiemAllowanceType,
  Truck,
  WorkShiftHours,
  WorkType,
} from "generated/client";
import { DateTime } from "luxon";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { theme } from "src/theme";
import { EmployeeWorkHoursForm } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  onClick: () => void;
  index: number;
  trucks: Truck[];
};

// Styled work shift row
const Row = styled(Stack, {
  label: "work-shift-row",
})(({ theme }) => ({
  flexDirection: "row",
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

function WorkShiftRow({ onClick, index, trucks }: Props) {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<EmployeeWorkHoursForm>();
  const workShift = watch(`${index}.workShift`) as EmployeeWorkShift | undefined;
  const dayOffWorkAllowance = watch(`${index}.workShift.dayOffWorkAllowance`);
  const approved = watch(`${index}.workShift.approved`) as boolean | undefined;
  const workShiftHours = watch(`${index}.workShiftHours`) as Record<WorkType, WorkShiftHours> | undefined;

  const getTruckById = (truckId: string) => {
    return truckId ? trucks.find((truck) => truck.id === truckId)?.name : undefined;
  };

  const renderWorkHourInput = (title: string, workType: WorkType) => {
    const calculatedHoursTooltipText = `${t("workingHours.workingDays.table.calculatedHours")}: ${
      workShiftHours?.[workType].calculatedHours?.toString() ?? title
    } `;
    return (
      <Tooltip title={calculatedHoursTooltipText} placement="bottom">
        <TextField
          className="cell-input"
          size="small"
          aria-label={title}
          fullWidth
          disabled={workShift?.approved}
          variant="outlined"
          placeholder={workShiftHours?.[workType].calculatedHours?.toFixed(2).toString()}
          value={workShiftHours?.[workType].actualHours || ""}
          onChange={(event) =>
            setValue(`${index}.workShiftHours.${workType}.actualHours`, parseFloat(event.target.value), {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true,
            })
          }
        />
      </Tooltip>
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
        disabled={workShift?.approved}
        variant="outlined"
        value={workShift?.perDiemAllowance || ""}
        onChange={(event) =>
          setValue(
            `${index}.workShift.perDiemAllowance`,
            (event.target.value || undefined) as PerDiemAllowanceType | undefined,
            {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true,
            },
          )
        }
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
        disabled={workShift?.approved}
        variant="outlined"
        value={workShift?.absence || ""}
        onChange={(event) =>
          setValue(`${index}.workShift.absence`, (event.target.value || undefined) as AbsenceType | undefined, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
          })
        }
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
    <Row
      style={{
        backgroundColor:
          workShift?.date && DateTime.fromJSDate(workShift.date) < DateTime.now().startOf("day")
            ? theme.palette.background.paper
            : theme.palette.background.default,
      }}
    >
      <Cell width={90}>
        <Link
          style={{
            fontWeight:
              workShift?.date && DateTime.fromJSDate(workShift.date).hasSame(DateTime.now(), "day") ? "bold" : "normal",
          }}
          variant="body2"
          title={t("workingHours.workingHourBalances.toWorkHourDetails")}
          onClick={onClick}
        >
          {workShift?.date && DateTime.fromJSDate(workShift.date).toFormat("EEE dd.MM")}
        </Link>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShift?.startedAt ? DateTime.fromJSDate(workShift.startedAt).toFormat("HH:mm") : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">
          {workShift?.endedAt ? DateTime.fromJSDate(workShift.endedAt).toFormat("HH:mm") : ""}
        </Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell minWidth={75} flex={1}>
        <Typography variant="body2">{"00:00"}</Typography>
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.payableWorkingHours"), WorkType.PaidWork)}
      </Cell>
      <Cell flex={1}>{renderWorkHourInput(t("workingHours.workingDays.table.waitingTime"), WorkType.Standby)}</Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.eveningWork"), WorkType.EveningAllowance)}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.nightWork"), WorkType.NightAllowance)}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.holidayBonus"), WorkType.HolidayAllowance)}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.taskSpecificBonus"), WorkType.JobSpecificAllowance)}
      </Cell>
      <Cell flex={1}>
        {renderWorkHourInput(t("workingHours.workingDays.table.freezerBonus"), WorkType.FrozenAllowance)}
      </Cell>
      <Cell minWidth={115} flex={1}>
        <Stack gap={0.5} direction="row" width="100%">
          <Checkbox
            size="small"
            className="cell-checkbox"
            title={t("workingHours.workingHourBalances.dayOffBonus")}
            aria-label={t("workingHours.workingHourBalances.dayOffBonus")}
            disabled={workShift?.approved}
            checked={dayOffWorkAllowance ?? false}
            onChange={(_, checked) =>
              setValue(`${index}.workShift.dayOffWorkAllowance`, checked, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
              })
            }
          />
          {renderAbsenceTypeSelectInput()}
        </Stack>
      </Cell>
      <Cell width={90}>
        <Typography variant="body2">
          {workShift?.truckIds?.map((truckId) => getTruckById(truckId)).join(", ")}
        </Typography>
      </Cell>
      <Cell width={90}>{renderPerDiemAllowanceSelectInput()}</Cell>
      <Cell width={90}>
        <Checkbox
          size="small"
          className="cell-checkbox"
          title={t("workingHours.workingHourBalances.approved")}
          aria-label={t("workingHours.workingHourBalances.approved")}
          checked={approved ?? false}
          onChange={(_, checked) =>
            setValue(`${index}.workShift.approved`, checked, {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true,
            })
          }
        />
      </Cell>
      <Cell minWidth={275} flex={1}>
        <TextField
          className="cell-input align-left"
          size="small"
          aria-label={t("workingHours.workingDays.table.remarks")}
          fullWidth
          disabled={!!workShift?.approved}
          variant="outlined"
          value={workShift?.notes || ""}
          onChange={(event) =>
            setValue(`${index}.workShift.notes`, event.target.value || undefined, {
              shouldDirty: true,
              shouldValidate: true,
              shouldTouch: true,
            })
          }
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
