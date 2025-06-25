import { ArchiveOutlined, Restore, SaveAlt } from "@mui/icons-material";
import { Button, Paper, Stack, styled } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ToolbarRow from "components/generic/toolbar-row";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import type { Towable, Truck } from "generated/client";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getEquipmentDisplayName } from "src/utils/format-utils";
import DataValidation from "../../../utils/data-validation-utils";
import EquipmentForm from "./equipment-form";
import TruckOrTowableThermometersList from "./truck-or-towable-thermometers-list";

// Styled components
const ScrollContainer = styled(Stack, {
  label: "equipment--scrollable-container",
})(({ theme }) => ({
  minHeight: "100%",
  flex: 1,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

type Props = {
  formType: "ADD" | "MODIFY";
  initialData?: Truck | Towable;
  onSave: (equipment: Truck | Towable) => Promise<unknown>;
};

function Equipment({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showConfirmDialog = useConfirmDialog();
  const queryClient = useQueryClient();
  const thermometersRef = useRef<{ reset: () => void } | null>(null);
  const [changedEquipmentThermometerNames, setChangedTerminalThermometerNames] = useState<
    { newName: string; thermometerId: string }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<Truck | Towable>({
    mode: "onChange",
    defaultValues: initialData,
    shouldFocusError: true,
  });

  const onArchiveEquipment = async (equipment: Truck | Towable) => {
    if (DataValidation.isTruck(equipment)) {
      archiveTruck.mutate(equipment);
    } else {
      archiveTowable.mutate(equipment);
    }
  };

  const archiveTruck = useMutation({
    mutationKey: ["archiveTruck", methods.watch("id")],
    mutationFn: async (truck?: Truck) => {
      if (!truck?.id) return;
      return api.trucks.updateTruck({ truckId: truck.id, truck: { ...truck, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucks", methods.watch("id")] });
      navigate({ to: "/management/equipment" });
    },
  });

  const archiveTowable = useMutation({
    mutationKey: ["archiveTowable", methods.watch("id")],
    mutationFn: async (towable?: Towable) => {
      if (!towable?.id) return;
      return api.towables.updateTowable({ towableId: towable.id, towable: { ...towable, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towables"] });
      queryClient.invalidateQueries({ queryKey: ["towables", methods.watch("id")] });
      navigate({ to: "/management/equipment" });
    },
  });

  const onReset = () => {
    if (initialData?.type === "TRUCK") {
      methods.reset({
        ...initialData,
        name: initialData?.name ?? "",
        costCenter: initialData?.costCenter ?? "",
        plateNumber: initialData?.plateNumber ?? "",
        vin: initialData?.vin ?? "",
        imei: initialData?.imei ?? "",
      });
    } else {
      methods.reset({
        ...initialData,
        name: initialData?.name ?? "",
        plateNumber: initialData?.plateNumber ?? "",
        vin: initialData?.vin ?? "",
        imei: initialData?.imei ?? "",
      });
    }

    thermometersRef.current?.reset();
  };

  const onSaveClick = async (values: Truck | Towable) => {
    setIsSaving(true);

    if (changedEquipmentThermometerNames.length > 0) {
      await Promise.all(
        changedEquipmentThermometerNames.map(({ newName, thermometerId }) =>
          api.thermometers.updateTruckOrTowableThermometer({
            thermometerId,
            updateTruckOrTowableThermometerRequest: { name: newName },
          }),
        ),
      );
    }

    await onSave(values);

    onReset();

    setIsSaving(false);
  };

  const formHasErrors = Object.keys(methods.formState.errors).length > 0;
  const formIsNotDirty =
    Object.keys(methods.formState.dirtyFields).length < 1 && changedEquipmentThermometerNames.length < 1;

  const isUndoChangesDisabled = formIsNotDirty || isSaving;
  const isSaveDisabled = formIsNotDirty || isSaving || formHasErrors;

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={2}>
      {initialData && (
        <Button
          variant="outlined"
          startIcon={<ArchiveOutlined />}
          onClick={() =>
            showConfirmDialog({
              title: t("management.equipment.archiveDialog.title"),
              description: t("management.equipment.archiveDialog.description", { name: methods.watch("name") }),
              onPositiveClick: () => onArchiveEquipment(initialData as Truck | Towable),
            })
          }
        >
          {t("archive")}
        </Button>
      )}
      <Button
        title={t("undoFormChangesTitle")}
        disabled={isUndoChangesDisabled}
        variant="text"
        startIcon={<Restore />}
        onClick={() => onReset()}
      >
        {t("undoChanges")}
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveAlt />}
        disabled={isSaveDisabled}
        onClick={methods.handleSubmit(onSaveClick)}
      >
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <ToolbarRow
        title={
          formType === "MODIFY" && initialData
            ? t("management.equipment.modify", { equipmentName: getEquipmentDisplayName(initialData) })
            : t("management.equipment.new")
        }
        navigateBack={() => navigate({ to: "/management/equipment" })}
        toolbarButtons={renderToolbarButtons()}
      />
      <Stack direction="row" height="calc(100% - 52px)">
        <FormProvider {...methods}>
          <EquipmentForm equipment={initialData} />
        </FormProvider>
        <ScrollContainer>
          {initialData ? (
            <TruckOrTowableThermometersList
              ref={thermometersRef}
              entityType={DataValidation.isTruck(initialData) ? "truck" : "towable"}
              entityId={initialData?.id ?? ""}
              setChangedTerminalThermometerNames={setChangedTerminalThermometerNames}
            />
          ) : null}
        </ScrollContainer>
      </Stack>
    </Paper>
  );
}

export default Equipment;
