import { Button, Dialog, DialogActions, DialogContent, Step, StepLabel, Stepper } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import DialogHeader from "components/generic/dialog-header";
import ThermalMonitorFormMonitorStep from "components/management/thermal-monitors/thermal-monitor-form-monitor-step";
import ThermalMonitorFormScheduleStep from "components/management/thermal-monitors/thermal-monitor-form-schedule-step";
import ThermalMonitorFormThermometersStep from "components/management/thermal-monitors/thermal-monitor-form-thermometers-step";
import { ThermalMonitorSchedulePeriod, ThermalMonitorStatus, ThermalMonitorType } from "generated/client";
import { useAppForm } from "hooks/form";
import { QUERY_KEYS } from "hooks/use-queries";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/management/thermal-monitors/add")({
  component: ManagementThermalMonitorsAdd,
});

const steps = ["monitor", "thermometers", "schedule", "pagingPolicies"] as const;

export type ThermalMonitorFormValues = {
  name: string;
  lowerThresholdTemperature?: number;
  upperThresholdTemperature?: number;
  thermometerIds: string[];
  type: ThermalMonitorType;
  activeFrom?: Date;
  activeTo?: Date;
  schedule?: ThermalMonitorSchedulePeriod[];
  pagingPolicies: {
    name: string;
    contactId: string;
    escalationDelaySeconds: number;
  }[];
};

function ManagementThermalMonitorsAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);

  const form = useAppForm({
    defaultValues: {
      name: "",
      type: ThermalMonitorType.OneOff,
      lowerThresholdTemperature: undefined,
      upperThresholdTemperature: undefined,
      thermometerIds: [],
      activeAt: new Date(),
      pagingPolicies: [],
    } as ThermalMonitorFormValues,
    onSubmit: ({ value }) => createThermalMonitorMutation.mutate(value),
  });

  const createThermalMonitorMutation = useMutation({
    mutationFn: async (data: ThermalMonitorFormValues) => {
      const thermalMonitor = await api.thermalMonitors.createThermalMonitor({
        thermalMonitor: {
          name: data.name,
          lowerThresholdTemperature: data.lowerThresholdTemperature,
          upperThresholdTemperature: data.upperThresholdTemperature,
          status: ThermalMonitorStatus.Pending,
          thermometerIds: data.thermometerIds,
          monitorType: data.type,
          activeFrom: data.activeFrom,
          activeTo: data.activeTo,
          schedule: data.schedule,
        },
      });

      await Promise.all(
        data.pagingPolicies.map((pagingPolicy, index) =>
          api.thermalMonitorPagingPolicies.createPagingPolicy({
            // biome-ignore lint/style/noNonNullAssertion: API entity must have ID.
            thermalMonitorId: thermalMonitor.id!,
            thermalMonitorPagingPolicy: {
              // biome-ignore lint/style/noNonNullAssertion: API entity must have ID.
              thermalMonitorId: thermalMonitor.id!,
              contactId: pagingPolicy.contactId,
              priority: index,
              escalationDelaySeconds: pagingPolicy.escalationDelaySeconds,
            },
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.THERMAL_MONITORS] });
      handleClose();
    },
  });

  const handleClose = () => navigate({ to: "/management/thermal-monitors" });

  const isStepComplete = (step: (typeof steps)[number], values: ThermalMonitorFormValues) => {
    switch (step) {
      case "monitor":
        return (
          values.name.length > 0 &&
          (values.lowerThresholdTemperature !== undefined || values.upperThresholdTemperature !== undefined)
        );
      case "thermometers":
        return values.thermometerIds.length > 0;
      case "schedule":
        return values.type === ThermalMonitorType.OneOff
          ? (values.activeFrom !== undefined && values.activeTo !== undefined) ||
              (values.activeFrom === undefined && values.activeTo === undefined)
          : (values.schedule?.length ?? 0) > 0;
      case "pagingPolicies":
        return values.pagingPolicies.length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ThermalMonitorFormMonitorStep form={form} />;
      case 1:
        return <ThermalMonitorFormThermometersStep form={form} />;
      case 2:
        return <ThermalMonitorFormScheduleStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 0 } }}>
      <DialogHeader
        title={t("management.thermalMonitors.addNewMonitor")}
        closeTooltip={t("tooltips.closeDialog")}
        onClose={handleClose}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <form.Subscribe
            selector={(state) => state.values}
            children={(values) => (
              <Stepper activeStep={activeStep}>
                {steps.map((step, index) => (
                  <Step key={step} completed={isStepComplete(step, values)} onClick={() => setActiveStep(index)}>
                    <StepLabel>{t(`management.thermalMonitors.${step}`)}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          />
          {renderStepContent()}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="text" onClick={handleClose}>
            {t("cancel")}
          </Button>
          {activeStep > 0 && (
            <Button variant="outlined" onClick={() => setActiveStep((prev) => prev - 1)}>
              {t("previous")}
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <form.AppForm>
              <form.FormSubmitButton label={t("save")} />
            </form.AppForm>
          ) : (
            <Button variant="contained" onClick={() => setActiveStep((prev) => prev + 1)}>
              {t("next")}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
