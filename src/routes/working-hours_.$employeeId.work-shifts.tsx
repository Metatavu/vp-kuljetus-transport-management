import { ArrowBack, Print, Save, Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
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
import { BlobProvider } from "@react-pdf/renderer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import AggregationsTableForDriver from "components/working-hours/aggregations-table-driver";
import AggregationsTableForOffice from "components/working-hours/aggregations-table-office";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import WorkingHoursDocument from "components/working-hours/working-hours-document";
import { EmployeeWorkShift, SalaryGroup, WorkShiftHours, WorkType } from "generated/client";
import { QUERY_KEYS, getListEmployeesQueryOptions, getListTrucksQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Breadcrumb, EmployeeWorkHoursForm, EmployeeWorkHoursFormRow } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import TimeUtils from "src/utils/time-utils";
import WorkShiftsUtils from "src/utils/workshift-utils";
import { z } from "zod";

export const workShiftSearchSchema = z.object({
  date: z.string().datetime({ offset: true }).transform(DataValidation.parseValidDateTime),
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
  const selectedDate = Route.useSearch({ select: (search) => search.date });

  const employees = useQuery(getListEmployeesQueryOptions({ max: 100 })).data?.employees;

  const employee = useMemo(() => employees?.find((employee) => employee.id === employeeId), [employees, employeeId]);

  const employeeSalaryGroup =
    employees?.find((employee) => employee.id === employeeId)?.salaryGroup ?? SalaryGroup.Driver;

  const workingPeriodsForEmployee = TimeUtils.getWorkingPeriodDates(employeeSalaryGroup, selectedDate?.toJSDate());

  const workShiftsDataForFormRows = useQuery({
    queryKey: [QUERY_KEYS.WORK_SHIFTS, employeeId, "workShiftsData", workingPeriodsForEmployee],
    queryFn: async () => {
      const [workShifts] = await api.employeeWorkShifts.listEmployeeWorkShiftsWithHeaders({
        employeeId,
        dateAfter: workingPeriodsForEmployee?.start,
        dateBefore: workingPeriodsForEmployee?.end,
      });

      return await Promise.all(
        workShifts.map<Promise<{ workShift: EmployeeWorkShift; workShiftHours: Record<WorkType, WorkShiftHours> }>>(
          async (workShift) => {
            const [workShiftHours] = await api.workShiftHours.listWorkShiftHoursWithHeaders({
              employeeId,
              employeeWorkShiftId: workShift.id,
            });

            return {
              workShift: workShift,
              workShiftHours: WorkShiftsUtils.getWorkShiftHoursWithWorkTypes(workShiftHours),
            };
          },
        ),
      );
    },
  });

  const addMissingWorkShiftRows = (
    employeeId: string,
    formValues: EmployeeWorkHoursFormRow[],
    workingPeriod: { start: Date; end: Date },
  ): EmployeeWorkHoursFormRow[] => {
    if (!workingPeriod) return formValues;

    const allDatesInWorkingPeriod = TimeUtils.eachDayOfWorkingPeriod(workingPeriod.start, workingPeriod.end).map(
      (date) => date.toJSDate(),
    );

    const existingWorkShiftDates = formValues.map((row) =>
      DateTime.fromJSDate(row.workShift.date).startOf("day").toISODate(),
    );

    const missingRows: EmployeeWorkHoursFormRow[] = allDatesInWorkingPeriod
      .filter((date) => !existingWorkShiftDates.includes(DateTime.fromJSDate(date).toISODate()))
      .map((missingDate) => ({
        workShift: {
          id: undefined, // No ID for missing work shifts
          date: missingDate,
          dayOffWorkAllowance: false,
          absence: undefined,
          perDiemAllowance: undefined,
          approved: false,
          notes: undefined,
          startedAt: undefined,
          endedAt: undefined,
          truckIds: undefined,
          employeeId,
        } as EmployeeWorkShift,
        // Create empty work shift hours for each work type
        workShiftHours: Object.values(WorkType).reduce<Record<WorkType, WorkShiftHours>>(
          (workShiftHours, workType) => {
            workShiftHours[workType] = {
              id: undefined, // No ID for missing work shift hours
              employeeId,
              workType,
              calculatedHours: undefined,
              actualHours: undefined,
              employeeWorkShiftId: "", // No employee work shift ID for missing work shift hours
            };
            return workShiftHours;
          },
          {} as Record<WorkType, WorkShiftHours>,
        ),
      }));

    const allRows = [...formValues, ...missingRows];

    return allRows.sort(
      (a, b) => DateTime.fromJSDate(a.workShift.date).toMillis() - DateTime.fromJSDate(b.workShift.date).toMillis(),
    );
  };

  const workShiftsDataWithWorkingPeriodDates = addMissingWorkShiftRows(
    employeeId,
    workShiftsDataForFormRows.data ?? [],
    TimeUtils.getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate()),
  );

  const methods = useForm<EmployeeWorkHoursForm>({
    defaultValues: workShiftsDataWithWorkingPeriodDates,
    values: workShiftsDataWithWorkingPeriodDates,
    mode: "onChange",
  });

  const getUpdatedWorkShiftsAndWorkShiftHours = (): [
    updatedWorkShifts: EmployeeWorkShift[],
    updatedWorkShiftHours: WorkShiftHours[],
    newRows: EmployeeWorkHoursFormRow[],
  ] => {
    const workShiftsToUpdate: EmployeeWorkShift[] = [];
    const workShiftHoursToUpdate: WorkShiftHours[] = [];
    const newRows: EmployeeWorkHoursFormRow[] = [];

    const formValues = methods.getValues();

    const dirtyFormRowIndices = Object.values(formValues).reduce<number[]>((indices, _, index) => {
      if (methods.getFieldState(`${index}`).isDirty) indices.push(index);
      return indices;
    }, []);

    for (const i of dirtyFormRowIndices) {
      const row = methods.getValues(`${i}`);

      if (!row.workShift.id) {
        newRows.push(row);
        continue;
      }

      const fieldState = methods.getFieldState(`${i}.workShift`);

      if (fieldState.isDirty && fieldState.isTouched) {
        workShiftsToUpdate.push(row.workShift);
      }

      const rowWorkTypes = Object.keys(methods.getValues(`${i}.workShiftHours`)) as WorkType[];

      const dirtyWorkTypes = rowWorkTypes.filter((workType) => {
        const fieldState = methods.getFieldState(`${i}.workShiftHours.${workType}`);
        return fieldState.isDirty && fieldState.isTouched;
      });

      workShiftHoursToUpdate.push(
        ...dirtyWorkTypes.map((workType) => methods.getValues(`${i}.workShiftHours.${workType}`)),
      );
    }

    return [workShiftsToUpdate, workShiftHoursToUpdate, newRows];
  };

  const updateWorkShift = useMutation({
    mutationFn: async () => {
      const [updatedWorkShifts, updatedWorkShiftHours, newRows] = getUpdatedWorkShiftsAndWorkShiftHours();
      const newRowsWithWorkShiftIds = await Promise.all(
        newRows.map(async (row) => {
          const normalizeDateFromRow = new Date(
            DateTime.fromJSDate(row.workShift.date).toISODate() ?? DateTime.now().toISODate(),
          );
          const workShift = await api.employeeWorkShifts.createEmployeeWorkShift({
            employeeId,
            employeeWorkShift: { ...row.workShift, date: normalizeDateFromRow },
          });
          return { ...row, workShift: workShift };
        }),
      );

      const newWorkShiftHours = (
        await Promise.all(
          newRowsWithWorkShiftIds.map(async (row) =>
            api.workShiftHours.listWorkShiftHours({
              employeeId,
              employeeWorkShiftId: row.workShift.id,
            }),
          ),
        )
      ).flat();

      const newWorkShiftHoursWithUpdatedValues = newWorkShiftHours.reduce<WorkShiftHours[]>((list, hours) => {
        const matchingRow = newRowsWithWorkShiftIds.find((row) => row.workShift.id === hours.employeeWorkShiftId);
        const hoursFromRow = matchingRow?.workShiftHours[hours.workType];
        if (hoursFromRow?.actualHours !== undefined) list.push({ ...hours, actualHours: hoursFromRow.actualHours });
        return list;
      }, []);

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

      const allWorkShiftHoursToUpdate = [...updatedWorkShiftHours, ...newWorkShiftHoursWithUpdatedValues];

      await Promise.all(
        allWorkShiftHoursToUpdate.map((workShiftHours) =>
          api.workShiftHours.updateWorkShiftHours({
            // biome-ignore lint/style/noNonNullAssertion: Work shift id is always defined
            workShiftHoursId: workShiftHours.id!,
            workShiftHours: workShiftHours,
          }),
        ),
      );

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_HOURS] });

      toast.success(t("workingHours.workingHourBalances.successToast"));
    },
    onError: () => {
      toast.error(t("workingHours.workingHourBalances.errorToast"));
    },
  });

  const handleFormUnregister = async () => {
    const formRowsCount = Object.values(methods.getValues()).length;
    for (let rowNumber = 0; rowNumber < formRowsCount; rowNumber++) {
      methods.unregister(`${rowNumber}`, { keepValue: false });
    }
  };

  const onChangeDate = useCallback(
    (newDate: DateTime | null) => {
      handleFormUnregister();
      navigate({ search: (prev) => ({ ...prev, date: newDate ?? DateTime.now() }) });
    },
    [navigate, handleFormUnregister],
  );

  const disableDatesOnWorkingPeriod = (date: DateTime) => {
    const workingPeriodDates = TimeUtils.getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate());
    if (!workingPeriodDates) return false;

    const start = DateTime.fromJSDate(workingPeriodDates.start);
    const end = DateTime.fromJSDate(workingPeriodDates.end);

    const dateIsInsideWorkingPeriod = date >= start && date <= end;

    return dateIsInsideWorkingPeriod;
  };

  const renderEmployeeMenuItems = () => {
    return employees?.map((employee) => (
      <MenuItem
        onClick={() => {
          handleFormUnregister();
          navigate({
            to: "/working-hours/$employeeId/work-shifts",
            params: { employeeId: employee.id },
            search: { date: selectedDate },
          });
        }}
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
          <IconButton
            onClick={() => navigate({ to: "../..", search: { date: DateTime.now() } })}
            title={t("tooltips.backToWorkingHours")}
          >
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
                  error: false,
                },
              }}
              onChange={onChangeDate}
              shouldDisableDate={disableDatesOnWorkingPeriod}
              displayWeekNumber
              disableHighlightToday
              sx={{ width: 300 }}
            />
          </Stack>
        </ToolbarContainer>
        <Stack direction="row" alignItems="end" gap={2} p={2}>
          <BlobProvider
            document={
              <WorkingHoursDocument
                employee={employee}
                workShiftsData={workShiftsDataWithWorkingPeriodDates}
                workingPeriodsForEmployee={workingPeriodsForEmployee}
              />
            }
          >
            {({ loading, url }) => (
              <LoadingButton
                loading={loading}
                href={url ?? ""}
                target="_blank"
                size="small"
                variant="outlined"
                endIcon={<Print />}
              >
                {t("workingHours.workingDays.print")}
              </LoadingButton>
            )}
          </BlobProvider>
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

  const handleAllApprovedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isApproved = event.target.checked;
    const formValues = methods.getValues();

    const updatedFormValues = Object.values(formValues).map((row) => {
      if (row.workShift.id === undefined || row.workShift.approved === isApproved) return row;

      return {
        ...row,
        workShift: { ...row.workShift, approved: isApproved },
      };
    });
    methods.reset(updatedFormValues);
  };

  const renderWorkingPeriodText = () => {
    if (!workingPeriodsForEmployee) return null;

    const start = DateTime.fromJSDate(workingPeriodsForEmployee.start).toFormat("EEE dd.MM");
    const end = DateTime.fromJSDate(workingPeriodsForEmployee.end).toFormat("EEE dd.MM");

    return (
      <Typography variant="subtitle1">
        {t("workingHours.workingHourBalances.payPeriod")}: {start} - {end}
      </Typography>
    );
  };

  const renderAggregationsTableTitle = () => {
    if (!workingPeriodsForEmployee) return null;

    const start = DateTime.fromJSDate(workingPeriodsForEmployee.start).toFormat("dd.MM");
    const end = DateTime.fromJSDate(workingPeriodsForEmployee.end).toFormat("dd.MM");
    return (
      <TableHeader>
        <Typography variant="subtitle1">
          {t("workingHours.workingDays.aggregationsTable.title", { year: selectedDate.year, start: start, end: end })}
        </Typography>
      </TableHeader>
    );
  };

  return (
    <>
      <Root>
        <FormProvider {...methods}>
          <form
            style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
            onSubmit={methods.handleSubmit(() => updateWorkShift.mutateAsync())}
          >
            {renderToolbar()}
            <Stack sx={{ overflow: "auto" }}>
              <Paper elevation={0}>
                <Stack>
                  <TableHeader>
                    {renderWorkingPeriodText()}
                    <Stack spacing={4} direction="row" alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={handleAllApprovedChange}
                            title={t("workingHours.workingHourBalances.markAllApproved")}
                          />
                        }
                        label={t("workingHours.workingDays.table.inspected")}
                      />
                      <Box minWidth={245}>
                        <Typography variant="body2">{"Tiedot tallennettu 11.5.2021 12:00"}</Typography>
                      </Box>
                    </Stack>
                  </TableHeader>
                  <TableContainer>
                    <WorkShiftsTableHeader />
                    {workShiftsDataWithWorkingPeriodDates.map((workShiftFormRow, index) => (
                      <WorkShiftRow
                        key={`${index}_${workShiftFormRow.workShift.id}`}
                        workShiftId={workShiftFormRow.workShift.id}
                        date={selectedDate}
                        index={index}
                      />
                    ))}
                  </TableContainer>
                </Stack>
              </Paper>
              <BottomAreaContainer>
                <Paper elevation={0} sx={{ display: "flex", flex: 2 }}>
                  <Stack flex={1}>
                    <TableHeader>{renderAggregationsTableTitle()}</TableHeader>
                    {employeeSalaryGroup === SalaryGroup.Driver || employeeSalaryGroup === SalaryGroup.Vplogistics ? (
                      <AggregationsTableForDriver
                        workShiftsData={workShiftsDataForFormRows.data ?? []}
                        employee={employee ?? undefined}
                      />
                    ) : (
                      <AggregationsTableForOffice
                        workShiftsData={workShiftsDataForFormRows.data ?? []}
                        employee={employee ?? undefined}
                      />
                    )}
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
            </Stack>
          </form>
        </FormProvider>
      </Root>
      <Outlet />
    </>
  );
}

export default WorkShifts;
