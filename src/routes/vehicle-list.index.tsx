import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { Paper } from "@mui/material";
import VehicleListScreen from "components/vehicle-list-screen";

export const Route = createFileRoute("/vehicle-list/")({
  component: VehicleListIndexRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicleList",
  }),
});

function VehicleListIndexRoute() {
  return (
    <Paper style={{ margin: 15, padding: 20 }}>
      <VehicleListScreen />
    </Paper>
  );
}
