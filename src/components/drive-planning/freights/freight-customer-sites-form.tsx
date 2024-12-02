import { Box, Grid, MenuItem, TextField } from "@mui/material";
import { Freight, Site } from "generated/client";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LocalizedLabelKey } from "src/types";

type Props = {
  freight?: Freight;
  customerSites: Site[];
};

type SiteField = {
  key: keyof Freight;
  label: LocalizedLabelKey;
  errorMessage: LocalizedLabelKey;
};

const FreightCustomerSitesForm = ({ freight, customerSites }: Props) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<Freight>();

  const renderCustomerSite = (site: Site) => (
    <MenuItem key={site.id} value={site.id}>
      {site.name}
    </MenuItem>
  );

  const renderMenuItems = () => customerSites.map(renderCustomerSite);

  const validateSiteId = (value: unknown) => value !== "EMPTY";

  const siteFields: SiteField[] = useMemo(
    () => [
      {
        key: "senderSiteId",
        label: "drivePlanning.freights.sender",
        errorMessage: "drivePlanning.freights.errorMessages.senderSiteMissing",
      },
      {
        key: "recipientSiteId",
        label: "drivePlanning.freights.recipient",
        errorMessage: "drivePlanning.freights.errorMessages.recipientSiteMissing",
      },
      {
        key: "pointOfDepartureSiteId",
        label: "drivePlanning.freights.pointOfDeparture",
        errorMessage: "drivePlanning.freights.errorMessages.pointOfDepartureMissing",
      },
      {
        key: "destinationSiteId",
        label: "drivePlanning.freights.destination",
        errorMessage: "drivePlanning.freights.errorMessages.destinationSiteMissing",
      },
    ],
    [],
  );

  return (
    <Box>
      <Grid container spacing={2} padding={2} columns={2}>
        {siteFields.map(({ key, label, errorMessage }) => (
          <Grid key={key} item xs={1}>
            <TextField
              select
              defaultValue={freight?.[key]}
              inputProps={register(key, {
                required: t(errorMessage),
                validate: validateSiteId,
              })}
              helperText={errors[key]?.message}
              error={!!errors[key]?.message}
              label={t(label)}
            >
              {renderMenuItems()}
            </TextField>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FreightCustomerSitesForm;
