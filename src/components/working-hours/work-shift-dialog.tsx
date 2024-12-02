import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { api } from "api/index";
import DialogHeader from "components/generic/dialog-header";
import { EmployeeWorkShift, Truck, WorkEvent } from "generated/client";
import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DataValidation from "src/utils/data-validation-utils";
import WorkEventRow from "./work-event-row";
import WorkShiftMap from "./work-shift-map";

type Props = {
  workEvents: WorkEvent[];
  trucks: Truck[];
  workShift: EmployeeWorkShift;
  shiftStartedAt: DateTime;
  onClose: () => void;
};

const WorkShiftDialog = ({ workEvents, trucks, workShift, shiftStartedAt, onClose }: Props) => {
  const { t } = useTranslation();

  /**
   * It is illegal to do workshifts over 15 hours, so if the workshift has not received ended at time, we assume it has ended after 15 hours.
   */
  const workShiftEndedAt = useMemo(
    () => workShift.endedAt ?? shiftStartedAt.plus({ hours: 15 }).toJSDate(),
    [workShift, shiftStartedAt],
  );

  const truckLocationsQuery = useQueries({
    queries:
      trucks.map(({ id }) => ({
        queryKey: ["truckLocations"],
        queryFn: async () =>
          id
            ? {
                truckId: id,
                locations: await api.trucks.listTruckLocations({
                  truckId: id,
                  after: workShift.startedAt,
                  before: workShiftEndedAt,
                }),
              }
            : null,
      })) ?? [],
    combine: (results) => ({
      data: results.map((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const calculateDuration = useCallback((currentWorkEvent: WorkEvent, index: number, allWorkEvents: WorkEvent[]) => {
    if (index === allWorkEvents.length - 1) {
      return "";
    }

    const nextWorkEvent = allWorkEvents[index + 1];
    const duration = DateTime.fromJSDate(nextWorkEvent.time).diff(
      DateTime.fromJSDate(currentWorkEvent.time),
      "seconds",
    );
    return duration.toFormat("hh:mm.ss");
  }, []);

  const renderWorkEventRow = useCallback(
    (workEvent: WorkEvent, index: number, workEvents: WorkEvent[]) => (
      <WorkEventRow
        key={workEvent.id}
        type={workEvent.workEventType}
        startTime={DateTime.fromJSDate(workEvent.time)}
        truck={trucks.find((truck) => truck.id === workEvent.truckId)}
        duration={calculateDuration(workEvent, index, workEvents)}
      />
    ),
    [trucks, calculateDuration],
  );

  const renderWorkEventRows = useCallback(() => workEvents.map(renderWorkEventRow), [workEvents, renderWorkEventRow]);

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={onClose} PaperProps={{ sx: { m: 0, borderRadius: 0 } }}>
      <DialogHeader
        closeTooltip={t("tooltips.closeDialog")}
        title={t("workingHours.workingDays.workShiftDialog.title")}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row">
          <WorkShiftMap truckLocations={(truckLocationsQuery.data ?? []).map(({ locations }) => locations)} />
          <Box display="flex" flex={1} maxHeight={600}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableCell>{t("workingHours.workingDays.workShiftDialog.time")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.vehicle")}</TableCell>
                  <TableCell>{t("workingHours.workingDays.workShiftDialog.event")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.duration")}</TableCell>
                  <TableCell align="center">{t("workingHours.workingDays.workShiftDialog.distance")}</TableCell>
                </TableHead>
                <TableBody>{renderWorkEventRows()}</TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={true} variant="outlined">
          {t("undoChanges")}
        </Button>
        <Button disabled={true}>{t("saveChanges")}</Button>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkShiftDialog;
