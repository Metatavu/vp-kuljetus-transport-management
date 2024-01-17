import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/vehicle-list/").createRoute({
  component: VehicleListIndexRoute,
});

function VehicleListIndexRoute() {
  return (
    <div>
      <p>Vehicle list route</p>
    </div>
  );
}
