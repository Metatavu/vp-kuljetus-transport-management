import { Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/drive-planning/freights")({
  component: DrivePlanningFreights,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.freights.title",
  }),
});

function DrivePlanningFreights() {
  const { t } = useTranslation();

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("drivePlanning.freights.title")} />
    </Paper>
  );
}
