import { ArrowBack, Print, Save, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deepEqual } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import AggregationsTable from "components/working-hours/aggregations-table";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import { EmployeeWorkShift } from "generated/client";
import { useApi } from "hooks/use-api";
import {
  QUERY_KEYS,
  getWorkingPeriodDates,
  useEmployeeWorkShifts,
  useListEmployees,
  useTrucks,
} from "hooks/use-queries";
import { DateTime } from "luxon";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/working-hours/$employeeId/work-shifts")({
  component: WorkShifts,
  staticData: { breadcrumbs: ["workingHours.title", "workingHours.workingDays.title"] },
});

// Styled root component
const Root = styled(Stack, {
  label: "working-days-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  flexDirection: "column",
  // Default padding for smaller screens
  padding: 0,
  // Apply padding for larger screens using breakpoints
  [theme.breakpoints.up(2100)]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
}));

// Styled toolbar container component
const ToolbarContainer = styled(Stack, {
  label: "working-days-toolbar-container",
})(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
  flexDirection: "row",
  flex: 1,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up(1800)]: {
    paddingBottom: theme.spacing(2),
  },
}));

// Styled toolbar container component
const BottomAreaContainer = styled(Stack, {
  label: "working-days-bottom-area-container",
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  gap: theme.spacing(2),
  // Default stack direction for smaller screens
  flexDirection: "column",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  // Stack direction row for larger screens
  [theme.breakpoints.up(2200)]: {
    flexDirection: "row",
    paddingRight: 0,
    paddingLeft: 0,
  },
}));

// Styled table header component
const TableHeader = styled(Stack, {
  label: "working-days-table-header",
})(({ theme }) => ({
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1, 2),
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

// Styled table container
const TableContainer = styled(Stack, {
  label: "work-shifts-table-container",
})(({ theme }) => ({
  backgroundColor: "#EDF3F5",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

function WorkShifts() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { employeeId } = Route.useParams();
  const { employeeWorkShiftsApi } = useApi();
  const queryClient = useQueryClient();
  const methods = useForm<EmployeeWorkShift[]>({
    defaultValues: [
      {
        perDiemAllowance: undefined,
        startedAt: DateTime.now().toJSDate(),
        absence: undefined,
        approved: false,
        notes: undefined,
      },
    ],
    mode: "onChange",
  });

  // const { watch } = methods;
  // const perDiem = watch("0.startedAt");
  // console.log("startedAt", perDiem);

  const workShifts = useEmployeeWorkShifts({ employeeId }).data?.employeeWorkShifts;
  const trucks = useTrucks().data;
  const employees = useListEmployees().data?.employees;
  const getWorkingPeriodsForEmployee = () => {
    const employeeSalaryGroup = employees?.find((employee) => employee.id === employeeId)?.salaryGroup;
    if (!employeeSalaryGroup) return;
    const workinPeriodDates = getWorkingPeriodDates(employeeSalaryGroup, DateTime.now().toJSDate());
    return workinPeriodDates;
  };

  const updateWorkShift = useMutation({
    mutationFn: (employeeWorkShift: EmployeeWorkShift) =>
      employeeWorkShiftsApi.updateEmployeeWorkShift({
        employeeId,
        employeeWorkShift,
        // biome-ignore lint/style/noNonNullAssertion: Workshift id is always defined
        workShiftId: employeeWorkShift.id!,
      }),
    onSuccess: () => {
      toast.success(t("management.employees.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
    },
    onError: () => toast.error(t("management.employees.errorToast")),
  });

  const onSaveClick = (updatedWorkShifts: EmployeeWorkShift[]) => {
    if (!workShifts) return;
    Object.values(updatedWorkShifts).map((workShift) => {
      const originalWorkShift: EmployeeWorkShift = workShifts.find((ws) => ws.id === workShift.id) ?? workShift;
      // Merge original workshift with updated workshift without undefined values
      const newWorkShift = { ...originalWorkShift, ...workShift };
      console.log("Original Workshift", JSON.stringify(originalWorkShift));
      console.log("New Workshift", JSON.stringify(newWorkShift));
      if (!deepEqual(originalWorkShift, newWorkShift)) {
        //updateWorkShift.mutateAsync(workShift);
        console.log("Updated Workshift found", newWorkShift);
      }
    });
  };

  const renderEmployeeMenuItems = () => {
    return employees?.map((employee) => (
      <MenuItem
        onClick={() =>
          navigate({
            to: "/working-hours/$employeeId/work-shifts",
            params: { employeeId: employee.id },
          })
        }
        key={employee.id}
        value={employee.id}
      >
        {employee.firstName} {employee.lastName}
      </MenuItem>
    ));
  };

  //TODO: Render correct pay periods for selected employee
  const renderPayPeriodMenuItems = () => {
    const workingPeriodsS = getWorkingPeriodsForEmployee();
    if (!workingPeriodsS) return;
    const payPeriods = Array.from({ length: 5 }, (_) => {
      const start = DateTime.fromJSDate(workingPeriodsS.start).minus({ weeks: 2 }).toFormat("dd.MM");
      const end = DateTime.fromJSDate(workingPeriodsS.end).minus({ weeks: 2 }).toFormat("dd.MM");
      return { start, end };
    });
    return payPeriods.map((workingPeriods) => (
      <MenuItem key={workingPeriods.start}>
        {workingPeriods.start} - {workingPeriods.end}
      </MenuItem>
    ));
  };

  const renderToolbar = () => {
    return (
      <Stack direction="row" justifyContent="space-between">
        <ToolbarContainer>
          <IconButton onClick={() => navigate({ to: "../.." })} title={t("tooltips.backToWorkingHours")}>
            <ArrowBack />
          </IconButton>
          <TextField
            sx={{ maxWidth: 300 }}
            select
            variant="standard"
            defaultValue={employees?.find((employee) => employee.id === employeeId)?.id}
            label={t("workingHours.workingDays.employee")}
          >
            {renderEmployeeMenuItems()}
          </TextField>
          <TextField
            sx={{ maxWidth: 300 }}
            select
            defaultValue=""
            variant="standard"
            label={t("workingHours.workingHourBalances.payPeriod")}
          >
            {renderPayPeriodMenuItems()}
          </TextField>
        </ToolbarContainer>
        <Stack direction="row" alignItems="end" gap={2} p={2}>
          <Button size="small" variant="outlined" endIcon={<Print />}>
            {t("workingHours.workingDays.print")}
          </Button>
          <Button size="small" variant="contained" disabled={true} endIcon={<Send />}>
            {t("workingHours.workingDays.sendToPayroll")}
          </Button>
          <Button
            size="small"
            variant="contained"
            endIcon={<Save />}
            type="submit"

            //disabled={!!Object.keys(errors).length}
          >
            {t("save")}
          </Button>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      <Root>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSaveClick)}>
            {renderToolbar()}
            <Paper elevation={0}>
              <Stack>
                <TableHeader>
                  <Typography variant="subtitle1">{"Su 28.4. 00.00 - La 11.5. 24:00"}</Typography>
                  <Stack spacing={4} direction="row" alignItems="center">
                    <FormControlLabel
                      control={<Checkbox title="Merkitse kaikki tarkistetuiksi" />}
                      label={t("workingHours.workingDays.table.inspected")}
                    />
                    <Box minWidth={245}>
                      <Typography variant="body2">{"Tiedot tallennettu 11.5.2021 12:00"}</Typography>
                    </Box>
                  </Stack>
                </TableHeader>
                <TableContainer>
                  <WorkShiftsTableHeader />
                  {
                    // TODO: Render work days for set time period by salarygroup
                    workShifts?.map((employeeWorkShift, index) => (
                      <WorkShiftRow
                        key={`${index}_${employeeWorkShift.id}`}
                        onClick={() => navigate({ to: "work-shift-details" })}
                        workShiftData={employeeWorkShift}
                        trucks={trucks?.trucks ?? []}
                        index={index}
                      />
                    ))
                  }
                </TableContainer>
              </Stack>
            </Paper>
            <BottomAreaContainer>
              <Paper elevation={0} sx={{ display: "flex", flex: 2 }}>
                <Stack flex={1}>
                  <TableHeader>
                    <Typography variant="subtitle1">{"Selected year and date range"}</Typography>
                  </TableHeader>
                  <AggregationsTable />
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ display: "flex", flex: 1 }}>
                <Stack flex={1}>
                  <TableHeader>
                    <Typography variant="subtitle1">{t("workingHours.workingDays.changeLog.title")}</Typography>
                  </TableHeader>
                  <ChangeLog />
                </Stack>
              </Paper>
            </BottomAreaContainer>
          </form>
        </FormProvider>
      </Root>

      <Outlet />
    </>
  );
}

export default WorkShifts;
