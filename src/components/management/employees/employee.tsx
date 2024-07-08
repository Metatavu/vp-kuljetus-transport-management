import { Close, SaveAlt } from "@mui/icons-material";
import { Button, Paper, Stack } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { Employee } from "generated/client";
import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import EmployeeForm from "./employee-form";

type Props = {
  formType: "ADD" | "MODIFY";
  employee?: Employee;
  onSave: UseMutationResult<Employee, Error, Employee, unknown>;
};

const EmployeeComponent = ({ formType, employee, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<Employee>({
    mode: "onChange",
    defaultValues: employee,
    shouldFocusError: true,
  });

  const onEmployeeSave = useCallback(
    async (employee: Employee) => {
      await onSave.mutateAsync(employee);
      navigate({ to: "/management/employees" });
    },
    [onSave, navigate],
  );

  const renderToolbarButtons = useCallback(() => {
    const {
      reset,
      handleSubmit,
      formState: { isDirty },
    } = form;
    return (
      <Stack direction="row" spacing={1}>
        {isDirty && (
          <Button variant="text" startIcon={<Close />} onClick={() => reset(employee)}>
            {t("cancel")}
          </Button>
        )}
        <Button variant="contained" startIcon={<SaveAlt />} onClick={handleSubmit(onEmployeeSave)}>
          {t("save")}
        </Button>
      </Stack>
    );
  }, [form, employee, t, onEmployeeSave]);

  return (
    <LoaderWrapper loading={onSave.isPending}>
      <Paper sx={{ height: "100%" }}>
        <FormProvider {...form}>
          <ToolbarRow
            title={formType === "ADD" ? t("management.employees.new") : t("management.employees.modify")}
            navigateBack={() => navigate({ to: "/management/employees" })}
            toolbarButtons={renderToolbarButtons()}
          />
          <Stack direction="row" height="calc(100% - 52px)">
            <EmployeeForm />
          </Stack>
        </FormProvider>
      </Paper>
    </LoaderWrapper>
  );
};

export default EmployeeComponent;
