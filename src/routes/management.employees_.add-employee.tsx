import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import EmployeeComponent from "components/management/employees/employee";
import { Employee } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/management/employees/add-employee")({
  component: AddEmployee,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.employees.title", "management.employees.new"],
  }),
});

function AddEmployee() {
  const { employeesApi } = useApi();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createEmployee = useMutation({
    mutationFn: (employee: Employee) => employeesApi.createEmployee({ employee }),
    onSuccess: () => {
      toast.success(t("management.employees.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
    },
    onError: () => toast.error(t("management.employees.errorToast")),
  });

  return <EmployeeComponent title={t("management.employees.new")} onSave={createEmployee} />;
}
