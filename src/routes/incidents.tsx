import { MenuItem, Paper, Stack, styled, TextField } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { ThermalMonitorIncident } from "generated/client";
import { getListIncidentsQueryOptions, getListThermalMonitorsQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Breadcrumb, LocalizedLabelKey } from "src/types";

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
  },
}));

// Styled filter container component
const FilterContainer = styled(Stack, {
  label: "working-hours-filters",
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
  monitor: string
}

const Incidents = () => {
  const monitorsQuery = useQuery(getListThermalMonitorsQueryOptions({}));

  const { watch, register } = useForm<IncidentFilters>({
    mode: "onChange",
    defaultValues: {
      monitor: "ALL"
    },
  });

  const monitorFilter = watch("monitor");
  const [{ page, pageSize }, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const incidentsQuery = useQuery(getListIncidentsQueryOptions({
    monitorId: monitorFilter == "ALL" ? undefined : monitorFilter
  }));

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

  const renderFilters = () => useMemo(() => {
    return (
      <FilterContainer>
        {renderSelectFilter(
          "incidents.filters.monitor",
          "monitor",
          thermalMonitorOptions(),
        )}
      </FilterContainer>
    );
  }, [monitorsQuery.data?.thermalMonitors]);

  const columns = (): GridColDef<ThermalMonitorIncident>[] => [
    {
        valueGetter: (params) => params.row.monitorId,
        field: "monitorId",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.number"),
        sortable: false,
        width: 80,
        align: "center",
      }
  ]

  return (
    <Root>
      { renderFilters() }
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Stack sx={{ flex: 1, overflowY: "auto" }}>
          <GenericDataGrid
            fullScreen
            autoHeight={false}
            columns={columns()}
            pagination
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnSelector
            loading={incidentsQuery.isFetching}
            rowCount={incidentsQuery.data?.totalResults ?? 0}
            rows={incidentsQuery.data?.incidents || []}
            getRowId={(row) => row.id}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={setPaginationModel}
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