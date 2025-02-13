import { MenuItem, Stack, TextField, styled } from "@mui/material";
import { Towable, TowableTypeEnum, Truck, TruckTypeEnum } from "generated/client";
import { useFormContext } from "react-hook-form";
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
  equipment?: Truck | Towable;
};

const EquipmentForm = ({ equipment }: Props) => {
  const { t } = useTranslation("translation");
  const methods = useFormContext();
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
          {...methods.register("type")}
        >
          {renderMenuItems()}
        </TextField>
        <TextField
          label={t("management.equipment.name")}
          error={!!methods.formState.errors.name}
          helperText={!!methods.formState.errors.name?.message}
          {...methods.register("name", { required: t("management.equipment.errorMessages.numberMissing") })}
        />
        { (methods.watch("type") == "TRUCK" || methods.watch("type") == "SEMI_TRUCK") && <TextField
          label={t("management.equipment.costCenter")}
          error={!!methods.formState.errors.name}
          helperText={!!methods.formState.errors.name?.message}
          {...methods.register("costCenter")}
        /> }
        <TextField
          label={t("management.equipment.licensePlate")}
          error={!!methods.formState.errors.plateNumber}
          helperText={!!methods.formState.errors.plateNumber?.message}
          {...methods.register("plateNumber", { required: t("management.equipment.errorMessages.licensePlateMissing") })}
        />
        <TextField
          label={t("management.equipment.vin")}
          error={!!methods.formState.errors.vin}
          helperText={!!methods.formState.errors.vin?.message}
          {...methods.register("vin", { required: t("management.equipment.errorMessages.vinNumberMissing") })}
        />
        <TextField label={t("management.equipment.imei")} {...methods.register("imei")} />
      </Stack>
    </Root>
  );
};

export default EquipmentForm;
