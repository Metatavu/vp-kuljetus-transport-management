import { Add, Edit, PauseCircle, PlayCircle } from "@mui/icons-material";
import { Button, IconButton, Stack, styled } from "@mui/material";
import { type GridColDef, type GridPaginationModel, useGridApiRef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { type ThermalMonitor, ThermalMonitorStatus, ThermalMonitorType } from "generated/client";
import { getListThermalMonitorsQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Breadcrumb } from "src/types";
import { useResizeObserver } from "usehooks-ts";

export const Route = createFileRoute("/management/thermal-monitors")({
  component: ManagementThermalMonitors,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      { label: t("management.thermalMonitors.title") },
    ];
    return { breadcrumbs };
  },
});

// Styled root component
const Root = styled(Stack, {
  label: "management-thermal-monitors-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function ManagementThermalMonitors() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const gridApiRef = useGridApiRef();

  const { width } = useResizeObserver({ ref: rootRef });

  // biome-ignore lint/correctness/useExhaustiveDependencies: width changes should trigger resizing
  useEffect(() => {
    gridApiRef.current?.resize();
  }, [width, gridApiRef]);

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const thermalMonitorsQuery = useQuery(
    getListThermalMonitorsQueryOptions({
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    }),
  );
  const thermalMonitors = useMemo(() => thermalMonitorsQuery.data?.thermalMonitors ?? [], [thermalMonitorsQuery.data]);

  const columns = useMemo<GridColDef<ThermalMonitor>[]>(
    () => [
      {
        field: "name",
        headerAlign: "left",
        headerName: t("management.thermalMonitors.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "lowerThresholdTemperature",
        headerAlign: "left",
        headerName: t("management.thermalMonitors.lowerThresholdTemperature"),
        sortable: false,
        valueFormatter: ({ value }) => (value !== undefined ? `${value} °C` : "-"),
      },
      {
        field: "upperThresholdTemperature",
        headerAlign: "left",
        headerName: t("management.thermalMonitors.upperThresholdTemperature"),
        sortable: false,
        valueFormatter: ({ value }) => (value !== undefined ? `${value} °C` : "-"),
      },
      {
        field: "status",
        headerAlign: "left",
        headerName: t("management.thermalMonitors.status"),
        sortable: false,
        flex: 1,
        valueFormatter: ({ value }) => t(`management.thermalMonitors.statuses.${value as ThermalMonitorStatus}`),
      },
      {
        field: "activeAt",
        headerAlign: "left",
        headerName: t("management.thermalMonitors.schedule"),
        sortable: false,
        flex: 1,
        valueGetter: ({ row: { activeFrom, activeTo, schedule, monitorType } }) => {
          if (monitorType === ThermalMonitorType.OneOff) {
            if (!activeFrom && !activeTo) return t("management.thermalMonitors.type.ONE_OFF");
            return "-";
          }

          if (monitorType === ThermalMonitorType.Scheduled && schedule) {
            return t("management.thermalMonitors.type.SCHEDULED"); // TODO: Format schedule
          }
        },
      },
      {
        field: "actions",
        headerName: t("management.thermalMonitors.actions"),
        type: "actions",
        headerAlign: "left",
        flex: 1,
        renderCell: ({ id, row }) => {
          const isActiveOrPaused = (
            [ThermalMonitorStatus.Active, ThermalMonitorStatus.Paused] as ThermalMonitorStatus[]
          ).includes(row.status);

          return (
            <Stack width="100%" px={1} direction="row" spacing={1} justifyContent="end" alignItems="center">
              {isActiveOrPaused && (
                <IconButton onClick={() => {}}>
                  {row.status === ThermalMonitorStatus.Paused ? <PlayCircle /> : <PauseCircle />}
                </IconButton>
              )}
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() =>
                  navigate({
                    to: "/management/thermal-monitors/$thermalMonitorId/modify",
                    params: { thermalMonitorId: id as string },
                  })
                }
                sx={{ ml: "auto" }}
                startIcon={<Edit />}
              >
                {t("edit")}
              </Button>
            </Stack>
          );
        },
      },
    ],
    [t, navigate],
  );

  return (
    <LoaderWrapper loading={thermalMonitorsQuery.isLoading}>
      <Root ref={rootRef}>
        <ToolbarRow
          title={t("management.thermalMonitors.title")}
          toolbarButtons={
            <Button
              size="small"
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate({ to: "/management/thermal-monitors/add" })}
            >
              {t("management.thermalMonitors.addNewMonitor")}
            </Button>
          }
        />
        <GenericDataGrid
          fullScreen
          apiRef={gridApiRef}
          autoHeight={false}
          rows={thermalMonitors}
          columns={columns}
          rowCount={thermalMonitorsQuery.data?.totalResults}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Root>
      <Outlet />
    </LoaderWrapper>
  );
}
