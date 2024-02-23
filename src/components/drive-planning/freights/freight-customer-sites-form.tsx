import { Stack, MenuItem } from "@mui/material";
import GenericFormTextfield from "components/generic/form-text-field";
import { Freight, Site } from "generated/client";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
  customerSites: Site[];
  control: Control<Freight, unknown, Freight>;
};

const FreightCustomerSitesForm = ({ customerSites, control }: Props) => {
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

  const validateSiteId = (value: unknown) => value !== "EMPTY";

  return (
    <Stack spacing={2} paddingX={2} paddingTop={3}>
      <Stack direction="row" spacing={2}>
        <GenericFormTextfield
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
        </GenericFormTextfield>
      </Stack>
    </Stack>
  );
};

export default FreightCustomerSitesForm;
