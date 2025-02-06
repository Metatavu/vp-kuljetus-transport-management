import { ArchiveOutlined, SaveAlt } from "@mui/icons-material";
import { Button, Paper, Stack, styled } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ToolbarRow from "components/generic/toolbar-row";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { Towable, Truck } from "generated/client";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getEquipmentDisplayName } from "src/utils/format-utils";
import DataValidation from "../../../utils/data-validation-utils";
import Sensors from "../sensors";
import EquipmentForm from "./equipment-form";

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
  onSave: (equipment: Truck | Towable) => unknown;
};

function EquipmentComponent({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showConfirmDialog = useConfirmDialog();
  const queryClient = useQueryClient();

  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Truck | Towable>({
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
    mutationKey: ["archiveTruck", watch("id")],
    mutationFn: async (truck?: Truck) => {
      if (!truck?.id) return;
      return api.trucks.updateTruck({ truckId: truck.id, truck: { ...truck, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucks", watch("id")] });
      navigate({ to: "/management/equipment" });
    },
  });

  const archiveTowable = useMutation({
    mutationKey: ["archiveTowable", watch("id")],
    mutationFn: async (towable?: Towable) => {
      if (!towable?.id) return;
      return api.towables.updateTowable({ towableId: towable.id, towable: { ...towable, archivedAt: new Date() } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["towables"] });
      queryClient.invalidateQueries({ queryKey: ["towables", watch("id")] });
      navigate({ to: "/management/equipment" });
    },
  });

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={2}>
      {initialData && (
        <Button
          variant="outlined"
          startIcon={<ArchiveOutlined />}
          onClick={() =>
            showConfirmDialog({
              title: t("management.equipment.archiveDialog.title"),
              description: t("management.equipment.archiveDialog.description", { name: watch("name") }),
              onPositiveClick: () => onArchiveEquipment(initialData as Truck | Towable),
            })
          }
        >
          {t("archive")}
        </Button>
      )}
      <Button variant="contained" startIcon={<SaveAlt />} onClick={handleSubmit(onSave)}>
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
        <EquipmentForm errors={errors} register={register} equipment={initialData} setFormValue={setValue} />
        <ScrollContainer>
          {initialData ? (
            <Sensors
              entityType={DataValidation.isTruck(initialData) ? "truck" : "towable"}
              entityId={initialData?.id ?? ""}
            />
          ) : null}
        </ScrollContainer>
      </Stack>
    </Paper>
  );
}

export default EquipmentComponent;
