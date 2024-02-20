import { Autocomplete, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Site } from "generated/client";
import { SessionToken } from "@mapbox/search-js-core";
import { useDebounce } from "../../hooks/use-debounce";
import Mapbox from "components/mapbox";
import { SyntheticEvent, useEffect, useState } from "react";

type Props = {
  errors: FieldErrors<Site>;
  register: UseFormRegister<Site>;
  setFormValue: UseFormSetValue<Site>;
  watch: UseFormWatch<Site>;
};

type AutocompleteLocationOption = {
  title: string;
  subtitle?: string;
  value?: string;
};

const CustomerSiteForm = ({ errors, register, setFormValue, watch }: Props) => {
  const { t } = useTranslation("translation", { keyPrefix: "management.customerSites" });
  const [debouncedSearchTerm, _, setSearchTerm] = useDebounce("", 500);

  const [suggestions, setSuggestions] = useState<AutocompleteLocationOption[]>([]);
  const [autocompleteValue, setAutocompleteValue] = useState<AutocompleteLocationOption>();

  const sessionToken = new SessionToken();

  const validatePostalCode = (value: string) => {
    if (value.length !== 5) {
      return t("errorMessages.postalCodeTooShort");
    }
    if (!/^\d+$/.test(value)) {
      return t("errorMessages.postalCodeInvalidFormat");
    }
    return true;
  };

  const onAutocompleteInputChange = async (query: string) => {
    const suggestions = await Mapbox.getSuggestions(query, sessionToken);
    setSuggestions(
      suggestions.map(({ address, place_formatted, mapbox_id }) => ({
        title: address,
        subtitle: place_formatted,
        value: mapbox_id,
      })),
    );
  };

  const onAutocompleteValueChange = async (_: SyntheticEvent, value: AutocompleteLocationOption | null) => {
    if (!value?.value) return;
    const retrievedSuggestion = await Mapbox.retrieveSuggestion(value.value, sessionToken);
    if (!retrievedSuggestion) return;
    const [lng, lat] = retrievedSuggestion.geometry.coordinates;
    const { postcode, place } = retrievedSuggestion.properties.context;
    setFormValue("address", value.title);
    setFormValue("location", `POINT(${lat} ${lng})`);
    setFormValue("postalCode", postcode.name);
    setFormValue("locality", place.name);
    setAutocompleteValue(value);
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSuggestions([]);
      setAutocompleteValue(undefined);
      return;
    }
    onAutocompleteInputChange(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <Stack width={356} padding="16px" gap="16px">
      <TextField
        label={t("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register("name", { required: t("errorMessages.nameMissing") })}
      />
      <Autocomplete
        options={suggestions}
        value={autocompleteValue}
        defaultValue={{ title: watch("address") }}
        {...register("address")}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.value}>
            <ListItemText primary={option.title} secondary={option.subtitle} />
          </ListItem>
        )}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        getOptionKey={(option) => option.value ?? ""}
        renderInput={(params) => <TextField {...params} label={t("address")} />}
        onInputChange={(event, value) => {
          if (!event) return;
          setSearchTerm(value);
        }}
        onChange={onAutocompleteValueChange}
      />
      <TextField
        label={t("postalCode")}
        error={!!errors.postalCode}
        helperText={errors.postalCode?.message}
        {...register("postalCode", { validate: validatePostalCode })}
      />
      <TextField
        label={t("municipality")}
        error={!!errors.locality}
        helperText={errors.locality?.message}
        {...register("locality", { required: t("errorMessages.municipalityMissing") })}
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
