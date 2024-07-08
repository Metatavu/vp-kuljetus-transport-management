import { Add, Search } from "@mui/icons-material";
import { Button, Stack, styled, TextField } from "@mui/material";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { theme } from "src/theme";
import { LocalizedLabelKey } from "src/types";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/management/employees")({
  component: ManagementEmployees,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.employees.title"],
  }),
});

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

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const renderSelectFilter = useCallback(
    (label: LocalizedLabelKey, renderMenuItems: () => ReactNode) => (
      <TextField
        select
        sx={{ width: 200 }}
        size="small"
        variant="outlined"
        label={t(label)}
        InputProps={{ notched: false, sx: { height: 32 } }}
      >
        {renderMenuItems()}
      </TextField>
    ),
    [t],
  );

  const renderLeftToolbar = useCallback(
    () => (
      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          sx={{ width: 200 }}
          variant="outlined"
          label={t("management.employees.filters.name.label")}
          placeholder={t("management.employees.filters.name.placeholder")}
          InputProps={{
            startAdornment: <Search sx={{ marginRight: theme.spacing(1) }} />,
            notched: false,
            sx: { height: 32 },
          }}
        />
        {renderSelectFilter("management.employees.salaryGroup", () => (
          <></>
        ))}
        {renderSelectFilter("management.employees.type", () => (
          <></>
        ))}
        {renderSelectFilter("management.employees.office", () => (
          <></>
        ))}
      </Stack>
    ),
    [t, renderSelectFilter],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "employeeNumber",
        headerName: t("management.employees.employeeNumber"),
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
        sortable: false,
        flex: 2,
      },
      {
        field: "pinCode",
        headerName: t("management.employees.pinCode"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerName: t("management.employees.type"),
        sortable: false,
        flex: 1,
      },
      {
        field: "salaryGroup",
        headerName: t("management.employees.salaryGroup"),
        sortable: false,
        flex: 1,
      },
      {
        field: "office",
        headerName: t("management.employees.office"),
        sortable: false,
        flex: 2,
      },
      {
        field: "workHours",
        headerName: t("management.employees.workHours"),
        sortable: false,
        flex: 2,
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
      },
      {
        field: "actions",
        type: "actions",
        width: 66,
        renderHeader: () => null,
        renderCell: () => (
          <Button variant="text" color="primary" size="small">
            {t("open")}
          </Button>
        ),
      },
    ],
    [t],
  );

  return (
    <LoaderWrapper loading={false}>
      <Root>
        <ToolbarRow
          height={62}
          titleFirst
          title={t("management.employees.title")}
          toolbarButtons={
            <Button
              size="small"
              variant="contained"
              sx={{ height: 26 }}
              startIcon={<Add />}
              onClick={() => navigate({ to: "/management/employees/add-employee" })}
            >
              {t("addNew")}
            </Button>
          }
          leftToolbar={renderLeftToolbar()}
        />
        <GenericDataGrid
          fullScreen
          autoHeight={false}
          columns={columns}
          rows={[]}
          disableRowSelectionOnClick
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Root>
    </LoaderWrapper>
  );
}
