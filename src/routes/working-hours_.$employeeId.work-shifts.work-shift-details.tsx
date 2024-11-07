import { createFileRoute, useNavigate } from "@tanstack/react-router"
import WorkShiftDialog from "components/working-hours/work-shift-dialog"
import { t } from "i18next"
import { Breadcrumb } from "src/types"

export const Route = createFileRoute(
  "/working-hours/$employeeId/work-shifts/work-shift-details",
)({
  component: WorkShiftDetails,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ]
    return { breadcrumbs }
  },
})

function WorkShiftDetails() {
  const navigate = useNavigate()

  return <WorkShiftDialog onClose={() => navigate({ to: ".." })} />
}
