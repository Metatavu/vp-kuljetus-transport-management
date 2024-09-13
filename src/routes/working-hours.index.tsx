import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { Paper, Stack, styled, TextField, Typography } from "@mui/material";
import GenericDataGrid from "components/generic/generic-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/working-hours/")({
  component: WorkingHours,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["workingHours.title", "workingHours.workingHourBalances.title"],
  }),
});

// Styled root component
const Root = styled(Stack, {
  label: "management-equipment-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.default,
  flexDirection: "column",
}));

function WorkingHours() {
  const { t } = useTranslation();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "person",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.person"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        field: "number",
        headerAlign: "center",
        headerName: t("management.equipment.licensePlate"),
        sortable: false,
        flex: 1,
        align: "center",
      },
      {
        field: "totalWorkTime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.totalWorkTime"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "breaks",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.breaks"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "waitingTime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.waitingTime"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "overtime",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.overtime"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "eveningWork",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.eveningWork"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "nightWork",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.nightWork"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "taskSpecificBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.taskSpecificBonus"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "freezerBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.freezerBonus"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "holidayBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.holidayBonus"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "dayOffBonus",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.dayOffBonus"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "sickLeaveOrAbsent",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.sickLeaveOrAbsent"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "pekkanens",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.pekkanens"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "vacation",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.vacation"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "fillHours",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.fillHours"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "halfDayAllowance",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.halfDayAllowance"),
        sortable: false,
        flex: 1,
        align: "center"
      },
      {
        field: "fullDayAllowance",
        headerAlign: "center",
        headerName: t("workingHours.workingHourBalances.fullDayAllowance"),
        sortable: false,
        flex: 1,
        align: "center"
      }
    ],
    [t],
  );

  const renderFilters = () => {
    return (
      <Stack direction="row" gap={2} p={2}>
        <TextField
          select
          variant="standard"
          label={t("workingHours.workingHourBalances.salaryGroup")}
        />
        <TextField
          select
          variant="standard"
          label={t("workingHours.workingHourBalances.payPeriod")}
        />
        <TextField
          select
          variant="standard"
          label={t("workingHours.workingHourBalances.workLocation")}
        />
        <TextField
          variant="standard"
          label={t("workingHours.workingHourBalances.nameSearch")}
          placeholder={t("workingHours.workingHourBalances.searchByName")}
        />
      </Stack>
    );
  };

  return (
    <Root>
      {renderFilters()}
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" spacing={2} p={2} alignItems="center">
          <Typography variant="h6">Su 28.4. 00:00 - La 11.5. 24:00</Typography>
          <Typography variant="subtitle1">{t("workingHours.workingHourBalances.uncheckedCount", { count: 2 })}</Typography>
        </Stack>
        <Stack flex={1} sx={{ flex: 1, overflowY: "auto" }}>
          <GenericDataGrid
            fullScreen
            autoHeight={false}
            rows={[]}
            columns={columns}
            pagination
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnSelector
            loading={false}
            paginationMode="server"
            pageSizeOptions={[25, 50, 100]}
          />
        </Stack>
      </Paper>
    </Root>
  );
}
