import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/management/").createRoute({
  component: VehicleInfoRoute,
});

function VehicleInfoRoute() {
  return (
    <div>
      <p>Management route</p>
    </div>
  );
}
