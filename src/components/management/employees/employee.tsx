import { Restore, SaveAlt } from "@mui/icons-material";
import { Box, Button, Paper, Stack } from "@mui/material";
import type { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import type { Employee } from "generated/client";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import EmployeeForm from "./employee-form";

type Props = {
  title: string;
  employee?: Employee;
  onSave: UseMutationResult<Employee, Error, Employee, unknown>;
};

const EmployeeComponent = ({ title, employee, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<Employee>({
    mode: "onSubmit",
    defaultValues: employee,
    shouldFocusError: true,
  });

  const {
    reset,
    handleSubmit,
    formState: { dirtyFields },
  } = form;

  const isUndoChangesDisabled = Object.keys(dirtyFields).length < 1 || onSave.isPending;

  const onEmployeeSave = useCallback(
    async (employee: Employee) => {
      await onSave.mutateAsync(employee);
      navigate({ to: "/management/employees" });
    },
    [onSave, navigate],
  );

  const renderToolbarButtons = useCallback(() => {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="text"
          disabled={isUndoChangesDisabled}
          startIcon={<Restore />}
          onClick={() =>
            reset({
              ...employee,
              driverCardId: employee?.driverCardId ?? "",
              employeeNumber: employee?.employeeNumber ?? "",
              lastName: employee?.lastName ?? "",
              firstName: employee?.firstName ?? "",
              phoneNumber: employee?.phoneNumber ?? "",
              email: employee?.email ?? "",
              office: employee?.office ?? undefined,
              type: employee?.type ?? undefined,
              salaryGroup: employee?.salaryGroup ?? undefined,
              regularWorkingHours: employee?.regularWorkingHours ?? undefined,
              pinCode: employee?.pinCode ?? "",
            })
          }
        >
          {t("undoChanges")}
        </Button>
        <Button variant="contained" startIcon={<SaveAlt />} onClick={handleSubmit(onEmployeeSave)}>
          {t("save")}
        </Button>
      </Stack>
    );
  }, [employee, t, isUndoChangesDisabled, onEmployeeSave, handleSubmit, reset]);

  return (
    <LoaderWrapper loading={onSave.isPending}>
      <Paper sx={{ height: "100%" }}>
        <FormProvider {...form}>
          <ToolbarRow
            title={title}
            navigateBack={() => navigate({ to: "/management/employees" })}
            toolbarButtons={renderToolbarButtons()}
          />
          <Stack direction="row" height="calc(100% - 42px)" overflow="scroll">
            <EmployeeForm employee={employee} />
            <Box sx={{ backgroundColor: "#f7f7f7" }} width="100%" height="100%" />
          </Stack>
        </FormProvider>
      </Paper>
    </LoaderWrapper>
  );
};

export default EmployeeComponent;
