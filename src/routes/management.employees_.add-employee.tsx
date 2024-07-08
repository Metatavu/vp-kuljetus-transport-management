import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/management/employees/add-employee")({
  component: AddEmployee,
  beforeLoad: () => ({
    breadcrumbs: ["management.employees.title", "management.employees.new"],
  }),
});

function AddEmployee() {
  return <div>Add Employee</div>;
}
