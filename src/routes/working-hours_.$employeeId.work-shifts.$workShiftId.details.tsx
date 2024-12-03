import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";
import { QUERY_KEYS, getFindTruckQueryOptions, getListEmployeeWorkEventsQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";
import DataValidation from "src/utils/data-validation-utils";

export const Route = createFileRoute("/working-hours_/$employeeId/work-shifts/$workShiftId/details")({
  component: WorkShiftDetails,
  loader: async ({ params }) => {
    const { employeeId, workShiftId } = params;

    const workShift = await queryClient.ensureQueryData({
      queryKey: [QUERY_KEYS.WORK_SHIFTS, { employeeId, workShiftId }],
      queryFn: async () =>
        await api.employeeWorkShifts.findEmployeeWorkShift({
          employeeId,
          workShiftId,
        }),
    });
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ];
    return { breadcrumbs, workShift };
  },
});

function WorkShiftDetails() {
  const navigate = useNavigate();
  const { employeeId, workShiftId } = Route.useParams();
  const { workShift } = Route.useLoaderData();
  const selectedDate = Route.useSearch({ select: (search) => search.date });
  const { startedAt } = workShift;

  if (!startedAt) return null;
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
    queries: (workShift.truckIds ?? []).map((truckId) => ({
      ...getFindTruckQueryOptions({ truckId }),
    })),
    combine: (results) =>
      results.map((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  return (
    <WorkShiftDialog
      workEvents={workEventsQuery.data?.workEvents ?? []}
      trucks={trucksQuery}
      workShift={workShift}
      shiftStartedAt={DateTime.fromJSDate(startedAt)}
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
