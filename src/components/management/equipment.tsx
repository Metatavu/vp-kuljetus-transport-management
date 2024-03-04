import { Box, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Close, SaveAlt } from "@mui/icons-material";
import EquipmentForm from "./equipment-form";
import { Truck } from "generated/client";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
  formType: "ADD" | "MODIFY";
  initialData?: Truck;
  onSave: UseMutationResult<Truck, Error, Truck, unknown>;
};

function EquipmentComponent({ formType, initialData, onSave }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Truck>({
    mode: "onChange",
    defaultValues: initialData,
    shouldFocusError: true,
  });

  const onTruckSave = async (truck: Truck) => {
    await onSave.mutateAsync(truck);
    navigate({ to: "/management/equipment" });
  };

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button variant="text" startIcon={<Close />} onClick={() => navigate({ to: "/management/equipment" })}>
        {t("cancel")}
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveAlt />}
        onClick={handleSubmit(onTruckSave)}
      >
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow
        title={formType === "ADD" ? t("management.equipment.new") : t("management.equipment.modify")}
        navigateBack={() => navigate({ to: "/management/equipment" })}
        toolbarButtons={renderToolbarButtons()}
      />
      <Stack direction="row">
        <EquipmentForm errors={errors} register={register} />
        <Box minHeight="100%" flex={1} alignContent="center" justifyContent="center">
          <Paper></Paper>
        </Box>
      </Stack>
    </Paper>
  );
}

export default EquipmentComponent;
