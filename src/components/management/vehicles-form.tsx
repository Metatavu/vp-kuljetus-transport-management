import { Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { VEHICLE_FORM } from "./vehicle";

type Props = {
  errors: FieldErrors<typeof VEHICLE_FORM>;
  register: UseFormRegister<typeof VEHICLE_FORM>;
};

const EquipmentForm = ({ errors, register }: Props) => {
  const { t } = useTranslation("translation", { keyPrefix: "management.vehicles" });

  return (
    <Stack width={356} padding="16px" gap="16px">
      <TextField select label={t("type")} InputProps={{ disableUnderline: false }} {...register("type")} />
      <TextField
        label={t("licensePlate")}
        error={!!errors.licensePlate}
        helperText={errors.licensePlate?.message}
        {...register("licensePlate", { required: t("errorMessages.licensePlateMissing") })}
      />
    </Stack>
  );
};

export default EquipmentForm;
