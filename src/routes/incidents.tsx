import { HorizontalRule } from "@mui/icons-material";
import { MenuItem, Paper, Stack, styled, TextField } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { TerminalThermometer, ThermalMonitorIncidentStatus, TruckOrTowableThermometer } from "generated/client";
import { getListIncidentsQueryOptions, getListTerminalThermometersQueryOptions, getListThermalMonitorsQueryOptions, getListTruckOrTowableThermometersQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { theme } from "src/theme";
import { Breadcrumb, LocalizedLabelKey } from "src/types";
import { usePaginationToFirstAndMax } from "src/utils/server-side-pagination-utils";

// Styled root component
const Root = styled(Stack, {
  label: "incidents-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  flexDirection: "column",
  gap: theme.spacing(2),
  // Default padding for smaller screens
  padding: 0,
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(1800)]: {
    padding: theme.spacing(2),
  }
}));

// Styled filter container component
const FilterContainer = styled(Stack, {
  label: "incident-filters",
})(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  maxWidth: 1440,
  gap: theme.spacing(2),
  // Default padding for smaller screens
  padding: theme.spacing(2),
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(1800)]: {
    padding: theme.spacing(0),
  },
}));

interface IncidentFilters {
  monitor: string;
  thermometer: string;
  status: string;
  triggeredBefore?: string;
  triggeredAfter?: string;
}

interface IncidentRow {
  thermalMonitorName: String;
  thermometerName: String;
  status: ThermalMonitorIncidentStatus;
  temperature: String | Number;
  id: string;
  incidentTime: string;
}

const Incidents = () => {
  const monitorsQuery = useQuery(getListThermalMonitorsQueryOptions({}));
  const terminalThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({}));
  const vehicleThermometersQuery = useQuery(getListTruckOrTowableThermometersQueryOptions({}));

  const { watch, register, control } = useForm<IncidentFilters>({
    mode: "onChange",
    defaultValues: {
      monitor: "ALL",
      thermometer: "ALL",
      status: "ALL"
    },
  });

  const monitorFilter = watch("monitor");
  const thermometerFilter = watch("thermometer");
  const triggeredBeforeFilter = watch("triggeredBefore");
  const triggeredAfterFilter = watch("triggeredAfter");
  const statusFilter = watch("status");
  const [{ page, pageSize }, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [first, max] = usePaginationToFirstAndMax({ page, pageSize });
  
  const incidentsQuery = useQuery(getListIncidentsQueryOptions({
    monitorId: monitorFilter == "ALL" ? undefined : monitorFilter,
    thermometerId: thermometerFilter == "ALL" ? undefined : thermometerFilter,
    incidentStatus: statusFilter == "ALL" ? undefined : statusFilter as ThermalMonitorIncidentStatus,
    before: triggeredBeforeFilter === undefined ? undefined : DateTime.fromISO(triggeredBeforeFilter).endOf("day").toJSDate(),
    after: triggeredAfterFilter === undefined ? undefined : DateTime.fromISO(triggeredAfterFilter).startOf("day").toJSDate(),
    max: max,
    first: first
  }));

  const statusOptions = () => {
    const options = [
      {
        "value": "TRIGGERED",
        "text": t("incidents.status.triggered")
      },
      {
        "value": "ACKNOWLEDGED",
        "text": t("incidents.status.acknowledged")
      },
      {
        "value": "RESOLVED",
        "text": t("incidents.status.resolved")
      },
    ]

    return [
      <MenuItem key="ALL" value="ALL">
        {t("all")}
      </MenuItem>,
      ...options.map(item => <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>)
    ]
  }

  const thermalMonitorOptions = () => {
    const monitors = monitorsQuery.data?.thermalMonitors.map(thermalMonitor => {
      const id: string = thermalMonitor.id!!;
      if (thermalMonitor.name.length > 0) {
        return {name: thermalMonitor.name, id: id };
      } else {
         return {name: id, id: id }
      }
    }) || []; 
    return [
       <MenuItem key="ALL" value="ALL">
        {t("all")}
      </MenuItem>,
      ...monitors.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
    ]
  }

  const thermometerOptions = () => {
    const thermometers =  ( [] as (TerminalThermometer | TruckOrTowableThermometer)[]).concat(terminalThermometersQuery.data || []).concat(vehicleThermometersQuery.data || []).map(thermalMonitor => {
      const id: string = thermalMonitor.id!!;
      if (thermalMonitor.name && thermalMonitor.name.length > 0) {
        return {name: thermalMonitor.name, id: id };
      } else {
         return {name: id, id: id }
      }
    }); 
    return [
       <MenuItem key="ALL" value="ALL">
        {t("all")}
      </MenuItem>,
      ...thermometers.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
    ]
  }


  const renderSelectFilter = useCallback(
    (label: LocalizedLabelKey, key: keyof IncidentFilters, menuItems: ReactNode) => (
      <TextField
        key={key}
        select
        defaultValue={watch(key)}
        variant="standard"
        label={t(label)}
        InputProps={{
          ...register(key),
        }}
      >
        {menuItems}
      </TextField>
    ),
    [t, register, watch],
  );

  const renderDateFilter = useCallback((label: LocalizedLabelKey | undefined, key: keyof IncidentFilters) => (
    <Stack>
      <Controller
        name={key}
        control={control}
        render={({ field }) => (
          <DatePicker
            label={label ? t(label) : <span style={{ visibility: "hidden" }}>placeholder</span>}
            value={field.value || null}
            onChange={(date) => field.onChange(date)}
            slotProps={{
              openPickerButton: { size: "small", title: t("openCalendar") },
              textField: {
                size: "small",
                InputProps: {
                  sx: { width: 300, backgroundColor: "white" },
                },
              },
            }}
            sx={{ width: 300 }}
          />
        )}
    />
    </Stack>
  ), [t, register, watch]);

  const renderFilters = () => useMemo(() => {
    return (
      <FilterContainer>
        {renderSelectFilter(
          "incidents.filters.monitor",
          "monitor",
          thermalMonitorOptions(),
        )}
        {renderSelectFilter(
          "incidents.filters.thermometer",
          "thermometer",
          thermometerOptions(),
        )}
        {renderSelectFilter(
            "incidents.filters.status",
            "status",
            statusOptions()
          )
        }
        {
          renderDateFilter(
            "incidents.filters.timePeriod",
            "triggeredAfter"
          )
        }
        <span style={{ marginTop: 23 }}>
          <HorizontalRule htmlColor="grey"/>
        </span>
        {
          renderDateFilter(
            undefined,
            "triggeredBefore"
          )
        }
      </FilterContainer>
    );
  }, [monitorsQuery.data, terminalThermometersQuery.data, vehicleThermometersQuery.data]);

  const formattedDateString = (date: Date): string => {
    const dateString = date.toLocaleString("fi-FI", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });

    const timeString = date.toLocaleString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `${dateString} ${timeString}`;
  }

  const incidentRows = useMemo<IncidentRow[]>(() => {
    const incidents = incidentsQuery.data?.incidents || [];
    return incidents.map<IncidentRow>(incident => ({
      thermalMonitorName: monitorsQuery.data?.thermalMonitors.find(monitor => monitor.id == incident.monitorId)?.name || incident.monitorId!!,
      thermometerName: terminalThermometersQuery.data?.find(thermometer => thermometer.id == incident.thermometerId)?.name ||
      vehicleThermometersQuery.data?.find(thermometer => thermometer.id == incident.thermometerId)?.name || incident.thermometerId!!,
      status: incident.status!!,
      temperature: incident.temperature || t("incidents.lostConnectionToSensor"),
      id: incident.id!!,
      incidentTime: incident.timestamp ? formattedDateString(incident.timestamp) : ""
    }));
  }, [incidentsQuery.data]);

  const getLocalizedIncidentStatus = (incident: ThermalMonitorIncidentStatus) => {
    switch (incident) {
      case "TRIGGERED":
        return t("incidents.status.triggered");
      case "ACKNOWLEDGED":
        return t("incidents.status.acknowledged");
      case "RESOLVED":
        return t("incidents.status.resolved");
    }
  }

  const columns = useMemo((): GridColDef<IncidentRow>[] => [
    {
        valueGetter: (params) => params.row.thermalMonitorName,
        field: "thermalMonitorName",
        headerAlign: "left",
        headerName: t("incidents.columns.monitor"),
        sortable: false,
        align: "left",
        flex: 1
    },
    {
        valueGetter: (params) => params.row.thermometerName,
        field: "thermometerName",
        headerAlign: "left",
        headerName: t("incidents.columns.thermometer"),
        sortable: false,
        align: "left",
        flex: 1
    },
    {
      valueGetter: (params) => getLocalizedIncidentStatus(params.row.status),
      field: "status",
      headerAlign: "left",
      headerName: t("incidents.columns.status"),
      sortable: false,
      align: "left",
      flex: 1,
      cellClassName: (params) => params.row.status
    },
    {
      valueGetter: (params) => params.row.temperature,
      field: "temperature",
      headerAlign: "left",
      headerName: t("incidents.columns.temperature"),
      sortable: false,
      align: "left",
      flex: 1
    },
    {
      valueGetter: (params) => params.row.incidentTime,
      field: "time",
      headerAlign: "left",
      headerName: t("incidents.columns.time"),
      sortable: false,
      align: "left",
      flex: 1
    },
  ], [t]);

  return (
    <Root>
      { renderFilters() }
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Stack sx={{ flex: 1, overflowY: "auto" }}>
          <GenericDataGrid
            fullScreen
            autoHeight={false}
            columns={columns}
            pagination
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnSelector
            loading={incidentsQuery.isFetching}
            rowCount={incidentsQuery.data?.totalResults ?? 0}
            rows={incidentRows}
            getRowId={(row) => row.id}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={setPaginationModel}
            sx={{
              [".TRIGGERED"]: {
                color: theme.palette.error.main
              },
              [".RESOLVED"]: {
                color: theme.palette.success.main
              }
            }}
          />
        </Stack>
      </Paper>
    </Root>
  );
}

export const Route = createFileRoute("/incidents")({
  component: Incidents,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("incidents.title") }];
    return { breadcrumbs };
  }
});