import { MenuItem, Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Truck, TruckTypeEnum } from "generated/client";
import LocalizationUtils from "../../../src/utils/localization-utils";

type Props = {
  errors: FieldErrors<Truck>;
  register: UseFormRegister<Truck>;
};

const EquipmentForm = ({ errors, register }: Props) => {
  const { t } = useTranslation("translation");

  const renderTruckType = (type: string) => (
    <MenuItem key={type} value={type}>
      {LocalizationUtils.getLocalizedTruckType(type, t)}
    </MenuItem>
  );

  const renderMenuItems = () => Object.keys(TruckTypeEnum).map(renderTruckType);

  return (
    <Stack width={356} padding="16px" gap="16px">
      <TextField
        select
        label={t("management.equipment.type")}
        InputProps={{ disableUnderline: false }}
        {...register("type")}
      >
        {renderMenuItems()}
      </TextField>
      <TextField
        label={t("management.equipment.name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name", { required: t("management.equipment.errorMessages.numberMissing") })}
      />
      <TextField
        label={t("management.equipment.licensePlate")}
        error={!!errors.plateNumber}
        helperText={errors.plateNumber?.message}
        {...register("plateNumber", { required: t("management.equipment.errorMessages.licensePlateMissing") })}
      />
      <TextField
        label={t("management.equipment.vin")}
        error={!!errors.vin}
        helperText={errors.vin?.message}
        {...register("vin", { required: t("management.equipment.errorMessages.vinNumberMissing") })}
      />
    </Stack>
  );
};

export default EquipmentForm;
