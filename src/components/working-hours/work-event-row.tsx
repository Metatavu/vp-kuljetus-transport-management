import { MenuItem, TableCell, TableRow, TextField, styled } from "@mui/material";
import { Truck, WorkEventType } from "generated/client";
import { TFunction } from "i18next";
import { DateTime, Duration } from "luxon";
import { Key, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WorkShiftDialogWorkEventRow } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  selected: boolean;
  row: WorkShiftDialogWorkEventRow;
  truck?: Truck;
  selectable: boolean;
  onClick: () => void;
};

// Styled work event TextField
const CellInput = styled(TextField, {
  label: "work-shift-row",
})(({ theme }) => ({
  "& .MuiInputBase-root.MuiFilledInput-root::before": {
    borderBottom: 0,
  },
  "& input, .MuiSelect-select": {
    border: `1px solid ${theme.palette.divider}`,
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(0, 1),
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
  },
}));

const WorkEventRow = ({ selected, row, truck, selectable, onClick }: Props) => {
  const { t } = useTranslation();

  // Handle work type change
  const handleWorkEventTypeChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    const newWorkEventType = event.target.value;
    // Handle work type change by adding
  }, []);

  const { workEventType, startTime, duration, distance } = useMemo(() => {
    const {
      workEvent: { workEventType, time },
      duration,
      distance,
    } = row;
    return {
      workEventType: workEventType,
      startTime: DateTime.fromJSDate(time),
      duration: Duration.fromMillis(duration).toFormat("hh:mm.ss"),
      distance: `${(distance / 1000).toFixed(2)} km`,
    };
  }, [row]);

  const renderLocalizedMenuItem = useCallback(
    <T extends string>(value: T, labelResolver: (value: T, t: TFunction) => string) => (
      <MenuItem key={value as Key} value={value}>
        {labelResolver(value, t)}
      </MenuItem>
    ),
    [t],
  );

  const renderLocalizedMenuItems = useCallback(
    <T extends string>(items: string[], labelResolver: (value: T, t: TFunction) => string) =>
      items.map((item) => renderLocalizedMenuItem(item as T, labelResolver)),
    [renderLocalizedMenuItem],
  );

  const rowStyle = useMemo(
    () => ({
      backgroundColor: selectable ? (selected ? "rgba(0, 255, 0, 0.1)" : undefined) : "rgba(0, 0, 0, 0.1)",
      cursor: selectable ? "pointer" : "default",
    }),
    [selectable, selected],
  );

  switch (workEventType) {
    case WorkEventType.ShiftStart:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime.toFormat("HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(workEventType, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
    case WorkEventType.ShiftEnd:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime.toFormat("HH:mm")}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(workEventType, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
    case WorkEventType.Logout:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(workEventType, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
    case WorkEventType.Login:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(workEventType, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
    case WorkEventType.Unknown:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime.toFormat("HH:mm")}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(workEventType, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
    case WorkEventType.Drive:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell sx={{ p: 0.5 }}>
            <CellInput
              select
              key={row.workEvent.id}
              onChange={handleWorkEventTypeChange} // move to upper scope
              aria-label={t("workingHours.workingDays.workShiftDialog.event")}
              defaultValue={workEventType}
            >
              {renderLocalizedMenuItems(Object.values(WorkEventType), LocalizationUtils.getLocalizedWorkEventType)}
            </CellInput>
          </TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    default:
      return (
        <TableRow onClick={onClick} sx={rowStyle}>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell sx={{ p: 0.5 }}>
            <CellInput
              select
              aria-label={t("workingHours.workingDays.workShiftDialog.event")}
              defaultValue={workEventType}
            >
              {renderLocalizedMenuItems(Object.values(WorkEventType), LocalizationUtils.getLocalizedWorkEventType)}
            </CellInput>
          </TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center" />
        </TableRow>
      );
  }
};

export default WorkEventRow;
