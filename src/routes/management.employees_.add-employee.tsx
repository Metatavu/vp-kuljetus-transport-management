import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import EmployeeComponent from "components/management/employees/employee";
import { Employee } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/employees_/add-employee")({
  component: AddEmployee,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.employees.title"),
        route: "/management/employees",
      },
      { label: t("management.employees.new") },
    ];
    return { breadcrumbs };
  },
});

function AddEmployee() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createEmployee = useMutation({
    mutationFn: (employee: Employee) => api.employees.createEmployee({ employee }),
    onSuccess: () => {
      toast.success(t("management.employees.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
    },
    onError: () => toast.error(t("management.employees.errorToast")),
  });

  return <EmployeeComponent title={t("management.employees.new")} onSave={createEmployee} />;
}
