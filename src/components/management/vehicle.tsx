import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Close, SaveAlt } from "@mui/icons-material";
import EquipmentForm from "./equipment-form";

// To be replaced with actual type once API/spec is ready
export const VEHICLE_FORM = {
  type: "",
  licensePlate: "",
};

function VehicleComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
  } = useForm<typeof VEHICLE_FORM>({
    mode: "onChange",
    defaultValues: VEHICLE_FORM,
    shouldFocusError: true,
  });

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button variant="text" startIcon={<Close />} onClick={() => navigate({ to: "/management/vehicles" })}>
        {t("cancel")}
      </Button>
      <Button variant="contained" startIcon={<SaveAlt />}>
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("management.vehicles.new")} backButtonVisible toolbarButtons={renderToolbarButtons()} />
      <Stack direction="row">
        <EquipmentForm errors={errors} register={register} />
        <Box minHeight="100%" flex={1} alignContent="center" justifyContent="center">
          <Typography>Not yet implemented</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default VehicleComponent;
