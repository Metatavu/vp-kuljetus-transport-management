import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/vehicle-info/")({
  component: VehicleInfoIndexRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["vehicleInfo"],
  }),
});

function VehicleInfoIndexRoute() {
  return (
    <div>
      <p>Vehicle info route</p>
    </div>
  );
}
