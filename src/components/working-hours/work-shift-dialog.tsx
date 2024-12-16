import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { api } from "api/index";
import DialogHeader from "components/generic/dialog-header";
import { EmployeeWorkShift, Truck, WorkEvent } from "generated/client";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataValidation from "src/utils/data-validation-utils";
import WorkEventRow from "./work-event-row";
import WorkShiftMap from "./work-shift-map";

type Props = {
  workEvents: WorkEvent[];
  trucks: Truck[];
  workShift?: EmployeeWorkShift;
  loading: boolean;
  onClose: () => void;
};

const WorkShiftDialog = ({ workEvents, trucks, workShift, loading, onClose }: Props) => {
  const { t } = useTranslation();

  const [selectedWorkEvent, setSelectedWorkEvent] = useState<WorkEvent>();

  const workShiftStartedAt = useMemo(
    () => DateTime.fromJSDate(workShift?.startedAt ?? new Date(Date.now())),
    [workShift],
  );

  /**
   * It is illegal to do workshifts over 15 hours, so if the workshift has not received ended at time, we assume it has ended after 15 hours.
   */
  const workShiftEndedAt = useMemo(
    () => workShift?.endedAt ?? workShiftStartedAt.plus({ hours: 15 }).toJSDate(),
    [workShift, workShift],
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
                  after: workShift?.startedAt,
                  before: workShiftEndedAt,
                }),
              }
            : null,
      })) ?? [],
    combine: (results) => ({
      data: results
        .map((result) => {
          const maxTimestamp =
            result.data?.locations === undefined
              ? 0
              : Math.max(...result.data.locations.map((location) => location.timestamp));
          const minTimestamp =
            result.data?.locations === undefined
              ? 0
              : Math.min(...result.data.locations.map((location) => location.timestamp));
          return {
            ...result.data,
            locations: result.data?.locations ?? [].filter(DataValidation.validateValueIsNotUndefinedNorNull),
            maxTimestamp: DateTime.fromSeconds(maxTimestamp).toJSDate(),
            minTimestamp: DateTime.fromSeconds(minTimestamp).toJSDate(),
          };
        })
        .filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const truckOdometerReadings = useQueries({
    queries: truckLocationsQuery.data.flatMap(({ truckId, maxTimestamp, minTimestamp }) => ({
      queryKey: ["truckOdometerReading", { truckId, maxTimestamp, minTimestamp }],
      queryFn: () =>
        truckId ? api.trucks.listTruckOdometerReadings({ truckId, after: minTimestamp, before: maxTimestamp }) : null,
    })),
    combine: (result) => result.flatMap((res) => res.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  const truckSpeeds = useQueries({
    queries: truckLocationsQuery.data.flatMap(({ truckId, maxTimestamp, minTimestamp }) => ({
      queryKey: ["truckSpeed", { truckId, maxTimestamp, minTimestamp }],
      queryFn: () =>
        truckId ? api.trucks.listTruckSpeeds({ truckId, after: minTimestamp, before: maxTimestamp }) : null,
    })),
    combine: (result) => result.flatMap((res) => res.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  const selectedWorkEventTelematics = useMemo(() => {
    if (!selectedWorkEvent) return;
    const { time } = selectedWorkEvent;
    const timestamp = time.getTime() / 1000;
    return {
      truckOdometerReading: truckOdometerReadings.find((reading) => reading.timestamp === timestamp),
      truckSpeed: truckSpeeds.find((speed) => speed.timestamp === timestamp),
      truckLocation: truckLocationsQuery.data
        .flatMap(({ locations }) => locations)
        .find((location) => location.timestamp === timestamp),
    };
  }, [selectedWorkEvent, truckOdometerReadings, truckSpeeds, truckLocationsQuery]);

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

  const calculateDistance = useCallback(
    (currentWorkEvent: WorkEvent, index: number, allWorkEvents: WorkEvent[]) => {
      if (index === allWorkEvents.length - 1 || currentWorkEvent.workEventType !== "DRIVE") {
        return "";
      }
      const timestamp = currentWorkEvent.time.getTime() / 1000;
      const nextWorkEventTimestamp = allWorkEvents[index + 1].time.getTime() / 1000;

      const truckOdometerReading = truckOdometerReadings.find((reading) => reading.timestamp === timestamp);
      const nextTruckOdometerReading = truckOdometerReadings.find(
        (reading) => reading.timestamp === nextWorkEventTimestamp,
      );

      if (!truckOdometerReading || !nextTruckOdometerReading) {
        return "";
      }

      const distance = nextTruckOdometerReading.odometerReading - truckOdometerReading.odometerReading;

      return `${(distance / 1000).toFixed(2)} km`;
    },
    [truckOdometerReadings],
  );

  const getIsSelectable = useCallback(
    (workEvent: WorkEvent) => {
      const timestamp = workEvent.time.getTime() / 1000;
      const truckLocation = truckLocationsQuery.data
        .flatMap(({ locations }) => locations)
        .find((location) => location.timestamp === timestamp);

      return truckLocation !== undefined;
    },
    [truckLocationsQuery],
  );

  const renderWorkEventRow = useCallback(
    (workEvent: WorkEvent, index: number, workEvents: WorkEvent[]) => (
      <WorkEventRow
        key={workEvent.id}
        type={workEvent.workEventType}
        startTime={DateTime.fromJSDate(workEvent.time)}
        truck={trucks.find((truck) => truck.id === workEvent.truckId)}
        duration={calculateDuration(workEvent, index, workEvents)}
        distance={calculateDistance(workEvent, index, workEvents)}
        selectable={getIsSelectable(workEvent)}
        selected={selectedWorkEvent?.id === workEvent.id}
        onClick={() => setSelectedWorkEvent(workEvent)}
      />
    ),
    [selectedWorkEvent, trucks, calculateDuration, calculateDistance, getIsSelectable],
  );

  const renderWorkEventRows = useCallback(
    () =>
      loading
        ? Array(15)
            .fill(null)
            .map((_, rowIdx: number) => (
              <TableRow key={`skeleton-work-event-row-${rowIdx}`}>
                {Array(5)
                  .fill(null)
                  .map((_, cellIdx: number) => (
                    <TableCell sx={{ border: "none" }} key={`skeleton-work-event-cell-${rowIdx}-${cellIdx}`}>
                      <Skeleton />
                    </TableCell>
                  ))}
              </TableRow>
            ))
        : workEvents.map(renderWorkEventRow),
    [loading, workEvents, renderWorkEventRow],
  );

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={onClose} PaperProps={{ sx: { m: 0, borderRadius: 0 } }}>
      <DialogHeader
        closeTooltip={t("tooltips.closeDialog")}
        title={t("workingHours.workingDays.workShiftDialog.title")}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row">
          <WorkShiftMap
            truckLocations={(truckLocationsQuery.data ?? []).map(({ locations }) => locations)}
            selectedWorkEventTelematics={selectedWorkEventTelematics}
          />
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
