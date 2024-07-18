import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { QUERY_KEYS, useEmployee } from "hooks/use-queries";
import { Employee } from "generated/client";
import { toast } from "react-toastify";
import LoaderWrapper from "components/generic/loader-wrapper";
import EmployeeComponent from "components/management/employees/employee";
import { useMemo } from "react";

export const Route = createFileRoute("/management/employees/$employeeId/modify")({
  component: EmployeeModify,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.employees.title", "management.employees.modify"],
  }),
});

function EmployeeModify() {
  const { employeesApi } = useApi();
  const { employeeId } = Route.useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const employeeQuery = useEmployee(employeeId);

  const updateEmployee = useMutation({
    mutationFn: (employee: Employee) => employeesApi.updateEmployee({ employeeId, employee }),
    onSuccess: () => {
      toast.success(t("management.employees.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
    },
    onError: () => toast.error(t("management.employees.errorToast")),
  });

  const employeeName = useMemo(() => {
    const { firstName, lastName } = employeeQuery.data ?? {};
    if (!firstName || !lastName) return "";

    return `${lastName}, ${firstName}`;
  }, [employeeQuery.data]);

  return (
    <LoaderWrapper loading={employeeQuery.isLoading}>
      <EmployeeComponent title={employeeName} employee={employeeQuery.data} onSave={updateEmployee} />
    </LoaderWrapper>
  );
}
