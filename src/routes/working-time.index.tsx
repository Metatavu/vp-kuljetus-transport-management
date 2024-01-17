import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/working-time/").createRoute({
  component: VehicleInfoRoute,
});

function VehicleInfoRoute() {
  return (
    <div>
      <p>Working time route</p>
    </div>
  );
}
