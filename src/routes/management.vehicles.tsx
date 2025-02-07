import { Button, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { createFileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { t } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/vehicles")({
  component: ManagementVehicles,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("management.title") }, { label: t("management.vehicles.title") }];
    return { breadcrumbs };
  },
});

function ManagementVehicles() {
  const { t } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "center",
        headerName: t("management.vehicles.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerAlign: "center",
        headerName: t("management.vehicles.type"),
        sortable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        flex: 0.7,
        renderHeader: () => null,
        renderCell: () => (
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="primary" size="small">
              {t("edit")}
            </Button>
            <Button variant="text" color="error" size="small">
              {t("delete")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <Stack sx={{ height: "100%", width: "100%" }}>
      <ToolbarRow title={t("management.vehicles.title")} />
      <GenericDataGrid rows={[]} columns={columns} />
    </Stack>
  );
}
