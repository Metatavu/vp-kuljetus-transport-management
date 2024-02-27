import { Stack, MenuItem, TextField } from "@mui/material";
import { Freight, Site } from "generated/client";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  freight: Freight;
  customerSites: Site[];
  onSave: (data: Freight) => Promise<void>;
};

const FreightCustomerSitesForm = ({ freight, customerSites, onSave }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useFormContext<Freight>();

  const renderCustomerSite = (site: Site) => (
    <MenuItem key={site.id} value={site.id}>
      {site.name}
    </MenuItem>
  );

  const renderMenuItems = () => customerSites.map(renderCustomerSite);

  const validateSiteId = (value: unknown) => value !== "EMPTY";

  const { senderSiteId, recipientSiteId, destinationSiteId, pointOfDepartureSiteId } = freight;
  return (
    <Stack spacing={2} paddingX={2} paddingTop={3}>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          defaultValue={senderSiteId}
          {...register("senderSiteId", {
            required: t("drivePlanning.freights.errorMessages.senderSiteMissing"),
            validate: validateSiteId,
          })}
          label={t("drivePlanning.freights.sender")}
        >
          {renderMenuItems()}
        </TextField>
        <TextField
          select
          defaultValue={recipientSiteId}
          {...register("recipientSiteId", {
            required: t("drivePlanning.freights.errorMessages.recipientSiteMissing"),
            validate: validateSiteId,
          })}
          label={t("drivePlanning.freights.recipient")}
        >
          {renderMenuItems()}
        </TextField>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
          select
          defaultValue={pointOfDepartureSiteId}
          {...register("pointOfDepartureSiteId", {
            required: t("drivePlanning.freights.errorMessages.pointOfDepartureMissing"),
            validate: validateSiteId,
          })}
          label={t("drivePlanning.freights.pointOfDeparture")}
        >
          {renderMenuItems()}
        </TextField>
        <TextField
          select
          defaultValue={destinationSiteId}
          {...register("destinationSiteId", {
            required: t("drivePlanning.freights.errorMessages.destinationSiteMissing"),
            validate: validateSiteId,
          })}
          label={t("drivePlanning.freights.destination")}
        >
          {renderMenuItems()}
        </TextField>
      </Stack>
      {/* <GenericFormTextfield
          control={control}
          rules={{
            required: t("drivePlanning.freights.errorMessages.senderSiteMissing"),
            validate: validateSiteId,
          }}
          name="senderSiteId"
          textFieldProps={{
            select: true,
            label: t("drivePlanning.freights.sender"),
          }}
        >
          {renderMenuItems()}
        </GenericFormTextfield>
        <GenericFormTextfield
          control={control}
          rules={{
            required: t("drivePlanning.freights.errorMessages.recipientSiteMissing"),
            validate: validateSiteId,
          }}
          name="recipientSiteId"
          textFieldProps={{
            select: true,
            label: t("drivePlanning.freights.recipient"),
          }}
        >
          {renderMenuItems()}
        </GenericFormTextfield>
      </Stack>
      <Stack direction="row" spacing={2}>
        <GenericFormTextfield
          control={control}
          rules={{
            required: t("drivePlanning.freights.errorMessages.pointOfDepartureMissing"),
            validate: validateSiteId,
          }}
          name="pointOfDepartureSiteId"
          textFieldProps={{
            select: true,
            label: t("drivePlanning.freights.pointOfDeparture"),
          }}
        >
          {renderMenuItems()}
        </GenericFormTextfield>
        <GenericFormTextfield
          control={control}
          rules={{
            required: t("drivePlanning.freights.errorMessages.destinationSiteMissing"),
            validate: validateSiteId,
          }}
          name="destinationSiteId"
          textFieldProps={{
            select: true,
            label: t("drivePlanning.freights.pointOfDeparture"),
          }}
        >
          {renderMenuItems()}
        </GenericFormTextfield> */}
    </Stack>
  );
};

export default FreightCustomerSitesForm;
