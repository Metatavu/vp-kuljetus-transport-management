import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";
import {
  getFindEmployeeWorkShiftQueryOptions,
  getFindTruckQueryOptions,
  getListEmployeeWorkEventsQueryOptions,
} from "hooks/use-queries";
import { t } from "i18next";
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
  const { employeeId, workShiftId } = Route.useParams();
  const selectedDate = Route.useSearch({ select: (search) => search.date });

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
    queries: (workShiftQuery.data?.truckIds ?? []).map((truckId) => ({
      ...getFindTruckQueryOptions({ truckId }),
    })),
    combine: (results) =>
      results.map((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
  });

  return (
    <WorkShiftDialog
      loading={workShiftQuery.isLoading || workEventsQuery.isLoading}
      workEvents={workEventsQuery.data?.workEvents ?? []}
      trucks={trucksQuery}
      workShift={workShiftQuery.data}
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
