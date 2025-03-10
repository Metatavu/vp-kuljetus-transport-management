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
      await Promise.all(
        editedWorkEvents.map((workEvent) =>
          api.workEvents.updateEmployeeWorkEvent({
            // biome-ignore lint/style/noNonNullAssertion: Work events are guaranteed to have an id
            workEventId: workEvent.id!,
            employeeId: employeeId,
            workEvent,
            workShiftChangeSetId: "", // uniquer per single workshift per single save,TODO
          }),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS] });
      setEditedWorkEvents([]);
      toast.success(t("workingHours.workingDays.workShiftDialog.successToast"));
    },
    onError: () => {
      toast.error(t("workingHours.workingDays.workShiftDialog.errorToast"));
    },
  });

  const handleRowChange = (workEvent: WorkEvent, type?: WorkEventType, value?: string) => {
    const index = editedWorkEvents.findIndex((event) => event.id === workEvent.id);

    // Check if the event is already in the edited list
    if (index !== -1) {
      const newEditedWorkEvents = [...editedWorkEvents];

      if (type !== undefined) {
        // If the new type is the same as the original, remove the event to avoid unnecessary updates
        if (type === workEvent.workEventType) {
          setEditedWorkEvents(editedWorkEvents.filter((event) => event.id !== workEvent.id));
          return;
        }
        newEditedWorkEvents[index] = { ...workEvent, workEventType: type };
      } else if (value !== undefined) {
        // If the new value is the same as the original, remove the event
        if (value === workEvent.costCenter || (value === "" && workEvent.costCenter === undefined)) {
          setEditedWorkEvents(editedWorkEvents.filter((event) => event.id !== workEvent.id));
          return;
        }
        newEditedWorkEvents[index] = { ...workEvent, costCenter: value };
      }

      setEditedWorkEvents(newEditedWorkEvents);
      return;
    }

    // If the event is not in the edited list, add it with the correct property
    const updatedEvent = { ...workEvent };
    if (type !== undefined) {
      updatedEvent.workEventType = type;
    } else if (value !== undefined) {
      updatedEvent.costCenter = value;
    }

    setEditedWorkEvents([...editedWorkEvents, updatedEvent]);
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
      onClose={() =>
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
            })
      }
    />
  );
}
