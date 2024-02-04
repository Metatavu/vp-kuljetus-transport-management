import { Paper } from "@mui/material";
import { FileRoute } from "@tanstack/react-router";
import VehicleListScreen from "components/vehicle-list-screen";

export const Route = new FileRoute("/vehicle-list/").createRoute({
  component: VehicleListIndexRoute,
});

function VehicleListIndexRoute() {
  return (
    <Paper style={{ margin: 15 }}>
      <VehicleListScreen />
    </Paper>
  );
}
