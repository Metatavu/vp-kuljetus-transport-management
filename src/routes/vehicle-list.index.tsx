import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/vehicle-list/")({
  component: VehicleListIndexRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicleList",
  }),
});

function VehicleListIndexRoute() {
  return (
    <div>
      <p>Vehicle list route</p>
    </div>
  );
}
