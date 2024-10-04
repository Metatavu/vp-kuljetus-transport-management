import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicle-info/")({
  component: VehicleInfoIndexRoute,
  staticData: { breadcrumbs: ["vehicleInfo"] },
});

function VehicleInfoIndexRoute() {
  return (
    <div>
      <p>Vehicle info route</p>
    </div>
  );
}
