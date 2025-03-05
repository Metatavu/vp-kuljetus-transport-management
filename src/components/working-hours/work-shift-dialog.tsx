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
import DialogHeader from "components/generic/dialog-header";
import { Truck, TruckLocation, TruckOdometerReading, TruckSpeed, WorkEvent, WorkEventType } from "generated/client";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { WorkShiftDialogWorkEventRow } from "src/types";
import WorkEventRow from "./work-event-row";
import WorkShiftMap from "./work-shift-map";

type TruckLocationData = {
  truckId?: string;
  locations: TruckLocation[];
  maxTimestamp: Date;
  minTimestamp: Date;
};

type Props = {
  workEvents: WorkEvent[];
  trucks: Truck[];
  loading: boolean;
  truckLocationsData: TruckLocationData[];
  truckOdometerReadings: TruckOdometerReading[];
  truckSpeeds: TruckSpeed[];
  workShiftStartedAt: DateTime;
  onClose: () => void;
  onSave: (editedWorkEvents: WorkEvent[]) => void;
};

const WorkShiftDialog = ({
  workEvents,
  trucks,
  loading,
  truckLocationsData,
  truckOdometerReadings,
  truckSpeeds,
  workShiftStartedAt,
  onClose,
  onSave,
}: Props) => {
  const { t } = useTranslation();

  const [selectedWorkEvent, setSelectedWorkEvent] = useState<WorkEvent>();
  const [editedWorkEvents, setEditedWorkEvents] = useState<WorkEvent[]>([]);

  const selectedWorkEventTelematics = useMemo(() => {
    if (!selectedWorkEvent) return;
    const { time } = selectedWorkEvent;
    const timestamp = time.getTime() / 1000;
    return {
      truckOdometerReading: truckOdometerReadings.find((reading) => reading.timestamp === timestamp),
      truckSpeed: truckSpeeds.find((speed) => speed.timestamp === timestamp),
      truckLocation: truckLocationsData
        .flatMap(({ locations }) => locations)
        .find((location) => location.timestamp === timestamp),
    };
  }, [selectedWorkEvent, truckOdometerReadings, truckSpeeds, truckLocationsData]);

  const calculateDuration = useCallback((currentWorkEvent: WorkEvent, nextWorkEvent?: WorkEvent) => {
    if (!nextWorkEvent) return 0;

    const duration = DateTime.fromJSDate(nextWorkEvent.time).diff(
      DateTime.fromJSDate(currentWorkEvent.time),
      "seconds",
    );
    return duration.toMillis();
  }, []);

  const calculateDistance = useCallback(
    (currentWorkEvent: WorkEvent, nextWorkEvent?: WorkEvent) => {
      if (!nextWorkEvent || currentWorkEvent.workEventType !== "DRIVE") {
        return 0;
      }

      const timestamp = currentWorkEvent.time.getTime() / 1000;
      const nextWorkEventTimestamp = nextWorkEvent.time.getTime() / 1000;

      const truckOdometerReading = truckOdometerReadings.find((reading) => reading.timestamp === timestamp);

      const nextTruckOdometerReading = truckOdometerReadings.find(
        (reading) => reading.timestamp === nextWorkEventTimestamp,
      );

      if (!truckOdometerReading || !nextTruckOdometerReading) {
        return 0;
      }

      return nextTruckOdometerReading.odometerReading - truckOdometerReading.odometerReading;
    },
    [truckOdometerReadings],
  );

  const workEventRows = useMemo(() => {
    return workEvents.map((workEvent, index) => {
      const nextWorkEvent = workEvents[index + 1];
      const truck = trucks.find((truck) => truck.id === workEvent.truckId);

      return {
        workEvent,
        truck,
        duration: calculateDuration(workEvent, nextWorkEvent),
        distance: calculateDistance(workEvent, nextWorkEvent),
      };
    });
  }, [workEvents, trucks, calculateDuration, calculateDistance]);

  const getIsSelectable = useCallback(
    (workEvent: WorkEvent) => {
      const timestamp = workEvent.time.getTime() / 1000;
      const truckLocation = truckLocationsData
        .flatMap(({ locations }) => locations)
        .find((location) => location.timestamp === timestamp);

      return truckLocation !== undefined;
    },
    [truckLocationsData],
  );

  const handleWorkEventTypeChange = (workEvent: WorkEvent, type: WorkEventType) => {
    const index = editedWorkEvents.findIndex((event) => event.id === workEvent.id);
    // If the event is already in editedWorkEvents
    if (index !== -1) {
      // Check if the new type is the same as the original, if it is, remove the event from the edited list to avoid uneccessary updates
      if (type === workEvent.workEventType) {
        setEditedWorkEvents(editedWorkEvents.filter((event) => event.id !== workEvent.id));
        return;
      }
      // Otherwise, update the event's type
      const newEditedWorkEvents = [...editedWorkEvents];
      newEditedWorkEvents[index] = { ...workEvent, workEventType: type };
      setEditedWorkEvents(newEditedWorkEvents);
      return;
    }
    // If the event is not in the edited list, add it
    setEditedWorkEvents([...editedWorkEvents, { ...workEvent, workEventType: type }]);
  };

  const renderWorkEventRow = useCallback(
    (workEventRow: WorkShiftDialogWorkEventRow) => (
      <WorkEventRow
        key={workEventRow.workEvent.id}
        row={workEventRow}
        truck={workEventRow.truck}
        selectable={getIsSelectable(workEventRow.workEvent)}
        selected={selectedWorkEvent?.id === workEventRow.workEvent.id}
        onClick={() => setSelectedWorkEvent(workEventRow.workEvent)}
        onWorkEventTypeChange={(workEvent: WorkEvent, type: WorkEventType) =>
          handleWorkEventTypeChange(workEvent, type)
        }
      />
    ),
    [selectedWorkEvent, getIsSelectable, handleWorkEventTypeChange],
  );

  const renderWorkEventRows = useCallback(
    () =>
      loading || !workEventRows
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
        : workEventRows.map(renderWorkEventRow),
    [loading, workEventRows, renderWorkEventRow],
  );

  return (
    <Dialog fullWidth={true} maxWidth="lg" open={true} onClose={onClose} PaperProps={{ sx: { m: 0, borderRadius: 0 } }}>
      <DialogHeader
        closeTooltip={t("tooltips.closeDialog")}
        title={t("workingHours.workingDays.workShiftDialog.title", { date: workShiftStartedAt.toFormat("dd.MM.yyyy") })}
        onClose={onClose}
      />
      <DialogContent sx={{ p: 0 }}>
        <Stack direction="row">
          <WorkShiftMap
            truckLocations={(truckLocationsData ?? []).map(({ locations }) => locations)}
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
        <Button onClick={() => onSave(editedWorkEvents)} disabled={editedWorkEvents.length === 0}>
          {t("saveChanges")}
        </Button>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkShiftDialog;
