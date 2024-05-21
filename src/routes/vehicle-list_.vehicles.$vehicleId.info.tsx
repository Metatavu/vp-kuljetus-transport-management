import { Paper } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { VehicleInfoBar } from "components/vehicles/vehicle-info-bar";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/use-api";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/vehicle-list/vehicles/$vehicleId/info")({
  component: () => <VehicleInfo />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicleList.info.title",
  }),
});

const VehicleInfo = () => {
  const { trucksApi } = useApi();
  const { t } = useTranslation();
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const truckSpeed = useQuery({
    queryKey: ["truckSpeed"],
    queryFn: async () => {
      const truckSpeed = await trucksApi.listTruckSpeeds({ truckId: vehicleId, max: 1, first: 0 });

      return truckSpeed[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const truck = useQuery({
    queryKey: ["truck"],
    queryFn: () => trucksApi.findTruck({ truckId: vehicleId }),
  });

  const truckLocation = useQuery({
    queryKey: ["truckLocation"],
    queryFn: async () => {
      const truckLocation = await trucksApi.listTruckLocations({ truckId: vehicleId, max: 1, first: 0 });

      return truckLocation[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const driveStates = useQuery({
    queryKey: ["driveStates"],
    queryFn: () =>
      trucksApi.listDriveStates({
        truckId: vehicleId,
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      }),
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "timeStamp",
        headerAlign: "center",
        headerName: t("vehicleList.info.timeStamp"),
        sortable: false,
        width: 150,
        align: "center",
      },
      {
        field: "event",
        headerAlign: "center",
        headerName: t("vehicleList.info.event"),
        sortable: false,
        width: 200,
        align: "center",
      },
      {
        field: "duration",
        headerAlign: "left",
        headerName: t("vehicleList.info.duration"),
        sortable: false,
        width: 400,
      },
      {
        field: "location",
        headerAlign: "left",
        headerName: t("vehicleList.info.location"),
        sortable: false,
        flex: 1,
      },
      {
        field: "driver",
        headerAlign: "left",
        headerName: t("vehicleList.info.driver"),
        sortable: false,
        flex: 1,
      },
    ],
    [t],
  );

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <VehicleInfoBar
        selectedTruck={truck.data}
        truckSpeed={truckSpeed.data}
        selectedTruckLocation={truckLocation.data}
        title={false}
        navigateBack={() => navigate({ to: "/vehicle-list/vehicles" })}
      />
      <GenericDataGrid
        rows={driveStates.data ?? []}
        columns={columns ?? []}
        pagination
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnSelector
        loading={false}
        getRowId={(row) => `${row.id}`}
        paginationMode="server"
        pageSizeOptions={[25, 50, 100]}
        rowCount={driveStates.data?.length ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
};
