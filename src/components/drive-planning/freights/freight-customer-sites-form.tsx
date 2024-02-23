import { Stack, TextField, MenuItem } from "@mui/material";
import { Freight, Site } from "generated/client";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  customerSites: Site[];
  errors: FieldErrors<Freight>;
  register: UseFormRegister<Freight>;
  watch: UseFormWatch<Freight>;
};

const FreightCustomerSitesForm = ({ customerSites, errors, register, watch }: Props) => {
  const { t } = useTranslation();

  const renderCustomerSite = (site: Site) => (
    <MenuItem key={site.id} value={site.id}>
      {site.name}
    </MenuItem>
  );

  const renderMenuItems = () => [
    <MenuItem value="EMPTY" key="EMPTY">
      {t("noSelection")}
    </MenuItem>,
    ...customerSites.map(renderCustomerSite),
  ];

  const validateSiteId = (value: string) => value !== "EMPTY";

  return (
    <Stack spacing={2} paddingX={2} paddingTop={3}>
      <Stack direction="row" spacing={2}>
        <TextField
          {...register("senderSiteId", {
            required: t("drivePlanning.freights.errorMessages.senderSiteMissing"),
            validate: validateSiteId,
          })}
          error={!!errors.senderSiteId}
          helperText={errors.senderSiteId?.message}
          defaultValue={watch("senderSiteId") || "EMPTY"}
          select
          label={t("drivePlanning.freights.sender")}
        >
          {renderMenuItems()}
        </TextField>
        <TextField
          {...register("recipientSiteId", {
            required: t("drivePlanning.freights.errorMessages.recipientSiteMissing"),
            validate: validateSiteId,
          })}
          error={!!errors.recipientSiteId}
          helperText={errors.recipientSiteId?.message}
          defaultValue={watch("recipientSiteId") || "EMPTY"}
          select
          label={t("drivePlanning.freights.recipient")}
        >
          {renderMenuItems()}
        </TextField>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          {...register("pointOfDepartureSiteId", {
            required: t("drivePlanning.freights.errorMessages.pointOfDepartureMissing"),
            validate: validateSiteId,
          })}
          defaultValue={watch("pointOfDepartureSiteId") || "EMPTY"}
          error={!!errors.pointOfDepartureSiteId}
          helperText={errors.pointOfDepartureSiteId?.message}
          select
          label={t("drivePlanning.freights.pointOfDeparture")}
        >
          {renderMenuItems()}
        </TextField>
        <TextField
          {...register("destinationSiteId", {
            required: t("drivePlanning.freights.errorMessages.destinationSiteMissing"),
            validate: validateSiteId,
          })}
          defaultValue={watch("destinationSiteId") || "EMPTY"}
          error={!!errors.destinationSiteId}
          helperText={errors.destinationSiteId?.message}
          select
          label={t("drivePlanning.freights.destination")}
        >
          {renderMenuItems()}
        </TextField>
      </Stack>
    </Stack>
  );
};

export default FreightCustomerSitesForm;
