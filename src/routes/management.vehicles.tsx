import { Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/management/vehicles")({
  component: ManagementVehicles,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicles",
  }),
});

function ManagementVehicles() {
  const { t } = useTranslation();

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("vehicles")} />
    </Paper>
  );
}
