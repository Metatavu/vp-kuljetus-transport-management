import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ThermalMonitorFormDialog, {
  ThermalMonitorFormValues,
} from "components/management/thermal-monitors/thermal-monitor-form-dialog";
import { ThermalMonitorStatus } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { useCallback } from "react";

export const Route = createFileRoute("/management/thermal-monitors/add")({
  component: ManagementThermalMonitorsAdd,
});

function ManagementThermalMonitorsAdd() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClose = useCallback(() => navigate({ to: "/management/thermal-monitors" }), [navigate]);

  const createThermalMonitorMutation = useMutation({
    mutationFn: async (data: ThermalMonitorFormValues) => {
      if (!data.name?.length) throw new Error("Name is required");

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
    onError: (error) => {
      console.error("Failed to create thermal monitor", error);
    },
  });

  return <ThermalMonitorFormDialog onSave={createThermalMonitorMutation.mutate} onClose={handleClose} />;
}
