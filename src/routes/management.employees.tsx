import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Divider, MenuItem, Stack, TextField, Typography, styled } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { Employee, EmployeeType, Office, SalaryGroup } from "generated/client";
import { useDebounce } from "hooks/use-debounce";
import { getListEmployeesQueryOptions } from "hooks/use-queries";
import { TFunction, t } from "i18next";
import { Key, ReactNode, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Breadcrumb, LocalizedLabelKey } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

export const Route = createFileRoute("/management/employees")({
  component: ManagementEmployees,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("management.title") }, { label: t("management.employees.title") }];
    return { breadcrumbs };
  },
});

type EmployeeFilters = {
  salaryGroup: SalaryGroup | "ALL";
  employeeType: EmployeeType | "ALL";
  office: Office | "ALL";
};

// Styled root component
const Root = styled(Stack, {
  label: "management-customer-sites-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function ManagementEmployees() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [debouncedSearchTerm, _, setSearchTerm] = useDebounce("", 1000);

  const { watch, register } = useForm<EmployeeFilters>({
    mode: "onChange",
    defaultValues: {
      salaryGroup: "ALL",
      employeeType: "ALL",
      office: "ALL",
    },
  });

  const [{ page, pageSize }, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const officeFilter = watch("office");
  const salaryGroupFilter = watch("salaryGroup");
  const employeeTypeFilter = watch("employeeType");

  const employeesQuery = useQuery(
    getListEmployeesQueryOptions({
      first: pageSize * page,
      max: pageSize,
      search: debouncedSearchTerm || undefined,
      office: officeFilter === "ALL" ? undefined : officeFilter,
      salaryGroup: salaryGroupFilter === "ALL" ? undefined : salaryGroupFilter,
      type: employeeTypeFilter === "ALL" ? undefined : employeeTypeFilter,
    }),
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

  const renderSelectFilter = useCallback(
    (label: LocalizedLabelKey, key: keyof EmployeeFilters, menuItems: ReactNode) => (
      <TextField
        key={key}
        select
        defaultValue={watch(key)}
        size="small"
        variant="outlined"
        label={t(label)}
        InputProps={{
          ...register(key),
          notched: false,
          sx: { height: 32 },
        }}
      >
        {menuItems}
      </TextField>
    ),
    [t, register, watch],
  );

  const renderLeftToolbar = useCallback(
    () => (
      <Stack direction="row" gap={2} flex={1} pr={2}>
        <TextField
          onChange={({ target: { value } }) => setSearchTerm(value)}
          size="small"
          variant="outlined"
          label={t("management.employees.filters.name.label")}
          placeholder={t("management.employees.filters.name.placeholder")}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            notched: false,
            sx: { height: 32 },
          }}
        />
        {renderSelectFilter(
          "management.employees.salaryGroup",
          "salaryGroup",
          renderLocalizedMenuItems(Object.values(SalaryGroup), LocalizationUtils.getLocalizedSalaryGroup),
        )}
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
      </Stack>
    ),
    [t, renderSelectFilter, renderLocalizedMenuItems, setSearchTerm],
  );

  const columns: GridColDef<Employee>[] = useMemo(
    () => [
      {
        field: "employeeNumber",
        headerName: t("management.employees.employeeNumber"),
        align: "center",
        headerAlign: "center",
        sortable: false,
        flex: 1,
      },
      {
        field: "lastName",
        headerName: t("management.employees.lastName"),
        sortable: false,
        flex: 2,
      },
      {
        field: "firstName",
        headerName: t("management.employees.firstName"),
        sortable: false,
        flex: 2,
      },
      {
        field: "driverCardId",
        headerName: t("management.employees.driverCard"),
        align: "center",
        headerAlign: "center",
        sortable: false,
        flex: 2,
      },
      {
        field: "pinCode",
        headerName: t("management.employees.pinCode"),
        align: "center",
        headerAlign: "center",
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerName: t("management.employees.type"),
        headerAlign: "center",
        sortable: false,
        flex: 1,
      },
      {
        field: "salaryGroup",
        headerName: t("management.employees.salaryGroup"),
        headerAlign: "center",
        sortable: false,
        flex: 1,
        renderCell: ({ row: { salaryGroup } }) => LocalizationUtils.getLocalizedSalaryGroup(salaryGroup, t),
      },
      {
        field: "office",
        headerName: t("management.employees.office"),
        sortable: false,
        flex: 2,
        renderCell: ({ row: { office } }) => LocalizationUtils.getLocalizedOffice(office, t),
      },
      {
        field: "regularWorkingHours",
        headerName: t("management.employees.regularWorkingHours"),
        sortable: false,
        flex: 2,
        renderCell: ({ row: { regularWorkingHours } }) => regularWorkingHours?.toFixed(2),
      },
      {
        field: "driverCardLastEmptied",
        headerName: t("management.employees.driverCardLastEmptied"),
        sortable: false,
        flex: 2,
      },
      {
        field: "lastDriven",
        headerName: t("management.employees.lastDriven"),
        sortable: false,
        flex: 2,
        colSpan: 1,
        renderCell: () => (
          <Stack direction="row" height="100%" width="100%" justifyContent="center" alignItems="center">
            <Typography variant="body2" width="30%" textAlign="center">
              {/* TODO: Implement this, there's no valid way of getting this yet. */}
            </Typography>
            <Divider orientation="vertical" flexItem />
            <Typography variant="body2" width="70%" textAlign="center">
              {/* TODO: Implement this. At the time of writing, there's no valid way of getting this yet. */}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "actions",
        type: "actions",
        width: 66,
        colSpan: 2,
        renderHeader: () => null,
        renderCell: ({ row: { id } }) => {
          if (!id) return null;
          return (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => navigate({ to: "/management/employees/$employeeId/modify", params: { employeeId: id } })}
            >
              {t("open")}
            </Button>
          );
        },
      },
    ],
    [t, navigate],
  );

  return (
    <Root>
      <ToolbarRow
        height={80}
        title={t("management.employees.title")}
        toolbarButtons={
          <Stack justifyContent="flex-end" pb={1}>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate({ to: "/management/employees/add" })}
            >
              {t("addNew")}
            </Button>
          </Stack>
        }
        leftToolbar={renderLeftToolbar()}
      />
      <GenericDataGrid
        fullScreen={false}
        loading={employeesQuery.isFetching}
        autoHeight={false}
        columns={columns}
        columnHeaderHeight={52}
        sx={{ "& .MuiDataGrid-columnHeaderTitle": { lineHeight: "120%", whiteSpace: "normal" } }}
        rows={employeesQuery.data?.employees ?? []}
        rowCount={employeesQuery.data?.totalResults ?? 0}
        disableRowSelectionOnClick
        paginationMode="server"
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={setPaginationModel}
      />
    </Root>
  );
}
