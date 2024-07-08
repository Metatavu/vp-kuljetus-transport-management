import { MenuItem, Stack, TextField } from "@mui/material";
import { Employee, EmployeeType, Office, SalaryGroup } from "generated/client";
import { TFunction } from "i18next";
import { Key, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "src/utils/localization-utils";

const EmployeeForm = () => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
  } = useFormContext<Employee>();

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

  return (
    <Stack justifyContent="space-between" width={356} p={2}>
      <Stack spacing={2} flex={1}>
        <TextField
          label={t("management.employees.driverCard")}
          error={!!errors.driverCardId}
          helperText={errors.driverCardId?.message}
          // TODO: Add validation for driver card ID. See vehicle-data-receiver
          {...register("driverCardId")}
        />
        <TextField
          label={t("management.employees.employeeNumber")}
          error={!!errors.employeeNumber}
          helperText={errors.employeeNumber?.message}
          {...register("employeeNumber", { required: t("management.employees.errorMessages.employeeNumberMissing") })}
        />
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
        {/* <TextField
          label={t("management.employees.phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          {...register("phoneNumber", { required: t("management.employees.errorMessages.phoneNumberMissing") })}
        /> */}
        {/* <TextField
          label={t("management.employees.email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", { required: t("management.employees.errorMessages.emailMissing") })}
        /> */}
        <TextField
          select
          label={t("management.employees.office")}
          inputProps={register("office", {
            required: t("management.employees.errorMessages.officeMissing"),
          })}
          helperText={errors.office?.message}
          error={!!errors.office?.message}
        >
          {renderLocalizedMenuItems(Object.values(Office), LocalizationUtils.getLocalizedOffice)}
        </TextField>
        <TextField
          select
          label={t("management.employees.type")}
          inputProps={register("type", {
            required: t("management.employees.errorMessages.typeMissing"),
          })}
          helperText={errors.type?.message}
          error={!!errors.type?.message}
        >
          {renderLocalizedMenuItems(Object.values(EmployeeType), LocalizationUtils.getLocalizedEmployeeType)}
        </TextField>
        <TextField
          select
          defaultValue={SalaryGroup.Driver}
          label={t("management.employees.salaryGroup")}
          inputProps={register("salaryGroup", {
            required: t("management.employees.errorMessages.salaryGroupMissing"),
          })}
          helperText={errors.salaryGroup?.message}
          error={!!errors.salaryGroup?.message}
        >
          {renderLocalizedMenuItems(Object.values(SalaryGroup), LocalizationUtils.getLocalizedSalaryGroup)}
        </TextField>
        <TextField
          label={t("management.employees.workHours")}
          error={!!errors.regularWorkingHours}
          helperText={errors.regularWorkingHours?.message}
          {...register("regularWorkingHours", {
            validate: (value, { salaryGroup }) => {
              if (!value && value !== 0 && salaryGroup === "Driver") {
                return false;
              }

              return true;
            },
          })}
        />
      </Stack>
    </Stack>
  );
};

export default EmployeeForm;
