import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/_management/management/towables").createRoute({
  component: ManagementTowables,
});

function ManagementTowables() {
  return (
    <div>
      <p>Management - Towables route</p>
    </div>
  );
}
