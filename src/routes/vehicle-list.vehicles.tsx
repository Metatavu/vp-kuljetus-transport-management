import { Paper } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { useTranslation } from "react-i18next";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import GenericDataGrid from "components/generic/generic-data-grid";
import { useApi } from "../hooks/use-api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/vehicle-list/vehicles")({
  component: VehicleListVehicles,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicleList.title",
  }),
});

function VehicleListVehicles() {
  const { trucksApi } = useApi();

  const { t } = useTranslation();
  const [totalTruckResults, setTotalTruckResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const trucks = useQuery({
    queryKey: ["trucks", paginationModel],
    queryFn: async () => {
      const [trucks, headers] = await trucksApi.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = parseInt(headers.get("x-total-count") ?? "0");

      setTotalTruckResults(count);
      return trucks;
    },
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "plateNumber",
        headerAlign: "center",
        headerName: t("vehicleList.vehicle.plateNumber"),
        sortable: false,
        width: 150,
        align: "center",
      },
      {
        field: "name",
        headerAlign: "center",
        headerName: t("vehicleList.vehicle.number"),
        sortable: false,
        width: 200,
        align: "center",
      },
      {
        field: "address",
        headerAlign: "left",
        headerName: t("vehicleList.vehicle.address"),
        sortable: false,
        width: 400,
      },
      {
        field: "location",
        headerAlign: "left",
        headerName: t("vehicleList.vehicle.location"),
        sortable: false,
        flex: 1,
      },
      {
        field: "status",
        headerAlign: "left",
        headerName: t("vehicleList.vehicle.status"),
        sortable: false,
        flex: 1,
      },
      {
        field: "trailer",
        headerAlign: "left",
        headerName: t("vehicleList.vehicle.trailer"),
        sortable: false,
        flex: 1,
      },
      {
        field: "driver",
        headerAlign: "left",
        headerName: t("vehicleList.vehicle.driver"),
        sortable: false,
        flex: 1,
      },
    ],
    [t],
  );

  return (
    <Paper>
      <GenericDataGrid
        rows={trucks.data ?? []}
        columns={columns}
        pagination
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnSelector
        loading={false}
        getRowId={(row) => `${row.id}`}
        paginationMode="server"
        pageSizeOptions={[25, 50, 100]}
        rowCount={totalTruckResults}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
}
