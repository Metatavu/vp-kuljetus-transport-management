import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "api/index"
import LoaderWrapper from "components/generic/loader-wrapper"
import EmployeeComponent from "components/management/employees/employee"
import { Employee, SalaryGroup } from "generated/client"
import {
  QUERY_KEYS,
  getFindEmployeeQueryOptions,
  getListTimeEntriesQueryOptions,
} from "hooks/use-queries"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { queryClient } from "src/main"
import { Breadcrumb } from "src/types"

export const Route = createFileRoute(
  "/management/employees_/$employeeId/modify",
)({
  component: EmployeeModify,
  loader: async ({ params }) => {
    const employee = await queryClient.ensureQueryData(
      getFindEmployeeQueryOptions(params.employeeId),
    )
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.employees.title"),
        route: "/management/employees",
      },
      {
        label: t("management.employees.modify", {
          employeeName: `${employee.firstName} ${employee.lastName}`,
        }),
      },
    ]
    return { breadcrumbs, employee }
  },
})

function EmployeeModify() {
  const { employeeId } = Route.useParams()
  const { employee } = Route.useLoaderData()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const employeeQuery = useQuery(getFindEmployeeQueryOptions(employeeId))
  const updateEmployee = useMutation({
    mutationFn: (employeeToUpdate: Employee) =>
      api.employees.updateEmployee({ employeeId, employee: employeeToUpdate }),
    onSuccess: () => {
      toast.success(t("management.employees.successToast"))
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] })
    },
    onError: () => toast.error(t("management.employees.errorToast")),
  })

  useQuery(
    getListTimeEntriesQueryOptions(
      { employeeId },
      true,
      employee.salaryGroup ?? SalaryGroup.Terminal,
      new Date(),
      employeeQuery.isSuccess,
    ),
  )

  return (
    <LoaderWrapper loading={employeeQuery.isLoading}>
      <EmployeeComponent
        title={`${employee.lastName}, ${employee.lastName}`}
        employee={employee}
        onSave={updateEmployee}
      />
    </LoaderWrapper>
  )
}
