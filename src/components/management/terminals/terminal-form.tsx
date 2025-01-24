import { SessionToken } from "@mapbox/search-js-core";
import { Autocomplete, Button, ListItem, ListItemText, Stack, TextField, styled } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { Site } from "generated/client";
import { useDebounce } from "hooks/use-debounce";
import Mapbox from "mapbox/index";
import { SyntheticEvent, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { stringify } from "wellknown";

// Styled components
const FlexTextArea = styled(TextField, {
  label: "flex-text-area",
})(() => ({
  flex: 1,
  "& .MuiFilledInput-root": {
    flex: 1,
  },
}));

type Props = {
  errors: FieldErrors<Site>;
  terminal?: Site;
  register: UseFormRegister<Site>;
  setFormValue: UseFormSetValue<Site>;
  watch: UseFormWatch<Site>;
};

type AutocompleteLocationOption = {
  title: string;
  subtitle?: string;
  value?: string;
};

const mapboxSessionToken = new SessionToken();

const TerminalSiteForm = ({ errors, terminal: customerSite, register, setFormValue, watch }: Props) => {
  const { t } = useTranslation();
  const [debouncedSearchTerm, _, setSearchTerm] = useDebounce("", 500);
  const [autocompleteValue, setAutocompleteValue] = useState<AutocompleteLocationOption>({ title: watch("address") });
  const showConfirmDialog = useConfirmDialog();
  const navigate = useNavigate();

  const validatePostalCode = (value: string) => {
    if (value.length !== 5) {
      return t("management.terminals.errorMessages.postalCodeTooShort");
    }
    if (!/^\d+$/.test(value)) {
      return t("management.terminals.errorMessages.postalCodeInvalidFormat");
    }
    return true;
  };

  const suggestions = useQuery({
    queryKey: ["suggestions", debouncedSearchTerm],
    queryFn: () => Mapbox.getSuggestions(debouncedSearchTerm, mapboxSessionToken),
    select: (suggestions) =>
      suggestions.map(({ name, place_formatted, mapbox_id }) => ({
        title: name,
        subtitle: place_formatted,
        value: mapbox_id,
      })),
    enabled: !!debouncedSearchTerm,
  });

  const archiveCustomerSite = useMutation({
    mutationKey: ["archiveSite", watch("id")],
    mutationFn: (site?: Site) => {
      if (!site?.id) return Promise.reject();
      return api.sites.updateSite({ siteId: site.id, site: { ...site, archivedAt: new Date() } });
    },
    onSuccess: () => navigate({ to: "/management/customer-sites" }),
  });

  const onAutocompleteValueChange = async (_: SyntheticEvent, value: string | AutocompleteLocationOption | null) => {
    if (typeof value === "string") return;
    if (!value?.value) return;
    const retrievedSuggestion = await Mapbox.retrieveSuggestion(value.value, mapboxSessionToken);
    if (!retrievedSuggestion) return;
    const [lng, lat] = retrievedSuggestion.geometry.coordinates;
    const { postcode, place } = retrievedSuggestion.properties.context;
    setFormValue("address", value.title);
    setFormValue("location", stringify({ type: "Point", coordinates: [lat, lng] }));
    setFormValue("postalCode", postcode.name);
    setFormValue("locality", place.name);
    setAutocompleteValue(value);
  };

  const isOptionEqualToValue = (option: AutocompleteLocationOption, value: AutocompleteLocationOption) => {
    if (!value.value) return option.title === value.title;

    return option.value === value.value;
  };

  const getAutocompleteOptionLabel = (option?: string | AutocompleteLocationOption) => {
    if (typeof option === "string") return option;
    return option?.title ?? "";
  };

  const getAutocompleteOptionKey = (option?: string | AutocompleteLocationOption) => {
    if (typeof option === "string") return option;
    return option?.value ?? "";
  };

  return (
    <Stack justifyContent="space-between" width={356} p={2}>
      <Stack spacing={2} flex={1}>
        <TextField
          label={t("management.terminals.name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name", { required: t("management.terminals.errorMessages.nameMissing") })}
        />
        <Autocomplete
          freeSolo
          options={suggestions.data ?? []}
          value={autocompleteValue}
          noOptionsText={t("noResults")}
          {...register("address", { required: t("management.terminals.errorMessages.addressMissing") })}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.value}>
              <ListItemText primary={option.title} secondary={option.subtitle} />
            </ListItem>
          )}
          filterOptions={(options) => options}
          getOptionLabel={getAutocompleteOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          getOptionKey={getAutocompleteOptionKey}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("management.terminals.address")}
              helperText={errors.address?.message}
              error={!!errors.address}
            />
          )}
          onInputChange={(event, value) => {
            if (!event) return;
            setSearchTerm(value);
          }}
          onChange={onAutocompleteValueChange}
        />
        <TextField
          label={t("management.terminals.postalCode")}
          error={!!errors.postalCode}
          helperText={errors.postalCode?.message}
          {...register("postalCode", { validate: validatePostalCode })}
        />
        <TextField
          label={t("management.terminals.municipality")}
          error={!!errors.locality}
          helperText={errors.locality?.message}
          {...register("locality", { required: t("management.terminals.errorMessages.municipalityMissing") })}
        />
        <FlexTextArea
          fullWidth
          multiline
          label={t("management.terminals.additionalInfo")}
          minRows={1}
          {...register("additionalInfo")}
          inputProps={{ style: { flex: 1, height: "100%" } }}
        />
        {customerSite && (
          <Button
            variant="outlined"
            onClick={() =>
              showConfirmDialog({
                title: t("management.terminals.archiveDialog.title"),
                description: t("management.terminals.archiveDialog.description", { name: watch("name") }),
                onPositiveClick: () => archiveCustomerSite.mutate(customerSite),
              })
            }
          >
            {t("archive")}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default TerminalSiteForm;
