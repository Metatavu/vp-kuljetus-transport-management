import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";
import { WorkEvent } from "generated/client";
import {
  QUERY_KEYS,
  getFindEmployeeWorkShiftQueryOptions,
  getFindTruckQueryOptions,
  getListEmployeeWorkEventsQueryOptions,
} from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useEffect, useMemo } from "react";
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
  const queryClient = useQueryClient();
  const { employeeId, workShiftId } = Route.useParams();
  const selectedDate = Route.useSearch({ select: (search) => search.date });

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
          // biome-ignore lint/style/noNonNullAssertion: Work events are guaranteed to have an id
          api.workEvents.updateEmployeeWorkEvent({ workEventId: workEvent.id!, employeeId: employeeId, workEvent }),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS] });

      toast.success(t("workingHours.workingHourBalances.successToast"));
    },
    onError: () => {
      toast.error(t("workingHours.workingHourBalances.errorToast"));
    },
  });

  return (
    <WorkShiftDialog
      loading={workShiftQuery.isLoading || workEventsQuery.isLoading}
      workEvents={workEventsQuery.data?.workEvents ?? []}
      trucks={trucksQuery}
      truckLocationsData={truckLocationsQuery.data}
      truckOdometerReadings={truckOdometerReadings}
      truckSpeeds={truckSpeeds}
      workShiftStartedAt={workShiftStartedAt}
      onSave={(editedWorkEvents: WorkEvent[]) => updateWorkEvent.mutate(editedWorkEvents)}
      onClose={() =>
        navigate({
          to: "../..",
          from: "/working-hours/$employeeId/work-shifts/$workShiftId/details",
          search: { date: selectedDate },
        })
      }
    />
  );
}
