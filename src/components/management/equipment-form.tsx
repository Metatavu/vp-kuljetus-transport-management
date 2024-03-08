import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Towable, TowableTypeEnum, Truck, TruckTypeEnum } from "generated/client";
import LocalizationUtils from "../../../src/utils/localization-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { useApi } from "../../../src/hooks/use-api";
import { useNavigate } from "@tanstack/react-router";
import { Close } from "@mui/icons-material";

type Props = {
  errors: FieldErrors<Truck | Towable>;
  register: UseFormRegister<Truck | Towable>;
  equipment?: Truck | Towable;
  setFormValue: UseFormSetValue<Truck | Towable>;
  watch: UseFormWatch<Truck | Towable>;
};

const EquipmentForm = ({ errors, register, equipment, watch }: Props) => {
  const { t } = useTranslation("translation");
  const showConfirmDialog = useConfirmDialog();
  const { trucksApi, towablesApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const renderEquipmentType = (type: string) => (
    <MenuItem key={type} value={type}>
      {LocalizationUtils.getLocalizedEquipmentType(type, t)}
    </MenuItem>
  );

  const renderMenuItems = () => Object.values(TruckTypeEnum).map(renderEquipmentType).concat(Object.values(TowableTypeEnum).map(renderEquipmentType));

  const onArchiveEquipment = async (equipment: Truck | Towable) => {
    if (Object.values(TruckTypeEnum).includes(equipment.type as TruckTypeEnum)) {
      archiveTruck.mutate(equipment as Truck);
    } else {
      archiveTowable.mutate(equipment as Towable);
    }
  }

  const archiveTruck = useMutation({
    mutationKey: ["archiveTruck", watch("id")],
    mutationFn: async (truck?: Truck) => {
      if (!truck?.id) return;
      return trucksApi.updateTruck({ truckId: truck.id, truck: { ...truck, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucks", equipment?.id] });
      navigate({ to: "/management/equipment" })
    },
  });

  const archiveTowable = useMutation({
    mutationKey: ["archiveTowable", watch("id")],
    mutationFn: async (towable?: Towable) => {
      if (!towable?.id) return;
      return towablesApi.updateTowable({ towableId: towable.id, towable: { ...towable, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towables"] });
      queryClient.invalidateQueries({ queryKey: ["towables", equipment?.id] });
      navigate({ to: "/management/equipment" })
    },
  });

  return (
    <Stack justifyContent="space-between" width={356} height="calc(100% - 52px)" padding="16px">
      <Stack width={356} padding="16px" gap="16px" minHeight="100%">
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
      {equipment && (
        <Stack spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Close />}
            onClick={() =>
              showConfirmDialog({
                title: t("management.equipment.archiveDialog.title"),
                description: t("management.equipment.archiveDialog.description", { name: equipment?.name }),
                cancelButtonEnabled: true,
                onPositiveClick: () => onArchiveEquipment(equipment),
              })
            }
          >
            {t("archive")}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default EquipmentForm;

