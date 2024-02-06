import { Add } from "@mui/icons-material";
import { Button, Paper, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { useTranslation } from "react-i18next";
import { RouterContext } from "./__root";
import { useMemo } from "react";

export const Route = createFileRoute("/management/customer-sites")({
  component: ManagementCustomerSites,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.customerSites.title",
  }),
});

function ManagementCustomerSites() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "type",
        headerAlign: "center",
        headerName: t("management.customerSites.type"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerAlign: "center",
        headerName: t("management.customerSites.type"),
        sortable: false,
        flex: 1,
      },
      {
        field: "postalNumber",
        headerAlign: "center",
        headerName: t("management.customerSites.postalCode"),
        sortable: false,
        flex: 1,
      },
      {
        field: "locality",
        headerAlign: "center",
        headerName: t("management.customerSites.municipality"),
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
      <ToolbarRow
        title={t("management.customerSites.title")}
        toolbarButtons={
          <Button
            size="small"
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              navigate({
                to: "/management/customer-sites/add-customer-site",
              })
            }
          >
            {t("addNew")}
          </Button>
        }
      />
      <GenericDataGrid rows={[]} columns={columns} />
    </Paper>
  );
}
