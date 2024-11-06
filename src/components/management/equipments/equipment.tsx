import { SaveAlt } from "@mui/icons-material";
import { Box, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { Towable, Truck } from "generated/client";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getEquipmentDisplayName } from "src/utils/format-utils";
import EquipmentForm from "./equipment-form";

type Props = {
  formType: "ADD" | "MODIFY";
  initialData?: Truck | Towable;
  onSave: (equipment: Truck | Towable) => unknown;
};

function EquipmentComponent({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
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
        <EquipmentForm
          errors={errors}
          register={register}
          equipment={initialData}
          setFormValue={setValue}
          watch={watch}
        />
        <Box minHeight="100%" flex={1} alignContent="center" justifyContent="center">
          <Paper />
        </Box>
      </Stack>
    </Paper>
  );
}

export default EquipmentComponent;
