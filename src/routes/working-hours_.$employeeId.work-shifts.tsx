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
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import AggregationsTable from "components/working-hours/aggregations-table";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import { EmployeeWorkShift, SalaryGroup, WorkShiftHours, WorkType } from "generated/client";
import {
  QUERY_KEYS,
  getEmployeeWorkShiftsQueryOptions,
  getListEmployeesQueryOptions,
  getListTrucksQueryOptions,
  getListWorkShiftHoursQueryOptions,
  getWorkingPeriodDates,
} from "hooks/use-queries";
import { t } from "i18next";
import { DateTime, Interval } from "luxon";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Breadcrumb, EmployeeWorkHoursForm, EmployeeWorkHoursFormRow } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import { z } from "zod";

export const workShiftSearchSchema = z.object({
  date: z.string().datetime({ offset: true }).transform(DataValidation.parseValidDateTime).optional(),
});

export const Route = createFileRoute("/working-hours_/$employeeId/work-shifts")({
  component: WorkShifts,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("workingHours.title") },
      { label: t("workingHours.workingDays.title") },
    ];
    return { breadcrumbs };
  },
  validateSearch: workShiftSearchSchema,
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
  const selectedDate = Route.useSearch({ select: (search) => search.date ?? DateTime.now() });

  const trucks = useQuery(getListTrucksQueryOptions({})).data?.trucks;
  const employees = useQuery(getListEmployeesQueryOptions({})).data?.employees;

  const employeeSalaryGroup =
    employees?.find((employee) => employee.id === employeeId)?.salaryGroup ?? SalaryGroup.Driver;

  const getWorkingPeriodsForEmployee = () => {
    const employeeSalaryGroup = employees?.find((employee) => employee.id === employeeId)?.salaryGroup;
    if (!employeeSalaryGroup) return;
    return getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate());
  };

  const eachDayOfInterval = (start: Date, end: Date): DateTime[] => {
    const interval = Interval.fromDateTimes(
      DateTime.fromJSDate(start).startOf("day"),
      DateTime.fromJSDate(end).endOf("day"),
    );

    // Divide the interval into days and map them
    return interval
      .splitBy({ days: 1 })
      .map((i) => i.start)
      .filter((date): date is DateTime => date !== undefined);
  };

  const workingPeriod = getWorkingPeriodsForEmployee();

  const workShifts = useQuery(
    getEmployeeWorkShiftsQueryOptions({
      employeeId,
      startedAfter: getWorkingPeriodsForEmployee()?.start,
      startedBefore: getWorkingPeriodsForEmployee()?.end,
    }),
  );

  const workShiftsData = useQueries({
    queries:
      workShifts?.data?.employeeWorkShifts.map((workShift) => ({
        ...getListWorkShiftHoursQueryOptions({ employeeWorkShiftId: workShift.id }),
        select: (data: { employeeWorkShiftHours: WorkShiftHours[]; totalResults: number }) => ({
          workShift: workShift,
          workShiftHours: data?.employeeWorkShiftHours.reduce<Record<WorkType, WorkShiftHours>>(
            (workShiftHoursRecord, singleWorkShiftHours) => {
              workShiftHoursRecord[singleWorkShiftHours.workType] = singleWorkShiftHours;
              return workShiftHoursRecord;
            },
            {} as Record<WorkType, WorkShiftHours>,
          ),
        }),
      })) ?? [],
    combine: (results) => results.filter((result) => result.isSuccess),
  });

  // //Get all dates in working period with month and day
  // const allDatesInWorkingPeriod =
  //   workingPeriod && eachDayOfInterval(workingPeriod.start, workingPeriod.end).map((date) => date.toJSDate());
  // console.log("allDatesInWorkingPeriod", allDatesInWorkingPeriod);
  // //Get all work shift dates from workShiftsData
  // //Check if all work shift dates are in the working period and add missing ones to workShiftsData
  // const workShiftDates = workShiftsData.map(({ data }) => data.workShift.startedAt);
  // console.log("workShiftDates", workShiftDates.length);
  // // change DateTime to Date from start of day
  // const missingDates =
  //   allDatesInWorkingPeriod?.filter(
  //     (date) =>
  //       !workShiftDates.find(
  //         (workShiftDate) =>
  //           workShiftDate && DateTime.fromJSDate(workShiftDate).startOf("day").toJSDate().getTime() === date.getTime(),
  //       ),
  //   ) ?? [];

  // console.log("missingDates", missingDates.length);

  const addMissingWorkShiftRows = (
    formValues: EmployeeWorkHoursFormRow[],
    workingPeriod: { start: Date; end: Date },
  ): EmployeeWorkHoursFormRow[] => {
    if (!workingPeriod) return formValues;

    const allDatesInWorkingPeriod = eachDayOfInterval(workingPeriod.start, workingPeriod.end).map((date) =>
      date.toJSDate(),
    );

    // Extract existing work shift dates from formValues
    const existingWorkShiftDates = formValues.map((row) =>
      DateTime.fromJSDate(row.workShift.date).startOf("day").toISODate(),
    );

    // Create empty rows for missing dates
    const missingRows = allDatesInWorkingPeriod
      .filter((date) => !existingWorkShiftDates.includes(DateTime.fromJSDate(date).toISODate()))
      .map((missingDate) => ({
        workShift: {
          id: undefined, // No ID for missing work shifts
          date: missingDate,
          dayOffWorkAllowance: false,
          absence: undefined,
          perDiemAllowance: undefined,
          approved: false,
          notes: "",
          startedAt: undefined,
          endedAt: undefined,
          truckIds: undefined,
          employeeId, // Ensure to set the current employee ID
        },
        workShiftHours: {} as Record<WorkType, WorkShiftHours>, // No work shift hours for missing work shifts
      }));

    // Combine existing rows with missing rows
    const allRows = [...formValues, ...missingRows];

    // Sort rows by date
    return allRows.sort(
      (a, b) => DateTime.fromJSDate(a.workShift.date).toMillis() - DateTime.fromJSDate(b.workShift.date).toMillis(),
    );
  };

  if (workingPeriod) {
    console.log(
      "workShiftsData",
      addMissingWorkShiftRows(
        workShiftsData.map<EmployeeWorkHoursFormRow>((workShiftsData) => workShiftsData.data),
        workingPeriod,
      ),
    );
  }

  const workShiftsDataWithWorkingPeriodDates = addMissingWorkShiftRows(
    workShiftsData.map<EmployeeWorkHoursFormRow>((workShiftsData) => workShiftsData.data),
    getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate()),
  );

  const methods = useForm<EmployeeWorkHoursForm>({
    defaultValues: [],
    //values: workShiftsData.map<EmployeeWorkHoursFormRow>((workShiftsData) => workShiftsData.data),
    values: workShiftsDataWithWorkingPeriodDates,
    mode: "onChange",
    disabled: workShiftsDataWithWorkingPeriodDates.length === 0,
  });

  const getUpdatedWorkShiftsAndWorkShiftHours = (): [
    updatedWorkShifts: EmployeeWorkShift[],
    updatedWorkShiftHours: WorkShiftHours[],
  ] => {
    const workShiftsToUpdate: EmployeeWorkShift[] = [];
    const workShiftHoursToUpdate: WorkShiftHours[] = [];

    const dirtyFormRows = Object.values(methods.getValues()).filter(
      (_, index) => methods.getFieldState(`${index}`).isDirty,
    );

    for (let i = 0; i < dirtyFormRows.length; i++) {
      if (methods.getFieldState(`${i}.workShift`)?.isDirty) {
        workShiftsToUpdate.push(methods.getValues(`${i}.workShift`));
      }

      const rowWorkTypes = Object.keys(methods.getValues(`${i}.workShiftHours`)) as WorkType[];

      const dirtyWorkTypes = rowWorkTypes.filter(
        (workType) => methods.getFieldState(`${i}.workShiftHours.${workType}`).isDirty,
      );

      workShiftHoursToUpdate.push(
        ...dirtyWorkTypes.map((workType) => methods.getValues(`${i}.workShiftHours.${workType}`)),
      );
    }

    return [workShiftsToUpdate, workShiftHoursToUpdate];
  };

  const updateWorkShift = useMutation({
    mutationFn: async () => {
      const [updatedWorkShifts, updatedWorkShiftHours] = getUpdatedWorkShiftsAndWorkShiftHours();

      await Promise.all(
        updatedWorkShifts.map((workShift) =>
          api.employeeWorkShifts.updateEmployeeWorkShift({
            employeeId,
            // biome-ignore lint/style/noNonNullAssertion: Work shift id is always defined
            workShiftId: workShift.id!,
            employeeWorkShift: workShift,
          }),
        ),
      );

      await Promise.all(
        updatedWorkShiftHours.map((workShiftHours) =>
          api.workShiftHours.updateWorkShiftHours({
            // biome-ignore lint/style/noNonNullAssertion: Work shift id is always defined
            workShiftHoursId: workShiftHours.id!,
            workShiftHours: workShiftHours,
          }),
        ),
      );
    },
    onError: () => toast.error(t("management.employees.errorToast")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_HOURS] });
      toast.success(t("workingHours.workingHourBalances.successToast"));
    },
  });

  const onChangeDate = (newDate: DateTime | null) =>
    navigate({ search: (prev) => ({ ...prev, date: newDate ?? DateTime.now() }) });

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
    const workingPeriodDates = getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate());
    if (!workingPeriodDates) return null;

    const start = DateTime.fromJSDate(workingPeriodDates.start).setLocale("fi").toFormat("EEE dd.MM"); // `EEE` gives the first two letters of the day in Finnish
    const end = DateTime.fromJSDate(workingPeriodDates.end).setLocale("fi").toFormat("EEE dd.MM");

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
          <form onSubmit={methods.handleSubmit(() => updateWorkShift.mutateAsync())}>
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
                  {workShiftsData.map(({ data: workShiftFormRow }, index) => (
                    <WorkShiftRow
                      key={`${index}_${workShiftFormRow.workShift.id}`}
                      onClick={() => navigate({ to: "work-shift-details" })}
                      workShiftData={workShiftFormRow}
                      trucks={trucks ?? []}
                      index={index}
                    />
                  ))}
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
