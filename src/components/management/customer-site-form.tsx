import { Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CUSTOMER_SITE_FORM } from "./customer-site";

type Props = {
  errors: FieldErrors<typeof CUSTOMER_SITE_FORM>;
  register: UseFormRegister<typeof CUSTOMER_SITE_FORM>;
};

const CustomerSiteForm = ({ errors, register }: Props) => {
  const { t } = useTranslation("translation", { keyPrefix: "management.customerSites" });

  const validatePostalCode = (value: string) => {
    if (value.length !== 5) {
      return t("errorMessages.postalCodeTooShort");
    }
    if (!/^\d+$/.test(value)) {
      return t("errorMessages.postalCodeInvalidFormat");
    }
    return true;
  };

  return (
    <Stack width={356} padding="16px" gap="16px">
      <TextField select label={t("type")} InputProps={{ disableUnderline: false }} {...register("type")} />
      <TextField
        label={t("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name", { required: t("errorMessages.nameMissing") })}
      />
      <TextField
        label={t("address")}
        error={!!errors.address}
        helperText={errors.address?.message}
        {...register("address", { required: t("errorMessages.addressMissing") })}
      />
      <TextField
        label={t("postalCode")}
        error={!!errors.postalNumber}
        helperText={errors.postalNumber?.message}
        {...register("postalNumber", { validate: validatePostalCode })}
      />
      <TextField
        label={t("municipality")}
        error={!!errors.municipality}
        helperText={errors.municipality?.message}
        {...register("municipality", { required: t("errorMessages.municipalityMissing") })}
      />
      <TextField
        fullWidth
        multiline
        minRows={9}
        label={t("additionalInfo")}
        variant="standard"
        {...register("additionalInfo")}
      />
    </Stack>
  );
};

export default CustomerSiteForm;
