import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useApi } from "../../../hooks/use-api";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { Freight } from "generated/client";
import FreightCustomerSitesForm from "./freight-customer-sites-form";
import { useForm } from "react-hook-form";
import FreightUnits from "./freight-units";

type Props = {
  type: "ADD" | "MODIFY";
  initialData?: Freight;
  onSave?: UseMutationResult<Freight, Error, Freight, unknown>;
};

const FreightDialog = ({ type, initialData, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sitesApi } = useApi();

  const customerSites = useQuery({
    queryKey: ["customerSites"],
    queryFn: async () => await sitesApi.listSites(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Freight>({
    mode: "onSubmit",
    defaultValues: initialData,
  });

  const onSaveClick = (freight: Freight) => {
    // onSave?.mutate(freight);
    navigate({ to: "/drive-planning/freights/$freightId/modify", params: { freightId: "asd" } });
  };

  const handleClose = () => navigate({ to: "/drive-planning/freights" });

  return (
    <Dialog open={true} onClose={handleClose} PaperProps={{ sx: { minWidth: "50%", maxHeight: "50%" } }}>
      <Stack padding="0px 8px 0px 16px" direction="row" height="42px" bgcolor="#4E8A9C" justifyContent="space-between">
        <Typography alignSelf="center" variant="h6" sx={{ color: "#ffffff" }}>
          {type === "ADD"
            ? t("drivePlanning.freights.new")
            : t("drivePlanning.freights.dialog.title", { freightNumber: "1000" })}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close htmlColor="#ffffff" />
        </IconButton>
      </Stack>
      <DialogContent sx={{ padding: 0 }}>
        <Stack spacing={2}>
          <FreightCustomerSitesForm customerSites={customerSites.data ?? []} errors={errors} register={register} />
          <FreightUnits />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSaveClick)}>
          {t("drivePlanning.freights.dialog.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FreightDialog;
