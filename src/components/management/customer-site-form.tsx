import { Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CUSTOMER_SITE_FORM } from "./customer-site";

type Props = {
  errors: FieldErrors<typeof CUSTOMER_SITE_FORM>;
  register: UseFormRegister<typeof CUSTOMER_SITE_FORM>;
};

const CustomerSiteForm = ({ errors, register }: Props) => {
  const { t } = useTranslation();

  const validatePostalCode = (value: string) => {
    if (value.length !== 5) {
      return t("customerSites.errorMessages.postalCodeTooShort");
    }
    if (!/^\d+$/.test(value)) {
      return t("customerSites.errorMessages.postalCodeInvalidFormat");
    }
    return true;
  };

  return (
    <Stack width={356} padding="16px" gap="16px">
      <TextField
        select
        label={t("customerSites.type")}
        InputProps={{ disableUnderline: false }}
        {...register("type")}
      />
      <TextField
        label={t("customerSites.name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name", { required: t("customerSites.errorMessages.nameMissing") })}
      />
      <TextField
        label={t("customerSites.address")}
        error={!!errors.address}
        helperText={errors.address?.message}
        {...register("address", { required: t("customerSites.errorMessages.addressMissing") })}
      />
      <TextField
        label={t("customerSites.postalCode")}
        error={!!errors.postalNumber}
        helperText={errors.postalNumber?.message}
        {...register("postalNumber", { validate: validatePostalCode })}
      />
      <TextField
        label={t("customerSites.municipality")}
        error={!!errors.municipality}
        helperText={errors.municipality?.message}
        {...register("municipality", { required: t("customerSites.errorMessages.municipalityMissing") })}
      />
      <TextField
        fullWidth
        multiline
        minRows={9}
        label={t("customerSites.additionalInfo")}
        variant="standard"
        {...register("additionalInfo")}
      />
    </Stack>
  );
};

export default CustomerSiteForm;
