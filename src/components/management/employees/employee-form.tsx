import { MenuItem, Stack, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ArchiveButton from "components/generic/archive-button";
import { Employee, EmployeeType, Office, SalaryGroup } from "generated/client";
import { TFunction } from "i18next";
import { Key, useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  employee?: Employee;
};

const EmployeeForm = ({ employee }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<Employee>();

  const archiveEmployee = useMutation({
    mutationFn: (employee?: Employee) => {
      if (!employee?.id) return Promise.reject();
      return api.employees.updateEmployee({
        employeeId: employee.id,
        employee: { ...employee, archivedAt: new Date() },
      });
    },
    onSuccess: () => {
      toast.success(t("management.employees.archiveToast"));
      navigate({ to: "/management/employees" });
    },
  });

  const renderLocalizedMenuItem = useCallback(
    <T extends string>(value: T, labelResolver: (value: T, t: TFunction) => string) => (
      <MenuItem key={value as Key} value={value}>
        {labelResolver(value, t)}
      </MenuItem>
    ),
    [t],
  );

  const renderLocalizedMenuItems = useCallback(
    <T extends string>(items: string[], labelResolver: (value: T, t: TFunction) => string) =>
      items.map((item) => renderLocalizedMenuItem(item as T, labelResolver)),
    [renderLocalizedMenuItem],
  );

  const employeeName = useMemo(() => {
    const { firstName, lastName } = employee ?? {};

    return `${lastName || ""}, ${firstName || ""}`;
  }, [employee]);

  const validateDriverCardId = useCallback(
    (value: unknown) => {
      if (typeof value !== "string") return true;
      if (value?.length > 0 && value.length !== 16) return t("management.employees.errorMessages.invalidDriverCard");
    },
    [t],
  );

  return (
    <Stack justifyContent="space-between" width={356} p={2}>
      <Stack spacing={2}>
        <TextField
          label={t("management.employees.driverCard")}
          error={!!errors.driverCardId}
          helperText={errors.driverCardId?.message}
          {...register("driverCardId", {
            validate: validateDriverCardId,
          })}
        />
        <TextField label={t("management.employees.employeeNumber")} {...register("employeeNumber")} />
        <TextField
          label={t("management.employees.lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register("lastName", { required: t("management.employees.errorMessages.lastNameMissing") })}
        />
        <TextField
          label={t("management.employees.firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register("firstName", { required: t("management.employees.errorMessages.firstNameMissing") })}
        />
        <TextField label={t("management.employees.phoneNumber")} {...register("phoneNumber")} />
        <TextField label={t("management.employees.email")} {...register("email")} />
        <TextField
          select
          defaultValue={watch("office")}
          label={t("management.employees.office")}
          InputProps={{
            ...register("office", {
              required: t("management.employees.errorMessages.officeMissing"),
            }),
            disableUnderline: true,
          }}
          helperText={errors.office?.message}
          error={!!errors.office?.message}
        >
          {renderLocalizedMenuItems(Object.values(Office), LocalizationUtils.getLocalizedOffice)}
        </TextField>
        <TextField
          select
          defaultValue={watch("type")}
          label={t("management.employees.type")}
          InputProps={{
            ...register("type", {
              required: t("management.employees.errorMessages.typeMissing"),
            }),
            disableUnderline: true,
          }}
          helperText={errors.type?.message}
          error={!!errors.type?.message}
        >
          {renderLocalizedMenuItems(Object.values(EmployeeType), LocalizationUtils.getLocalizedEmployeeType)}
        </TextField>
        <TextField
          select
          defaultValue={watch("salaryGroup")}
          label={t("management.employees.salaryGroup")}
          InputProps={{
            ...register("salaryGroup", {
              required: t("management.employees.errorMessages.salaryGroupMissing"),
            }),
            disableUnderline: true,
          }}
          helperText={errors.salaryGroup?.message}
          error={!!errors.salaryGroup?.message}
        >
          {renderLocalizedMenuItems(Object.values(SalaryGroup), LocalizationUtils.getLocalizedSalaryGroup)}
        </TextField>
        <TextField label={t("management.employees.regularWorkingHours")} {...register("regularWorkingHours")} />
      </Stack>
      {employee && (
        <ArchiveButton
          title={t("management.employees.archiveDialog.title")}
          description={t("management.employees.archiveDialog.description", { name: employeeName })}
          onArchive={() => archiveEmployee.mutate(employee)}
        />
      )}
    </Stack>
  );
};

export default EmployeeForm;
