import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/working-time/")({
  component: VehicleInfoRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "workingTime",
  }),
});

function VehicleInfoRoute() {
  return (
    <div>
      <p>Working time route</p>
    </div>
  );
}
