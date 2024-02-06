import { Button, Paper, Stack } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import GenericDataGrid from "components/generic/generic-data-grid";

export const Route = createFileRoute("/management/equipment")({
  component: ManagementEquipment,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.title",
  }),
});

function ManagementEquipment() {
  const { t } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "center",
        headerName: t("management.equipment.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerAlign: "center",
        headerName: t("management.equipment.type"),
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
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("management.equipment.title")} />
      <GenericDataGrid rows={[]} columns={columns} />
    </Paper>
  );
}
