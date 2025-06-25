import { Button, Dialog, DialogActions, DialogContent, Step, StepLabel, Stepper } from "@mui/material";
import DialogHeader from "components/generic/dialog-header";
import {
  type ThermalMonitorPagingPolicy,
  type ThermalMonitorSchedulePeriod,
  ThermalMonitorType,
} from "generated/client";
import { useAppForm } from "hooks/form";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import ThermalMonitorFormMonitorStep from "./thermal-monitor-form-monitor-step";
import ThermalMonitorFormPagingPoliciesStep from "./thermal-monitor-form-paging-policies-step";
import ThermalMonitorFormScheduleStep from "./thermal-monitor-form-schedule-step";
import ThermalMonitorFormThermometersStep from "./thermal-monitor-form-thermometers-step";

const FORM_STEPS = ["monitor", "thermometers", "schedule", "pagingPolicies"] as const;
type FormStep = (typeof FORM_STEPS)[number];

type ThermalMonitorPagingPolicyFormItem = Omit<ThermalMonitorPagingPolicy, "id" | "priority" | "thermalMonitorId"> & {
  id: string;
};

export type ThermalMonitorFormValues = {
  name?: string;
  lowerThresholdTemperature?: number;
  upperThresholdTemperature?: number;
  thermometerIds: string[];
  type: ThermalMonitorType;
  activeFrom?: Date;
  activeTo?: Date;
  schedule?: ThermalMonitorSchedulePeriod[];
  pagingPolicies: ThermalMonitorPagingPolicyFormItem[];
};

type Props = {
  existingThermalMonitorFormValues?: ThermalMonitorFormValues;
  onSave: (values: ThermalMonitorFormValues) => Promise<void>;
  onClose: () => void;
};

const ThermalMonitorFormDialog = ({ existingThermalMonitorFormValues, onSave, onClose }: Props) => {
  const { t } = useTranslation();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const isStepComplete = useCallback(
    (step: FormStep, values: ThermalMonitorFormValues) => {
      switch (step) {
        case "monitor":
          return (
            !!values.name?.length &&
            (values.lowerThresholdTemperature !== undefined || values.upperThresholdTemperature !== undefined) &&
            activeStepIndex > 0
          );
        case "thermometers":
          return values.thermometerIds.length > 0 && activeStepIndex > 1;
        case "schedule":
          return (
            (values.type === ThermalMonitorType.OneOff
              ? (values.activeFrom !== undefined && values.activeTo !== undefined) ||
                (values.activeFrom === undefined && values.activeTo === undefined)
              : (values.schedule?.length ?? 0) > 0) && activeStepIndex > 2
          );
        case "pagingPolicies":
          return values.pagingPolicies.length > 0 && activeStepIndex === 3;
        default:
          return false;
      }
    },
    [activeStepIndex],
  );

  const getDefaultFormValues = useCallback(
    (existingThermalMonitor?: ThermalMonitorFormValues): ThermalMonitorFormValues => ({
      type: existingThermalMonitor?.type ?? ThermalMonitorType.Scheduled,
      lowerThresholdTemperature: existingThermalMonitor?.lowerThresholdTemperature,
      upperThresholdTemperature: existingThermalMonitor?.upperThresholdTemperature,
      thermometerIds: existingThermalMonitor?.thermometerIds ?? [],
      activeFrom: existingThermalMonitor?.activeFrom,
      activeTo: existingThermalMonitor?.activeTo,
      schedule: existingThermalMonitor?.schedule,
      name: existingThermalMonitor?.name,
      pagingPolicies: existingThermalMonitor?.pagingPolicies ?? [],
    }),
    [],
  );

  const form = useAppForm({
    defaultValues: getDefaultFormValues(existingThermalMonitorFormValues),
    onSubmit: ({ value }) => onSave(value),
  });

  const renderStepContent = useCallback(
    (step: FormStep) => {
      switch (step) {
        case "monitor":
          return <ThermalMonitorFormMonitorStep form={form} />;
        case "thermometers":
          return <ThermalMonitorFormThermometersStep form={form} />;
        case "schedule":
          return <ThermalMonitorFormScheduleStep form={form} />;
        case "pagingPolicies":
          return <ThermalMonitorFormPagingPoliciesStep form={form} />;
        default:
          return null;
      }
    },
    [form],
  );

  return (
    <Dialog open fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 0 } }}>
      <DialogHeader
        title={t("management.thermalMonitors.addNewMonitor")}
        closeTooltip={t("tooltips.closeDialog")}
        onClose={onClose}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent sx={{ p: 3 }} style={{ height: "calc(100dvh * 2 / 3)" }}>
          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <Stepper activeStep={activeStepIndex}>
                {FORM_STEPS.map((step, index) => (
                  <Step key={step} completed={isStepComplete(step, values)} onClick={() => setActiveStepIndex(index)}>
                    <StepLabel style={{ cursor: "pointer" }}>{t(`management.thermalMonitors.${step}`)}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </form.Subscribe>
          {renderStepContent(FORM_STEPS[activeStepIndex])}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="text" onClick={onClose}>
            {t("cancel")}
          </Button>
          {activeStepIndex > 0 && (
            <Button variant="outlined" onClick={() => setActiveStepIndex((prev) => prev - 1)}>
              {t("previous")}
            </Button>
          )}
          {activeStepIndex === FORM_STEPS.length - 1 ? (
            <form.AppForm>
              <form.FormSubmitButton label={t("save")} />
            </form.AppForm>
          ) : (
            <Button variant="contained" onClick={() => setActiveStepIndex((prev) => prev + 1)}>
              {t("next")}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ThermalMonitorFormDialog;
