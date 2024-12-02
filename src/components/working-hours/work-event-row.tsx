import { MenuItem, TableCell, TableRow, TextField, styled } from "@mui/material";
import { Truck, WorkEventType } from "generated/client";
import { TFunction } from "i18next";
import { DateTime } from "luxon";
import { Key, useCallback } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  type: WorkEventType;
  startTime: DateTime;
  truck?: Truck;
  duration: string;
  distance?: string;
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

const WorkEventRow = ({ type, startTime, truck, duration, distance }: Props) => {
  const { t } = useTranslation();

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

  switch (type) {
    case WorkEventType.ShiftStart:
      return (
        <TableRow>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(type, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    case WorkEventType.ShiftEnd:
      return (
        <TableRow>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(type, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    case WorkEventType.Logout:
      return (
        <TableRow>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(type, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    case WorkEventType.Login:
      return (
        <TableRow>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(type, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    case WorkEventType.Unknown:
      return (
        <TableRow>
          <TableCell sx={{ p: 0.5 }} width={100}>
            <CellInput
              aria-label={t("workingHours.workingDays.workShiftDialog.time")}
              type="time"
              defaultValue={startTime}
            />
          </TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell>{LocalizationUtils.getLocalizedWorkEventType(type, t)}</TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
    default:
      return (
        <TableRow>
          <TableCell width={100}>{startTime.toFormat("HH:mm")}</TableCell>
          <TableCell align="center">{truck?.name ?? ""}</TableCell>
          <TableCell sx={{ p: 0.5 }}>
            <CellInput select aria-label={t("workingHours.workingDays.workShiftDialog.event")} defaultValue={type}>
              {renderLocalizedMenuItems(Object.values(WorkEventType), LocalizationUtils.getLocalizedWorkEventType)}
            </CellInput>
          </TableCell>
          <TableCell align="center">{duration}</TableCell>
          <TableCell align="center">{distance}</TableCell>
        </TableRow>
      );
  }
};

export default WorkEventRow;
