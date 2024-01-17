import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/vehicle-info/").createRoute({
  component: VehicleInfoIndexRoute,
});

function VehicleInfoIndexRoute() {
  return (
    <div>
      <p>Vehicle info route</p>
    </div>
  );
}
