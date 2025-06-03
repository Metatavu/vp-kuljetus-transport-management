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
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import AggregationsTableForDriver from "components/working-hours/aggregations-table-driver";
import AggregationsTableForOffice from "components/working-hours/aggregations-table-office";
import ChangeLog from "components/working-hours/change-log";
import WorkShiftRow from "components/working-hours/work-shift-row";
import WorkShiftsTableHeader from "components/working-hours/work-shifts-table-header";
import WorkingHoursDocument from "components/working-hours/working-hours-document";
import {
  EmployeeWorkShift,
  SalaryGroup,
  WorkEvent,
  WorkShiftChangeReason,
  WorkShiftChangeSet,
  WorkShiftHours,
  WorkType,
} from "generated/client";
import {
  QUERY_KEYS,
  getFindEmployeeAggregatedWorkHoursQueryOptions,
  getFindPayrollExportQueryOptions,
  getListEmployeesQueryOptions,
  getListWorkShiftChangeSetsQueryOptions,
} from "hooks/use-queries";
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
import { v4 as uuidv4 } from "uuid";
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
  const showConfirmDialog = useConfirmDialog();
  const { employeeId } = Route.useParams();
  const queryClient = useQueryClient();
  const selectedDate = Route.useSearch({ select: (search) => search.date });

  const employees = useQuery(getListEmployeesQueryOptions({ max: 100 })).data?.employees;

  const employee = useMemo(() => employees?.find((employee) => employee.id === employeeId), [employees, employeeId]);

  const employeeSalaryGroup =
    employees?.find((employee) => employee.id === employeeId)?.salaryGroup ?? SalaryGroup.Driver;

  const employeeAggregatedHours = useQuery({
    ...getFindEmployeeAggregatedWorkHoursQueryOptions(
      { employeeId: employeeId, dateInSalaryPeriod: selectedDate.toJSDate() },
      !!employeeId,
    ),
  });

  const workingPeriodsForEmployee = TimeUtils.getWorkingPeriodDates(employeeSalaryGroup, selectedDate?.toJSDate());

  const workShiftsDataForFormRows = useQuery({
    queryKey: [QUERY_KEYS.WORK_SHIFTS, employeeId, "workShiftsData", workingPeriodsForEmployee],
    queryFn: async () => {
      const [workShifts] = await api.employeeWorkShifts.listEmployeeWorkShiftsWithHeaders({
        employeeId,
        dateAfter: workingPeriodsForEmployee?.start,
        dateBefore: workingPeriodsForEmployee?.end,
        max: 100,
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

  const handleCreatePayrollExport = useMutation({
    mutationFn: async () => {
      if (!workShiftsDataForFormRows.data) return Promise.reject();
      const workShiftIds = workShiftsDataForFormRows.data.map((row) => row.workShift.id);
      if (!workShiftIds) return Promise.reject();
      const payrollExport = await api.payrollExports.createPayrollExport({
        payrollExport: {
          employeeId,
          workShiftIds: workShiftIds.filter((id): id is string => id !== undefined),
        },
      });
      return payrollExport;
    },
    onSuccess: () => {
      toast.success(t("workingHours.workingHourBalances.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
    },
    onError: () => {
      toast.error(t("workingHours.workingHourBalances.errorToast"));
    },
  });

  // Check if payroll export ID exists in work shifts
  const payrollExportIdExists = useMemo(() => {
    if (!workShiftsDataForFormRows.data) return false;

    return workShiftsDataForFormRows.data.some((row) => row.workShift?.payrollExportId != null);
  }, [workShiftsDataForFormRows.data]);

  const foundPayrollExportData = useQuery({
    ...getFindPayrollExportQueryOptions(workShiftsDataForFormRows.data?.[0]?.workShift?.payrollExportId ?? ""),
    enabled: payrollExportIdExists,
  });

  const workShiftChangeSets = useQuery(
    getListWorkShiftChangeSetsQueryOptions({
      employeeId: employeeId,
      workShiftDateAfter: workingPeriodsForEmployee.start,
      workShiftDateBefore: workingPeriodsForEmployee.end,
    }),
  );

  // Get every work event id from the work shift change set entries where the reason is WorkeventUpdatedType
  const workEventIds = useMemo(() => {
    if (!workShiftChangeSets.data) return [];

    const workEventIds = workShiftChangeSets.data.workShiftChangeSets
      .filter((changeSet) =>
        changeSet.entries?.some((entry) => entry.reason === WorkShiftChangeReason.WorkeventUpdatedType),
      )
      .flatMap((changeSet) => changeSet.entries?.map((entry) => entry.workEventId))
      .filter((id): id is string => id !== undefined);

    return workEventIds;
  }, [workShiftChangeSets.data]);

  // Fetch work events based on the work event ids
  const workEvents = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS, employeeId],
    queryFn: async () => {
      if (workEventIds.length === 0) return [];

      return await Promise.all(
        workEventIds.map<Promise<{ workEvent: WorkEvent }>>(async (workEventId) => {
          const workEvent = await api.workEvents.findEmployeeWorkEvent({
            employeeId,
            workEventId,
          });
          return { workEvent };
        }),
      );
    },
    enabled: workEventIds.length > 0,
  }).data?.map((workEvent) => workEvent.workEvent);

  // Get latest change set made by the user
  const getLatestChangeSetDateAndTime = useMemo(() => {
    if (!workShiftChangeSets.data) return "-";

    const changeSets = workShiftChangeSets.data.workShiftChangeSets;
    if (changeSets.length === 0) return "-";

    // Sort change sets by createdAt in descending order
    changeSets.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) {
        return 0;
      }
      const dateA = DateTime.fromJSDate(a.createdAt);
      const dateB = DateTime.fromJSDate(b.createdAt);
      return dateB.toMillis() - dateA.toMillis();
    });

    return changeSets[0].createdAt ? DateTime.fromJSDate(changeSets[0].createdAt).toFormat("dd.MM.yyyy HH:mm") : "-";
  }, [workShiftChangeSets.data]);

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
          costCentersFromEvents: [],
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

  const workShiftChangeSetsInWorkShifts = useMemo(() => {
    if (!workShiftChangeSets.data) return [];
    const workShiftChangeSetsWithWorkShifts: Record<string, WorkShiftChangeSet[]> = {};

    for (const changeSet of workShiftChangeSets.data.workShiftChangeSets) {
      const workShiftId = changeSet.entries?.[0]?.workShiftId;
      if (workShiftId) {
        if (!workShiftChangeSetsWithWorkShifts[workShiftId]) {
          workShiftChangeSetsWithWorkShifts[workShiftId] = [];
        }
        workShiftChangeSetsWithWorkShifts[workShiftId].push(changeSet);
      }
    }
    return Object.entries(workShiftChangeSetsWithWorkShifts).map(([workShiftId, changeSets]) => ({
      workShiftId,
      changeSets,
    }));
  }, [workShiftChangeSets.data]);

  const updateWorkShift = useMutation({
    mutationFn: async () => {
      const [updatedWorkShifts, updatedWorkShiftHours, newRows] = getUpdatedWorkShiftsAndWorkShiftHours();

      // Prepare consistent keys for all shifts (ID or fallback to date)
      const allWorkShifts = [...updatedWorkShifts, ...newRows.map((row) => row.workShift)];

      // Add any work shifts referenced by updatedWorkShiftHours (in case not already included)
      const additionalWorkShiftIds = updatedWorkShiftHours.map((h) => h.employeeWorkShiftId);
      const additionalWorkShifts = workShiftsDataWithWorkingPeriodDates
        .map((row) => row.workShift)
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        .filter((ws) => additionalWorkShiftIds.includes(ws.id!))
        .filter((ws) => !allWorkShifts.find((existing) => existing.id === ws.id));

      const fullWorkShiftList = [...allWorkShifts, ...additionalWorkShifts];

      // Create and store consistent changeSetIds for each shift
      const newWorkShiftChangeSet = new Map<string, string>();
      for (const workShift of fullWorkShiftList) {
        const key = workShift.id ?? workShift.date.toISOString();
        if (!newWorkShiftChangeSet.has(key)) {
          newWorkShiftChangeSet.set(key, uuidv4());
        }
      }

      // Create new work shifts
      const newRowsWithWorkShiftIds = await Promise.all(
        newRows.map(async (row) => {
          const normalizedDate = new Date(
            DateTime.fromJSDate(row.workShift.date).toISODate() ?? DateTime.now().toISODate(),
          );

          const fallbackKey = row.workShift.id ?? row.workShift.date.toISOString();
          const changeSetId = newWorkShiftChangeSet.get(fallbackKey);
          if (!changeSetId) throw new Error(`Missing changeSetId for new row ${fallbackKey}`);

          const workShift = await api.employeeWorkShifts.createEmployeeWorkShift({
            employeeId,
            employeeWorkShift: { ...row.workShift, date: normalizedDate },
            workShiftChangeSetId: changeSetId,
          });

          // Map the new ID to the same changeSetId so workShiftHours lookup works later
          // biome-ignore lint/style/noNonNullAssertion: Work shift ID is always defined
          newWorkShiftChangeSet.set(workShift.id!, changeSetId);

          return { ...row, workShift };
        }),
      );

      // Fetch new work shift hours
      const newWorkShiftHours = (
        await Promise.all(
          newRowsWithWorkShiftIds.map((row) =>
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
        if (hoursFromRow?.actualHours !== undefined) {
          list.push({ ...hours, actualHours: hoursFromRow.actualHours });
        }
        return list;
      }, []);

      // Update existing work shifts
      for (const workShift of updatedWorkShifts) {
        const key = workShift.id ?? workShift.date.toISOString();
        const changeSetId = newWorkShiftChangeSet.get(key);

        if (!changeSetId) {
          throw new Error(`Missing changeSetId for updated shift ${key}`);
        }

        await api.employeeWorkShifts.updateEmployeeWorkShift({
          employeeId,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          workShiftId: workShift.id!,
          employeeWorkShift: workShift,
          workShiftChangeSetId: changeSetId,
        });
      }

      // Update all work shift hours
      const allWorkShiftHoursToUpdate = [...updatedWorkShiftHours, ...newWorkShiftHoursWithUpdatedValues];

      for (const workShiftHours of allWorkShiftHoursToUpdate) {
        const key = workShiftHours.employeeWorkShiftId;
        const changeSetId = newWorkShiftChangeSet.get(key);

        if (!changeSetId) {
          throw new Error(`Missing changeSetId for workShiftHours with shiftId: ${key}`);
        }

        await api.workShiftHours.updateWorkShiftHours({
          // biome-ignore lint/style/noNonNullAssertion: Work shift id is always defined
          workShiftHoursId: workShiftHours.id!,
          workShiftHours,
          workShiftChangeSetId: changeSetId,
        });
      }

      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFTS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_HOURS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORK_SHIFT_CHANGE_SETS] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEE_AGGREGATED_HOURS] });

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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYROLL_EXPORTS] });
    },
    [navigate, handleFormUnregister, queryClient],
  );

  const disableDatesOnWorkingPeriod = (date: DateTime) => {
    const workingPeriodDates = TimeUtils.getWorkingPeriodDates(employeeSalaryGroup, selectedDate.toJSDate());
    if (!workingPeriodDates) return false;

    const start = DateTime.fromJSDate(workingPeriodDates.start);
    const end = DateTime.fromJSDate(workingPeriodDates.end);

    const dateIsInsideWorkingPeriod = date >= start && date <= end;

    return dateIsInsideWorkingPeriod;
  };

  const checkIfSendToPayrollButtonDisabled = useMemo(() => {
    if (!workShiftsDataForFormRows.data) return true;
    const allWorkShifts = workShiftsDataForFormRows.data.map((row) => row.workShift);
    const allWorkShiftsApproved = allWorkShifts.every((workShift) => workShift.approved);
    const allWorkShiftsHavePayrollExportId = allWorkShifts.every(
      (workShift) => workShift.payrollExportId !== undefined,
    );
    return !allWorkShiftsApproved || allWorkShiftsHavePayrollExportId;
  }, [workShiftsDataForFormRows.data]);

  const handlePayrollExportButtonClick = () => {
    showConfirmDialog({
      title: t("workingHours.workingDays.confirmDialogPayroll.title"),
      description: t("workingHours.workingDays.confirmDialogPayroll.description"),
      positiveButtonText: t("workingHours.workingDays.confirmDialogPayroll.confirm"),
      onPositiveClick: () => {
        handleCreatePayrollExport.mutateAsync();
      },
    });
  };

  const handleAllApprovedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAllApproved = event.target.checked;
    const formValues = methods.getValues();

    Object.values(formValues).map((row: EmployeeWorkHoursFormRow, index: number) => {
      const currentValue = row?.workShift?.approved;

      if (row?.workShift?.id !== undefined && currentValue !== isAllApproved) {
        methods.setValue(`${index}.workShift.approved`, isAllApproved, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      }
    });
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
                employeeAggregatedHours={employeeAggregatedHours.data?.aggregatedHours}
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
          {handleCreatePayrollExport.isPending ? (
            <LoadingButton
              loading={handleCreatePayrollExport.isPending}
              size="small"
              variant="contained"
              endIcon={<Send />}
            >
              {t("workingHours.workingDays.sendToPayroll")}
            </LoadingButton>
          ) : (
            <Button
              size="small"
              variant="contained"
              disabled={checkIfSendToPayrollButtonDisabled || updateWorkShift.isPending}
              endIcon={<Send />}
              onClick={() => {
                handlePayrollExportButtonClick();
              }}
            >
              {payrollExportIdExists && foundPayrollExportData.data?.exportedAt
                ? t("workingHours.workingHourBalances.sentToPayroll")
                : t("workingHours.workingDays.sendToPayroll")}
            </Button>
          )}
          {updateWorkShift.isPending ? (
            <LoadingButton
              loading={updateWorkShift.isPending}
              size="small"
              variant="contained"
              endIcon={<Save />}
              type="submit"
            >
              {t("save")}
            </LoadingButton>
          ) : (
            <Button
              size="small"
              variant="contained"
              endIcon={<Save />}
              type="submit"
              disabled={!methods.formState.isDirty}
            >
              {t("save")}
            </Button>
          )}
        </Stack>
      </Stack>
    );
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
                            checked={Object.values(methods.getValues())
                              .filter((row) => row.workShift.id !== undefined)
                              .every((row) => row.workShift.approved)}
                            name="allApproved"
                            disabled={workShiftsDataForFormRows.data?.length === 0}
                            title={t("workingHours.workingHourBalances.markAllApproved")}
                          />
                        }
                        label={t("workingHours.workingDays.table.inspected")}
                      />
                      <Box minWidth={245}>
                        <Typography variant="body2">{`${t(
                          "workingHours.workingHourBalances.changesSaved",
                        )} ${getLatestChangeSetDateAndTime}`}</Typography>
                      </Box>
                      {foundPayrollExportData.data?.exportedAt ? (
                        <Box minWidth={245}>
                          <Typography variant="body2">{`${t(
                            "workingHours.workingHourBalances.sentToPayroll",
                          )} ${DateTime.fromJSDate(foundPayrollExportData.data?.exportedAt).toFormat(
                            "dd.MM.yyyy HH:mm",
                          )} (${
                            employees?.find((employee) => employee.id === foundPayrollExportData.data?.creatorId)
                              ?.firstName
                          } ${
                            employees?.find((employee) => employee.id === foundPayrollExportData.data?.creatorId)
                              ?.lastName
                          })`}</Typography>
                        </Box>
                      ) : null}
                    </Stack>
                  </TableHeader>
                  <TableContainer>
                    <WorkShiftsTableHeader />
                    {workShiftsDataForFormRows.isLoading ? (
                      <Skeleton variant="rectangular" height={550} />
                    ) : (
                      workShiftsDataWithWorkingPeriodDates.map((workShiftFormRow, index) => (
                        <WorkShiftRow
                          key={`${index}_${workShiftFormRow.workShift.id}`}
                          workShiftId={workShiftFormRow.workShift.id}
                          date={selectedDate}
                          index={index}
                        />
                      ))
                    )}
                  </TableContainer>
                </Stack>
              </Paper>
              <BottomAreaContainer>
                <Paper elevation={0} sx={{ display: "flex", flex: 2 }}>
                  <Stack flex={1}>
                    <TableHeader>{renderAggregationsTableTitle()}</TableHeader>
                    {workShiftsDataForFormRows.isLoading ||
                    employeeAggregatedHours.isLoading ||
                    employeeAggregatedHours.isFetching ? (
                      <Skeleton variant="rectangular" height={150} />
                    ) : employeeSalaryGroup === SalaryGroup.Driver ||
                      employeeSalaryGroup === SalaryGroup.Vplogistics ? (
                      <AggregationsTableForDriver
                        employeeAggregatedHours={employeeAggregatedHours.data?.aggregatedHours}
                        employee={employee ?? undefined}
                      />
                    ) : (
                      <AggregationsTableForOffice
                        employeeAggregatedHours={employeeAggregatedHours.data?.aggregatedHours}
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
                    {workShiftChangeSets.isLoading ? (
                      <Skeleton variant="rectangular" height={150} />
                    ) : (
                      workShiftChangeSetsInWorkShifts.map(({ changeSets, workShiftId }) => (
                        <ChangeLog
                          key={workShiftId}
                          changeSets={changeSets}
                          workShiftDate={
                            workShiftsDataForFormRows
                              ? workShiftsDataForFormRows?.data?.find(
                                  (workShift) => workShift.workShift.id === workShiftId,
                                )?.workShift.date
                              : undefined
                          }
                          employees={employees}
                          workShiftHours={
                            workShiftsDataForFormRows?.data?.find((workShift) => workShift.workShift.id === workShiftId)
                              ?.workShiftHours
                          }
                          workEvents={workEvents}
                        />
                      ))
                    )}
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
