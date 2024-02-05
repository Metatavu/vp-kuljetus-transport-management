import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomerSiteForm from "./customer-site-form";
import { Close, SaveAlt } from "@mui/icons-material";

// To be replaced with actual type once API/spec is ready
export const CUSTOMER_SITE_FORM = {
  type: "",
  customer: "",
  name: "",
  address: "",
  postalNumber: "",
  municipality: "",
  additionalInfo: "",
};

function CustomerSiteComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<typeof CUSTOMER_SITE_FORM>({
    mode: "onChange",
    defaultValues: CUSTOMER_SITE_FORM,
    shouldFocusError: true,
  });

  const renderToolbarButtons = () => (
    <Stack direction="row" spacing={1}>
      <Button variant="text" startIcon={<Close />} onClick={() => navigate({ to: "/management/customer-sites" })}>
        {t("cancel")}
      </Button>
      <Button variant="contained" startIcon={<SaveAlt />}>
        {t("save")}
      </Button>
    </Stack>
  );

  return (
    <Paper sx={{ height: "100%" }}>
      <ToolbarRow title={t("customerSites.new")} backButtonVisible toolbarButtons={renderToolbarButtons()} />
      <Stack direction="row">
        <CustomerSiteForm errors={errors} register={register} />
        <Box minHeight="100%" flex={1} alignContent="center" justifyContent="center">
          <Typography>Not yet implemented</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default CustomerSiteComponent;
