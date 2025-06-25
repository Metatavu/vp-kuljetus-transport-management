import { Button, Paper, Stack } from "@mui/material";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import clsx from "clsx";
import GenericDataGrid from "components/generic/generic-data-grid";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Breadcrumb } from "src/types";
import LocalizationUtils from "../utils/localization-utils";

export const Route = createFileRoute("/vehicles/list")({
  component: VehicleListVehicles,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("vehicles.title") }];
    return { breadcrumbs };
  },
});

function VehicleListVehicles() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [totalTruckResults, setTotalTruckResults] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const trucks = useQuery({
    queryKey: ["trucks", paginationModel],
    queryFn: async () => {
      const [trucks, headers] = await api.trucks.listTrucksWithHeaders({
        first: paginationModel.pageSize * paginationModel.page,
        max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
      });
      const count = Number.parseInt(headers.get("x-total-count") ?? "0");

      setTotalTruckResults(count);
      return trucks;
    },
  });

  const trucksDriveStates = useQueries({
    queries: (trucks.data ?? []).map((truck) => ({
      queryKey: ["trucksDriveStates", truck.id],
      queryFn: async () => ({
        // biome-ignore lint/style/noNonNullAssertion: id must exist in trucks from API
        truckId: truck.id!,
        driveState: (
          await api.trucks.listDriveStates({
            // biome-ignore lint/style/noNonNullAssertion: id must exist in trucks from API
            truckId: truck.id!,
            max: 1,
            first: 0,
          })
        ).at(0),
      }),
      refetchInterval: 10_000,
      enabled: trucks.isSuccess,
    })),
    combine: (results) => results.map((result) => result.data),
  });

  const [currentTime, setTime] = useState(DateTime.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(DateTime.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Render the drive state cell with a timer that shows how long the truck has been in the current drive state
   *
   * @param driveState drive state of the truck
   * @param timestamp timestamp of the latest drive state
   * @returns
   */
  const getDriveStateWithTimer = useCallback(
    (driveState: string, timestamp: number | undefined, currentTime: DateTime) => {
      if (!driveState || !timestamp) {
        return "";
      }

      const dateFromTimestamp = DateTime.fromSeconds(timestamp);
      const timePassedInCurrentDriveState = currentTime.diff(dateFromTimestamp, ["seconds", "minutes", "hours"]);
      const formattedTimeString = `(${timePassedInCurrentDriveState.toFormat("hh:mm:ss")})`;

      return formattedTimeString;
    },
    [],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "plateNumber",
        headerAlign: "center",
        headerName: t("vehicles.list.plateNumber"),
        sortable: false,
        width: 150,
        align: "center",
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() =>
                navigate({
                  to: "/vehicles/$truckId/details",
                  params: { truckId: params.row.id as string },
                  search: { date: DateTime.now() },
                })
              }
            >
              {params.row.plateNumber}
            </Button>
          </Stack>
        ),
      },
      {
        field: "name",
        headerAlign: "center",
        headerName: t("vehicles.list.number"),
        sortable: false,
        width: 200,
        align: "center",
      },
      {
        field: "address",
        headerAlign: "left",
        headerName: t("vehicles.list.address"),
        sortable: false,
        width: 400,
      },
      {
        field: "location",
        headerAlign: "left",
        headerName: t("vehicles.list.location"),
        sortable: false,
        flex: 1,
      },
      {
        field: "status",
        headerAlign: "left",
        headerName: t("vehicles.list.status"),
        sortable: false,
        flex: 1,
        cellClassName: (params) => {
          if (params.value !== "-") {
            return clsx("driveState", {
              drive: params.value === LocalizationUtils.getLocalizedTruckDriveState("DRIVE", t),
            });
          }
          // Default class if drive state is not recognized
          return "";
        },
        renderCell: (params) => (
          <Stack>
            {params.value}{" "}
            {getDriveStateWithTimer(
              params.value,
              trucksDriveStates.find((driveState) => driveState?.truckId === params.row.id)?.driveState?.timestamp,
              currentTime,
            )}
          </Stack>
        ),
      },
      {
        field: "trailer",
        headerAlign: "left",
        headerName: t("vehicles.list.trailer"),
        sortable: false,
        flex: 1,
      },
      {
        field: "driver",
        headerAlign: "left",
        headerName: t("vehicles.list.driver"),
        sortable: false,
        flex: 1,
      },
    ],
    [t, navigate, trucksDriveStates.find, getDriveStateWithTimer, currentTime],
  );

  /**
   * Combine the truck data with drive state data
   */
  const trucksWithDriveState = trucks.data?.map((truck) => {
    const driveState = trucksDriveStates.find((driveState) => driveState?.truckId === truck.id)?.driveState?.state;
    return {
      ...truck,
      status: driveState ? LocalizationUtils.getLocalizedTruckDriveState(driveState, t) : "-",
    };
  });

  return (
    <Paper
      sx={{
        display: "flex",
        height: "calc(100% - 32px)",
        "& .driveState.drive": {
          backgroundColor: "rgba(157, 255, 118, 0.49)",
        },
      }}
    >
      <GenericDataGrid
        fullScreen
        autoHeight={false}
        rows={trucksWithDriveState ?? []}
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
