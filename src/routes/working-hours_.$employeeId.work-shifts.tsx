import { ArrowBack, Print, Save, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import AggregationsTable from "components/working-hours/aggregations-table";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import { EmployeeWorkShift } from "generated/client";
import {
  QUERY_KEYS,
  getEmployeeWorkShiftsQueryOptions,
  getListEmployeesQueryOptions,
  getListTrucksQueryOptions,
  getWorkingPeriodDates,
} from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { EmployeeWorkHoursForm, EmployeeWorkHoursFormRow } from "src/types";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/working-hours/$employeeId/work-shifts")({
  component: WorkShifts,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ];
    return { breadcrumbs };
  },
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
  const queryClient = useQueryClient();
  const [date, setDate] = useState(DateTime.now());

  const workShifts =
    useQuery(
      getEmployeeWorkShiftsQueryOptions({
        employeeId,
      }),
    ).data?.employeeWorkShifts ?? [];

  const methods = useForm<EmployeeWorkHoursForm>({
    defaultValues: [],
    values: workShifts.map<EmployeeWorkHoursFormRow>((workShift) => ({
      workShift: {
        id: workShift.id,
        date: workShift.date,
        dayOffWorkAllowance: workShift.dayOffWorkAllowance ?? false,
        absence: workShift.absence ?? "",
        perDiemAllowance: workShift.perDiemAllowance ?? "",
        approved: workShift.approved,
        notes: workShift.notes ?? "",
      },
    })),
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  // const { watch } = methods;
  // const perDiem = watch("0.startedAt");
  // console.log("startedAt", perDiem);

  const trucks = useQuery(getListTrucksQueryOptions({})).data?.trucks;
  const employees = useQuery(getListEmployeesQueryOptions({})).data?.employees;

  const getWorkingPeriodsForEmployee = () => {
    const employeeSalaryGroup = employees?.find((employee) => employee.id === employeeId)?.salaryGroup;
    if (!employeeSalaryGroup) return;
    const workinPeriodDates = getWorkingPeriodDates(employeeSalaryGroup, DateTime.now().toJSDate());
    return workinPeriodDates;
  };

  const updateWorkShift = useMutation({
    mutationFn: (employeeWorkShift: EmployeeWorkShift) =>
      api.employeeWorkShifts.updateEmployeeWorkShift({
        employeeId,
        employeeWorkShift,
        // biome-ignore lint/style/noNonNullAssertion: Workshift id is always defined
        workShiftId: employeeWorkShift.id!,
      }),
    onError: () => toast.error(t("management.employees.errorToast")),
  });

  const onChangeDate = (newDate: DateTime | null) => setDate(newDate ?? DateTime.now());

  const onSaveClick = async (formValues: EmployeeWorkHoursForm) => {
    const workShiftsToUpdate = formValues.reduce<EmployeeWorkShift[]>((list, workHoursFormRow, index) => {
      const existingWorkShift = workShifts?.find((workShift) => workShift.id === workHoursFormRow.workShift.id);
      const formFieldNames = Object.keys(workHoursFormRow.workShift) as (keyof EmployeeWorkHoursFormRow["workShift"])[];

      const isDirty = formFieldNames.some(
        (fieldName) => methods.getFieldState(`${index}.workShift.${fieldName}`)?.isDirty,
      );

      if (isDirty) {
        list.push({
          ...existingWorkShift,
          date: existingWorkShift?.date ?? new Date(),
          employeeId: employeeId,
          dayOffWorkAllowance: workHoursFormRow.workShift.dayOffWorkAllowance,
          absence: workHoursFormRow.workShift.absence || undefined,
          perDiemAllowance: workHoursFormRow.workShift.perDiemAllowance || "PARTIAL",
          approved: workHoursFormRow.workShift.approved,
          notes: workHoursFormRow.workShift.notes || undefined,
        });
      }

      return list;
    }, []);

    for (const updatedWorkShift of workShiftsToUpdate) {
      await updateWorkShift.mutateAsync(updatedWorkShift);
    }

    toast.success(t("management.employees.successToast"));

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
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

  const renderToolbar = () => {
    return (
      <Stack direction="row" justifyContent="space-between">
        <ToolbarContainer>
          <IconButton onClick={() => navigate({ to: "../.." })} title={t("tooltips.backToWorkingHours")}>
            <ArrowBack />
          </IconButton>
          {employees?.length ? (
            <TextField
              sx={{ maxWidth: 300 }}
              select
              variant="standard"
              defaultValue={employees?.find((employee) => employee.id === employeeId)?.id}
              label={t("workingHours.workingDays.employee")}
            >
              {renderEmployeeMenuItems()}
            </TextField>
          ) : (
            <Skeleton variant="rectangular" width={300} height={30} style={{ marginTop: 16 }} />
          )}
          <Stack>
            <DatePicker
              // TODO: set formatted text for date
              label={t("workingHours.workingHourBalances.payPeriod")}
              value={date}
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
            disabled={!methods.formState.isDirty}
          >
            {t("save")}
          </Button>
        </Stack>
      </Stack>
    );
  };

  const renderWorkingPeriodText = () => {
    const workingPeriods = getWorkingPeriodsForEmployee();
    if (!workingPeriods) return;
    const start = DateTime.fromJSDate(workingPeriods.start)
      .setLocale("fi") // Set locale to Finnish
      .toFormat("EEE dd.MM"); // `cc` gives the first two letters of the day in Finnish

    const end = DateTime.fromJSDate(workingPeriods.end).setLocale("fi").toFormat("EEE dd.MM");
    return (
      <Typography variant="subtitle1">
        {start} - {end}
      </Typography>
    );
  };

  return (
    <>
      <Root>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSaveClick)}>
            {renderToolbar()}
            <Paper elevation={0}>
              <Stack>
                <TableHeader>
                  {renderWorkingPeriodText()}
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
                        trucks={trucks ?? []}
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
