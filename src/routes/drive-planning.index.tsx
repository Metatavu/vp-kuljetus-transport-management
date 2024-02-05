import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/drive-planning/")({
  component: VehicleInfoRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning",
  }),
});

function VehicleInfoRoute() {
  return (
    <div>
      <p>Drive planning route</p>
    </div>
  );
}
