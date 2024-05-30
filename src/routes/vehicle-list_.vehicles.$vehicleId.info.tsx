import { Paper, Stack } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { VehicleInfoBar } from "components/vehicles/vehicle-info-bar";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/use-api";
import { RouterContext } from "./__root";
import LocalizationUtils from "../utils/localization-utils";
import clsx from "clsx";
import { DateTime } from "luxon";

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

  /**
   * Get time passed from last drive state change
   */
  const getDriveStateDuration = (driveStateId: string) => {
    const currentDriveStateIndex = driveStates.data?.findIndex((driveState) => driveState.id === driveStateId) ?? 0;
    const currentDriveState = driveStates.data?.[currentDriveStateIndex];
    const nextDriveState = driveStates.data?.[currentDriveStateIndex + 1];

    if (!currentDriveState || !nextDriveState) {
      return "";
    }

    const currentDriveStateTimeStamp = DateTime.fromSeconds(currentDriveState.timestamp);
    const nextDriveStateDriveStamp = DateTime.fromSeconds(nextDriveState.timestamp);

    const duration = currentDriveStateTimeStamp
      .diff(nextDriveStateDriveStamp, ["seconds", "minutes", "hours"])
      .toISOTime();

    return DateTime.fromISO(duration).toFormat("HH:mm:ss");
  };

  /**
   * Get drive state start and end time
   */
  const getDriveStateTime = (driveStateId: string) => {
    const currentDriveStateIndex = driveStates.data?.findIndex((driveState) => driveState.id === driveStateId) ?? 0;
    const currentDriveState = driveStates.data?.[currentDriveStateIndex];
    const nextDriveState = driveStates.data?.[currentDriveStateIndex + 1];

    if (!currentDriveState || !nextDriveState) {
      return "";
    }

    const currentDriveStateTimeStamp = DateTime.fromSeconds(currentDriveState.timestamp).toISOTime();
    const nextDriveStateDriveStamp = DateTime.fromSeconds(nextDriveState.timestamp).toISOTime();

    return `${DateTime.fromISO(currentDriveStateTimeStamp).toFormat("HH:mm:ss")} - ${DateTime.fromISO(
      nextDriveStateDriveStamp,
    ).toFormat("HH:mm:ss")}`;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "timestamp",
        headerAlign: "center",
        headerName: t("vehicleList.info.timeStamp"),
        sortable: false,
        width: 150,
        align: "center",
        renderCell: (params) => {
          return getDriveStateTime(params.row.id);
        },
      },
      {
        field: "state",
        headerAlign: "center",
        headerName: t("vehicleList.info.event"),
        sortable: false,
        width: 200,
        align: "center",
        cellClassName: (params) => {
          if (params.value !== "-") {
            return clsx("driveState", {
              drive: params.value === "DRIVE",
            });
          }
          // Default class if drive state is not recognized
          return "";
        },
        renderCell: (params) => (
          <Stack direction="row" justifyContent="space-between" width="100%" textAlign="center">
            <Stack width="50%" borderRight="1px solid rgba(0, 0, 0, 0.5)">
              {params.value}
            </Stack>
            <Stack width="50%">{LocalizationUtils.getLocalizedTruckDriveState(params.value, t)}</Stack>
          </Stack>
        ),
      },
      {
        field: "duration",
        headerAlign: "left",
        headerName: t("vehicleList.info.duration"),
        sortable: false,
        width: 400,
        renderCell: (params) => <Stack>{getDriveStateDuration(params.row.id)}</Stack>,
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
    [t, getDriveStateDuration, getDriveStateTime],
  );

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        "& .driveState.drive": {
          backgroundColor: "rgba(157, 255, 118, 0.49)",
        },
      }}
    >
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
