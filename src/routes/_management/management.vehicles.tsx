import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/_management/management/vehicles").createRoute({
  component: ManagementVehicles,
});

function ManagementVehicles() {
  return (
    <div>
      <p>Management - Vehicles route</p>
    </div>
  );
}
