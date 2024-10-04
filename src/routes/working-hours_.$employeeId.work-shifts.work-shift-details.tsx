import { createFileRoute, useNavigate } from "@tanstack/react-router";
import WorkShiftDialog from "components/working-hours/work-shift-dialog";

export const Route = createFileRoute("/working-hours/$employeeId/work-shifts/work-shift-details")({
  component: WorkShiftDetails,
});

function WorkShiftDetails() {
  const navigate = useNavigate();

  return <WorkShiftDialog onClose={() => navigate({ to: ".." })} />;
}
