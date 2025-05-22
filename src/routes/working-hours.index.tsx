import SearchIcon from "@mui/icons-material/Search";
import { Link, MenuItem, Paper, Stack, TextField, Typography, styled } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import { Employee, EmployeeType, Office, SalaryGroup, SalaryPeriodTotalWorkHours } from "generated/client";
import { useDebounce } from "hooks/use-debounce";
import { QUERY_KEYS } from "hooks/use-queries";
import { TFunction, t } from "i18next";
import { DateTime } from "luxon";
import { Key, ReactNode, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Breadcrumb, LocalizedLabelKey } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import LocalizationUtils from "src/utils/localization-utils";
import { z } from "zod";

export const workShiftSearchSchema = z.object({
  date: z.string().datetime({ offset: true }).transform(DataValidation.parseValidDateTime),
});

export const Route = createFileRoute("/working-hours/")({
  component: WorkingHours,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("workingHours.title") }];
    return { breadcrumbs };
  },
  validateSearch: workShiftSearchSchema,
});

type EmployeeFilters = {
  salaryGroup: SalaryGroup;
  employeeType: EmployeeType | "ALL";
  office: Office | "ALL";
};

// Styled root component
const Root = styled(Stack, {
  label: "working-hours-root",
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

function WorkingHours() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const [debouncedSearchTerm, _, setSearchTerm] = useDebounce("", 1000);
  const [{ page, pageSize }, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const selectedDate = Route.useSearch({ select: (search) => search.date });

  const { watch, register } = useForm<EmployeeFilters>({
    mode: "onChange",
    defaultValues: {
      salaryGroup: SalaryGroup.Driver,
      employeeType: "ALL",
      office: "ALL",
    },
  });

  const officeFilter = watch("office");
  const salaryGroupFilter = watch("salaryGroup");
  const employeeTypeFilter = watch("employeeType");

  const employeesWithAggregatedHours = useQuery({
    queryKey: [
      QUERY_KEYS.EMPLOYEES,
      QUERY_KEYS.EMPLOYEES_AGGREGATED_HOURS,
      selectedDate,
      officeFilter,
      salaryGroupFilter,
      employeeTypeFilter,
      debouncedSearchTerm,
      page,
      pageSize,
    ],
    queryFn: async () => {
      const [employees] = await api.employees.listEmployeesWithHeaders({
        first: pageSize * page,
        max: pageSize + 1,
        search: debouncedSearchTerm || undefined,
        office: officeFilter === "ALL" ? undefined : officeFilter,
        salaryGroup: salaryGroupFilter ? undefined : salaryGroupFilter,
        type: employeeTypeFilter === "ALL" ? undefined : employeeTypeFilter,
      });

      return await Promise.all(
        employees.map<Promise<{ employee: Employee; aggregatedHours: SalaryPeriodTotalWorkHours }>>(
          async (employee) => {
            const aggregatedHours = await api.employees.getSalaryPeriodTotalWorkHours({
              // biome-ignore lint/style/noNonNullAssertion: Employee ID is always present
              employeeId: employee.id!,
              dateInSalaryPeriod: selectedDate?.toJSDate(),
            });

            return {
              employee: employee,
              aggregatedHours: aggregatedHours,
            };
          },
        ),
      );
    },
  });

  const onChangeDate = useCallback(
    (newDate: DateTime | null) => navigate({ search: (prev) => ({ ...prev, date: newDate ?? DateTime.now() }) }),
    [navigate],
  );

  const columns: GridColDef[] = useMemo<GridColDef[]>(
    () => [
      {
        valueGetter: (params) => params.row.employee.employeeNumber,
        field: "employeeNumber",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.number"),
        sortable: false,
        width: 80,
        align: "center",
      },
      {
        valueGetter: (params) => `${params.row.employee.firstName} ${params.row.employee.lastName}`,
        field: "name",
        headerAlign: "left",
        headerName: t("workingHours.workingHourBalances.person"),
        sortable: false,
        width: 180,
        align: "left",
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Link
              title={t("workingHours.workingHourBalances.toWorkHourDetails")}
              onClick={() =>
                navigate({
                  to: "/working-hours/$employeeId/work-shifts",
                  params: { employeeId: params.row.id as string },
                  search: { date: selectedDate },
                })
              }
            >
              {params.row.employee.firstName} {params.row.employee.lastName}
            </Link>
          </Stack>
        ),
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.workingHours).toFixed(2),
        field: "totalWorkTime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.totalWorkTime"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        // valueGetter: (params) => Number(params.row.aggregatedHours.breaks).toFixed(2), // Not yet supported
        field: "breaks",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.breaks"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.waitingTime).toFixed(2),
        field: "waitingTime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.waitingTime"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) =>
          (Number(params.row.aggregatedHours.overTimeFull) + Number(params.row.aggregatedHours.overTimeHalf)).toFixed(
            2,
          ),
        field: "overtime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.overtime"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.eveningWork).toFixed(2),
        field: "eveningWork",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.eveningWork"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.nightWork).toFixed(2),
        field: "nightWork",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.nightWork"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        //valueGetter: (params) => Number(params.row.aggregatedHours.taskSpecificBonus).toFixed(2), // Not yet supported
        field: "taskSpecificBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.taskSpecificBonus"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        //valueGetter: (params) => Number(params.row.aggregatedHours.freezerBonus).toFixed(2), // Not yet supported
        field: "freezerBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.freezerBonus"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.holiday).toFixed(2),
        field: "holidayBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.holidayBonus"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.dayOffBonus).toFixed(2),
        field: "dayOffBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.dayOffBonus"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.sickHours).toFixed(2),
        field: "sickLeaveOrAbsent",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.sickLeaveOrAbsent"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.compensatoryLeave).toFixed(2),
        field: "pekkanens",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.pekkanens"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.vacation).toFixed(2),
        field: "vacation",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.vacation"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => Number(params.row.aggregatedHours.fillingHours).toFixed(2),
        field: "fillHours",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.fillHours"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => params.row.aggregatedHours.partialDailyAllowance,
        field: "halfDayAllowance",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.halfDayAllowance"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        valueGetter: (params) => params.row.aggregatedHours.fullDailyAllowance,
        field: "fullDayAllowance",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.fullDayAllowance"),
        sortable: false,
        flex: 1,
        align: "center",
      },
    ],
    [t, navigate, selectedDate],
  );

  const renderLocalizedMenuItem = useCallback(
    <T extends string>(value: T, labelResolver: (value: T, t: TFunction) => string) => (
      <MenuItem key={value as Key} value={value}>
        {labelResolver(value, t)}
      </MenuItem>
    ),
    [t],
  );

  const renderLocalizedMenuItems = useCallback(
    <T extends string>(items: string[], labelResolver: (value: T, t: TFunction) => string) => [
      <MenuItem value="ALL">{t("all")}</MenuItem>,
      ...items.map((item) => renderLocalizedMenuItem(item as T, labelResolver)),
    ],
    [t, renderLocalizedMenuItem],
  );

  const renderLocalizedSalaryGroupOptions = useCallback(
    <T extends string>(items: string[], labelResolver: (value: T, t: TFunction) => string) =>
      items.map((item) => renderLocalizedMenuItem(item as T, labelResolver)),
    [renderLocalizedMenuItem],
  );

  const renderSelectFilter = useCallback(
    (label: LocalizedLabelKey, key: keyof EmployeeFilters, menuItems: ReactNode) => (
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

  const renderFilters = () => {
    return (
      <FilterContainer>
        {renderSelectFilter(
          "management.employees.salaryGroup",
          "salaryGroup",
          renderLocalizedSalaryGroupOptions(Object.values(SalaryGroup), LocalizationUtils.getLocalizedSalaryGroup),
        )}
        <Stack>
          <DatePicker
            label={t("workingHours.workingHourBalances.payPeriod")}
            value={selectedDate}
            slotProps={{
              openPickerButton: { size: "small", title: t("openCalendar") },
              textField: {
                size: "small",
                InputProps: { sx: { width: 300 } },
              },
            }}
            onChange={onChangeDate}
            sx={{ width: 300 }}
          />
        </Stack>
        {renderSelectFilter(
          "management.employees.type",
          "employeeType",
          renderLocalizedMenuItems(Object.values(EmployeeType), LocalizationUtils.getLocalizedEmployeeType),
        )}
        {renderSelectFilter(
          "management.employees.office",
          "office",
          renderLocalizedMenuItems(Object.values(Office), LocalizationUtils.getLocalizedOffice),
        )}
        <TextField
          id="searchEmployee"
          onChange={({ target: { value } }) => setSearchTerm(value)}
          variant="standard"
          label={t("workingHours.workingHourBalances.nameSearch")}
          placeholder={t("workingHours.workingHourBalances.searchByName")}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </FilterContainer>
    );
  };

  return (
    <Root>
      {renderFilters()}
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack flexDirection="row" alignItems="center" gap={4} p={(theme) => theme.spacing(1, 2)}>
          {/* <Typography variant="h6">{"Su 28.4. 00:00 - La 11.5. 24:00"}</Typography> */}
          <Typography variant="subtitle2">
            {t("workingHours.workingHourBalances.uncheckedCount", { count: 2 })}
          </Typography>
        </Stack>
        <Stack flex={1} sx={{ flex: 1, overflowY: "auto" }}>
          <GenericDataGrid
            fullScreen
            autoHeight={false}
            columns={columns}
            pagination
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnSelector
            loading={employeesWithAggregatedHours.isFetching}
            rows={employeesWithAggregatedHours.data ?? []}
            rowCount={employeesWithAggregatedHours.data?.length ?? 0}
            getRowId={(row) => row.employee.id}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={setPaginationModel}
          />
        </Stack>
      </Paper>
    </Root>
  );
}
