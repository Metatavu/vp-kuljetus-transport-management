import { Stack } from "@mui/material";
import { withForm } from "hooks/form";
import { useTranslation } from "react-i18next";
import { ThermalMonitorFormValues } from "routes/management.thermal-monitors.add";
import { z } from "zod";

const ThermalMonitorFormMonitorStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();

    return (
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <form.AppField
          name="name"
          validators={{ onChange: z.string().min(1, { message: t("formValidationErrors.required") }) }}
          children={(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.name")}
              placeholder={t("management.thermalMonitors.namePlaceholder")}
            />
          )}
        />
        <form.AppField
          name="upperThresholdTemperature"
          validators={{ onChange: z.number({ coerce: true }).optional() }}
          children={(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.upperThresholdTemperature")}
              helperText={t("management.thermalMonitors.upperThresholdTemperatureHelperText")}
              sx={{ width: 300 }}
            />
          )}
        />
        <form.AppField
          name="lowerThresholdTemperature"
          validators={{ onChange: z.number({ coerce: true }).optional() }}
          children={(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.lowerThresholdTemperature")}
              helperText={t("management.thermalMonitors.lowerThresholdTemperatureHelperText")}
              sx={{ width: 300 }}
            />
          )}
        />
      </Stack>
    );
  },
});

export default ThermalMonitorFormMonitorStep;
