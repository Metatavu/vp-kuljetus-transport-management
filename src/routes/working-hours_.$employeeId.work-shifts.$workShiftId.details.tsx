import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";
import { WorkEvent, WorkEventType } from "generated/client";
import {
  QUERY_KEYS,
  getFindEmployeeWorkShiftQueryOptions,
  getFindTruckQueryOptions,
  getListEmployeeWorkEventsQueryOptions,
} from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Breadcrumb } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import { v4 as uuidv4 } from "uuid";

export const Route = createFileRoute("/working-hours_/$employeeId/work-shifts/$workShiftId/details")({
  component: WorkShiftDetails,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ];
    return { breadcrumbs };
  },
});

function WorkShiftDetails() {
  const navigate = useNavigate();
  const showConfirmDialog = useConfirmDialog();
  const queryClient = useQueryClient();
  const { employeeId, workShiftId } = Route.useParams();
  const selectedDate = Route.useSearch({ select: (search) => search.date });
  const [editedWorkEvents, setEditedWorkEvents] = useState<WorkEvent[]>([]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRUCK_LOCATIONS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRUCK_ODOMETER_READINGS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRUCK_SPEEDS] });
  }, [queryClient]);

  const workShiftQuery = useQuery(getFindEmployeeWorkShiftQueryOptions({ employeeId, workShiftId }));

  const workEventsQuery = useQuery({
    ...getListEmployeeWorkEventsQueryOptions({
      employeeId,
      employeeWorkShiftId: workShiftId,
      first: 0,
      max: 100000,
    }),
    select: ({ workEvents, totalResults }) => ({ workEvents: workEvents.reverse(), totalResults }),
  });

  const trucksQuery = useQueries({
    queries: (workShiftQuery.data?.truckIdsFromEvents ?? []).map((truckId) => ({
      ...getFindTruckQueryOptions({ truckId }),
    })),
    combine: (results) =>
      results.map((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  const workShiftStartedAt = useMemo(
    () => DateTime.fromJSDate(workShiftQuery.data?.startedAt ?? new Date(Date.now())),
    [workShiftQuery.data],
  );

  /**
   * Fallback time for shift end is 24 hours after shift start
   */
  const workShiftEndedAt = useMemo(
    () => workShiftQuery.data?.endedAt ?? workShiftStartedAt.plus({ hours: 24 }).toJSDate(),
    [workShiftQuery.data, workShiftStartedAt],
  );

  const truckLocationsQuery = useQueries({
    queries:
      trucksQuery.map(({ id }) => ({
        queryKey: ["truck-locations"],
        queryFn: async () =>
          id
            ? {
                truckId: id,
                locations: await api.trucks.listTruckLocations({
                  truckId: id,
                  after: workShiftQuery.data?.startedAt,
                  before: workShiftEndedAt,
                  max: 100000,
                }),
              }
            : null,
      })) ?? [],
    combine: (results) => ({
      data: results
        .map((result) => {
          const locationTimestamps = result.data?.locations
            ?.map((location) => location.timestamp)
            ?.sort((a, b) => (a ?? 0) - (b ?? 0));
          const minTimestamp = locationTimestamps?.at(0) ?? 0;
          const maxTimestamp = locationTimestamps?.at(-1) ?? 0;
          return {
            ...result.data,
            locations: (result.data?.locations ?? []).filter(DataValidation.validateValueIsNotUndefinedNorNull),
            maxTimestamp: DateTime.fromSeconds(maxTimestamp).toJSDate(),
            minTimestamp: DateTime.fromSeconds(minTimestamp).toJSDate(),
          };
        })
        .filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const truckOdometerReadings = useQueries({
    queries: truckLocationsQuery.data.flatMap(({ truckId, maxTimestamp, minTimestamp }) => ({
      queryKey: ["truck-odometer-readings", { truckId, maxTimestamp, minTimestamp }],
      queryFn: () =>
        truckId
          ? api.trucks.listTruckOdometerReadings({ truckId, after: minTimestamp, before: maxTimestamp, max: 100000 })
          : null,
    })),
    combine: (result) => result.flatMap((res) => res.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  const truckSpeeds = useQueries({
    queries: truckLocationsQuery.data.flatMap(({ truckId, maxTimestamp, minTimestamp }) => ({
      queryKey: ["truck-speeds", { truckId, maxTimestamp, minTimestamp }],
      queryFn: () =>
        truckId
          ? api.trucks.listTruckSpeeds({ truckId, after: minTimestamp, before: maxTimestamp, max: 100000 })
          : null,
    })),
    combine: (result) => result.flatMap((res) => res.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  const updateWorkEvent = useMutation({
    mutationFn: async (editedWorkEvents: WorkEvent[]) => {
      // Create a unique change set id for the work shift to track changes
      const uniqueChangeSetId = uuidv4();

      for (const workEvent of editedWorkEvents) {
        await api.workEvents.updateEmployeeWorkEvent({
          // biome-ignore lint/style/noNonNullAssertion: Work events are guaranteed to have an id
          workEventId: workEvent.id!,
          employeeId: employeeId,
          workEvent,
          workShiftChangeSetId: uniqueChangeSetId,
        });
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_CHANGE_SETS] });
      setEditedWorkEvents([]);
      toast.success(t("workingHours.workingDays.workShiftDialog.successToast"));
    },
    onError: () => {
      toast.error(t("workingHours.workingDays.workShiftDialog.errorToast"));
    },
  });

  const handleRowChange = (workEvent: WorkEvent, type?: WorkEventType, value?: string) => {
    const indexOfExistingEditedWorkEvent = editedWorkEvents.findIndex((event) => event.id === workEvent.id);

    const updatedEvent =
      indexOfExistingEditedWorkEvent !== -1
        ? { ...editedWorkEvents[indexOfExistingEditedWorkEvent] }
        : { ...workEvent };

    if (type !== undefined) {
      if (type !== workEvent.workEventType) {
        updatedEvent.workEventType = type;
      } else if (updatedEvent.workEventType !== workEvent.workEventType) {
        // Reset to original if type matches original
        updatedEvent.workEventType = workEvent.workEventType;
      }
    }

    if (value !== undefined) {
      if (value !== workEvent.costCenter && !(value === "" && workEvent.costCenter === undefined)) {
        updatedEvent.costCenter = value;
      } else if (updatedEvent.costCenter !== workEvent.costCenter) {
        // Reset to original if costCenter matches original
        updatedEvent.costCenter = workEvent.costCenter;
      }
    }

    // Check if event now matches original completely
    const isSameAsOriginal =
      updatedEvent.workEventType === workEvent.workEventType &&
      (updatedEvent.costCenter ?? "") === (workEvent.costCenter ?? "");

    if (isSameAsOriginal) {
      // No longer edited, remove from list
      setEditedWorkEvents(editedWorkEvents.filter((event) => event.id !== workEvent.id));
    } else if (indexOfExistingEditedWorkEvent !== -1) {
      const newEditedWorkEvents = [...editedWorkEvents];
      newEditedWorkEvents[indexOfExistingEditedWorkEvent] = updatedEvent;
      setEditedWorkEvents(newEditedWorkEvents);
    } else {
      setEditedWorkEvents([...editedWorkEvents, updatedEvent]);
    }
  };

  const handleOnClose = () => {
    // Check if there are any unsaved changes
    editedWorkEvents.length > 0
      ? showConfirmDialog({
          title: t("workingHours.workingDays.workShiftDialog.confirmDialogMessage.title"),
          description: t("workingHours.workingDays.workShiftDialog.confirmDialogMessage.description"),
          positiveButtonText: t("workingHours.workingDays.workShiftDialog.confirmDialogMessage.confirm"),
          onPositiveClick: () =>
            navigate({
              to: "../..",
              from: "/working-hours/$employeeId/work-shifts/$workShiftId/details",
              search: { date: selectedDate },
            }),
        })
      : navigate({
          to: "../..",
          from: "/working-hours/$employeeId/work-shifts/$workShiftId/details",
          search: { date: selectedDate },
        });
  };

  return (
    <WorkShiftDialog
      loading={workShiftQuery.isLoading || workEventsQuery.isLoading}
      workEvents={workEventsQuery.data?.workEvents ?? []}
      trucks={trucksQuery}
      truckLocationsData={truckLocationsQuery.data}
      truckOdometerReadings={truckOdometerReadings}
      truckSpeeds={truckSpeeds}
      workShiftStartedAt={workShiftStartedAt}
      editedWorkEvents={editedWorkEvents}
      onSave={(editedWorkEvents: WorkEvent[]) => updateWorkEvent.mutate(editedWorkEvents)}
      saving={updateWorkEvent.isPending}
      onRowChange={handleRowChange}
      onClose={() => handleOnClose()}
    />
  );
}
