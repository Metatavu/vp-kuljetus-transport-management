import { Add } from "@mui/icons-material";
import { Button, Paper, Stack } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { useTranslation } from "react-i18next";
import { RouterContext } from "./__root";
import { useMemo, useState } from "react";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Site } from "generated/client";
import { useSites } from "hooks/use-queries";

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

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const sitesQuery = useSites({
    first: paginationModel.pageSize * paginationModel.page,
    max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
  });

  const deleteCustomerSite = useMutation({
    mutationFn: (site: Site) => {
      if (!site.id) return Promise.reject();
      return sitesApi.updateSite({ siteId: site.id, site: { ...site, archivedAt: new Date() } });
    },
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
        width: 180,
      },
      {
        field: "locality",
        headerAlign: "center",
        headerName: t("management.customerSites.municipality"),
        sortable: false,
        width: 180,
      },
      {
        field: "actions",
        type: "actions",
        width: 66,
        renderHeader: () => null,
        renderCell: ({ id }) => (
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
          </Stack>
        ),
      },
    ],
    [t, navigate],
  );

  return (
    <LoaderWrapper loading={deleteCustomerSite.isPending || sitesQuery.isLoading}>
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
        <GenericDataGrid
          rows={sitesQuery.data?.sites ?? []}
          columns={columns}
          rowCount={sitesQuery.data?.totalResults}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Paper>
    </LoaderWrapper>
  );
}
