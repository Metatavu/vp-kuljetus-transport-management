import { Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EQUIPMENT_FORM } from "./equipment";

type Props = {
  errors: FieldErrors<typeof EQUIPMENT_FORM>;
  register: UseFormRegister<typeof EQUIPMENT_FORM>;
};

const EquipmentForm = ({ errors, register }: Props) => {
  const { t } = useTranslation("translation", { keyPrefix: "management.equipment" });

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
