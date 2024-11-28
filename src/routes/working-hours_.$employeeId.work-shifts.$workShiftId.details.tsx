import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";
import { QUERY_KEYS, getFindTruckQueryOptions, getListEmployeeWorkEventsQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";

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
    const workEvents = await queryClient.ensureQueryData(
      getListEmployeeWorkEventsQueryOptions({ employeeId, employeeWorkShiftId: workShiftId, first: 0, max: 100000 }),
    );
    const trucks = await Promise.all(
      (workShift.truckIds ?? []).map((truckId) => queryClient.ensureQueryData(getFindTruckQueryOptions({ truckId }))),
    );
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ];
    return { breadcrumbs, workEvents, trucks, workShift };
  },
});

function WorkShiftDetails() {
  const navigate = useNavigate();
  const { workEvents, trucks, workShift } = Route.useLoaderData();

  return (
    <WorkShiftDialog
      workEvents={workEvents}
      trucks={trucks}
      workShift={workShift}
      onClose={() => navigate({ to: ".." })}
    />
  );
}
