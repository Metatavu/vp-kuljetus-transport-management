import { MenuItem, Stack, TextField, styled } from "@mui/material";
import { Towable, TowableTypeEnum, Truck, TruckTypeEnum } from "generated/client";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";

// Styled components
const Root = styled(Stack, {
  label: "equipment-form--root",
})(({ theme }) => ({
  justifyContent: "space-between",
  height: "100%",
  overflowY: "auto",
  borderRight: `1px solid ${theme?.palette.divider}`,
}));

type Props = {
  errors: FieldErrors<Truck | Towable>;
  register: UseFormRegister<Truck | Towable>;
  equipment?: Truck | Towable;
  setFormValue: UseFormSetValue<Truck | Towable>;
};

const EquipmentForm = ({ errors, register, equipment }: Props) => {
  const { t } = useTranslation("translation");

  const renderEquipmentType = (type: string) => (
    <MenuItem key={type} value={type}>
      {LocalizationUtils.getLocalizedEquipmentType(type, t)}
    </MenuItem>
  );

  const renderMenuItems = () =>
    Object.values(TruckTypeEnum)
      .map(renderEquipmentType)
      .concat(Object.values(TowableTypeEnum).map(renderEquipmentType));

  return (
    <Root>
      <Stack width={356} p={2} gap={2} minHeight="100%">
        <TextField
          select
          label={t("management.equipment.type")}
          InputProps={{ disableUnderline: false }}
          defaultValue={equipment?.type ?? ""}
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
          label={t("management.equipment.costCenter")}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("costCenter", { required: t("management.equipment.errorMessages.numberMissing") })}
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
        <TextField label={t("management.equipment.imei")} {...register("imei")} />
      </Stack>
    </Root>
  );
};

export default EquipmentForm;
