import { HorizontalRule } from "@mui/icons-material";
import { Autocomplete, Box, MenuItem, Stack, styled, TextField, type TextFieldProps } from "@mui/material";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import { type ThermalMonitorIncident, ThermalMonitorIncidentStatus } from "generated/client";
import {
  getListIncidentsQueryOptions,
  getListTerminalThermometersQueryOptions,
  getListThermalMonitorsQueryOptions,
  getListTruckOrTowableThermometersQueryOptions,
} from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { theme } from "src/theme";
import type { Breadcrumb } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import { usePaginationToFirstAndMax } from "src/utils/server-side-pagination-utils";
import { z } from "zod/v4";

const incidentSearchSchema = z.object({
  monitorId: z.uuidv4().optional(),
  thermometerId: z.uuidv4().optional(),
  status: z.enum(Object.values(ThermalMonitorIncidentStatus)).optional(),
  triggeredBefore: z.iso.datetime({ offset: true }).optional().pipe(DataValidation.validDatetimeTransform),
  triggeredAfter: z.iso.datetime({ offset: true }).optional().pipe(DataValidation.validDatetimeTransform),
});

type IncidentSearchSchema = z.infer<typeof incidentSearchSchema>;

export const Route = createFileRoute("/incidents")({
  component: Incidents,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("incidents.title") }];
    return { breadcrumbs };
  },
  validateSearch: incidentSearchSchema,
});

// Styled root component
const Root = styled(Stack, {
  label: "incidents-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: "#00414F1A",
  flexDirection: "column",
  // Default padding for smaller screens
  padding: 0,
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(1800)]: {
    padding: theme.spacing(2),
  },
}));

// Styled filter container component
const FilterContainer = styled(Stack, {
  label: "incident-filters",
})(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "end",
  maxWidth: 1440,
  gap: theme.spacing(2),
  // Default padding for smaller screens
  padding: theme.spacing(1),
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(1800)]: {
    padding: theme.spacing(0),
  },
}));

const FilterField = styled((props: Omit<TextFieldProps, "variant">) => <TextField variant="filled" {...props} />, {
  label: "incident-filter-field",
})(({ theme }) => ({
  "& .MuiFilledInput-root": {
    backgroundColor: "#fff !important",
    borderRadius: 4,
    border: "1px solid",
    borderColor: "#ddd !important",
    "&:hover": {
      backgroundColor: "#f7f7f7 !important",
    },
    "&.Mui-focused": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function Incidents() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const filters = Route.useSearch();

  const monitorsQuery = useQuery(getListThermalMonitorsQueryOptions({ first: 0, max: 10000 }));
  const terminalThermometersQuery = useQuery(
    getListTerminalThermometersQueryOptions({ first: 0, max: 10000, includeArchived: true }),
  );
  const vehicleThermometersQuery = useQuery(
    getListTruckOrTowableThermometersQueryOptions({ first: 0, max: 10000, includeArchived: true }),
  );

  const [{ page, pageSize }, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [first, max] = usePaginationToFirstAndMax({ page, pageSize });

  const incidentsQuery = useQuery(
    getListIncidentsQueryOptions({
      monitorId: filters.monitorId,
      thermometerId: filters.thermometerId,
      incidentStatus: filters.status,
      before: filters.triggeredBefore?.startOf("day").toJSDate(),
      after: filters.triggeredAfter?.startOf("day").toJSDate(),
      first: first,
      max: max,
    }),
  );

  const handleUrlFilterChange = <T extends keyof IncidentSearchSchema>(
    key: T,
    value: IncidentSearchSchema[T] | undefined,
  ) => {
    navigate({
      search: (prevSearch) => {
        const newSearch = { ...prevSearch };

        if (value === undefined || (value instanceof DateTime && !value.isValid)) {
          delete newSearch[key];
        } else {
          newSearch[key] = value;
        }

        return newSearch;
      },
    });
  };

  const thermometers = useMemo(
    () =>
      [...(terminalThermometersQuery.data ?? []), ...(vehicleThermometersQuery.data ?? [])].toSorted((a, b) =>
        (a.name ?? a.id ?? "").localeCompare(b.name ?? b.id ?? ""),
      ),
    [terminalThermometersQuery.data, vehicleThermometersQuery.data],
  );

  const monitorOptions = useMemo(() => {
    return (monitorsQuery.data?.thermalMonitors ?? []).map((monitor) => ({
      label: monitor.name || monitor.id,
      id: monitor.id,
    }));
  }, [monitorsQuery.data]);

  const selectedMonitor = useMemo(() => {
    return monitorOptions.find((option) => option.id === filters.monitorId) ?? { label: t("all"), id: "ALL" };
  }, [t, filters.monitorId, monitorOptions]);

  const thermometerOptions = useMemo(() => {
    return thermometers.map((thermometer) => ({
      label: thermometer.name || thermometer.id,
      id: thermometer.id,
    }));
  }, [thermometers]);

  const selectedThermometer = useMemo(() => {
    return thermometerOptions.find((option) => option.id === filters.thermometerId) ?? { label: t("all"), id: "ALL" };
  }, [t, filters.thermometerId, thermometerOptions]);

  const columns = useMemo(
    (): GridColDef<ThermalMonitorIncident>[] => [
      {
        field: "thermalMonitorName",
        headerAlign: "left",
        headerName: t("incidents.columns.monitor"),
        sortable: false,
        align: "left",
        flex: 1,
        valueGetter: ({ row }) =>
          monitorsQuery.data?.thermalMonitors.find((monitor) => monitor.id === row.monitorId)?.name ?? "",
      },
      {
        field: "thermometerName",
        headerAlign: "left",
        headerName: t("incidents.columns.thermometer"),
        sortable: false,
        align: "left",
        flex: 1,
        valueGetter: ({ row }) =>
          terminalThermometersQuery.data?.find((thermometer) => thermometer.id === row.thermometerId)?.name ??
          vehicleThermometersQuery.data?.find((thermometer) => thermometer.id === row.thermometerId)?.name ??
          row.thermometerId,
      },
      {
        field: "status",
        headerAlign: "left",
        headerName: t("incidents.columns.status"),
        sortable: false,
        align: "left",
        flex: 1,
        valueFormatter: ({ value }) => t(`incidents.status.${value as ThermalMonitorIncidentStatus}`),
        cellClassName: ({ row }) => row.status ?? "",
      },
      {
        field: "temperature",
        headerAlign: "left",
        headerName: t("incidents.columns.temperature"),
        sortable: false,
        align: "left",
        flex: 1,
        valueGetter: ({ row }) => row.temperature ?? t("incidents.lostConnectionToSensor"),
      },
      {
        field: "timestamp",
        headerAlign: "left",
        headerName: t("incidents.columns.time"),
        sortable: false,
        align: "left",
        flex: 1,
        valueFormatter: ({ value }) => value?.toLocaleString("fi-FI") ?? "",
      },
    ],
    [t, monitorsQuery.data, terminalThermometersQuery.data, vehicleThermometersQuery.data],
  );

  return (
    <Root>
      <FilterContainer>
        <Autocomplete
          value={selectedMonitor}
          options={monitorOptions}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, newValue) =>
            handleUrlFilterChange("monitorId", newValue?.id === "ALL" ? undefined : newValue?.id)
          }
          renderInput={(params) => <FilterField {...params} label={t("incidents.filters.monitor")} />}
        />
        <Autocomplete
          value={selectedThermometer}
          options={thermometerOptions}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, newValue) =>
            handleUrlFilterChange("thermometerId", newValue?.id === "ALL" ? undefined : newValue?.id)
          }
          renderInput={(params) => <FilterField {...params} label={t("incidents.filters.thermometer")} />}
        />
        <FilterField
          select
          label={t("incidents.filters.status")}
          value={filters.status || "ALL"}
          onChange={(event) =>
            handleUrlFilterChange(
              "status",
              event.target.value === "ALL" ? undefined : (event.target.value as ThermalMonitorIncidentStatus),
            )
          }
        >
          <MenuItem key="ALL" value="ALL">
            {t("all")}
          </MenuItem>
          {...Object.values(ThermalMonitorIncidentStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {t(`incidents.status.${status}`)}
            </MenuItem>
          ))}
        </FilterField>
        <DatePicker
          label={t("incidents.filters.timePeriod")}
          slots={{ textField: FilterField }}
          slotProps={{ openPickerButton: { sx: { padding: 0.5, marginLeft: 0, marginRight: 0.5 } } }}
          value={filters.triggeredAfter || null}
          onChange={(value: DateTime | null) => handleUrlFilterChange("triggeredAfter", value ?? undefined)}
        />
        <Box mx={-1}>
          <HorizontalRule sx={{ fontSize: 16, color: "text.disabled" }} />
        </Box>
        <DatePicker
          value={filters.triggeredBefore || null}
          slots={{ textField: FilterField }}
          slotProps={{ openPickerButton: { sx: { padding: 0.5, marginLeft: 0, marginRight: 0.5 } } }}
          onChange={(value: DateTime | null) => handleUrlFilterChange("triggeredBefore", value ?? undefined)}
        />
      </FilterContainer>
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden" bgcolor="background.paper">
        <Stack flex="1" overflow="auto">
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
            rows={incidentsQuery.data?.incidents ?? []}
            getRowId={(row) => row.id}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={setPaginationModel}
            sx={{
              ".TRIGGERED": { color: theme.palette.error.main },
              ".RESOLVED": { color: theme.palette.success.main },
            }}
          />
        </Stack>
      </Box>
    </Root>
  );
}
