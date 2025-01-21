import { Box, Divider, Stack } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import clsx from "clsx";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";
import GenericDataGrid from "components/generic/generic-data-grid";
import { VehicleInfoBar } from "components/vehicles/vehicle-info-bar";
import { Driver, Site, Task, TaskType, TruckDriveState, TruckDriveStateEnum } from "generated/client";
import { getFindTruckQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { DateTime, Interval } from "luxon";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import { getEquipmentDisplayName } from "src/utils/format-utils";
import { z } from "zod";
import LocalizationUtils from "../utils/localization-utils";

type DriveStatesTableRow = {
  interval: Interval<true>;
  state: TruckDriveStateEnum;
  event?: TaskType;
  siteId?: string;
  driverId?: string;
};

export const vehicleInfoRouteSearchSchema = z.object({
  date: z.string().datetime({ offset: true }).transform(DataValidation.parseValidDateTime).optional(),
});

export const Route = createFileRoute("/vehicles_/$truckId/details")({
  component: VehicleInfo,
  validateSearch: vehicleInfoRouteSearchSchema,
  loader: async ({ params: { truckId } }) => {
    const truck = await queryClient.ensureQueryData(getFindTruckQueryOptions({ truckId }));
    const breadcrumbs: Breadcrumb[] = [{ label: t("vehicles.title") }, { label: getEquipmentDisplayName(truck) }];
    return { breadcrumbs, truck };
  },
});

function VehicleInfo() {
  const { t } = useTranslation();
  const { truckId } = Route.useParams();
  const navigate = useNavigate({ from: Route.parentRoute.fullPath });
  const selectedDate = Route.useSearch({
    select: (search) => search.date ?? DateTime.now(),
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const truckSpeed = useQuery({
    queryKey: ["truckSpeed"],
    queryFn: async () => {
      const truckSpeed = await api.trucks.listTruckSpeeds({
        truckId: truckId,
        max: 1,
        first: 0,
      });

      return truckSpeed[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const customerSitesMap = useQuery({
    queryKey: ["customerSites"],
    queryFn: () => api.sites.listSites({}),
    select: (data) =>
      data.reduce((map, site) => {
        if (site.id) map.set(site.id, site);
        return map;
      }, new Map<string, Site>()),
  });

  const truck = useQuery({
    queryKey: ["truck"],
    queryFn: () => api.trucks.findTruck({ truckId: truckId }),
  });

  const truckLocation = useQuery({
    queryKey: ["truckLocation"],
    queryFn: async () => {
      const truckLocation = await api.trucks.listTruckLocations({
        truckId: truckId,
        max: 1,
        first: 0,
      });

      return truckLocation[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const routesQueryParams = {
    truckId: truckId,
    departureAfter: selectedDate.startOf("day").toJSDate(),
    departureBefore: selectedDate.endOf("day").toJSDate(),
  };

  const routes = useQuery({
    queryKey: ["routes", routesQueryParams],
    queryFn: async () => await api.routes.listRoutes(routesQueryParams),
  });

  const uniqueTasks = useQueries({
    queries:
      routes.data?.map((route) => ({
        queryKey: ["tasks", { routeId: route.id }],
        queryFn: () => api.tasks.listTasks({ routeId: route.id }),
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
    queryFn: () => api.drivers.listDrivers({}),
    select: (data) =>
      data.reduce((map, driver) => {
        if (driver.id) map.set(driver.id, driver);
        return map;
      }, new Map<string, Driver>()),
  });

  const driveStatesQueryParams = {
    truckId: truckId,
    after: selectedDate.startOf("day").toJSDate(),
    before: selectedDate.endOf("day").toJSDate(),
  };

  const driveStates = useQuery({
    queryKey: ["driveStates", driveStatesQueryParams],
    queryFn: () => api.trucks.listDriveStates(driveStatesQueryParams),
    select: (data) => data.sort((a, b) => a.timestamp - b.timestamp),
  });

  const getRowsToAdd = (
    taskRows: DriveStatesTableRow[],
    driveStateInterval: Interval<true>,
    driveState: TruckDriveState,
  ) => {
    return taskRows.reduce<DriveStatesTableRow[]>((list, row, index, rows) => {
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
  };

  const getTaskRows = (uniqueTasks: Task[], driveStateInterval: Interval<true>, driveState: TruckDriveState) => {
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

    return taskRows.sort((a, b) => a.interval.start.toMillis() - b.interval.start.toMillis());
  };

  const getDriveStateInterval = (driveState: TruckDriveState, nextState: TruckDriveState | undefined) => {
    return Interval.fromDateTimes(
      DateTime.fromSeconds(driveState.timestamp),
      nextState?.timestamp
        ? DateTime.fromSeconds(nextState.timestamp)
        : selectedDate.hasSame(DateTime.now(), "day")
          ? DateTime.now()
          : selectedDate.endOf("day"),
    );
  };

  /**
   * Construct the rows for the drive state table
   */
  const driveStateRows = useMemo(() => {
    if (!driveStates.data) return [];

    const tableRows = driveStates.data.reduce<DriveStatesTableRow[]>((rows, driveState, index, driveStates) => {
      const nextState = driveStates.at(index + 1);

      const driveStateInterval = getDriveStateInterval(driveState, nextState);

      if (!driveStateInterval.isValid) return rows;

      if (driveState.state !== TruckDriveStateEnum.Work) {
        rows.push({
          interval: driveStateInterval,
          state: driveState.state,
          driverId: driveState.driverId,
        });

        return rows;
      }

      const taskRows = getTaskRows(uniqueTasks, driveStateInterval, driveState);

      const rowsToAdd = getRowsToAdd(taskRows, driveStateInterval, driveState);

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
  }, [driveStates.data, uniqueTasks, getRowsToAdd, getTaskRows, getDriveStateInterval]);

  const columns: GridColDef<DriveStatesTableRow>[] = useMemo(
    () => [
      {
        field: "start",
        headerAlign: "left",
        headerName: t("vehicles.details.timeStamp"),
        sortable: false,
        width: 250,
        align: "left",
        renderCell: ({ row }) => row.interval.toFormat("HH:mm:ss", { separator: " - " }),
      },
      {
        field: "state",
        headerAlign: "center",
        headerName: t("vehicles.details.event"),
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
        renderCell: ({ row }) => (
          <Stack direction="row" width="100%" height="100%">
            <Box flex={1} alignItems="center" display="flex" justifyContent="center">
              {LocalizationUtils.getLocalizedDriveStateStatus(row.state, t)}
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box flex={1} alignItems="center" display="flex" justifyContent="center">
              {row.event ?? ""}
            </Box>
          </Stack>
        ),
      },
      {
        field: "duration",
        headerAlign: "left",
        headerName: t("vehicles.details.duration"),
        sortable: false,
        width: 400,
        renderCell: ({ row }) => <Stack>{row.interval.toDuration().toFormat("hh:mm:ss")}</Stack>,
      },
      {
        field: "location",
        headerAlign: "left",
        headerName: t("vehicles.details.location"),
        sortable: false,
        flex: 1,
        valueGetter: ({ row }) => customerSitesMap.data?.get(row.siteId ?? "")?.name ?? "",
      },
      {
        field: "driver",
        headerAlign: "left",
        headerName: t("vehicles.details.driver"),
        sortable: false,
        flex: 1,
        valueGetter: ({ row }) => driversDataMap.data?.get(row.siteId ?? "")?.displayName ?? "",
      },
    ],
    [t, customerSitesMap.data, driversDataMap.data],
  );

  return (
    <Stack
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        "& .driveState.drive": {
          backgroundColor: "#B9F6CA",
        },
      }}
    >
      <VehicleInfoBar
        selectedTruck={truck.data}
        truckSpeed={truckSpeed.data}
        selectedTruckLocation={truckLocation.data}
        title={false}
        navigateBack={() => navigate({ to: "/vehicles/list" })}
      />
      <Box borderTop="1px solid rgba(0, 0, 0, 0.1)" px={3} py={1}>
        <DatePickerWithArrows
          date={selectedDate}
          buttonsWithText
          setDate={(date) =>
            navigate({
              search: (search) => ({ ...search, date: date.toISODate() }),
            })
          }
        />
      </Box>
      <Stack flex={1} overflow="hidden">
        <GenericDataGrid
          autoHeight={false}
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
      </Stack>
    </Stack>
  );
}
