import { Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/drive-planning/routes")({
  component: DrivePlanningRoutes,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.title",
  }),
});

function DrivePlanningRoutes() {
  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow/>
    </Paper>
  );
}
