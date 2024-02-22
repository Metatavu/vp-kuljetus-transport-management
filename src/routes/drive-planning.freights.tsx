import { Button, Paper, Stack } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import GenericDataGrid from "components/generic/generic-data-grid";

export const Route = createFileRoute("/drive-planning/freights")({
  component: DrivePlanningFreights,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.freights.title",
  }),
});

function DrivePlanningFreights() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { freightsApi } = useApi();
  // const queryClient = useQueryClient();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [totalResults, setTotalResults] = useState(0);
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [selectedFreight, setSelectedFreight] = useState<Freight>();

  const freights = useQuery({
    queryKey: ["freights", paginationModel],
    queryFn: async () => {
      const [freights, headers] = await freightsApi.listFreightsWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");
      setTotalResults(count);
      return freights;
    },
  });

  // const createFreight = useMutation({
  //   mutationKey: ["createFreight"],
  //   mutationFn: async (freight: Freight) => await freightsApi.createFreight({ freight }),
  // });

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
        field: "sender",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.sender"),
        sortable: false,
        flex: 1,
      },
      {
        field: "recipient",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.freightNumber"),
        sortable: false,
        flex: 1,
      },
      {
        field: "pointOfDeparture",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.pointOfDeparture"),
        sortable: false,
        flex: 1,
      },
      {
        field: "destination",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.destination"),
        sortable: false,
        flex: 1,
      },
      {
        field: "freightUnits",
        headerAlign: "center",
        headerName: t("drivePlanning.freights.freightUnits"),
        sortable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => null,
        renderCell: () => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              // onClick={() =>navigate({to: "/management/customer-sites/$customerSiteId/modify",params: { customerSiteId: id as string },})}
            >
              {t("open")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <Outlet />
      {/* <FreightDialog open={dialogOpen} onClose={() => setDialogOpen(false)} /> */}
      <Paper sx={{ height: "100%" }}>
        <ToolbarRow
          title={t("drivePlanning.freights.title")}
          toolbarButtons={
            <Button
              size="small"
              variant="text"
              startIcon={<Add />}
              onClick={() => navigate({ to: "/drive-planning/freights/add-freight" })}
            >
              {t("drivePlanning.freights.new")}
            </Button>
          }
        />
        <GenericDataGrid
          rows={freights.data ?? []}
          columns={columns}
          rowCount={totalResults}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Paper>
    </>
  );
}
