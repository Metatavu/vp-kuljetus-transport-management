import { Button, Paper, Stack } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { GridColDef, GridPaginationModel, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Freight } from "generated/client";
import LoaderWrapper from "components/generic/loader-wrapper";
import DataValidation from "utils/data-validation-utils";
import ServerSidePaginationUtils from "utils/server-side-pagination-utils";

export const Route = createFileRoute("/drive-planning/freights")({
  component: DrivePlanningFreights,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.freights.title",
  }),
});

function DrivePlanningFreights() {
  const { t } = useTranslation();
  const { freightsApi, sitesApi, freightUnitsApi } = useApi();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [totalResults, setTotalResults] = useState(0);

  const freightsQuery = useQuery({
    queryKey: ["freights", paginationModel],
    queryFn: async () => {
      const [freights, headers] = await freightsApi.listFreightsWithHeaders({
        ...ServerSidePaginationUtils.paginationModelToRange(paginationModel),
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return freights;
    },
  });

  const customerSitesQuery = useQuery({
    queryKey: ["customerSites"],
    queryFn: () => sitesApi.listSites(),
    enabled: !!freightsQuery.data,
  });

  const freightUnitsQuery = useQueries({
    queries: (freightsQuery.data ?? []).map((freight) => ({
      queryKey: ["freightUnits", freight.id],
      queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const renderCustomerSiteCell = useCallback(
    ({ row, field }: GridRenderCellParams<Freight, unknown, unknown, GridTreeNodeWithRender>) => {
      const site = customerSitesQuery.data?.find((site) => site.id === row[field as keyof Freight]);

      return site?.name;
    },
    [customerSitesQuery.data],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "freightNumber",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.freightNumber"),
        sortable: false,
        flex: 1,
      },
      {
        field: "senderSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.sender"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "pointOfDepartureSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.pointOfDeparture"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "recipientSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.recipient"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "destinationSiteId",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.destination"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "freightUnits",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.freightUnits"),
        sortable: false,
        flex: 1,
        renderCell: ({ row: { id } }: GridRenderCellParams<Freight, unknown, unknown, GridTreeNodeWithRender>) => {
          const freightsUnits = freightUnitsQuery.data.filter((freightUnit) => freightUnit.freightId === id);

          return freightsUnits
            ?.map((freightUnit) => freightUnit.contents)
            .filter((content) => content)
            .join(", ");
        },
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => null,
        renderCell: () => (
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="primary" size="small">
              {t("open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, renderCustomerSiteCell, freightUnitsQuery],
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow
        toolbarButtons={
          <Button size="small" variant="text" startIcon={<Add />}>
            {t("drivePlanning.freights.new")}
          </Button>
        }
      />
      <LoaderWrapper loading={freightsQuery.isLoading || customerSitesQuery.isLoading}>
        <GenericDataGrid
          rows={freightsQuery.data ?? []}
          columns={columns}
          rowCount={totalResults}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </LoaderWrapper>
    </Paper>
  );
}
