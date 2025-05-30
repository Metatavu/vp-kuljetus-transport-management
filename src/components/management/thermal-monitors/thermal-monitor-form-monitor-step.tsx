import { Stack } from "@mui/material";
import { withForm } from "hooks/form";
import { useTranslation } from "react-i18next";
import { z } from "zod/v4";
import { ThermalMonitorFormValues } from "./thermal-monitor-form-dialog";

const ThermalMonitorFormMonitorStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();

    return (
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <form.AppField name="name" validators={{ onChange: z.string(t("formValidationErrors.required")) }}>
          {(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.name")}
              placeholder={t("management.thermalMonitors.namePlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="upperThresholdTemperature" validators={{ onChange: z.coerce.number<number>().optional() }}>
          {(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.upperThresholdTemperature")}
              helperText={t("management.thermalMonitors.upperThresholdTemperatureHelperText")}
              sx={{ width: 300 }}
            />
          )}
        </form.AppField>
        <form.AppField name="lowerThresholdTemperature" validators={{ onChange: z.coerce.number<number>().optional() }}>
          {(field) => (
            <field.FormTextField
              label={t("management.thermalMonitors.lowerThresholdTemperature")}
              helperText={t("management.thermalMonitors.lowerThresholdTemperatureHelperText")}
              sx={{ width: 300 }}
            />
          )}
        </form.AppField>
      </Stack>
    );
  },
});

export default ThermalMonitorFormMonitorStep;
