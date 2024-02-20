import { Add } from "@mui/icons-material";
import { Button, Paper, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { useTranslation } from "react-i18next";
import { RouterContext } from "./__root";
import { useMemo } from "react";
import { useApi } from "../hooks/use-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDialog } from "components/contexts/dialog-context";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Site } from "generated/client";

export const Route = createFileRoute("/management/customer-sites")({
  component: ManagementCustomerSites,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.customerSites.title",
  }),
});

function ManagementCustomerSites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sitesApi } = useApi();
  const queryClient = useQueryClient();
  const showDialog = useDialog();

  const customerSites = useQuery({
    queryKey: ["sites"],
    queryFn: () => sitesApi.listSites({}),
  });

  const deleteCustomerSite = useMutation({
    mutationFn: (site: Site) => sitesApi.updateSite({ siteId: site.id!, site: { ...site, archivedAt: new Date() } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sites"] }),
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "center",
        headerName: t("management.customerSites.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "postalCode",
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
        renderCell: ({ row: { id, name } }) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() =>
                navigate({
                  to: "/management/customer-sites/$customerSiteId/modify",
                  params: { customerSiteId: id as string },
                })
              }
            >
              {t("open")}
            </Button>
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                showDialog({
                  title: t("management.customerSites.archiveDialog.title"),
                  description: t("management.customerSites.archiveDialog.description", { name: name }),
                  positiveButtonText: t("archive"),
                  cancelButtonEnabled: true,
                  onPositiveClick: () => deleteCustomerSite.mutate(id),
                });
              }}
            >
              {t("archive")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, navigate, showDialog, deleteCustomerSite],
  );

  return (
    <LoaderWrapper loading={deleteCustomerSite.isPending || customerSites.isLoading}>
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
        <GenericDataGrid rows={customerSites.data ?? []} columns={columns} />
      </Paper>
    </LoaderWrapper>
  );
}
