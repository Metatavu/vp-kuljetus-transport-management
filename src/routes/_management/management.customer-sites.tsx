import { Add } from "@mui/icons-material";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { FileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/management/generic/generic-data-grid";
import { useTranslation } from "react-i18next";

export const Route = new FileRoute("/_management/management/customer-sites").createRoute({
  component: ManagementCustomerSites,
});

function ManagementCustomerSites() {
  const { t } = useTranslation();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerAlign: "center",
      headerName: "Nimi",
      sortable: false,
      flex: 1,
    },
    {
      field: "type",
      headerAlign: "center",
      headerName: "Tyyppi",
      sortable: false,
      flex: 1,
    },
    {
      field: "customer",
      headerAlign: "center",
      headerName: "Asiakkuus",
      sortable: false,
      flex: 1,
    },
    {
      field: "postalNumber",
      headerAlign: "center",
      headerName: "Postinumero",
      sortable: false,
      flex: 1,
    },
    {
      field: "locality",
      headerAlign: "center",
      headerName: "Paikkakunta",
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
            Edit
          </Button>
          <Button variant="text" color="error" size="small">
            Delete
          </Button>
        </Stack>
      ),
    },
  ];
  return (
    <Paper sx={{ height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" padding="8px 16px">
        <Typography variant="h6" sx={{ opacity: 0.87 }}>
          {t("breadcrumbs.customer-sites")}
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          Add Site
        </Button>
      </Stack>
      <GenericDataGrid rows={[]} columns={columns} />
    </Paper>
  );
}
