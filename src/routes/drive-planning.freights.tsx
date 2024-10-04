import { Add } from "@mui/icons-material";
import { Button, Stack, styled } from "@mui/material";
import { GridColDef, GridPaginationModel, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { useQueries } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import RootFreightDialog from "components/drive-planning/freights/root-freight-dialog";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { Freight } from "generated/client";
import { useApi } from "hooks/use-api";
import { useFreights, useSites } from "hooks/use-queries";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DataValidation from "utils/data-validation-utils";
import { z } from "zod";

export const drivePlanningFreightsRouteSearchSchema = z.object({
  freightId: z.string().optional(),
});

export const Route = createFileRoute("/drive-planning/freights")({
  component: DrivePlanningFreights,
  staticData: { breadcrumbs: ["drivePlanning.freights.title"] },
  validateSearch: drivePlanningFreightsRouteSearchSchema,
});

// Styled root component
const Root = styled(Stack, {
  label: "drive-planning-freights-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function DrivePlanningFreights() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { freightUnitsApi } = useApi();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const freightsQuery = useFreights({
    first: paginationModel.pageSize * paginationModel.page,
    max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
  });
  const sitesQuery = useSites(undefined, !freightsQuery.isLoading);

  const freightUnitsQuery = useQueries({
    queries: (freightsQuery.data?.freights ?? []).map((freight) => ({
      queryKey: ["freightUnits", freight.id],
      queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const renderCustomerSiteCell = useCallback(
    ({ row, field }: GridRenderCellParams<Freight, unknown, unknown, GridTreeNodeWithRender>) => {
      const site = sitesQuery.data?.sites.find((site) => site.id === row[field as keyof Freight]);

      return site?.name;
    },
    [sitesQuery.data],
  );

  const columns: GridColDef<Freight>[] = useMemo(
    () => [
      {
        field: "freightNumber",
        headerName: t("drivePlanning.freights.freightNumber"),
        sortable: false,
        width: 120,
      },
      {
        field: "senderSiteId",
        headerName: t("drivePlanning.freights.sender"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "pointOfDepartureSiteId",
        headerName: t("drivePlanning.freights.pointOfDeparture"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "recipientSiteId",
        headerName: t("drivePlanning.freights.recipient"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "destinationSiteId",
        headerName: t("drivePlanning.freights.destination"),
        sortable: false,
        flex: 1,
        renderCell: renderCustomerSiteCell,
      },
      {
        field: "freightUnits",
        headerName: t("drivePlanning.freights.freightUnits"),
        sortable: false,
        flex: 1,
        renderCell: ({ row: { id } }) => {
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
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => navigate({ search: { freightId: params.row.id as string } })}
            >
              {t("open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, navigate, renderCustomerSiteCell, freightUnitsQuery],
  );

  return (
    <>
      <Outlet />
      <Root>
        <RootFreightDialog />
        <ToolbarRow
          title={t("drivePlanning.freights.title")}
          toolbarButtons={
            <Button
              size="small"
              startIcon={<Add />}
              onClick={() => navigate({ to: "/drive-planning/freights/add-freight" })}
            >
              {t("drivePlanning.freights.new")}
            </Button>
          }
        />
        <LoaderWrapper loading={freightsQuery.isLoading || sitesQuery.isLoading}>
          <GenericDataGrid
            fullScreen
            autoHeight={false}
            rows={freightsQuery.data?.freights ?? []}
            columns={columns}
            rowCount={freightsQuery.data?.totalResults}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </LoaderWrapper>
      </Root>
    </>
  );
}
