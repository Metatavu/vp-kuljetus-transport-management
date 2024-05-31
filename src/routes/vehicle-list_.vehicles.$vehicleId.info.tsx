import { Paper, Stack } from "@mui/material";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { VehicleInfoBar } from "components/vehicles/vehicle-info-bar";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../hooks/use-api";
import { RouterContext } from "./__root";
import LocalizationUtils from "../utils/localization-utils";
import { DateTime, Interval } from "luxon";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import { Driver, Site, Task, TaskType, TruckDriveStateEnum } from "generated/client";
import clsx from "clsx";

type DriveStatesTableRow = {
  interval: Interval<true>;
  state: TruckDriveStateEnum;
  event?: TaskType;
  siteId?: string;
  driverId?: string;
};

export const Route = createFileRoute("/vehicle-list/vehicles/$vehicleId/info")({
  component: () => <VehicleInfo />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "vehicleList.info.title",
  }),
});

const VehicleInfo = () => {
  const { trucksApi, routesApi, tasksApi, sitesApi, driversApi } = useApi();
  const { t } = useTranslation();
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const truckSpeed = useQuery({
    queryKey: ["truckSpeed"],
    queryFn: async () => {
      const truckSpeed = await trucksApi.listTruckSpeeds({ truckId: vehicleId, max: 1, first: 0 });

      return truckSpeed[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const customerSitesMap = useQuery({
    queryKey: ["customerSites"],
    queryFn: () => sitesApi.listSites({}),
    select: (data) =>
      data.reduce((map, site) => {
        if (site.id) map.set(site.id, site);
        return map;
      }, new Map<string, Site>()),
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

  const routes = useQuery({
    queryKey: [
      "routes",
      {
        truckId: vehicleId,
        departureAfter: selectedDate?.startOf("day").toJSDate(),
        departureBefore: selectedDate?.endOf("day").toJSDate(),
      },
    ],
    queryFn: async () =>
      await routesApi.listRoutes({
        truckId: vehicleId,
        departureAfter: selectedDate?.startOf("day").toJSDate(),
        departureBefore: selectedDate?.endOf("day").toJSDate(),
      }),
  });

  const uniqueTasks = useQueries({
    queries:
      routes.data?.map((route) => ({
        queryKey: ["tasks", { routeId: route.id }],
        queryFn: () => tasksApi.listTasks({ routeId: route.id }),
      })) ?? [],
    combine: (results) => {
      const tasks = results
        .reduce<Task[][]>((list, result) => {
          if (result.data) list.push(result.data);
          return list;
        }, [])
        .flat();

      const uniqueTasksMap = tasks.reduce((map, task) => {
        const taskGroupKey = `${task.routeId}-${task.customerSiteId}-${task.type}-${task.groupNumber}`;
        map.set(taskGroupKey, task);
        return map;
      }, new Map<string, Task>());

      return [...uniqueTasksMap.values()];
    },
  });

  const driversDataMap = useQuery({
    queryKey: ["drivers"],
    queryFn: () => driversApi.listDrivers({}),
    select: (data) =>
      data.reduce((map, driver) => {
        if (driver.id) map.set(driver.id, driver);
        return map;
      }, new Map<string, Driver>()),
  });

  const driveStates = useQuery({
    queryKey: [
      "driveStates",
      {
        truckId: vehicleId,
        after: selectedDate?.startOf("day").toJSDate(),
        before: selectedDate?.endOf("day").toJSDate(),
      },
    ],
    queryFn: () =>
      trucksApi.listDriveStates({
        truckId: vehicleId,
        after: selectedDate?.startOf("day").toJSDate(),
        before: selectedDate?.endOf("day").toJSDate(),
      }),
    select: (data) => data.sort((a, b) => a.timestamp - b.timestamp),
  });

  const driveStateRows = useMemo(() => {
    if (!driveStates.data) return [];

    const tableRows = driveStates.data.reduce<DriveStatesTableRow[]>((rows, driveState, index, driveStates) => {
      const nextState = driveStates.at(index + 1);

      const driveStateInterval = Interval.fromDateTimes(
        DateTime.fromSeconds(driveState.timestamp),
        nextState?.timestamp
          ? DateTime.fromSeconds(nextState.timestamp)
          : selectedDate.hasSame(DateTime.now(), "day")
            ? DateTime.now()
            : selectedDate.endOf("day"),
      );

      if (!driveStateInterval.isValid) return rows;

      if (driveState.state !== TruckDriveStateEnum.Work) {
        rows.push({
          interval: driveStateInterval,
          state: driveState.state,
          driverId: driveState.driverId,
        });

        return rows;
      }

      const taskRows: DriveStatesTableRow[] = [];

      for (const task of uniqueTasks) {
        if (!task.startedAt) continue;

        const startTime = DateTime.fromJSDate(task.startedAt);
        const endTime = task.finishedAt ? DateTime.fromJSDate(task.finishedAt) : DateTime.now();

        const taskInterval = Interval.fromDateTimes(startTime, endTime);
        if (!taskInterval.isValid) continue;

        if (!taskInterval.overlaps(driveStateInterval)) continue;

        const rowInterval = Interval.fromDateTimes(
          taskInterval.start >= driveStateInterval.start ? taskInterval.start : driveStateInterval.start,
          taskInterval.end <= driveStateInterval.end ? taskInterval.end : driveStateInterval.end,
        );

        if (!rowInterval.isValid) continue;

        taskRows.push({
          interval: rowInterval,
          state: driveState.state,
          event: task.type,
          driverId: driveState.driverId,
          siteId: task.customerSiteId,
        });
      }

      taskRows.sort((a, b) => a.interval.start.toMillis() - b.interval.start.toMillis());

      const rowsToAdd = taskRows.reduce<DriveStatesTableRow[]>((list, row, index, rows) => {
        if (index === 0 && row.interval.start > driveStateInterval.start) {
          const intervalFromDriveStateStartToRowStart = Interval.fromDateTimes(
            driveStateInterval.start,
            row.interval.start,
          );

          if (intervalFromDriveStateStartToRowStart.isValid) {
            list.push({
              interval: intervalFromDriveStateStartToRowStart,
              state: driveState.state,
              driverId: driveState.driverId,
            });
          }
        } else if (index === rows.length - 1 && row.interval.end < driveStateInterval.end) {
          const intervalFromDriveStateEndToRowEnd = Interval.fromDateTimes(row.interval.end, driveStateInterval.end);

          if (intervalFromDriveStateEndToRowEnd.isValid) {
            list.push({
              interval: intervalFromDriveStateEndToRowEnd,
              state: driveState.state,
              driverId: driveState.driverId,
            });
          }
        } else {
          const prevRow = rows[index - 1];
          const intervalBetweenRows = Interval.fromDateTimes(prevRow.interval.end, row.interval.start);

          if (intervalBetweenRows.isValid && intervalBetweenRows.length("seconds") > 0) {
            list.push({
              interval: intervalBetweenRows,
              state: driveState.state,
              driverId: driveState.driverId,
            });
          }
        }

        return list;
      }, []);

      if (rowsToAdd.length) {
        rows.push(...rowsToAdd);
      } else {
        rows.push({
          interval: driveStateInterval,
          state: driveState.state,
          driverId: driveState.driverId,
        });
      }

      return rows;
    }, []);

    return tableRows;
  }, [driveStates.data, uniqueTasks, selectedDate]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "start",
        headerAlign: "left",
        headerName: t("vehicleList.info.timeStamp"),
        sortable: false,
        width: 250,
        align: "left",
        renderCell: ({ row }: GridRenderCellParams<DriveStatesTableRow>) =>
          row.interval.toFormat("HH:mm:ss", { separator: " - " }),
      },
      {
        field: "state",
        headerAlign: "center",
        headerName: t("vehicleList.info.event"),
        sortable: false,
        width: 250,
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
        renderCell: ({ row }: GridRenderCellParams<DriveStatesTableRow>) => (
          <Stack direction="row" justifyContent="space-between" width="100%" textAlign="center">
            <Stack width="50%" borderRight="1px solid rgba(0, 0, 0, 0.5)">
              {LocalizationUtils.getLocalizedDriveStateStatus(row.state, t)}
            </Stack>
            <Stack width="50%">{row.event ?? ""}</Stack>
          </Stack>
        ),
      },
      {
        field: "duration",
        headerAlign: "left",
        headerName: t("vehicleList.info.duration"),
        sortable: false,
        width: 400,
        renderCell: ({ row }: GridRenderCellParams<DriveStatesTableRow>) => (
          <Stack>{row.interval.toDuration().toFormat("hh:mm:ss")}</Stack>
        ),
      },
      {
        field: "location",
        headerAlign: "left",
        headerName: t("vehicleList.info.location"),
        sortable: false,
        flex: 1,
        valueGetter: ({ row }: GridRenderCellParams<DriveStatesTableRow>) =>
          customerSitesMap.data?.get(row.siteId ?? "")?.name ?? "",
      },
      {
        field: "driver",
        headerAlign: "left",
        headerName: t("vehicleList.info.driver"),
        sortable: false,
        flex: 1,
        valueGetter: ({ row }: GridRenderCellParams<DriveStatesTableRow>) =>
          driversDataMap.data?.get(row.siteId ?? "")?.displayName ?? "",
      },
    ],
    [t, customerSitesMap.data, driversDataMap.data],
  );

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
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
      <Stack flex={1} borderTop="1px solid rgba(0, 0, 0, 0.1)" padding={1}>
        <Stack width="30%" marginLeft={1}>
          <DatePickerWithArrows date={selectedDate ?? DateTime.now()} buttonsWithText setDate={setSelectedDate} />
        </Stack>
      </Stack>
      <GenericDataGrid
        rows={driveStateRows ?? []}
        columns={columns ?? []}
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnSelector
        loading={false}
        getRowId={(row: DriveStatesTableRow) => row.interval.start.toSeconds()}
        paginationMode="client"
        pageSizeOptions={[25, 50, 100]}
        rowCount={driveStateRows.length ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Paper>
  );
};
