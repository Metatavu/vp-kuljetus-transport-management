import { Add } from "@mui/icons-material";
import { Button, Stack, styled } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { Site } from "generated/client";
import { QUERY_KEYS, getListSitesQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/customer-sites")({
  component: ManagementCustomerSites,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      { label: t("management.customerSites.title") },
    ];
    return { breadcrumbs };
  },
});

// Styled root component
const Root = styled(Stack, {
  label: "management-customer-sites-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function ManagementCustomerSites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const sitesQuery = useQuery(
    getListSitesQueryOptions({
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    }),
  );

  const deleteCustomerSite = useMutation({
    mutationFn: (site: Site) => {
      if (!site.id) return Promise.reject();
      return api.sites.updateSite({ siteId: site.id, site: { ...site, archivedAt: new Date() } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] }),
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "left",
        headerName: t("management.customerSites.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "postalCode",
        headerAlign: "left",
        headerName: t("management.customerSites.postalCode"),
        sortable: false,
        width: 180,
      },
      {
        field: "locality",
        headerAlign: "left",
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
      <Root>
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
          fullScreen
          autoHeight={false}
          rows={sitesQuery.data?.sites ?? []}
          columns={columns}
          rowCount={sitesQuery.data?.totalResults}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Root>
    </LoaderWrapper>
  );
}
