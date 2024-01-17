import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/drive-planning/").createRoute({
  component: VehicleInfoRoute,
});

function VehicleInfoRoute() {
  return (
    <div>
      <p>Drive planning route</p>
    </div>
  );
}
