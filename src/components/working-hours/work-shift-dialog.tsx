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
import { EmployeeWorkShift, Truck, TruckLocation, WorkEvent } from "generated/client";
import { LatLng } from "leaflet";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataValidation from "src/utils/data-validation-utils";
import WorkEventRow from "./work-event-row";
import WorkShiftMap from "./work-shift-map";

type Props = {
  workEvents: WorkEvent[];
  trucks: Truck[];
  workShift: EmployeeWorkShift;
  onClose: () => void;
};

const WorkShiftDialog = ({ workEvents, trucks, workShift, onClose }: Props) => {
  const { t } = useTranslation();

  const [hoveredTimestamp, setHoveredTimestamp] = useState<{ [key: string]: string } | null>(null);

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
                  before: workShift.endedAt,
                }),
              }
            : null,
      })) ?? [],
    combine: (results) => ({
      data: results.map((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const truckLocationsLookup = useMemo(
    () =>
      truckLocationsQuery.data?.reduce((acc: Record<string, Record<number, LatLng>>, { truckId, locations }) => {
        acc[truckId] = locations.reduce((ac: Record<number, LatLng>, truckLocation: TruckLocation) => {
          ac[truckLocation.timestamp] = new LatLng(truckLocation.latitude, truckLocation.longitude);

          return ac;
        }, {});
        return acc;
      }, {}),
    [truckLocationsQuery.data],
  );

  const calculateDuration = useCallback((currentWorkEvent: WorkEvent, index: number, allWorkEvents: WorkEvent[]) => {
    if (index === allWorkEvents.length - 1) {
      return "";
    }

    const nextWorkEvent = allWorkEvents[index + 1];
    const duration = DateTime.fromJSDate(currentWorkEvent.time).diff(
      DateTime.fromJSDate(nextWorkEvent.time),
      "seconds",
    );
    return duration.toFormat("hh:mm.ss");
  }, []);

  const renderWorkEventRow = useCallback(
    (workEvent: WorkEvent, index: number, workEvents: WorkEvent[]) => (
      <WorkEventRow
        type={workEvent.workEventType}
        startTime={DateTime.fromJSDate(workEvent.time)}
        truck={trucks.find((truck) => truck.id === workEvent.truckId)}
        duration={calculateDuration(workEvent, index, workEvents)}
        onHover={(timestamp, truckId) =>
          truckId && timestamp ? setHoveredTimestamp({ [truckId]: timestamp.toString() }) : setHoveredTimestamp(null)
        }
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
          <WorkShiftMap
            truckLocations={(truckLocationsQuery.data ?? []).map(({ locations }) => locations)}
            hoveredLocation={
              truckLocationsLookup[hoveredTimestamp?.truckId ?? ""]?.[
                Number.parseInt(hoveredTimestamp?.timestamp ?? "0")
              ]
            }
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
