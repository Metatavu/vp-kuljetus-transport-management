import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ThermalMonitorFormDialog, {
  type ThermalMonitorFormValues,
} from "components/management/thermal-monitors/thermal-monitor-form-dialog";
import { ThermalMonitorStatus, ThermalMonitorType } from "generated/client";
import {
  getFindThermalMonitorQueryOptions,
  getListThermalMonitorPagingPoliciesQueryOptions,
  QUERY_KEYS,
} from "hooks/use-queries";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/management/thermal-monitors/$thermalMonitorId/modify")({
  component: ModifyThermalMonitor,
});

function ModifyThermalMonitor() {
  const { thermalMonitorId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const findThermalMonitor = useQuery(getFindThermalMonitorQueryOptions({ thermalMonitorId }));
  const listThermalMonitorPagingPolicies = useQuery(
    getListThermalMonitorPagingPoliciesQueryOptions({ thermalMonitorId: thermalMonitorId, first: 0, max: 1000 }),
  );

  const handleClose = useCallback(() => navigate({ to: "/management/thermal-monitors" }), [navigate]);

  const updateThermalMonitorMutation = useMutation({
    mutationFn: async (formValues: ThermalMonitorFormValues) => {
      if (!listThermalMonitorPagingPolicies.data) {
        throw new Error("Paging policies were not fetched, cannot update monitor");
      }

      if (!formValues.name?.length) throw new Error("Name is required");

      await api.thermalMonitors.updateThermalMonitor({
        thermalMonitorId,
        thermalMonitor: {
          name: formValues.name,
          lowerThresholdTemperature: formValues.lowerThresholdTemperature,
          upperThresholdTemperature: formValues.upperThresholdTemperature,
          status: findThermalMonitor.data?.status ?? ThermalMonitorStatus.Pending,
          thermometerIds: formValues.thermometerIds,
          monitorType: formValues.type,
          activeFrom: formValues.activeFrom,
          activeTo: formValues.activeTo,
          schedule: formValues.schedule,
        },
      });

      const pagingPoliciesToBeDeleted = listThermalMonitorPagingPolicies.data.filter(
        (pagingPolicy) => !formValues.pagingPolicies.some((p) => p.id === pagingPolicy.id),
      );

      await Promise.all(
        pagingPoliciesToBeDeleted.map((pagingPolicy) =>
          api.thermalMonitorPagingPolicies.deletePagingPolicy({
            thermalMonitorId: thermalMonitorId,
            // biome-ignore lint/style/noNonNullAssertion: API entity must have ID.
            pagingPolicyId: pagingPolicy.id!,
          }),
        ),
      );

      await Promise.all(
        formValues.pagingPolicies.map((pagingPolicy, index) => {
          const existingPagingPolicy = listThermalMonitorPagingPolicies.data.some((p) => p.id === pagingPolicy.id);

          if (existingPagingPolicy) {
            return api.thermalMonitorPagingPolicies.updatePagingPolicy({
              thermalMonitorId: thermalMonitorId,
              // biome-ignore lint/style/noNonNullAssertion: API entity must have ID.
              pagingPolicyId: pagingPolicy.id!,
              thermalMonitorPagingPolicy: {
                thermalMonitorId: thermalMonitorId,
                contactId: pagingPolicy.contactId,
                priority: index,
                escalationDelaySeconds: pagingPolicy.escalationDelaySeconds,
              },
            });
          }

          return api.thermalMonitorPagingPolicies.createPagingPolicy({
            thermalMonitorId: thermalMonitorId,
            thermalMonitorPagingPolicy: {
              thermalMonitorId: thermalMonitorId,
              contactId: pagingPolicy.contactId,
              priority: index,
              escalationDelaySeconds: pagingPolicy.escalationDelaySeconds,
            },
          });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.THERMAL_MONITORS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.THERMAL_MONITOR_PAGING_POLICIES, { thermalMonitorId }] });
      handleClose();
    },
    onError: (error) => {
      console.error("Failed to create thermal monitor", error);
    },
  });

  const existingThermalMonitorFormValues = useMemo((): ThermalMonitorFormValues | undefined => {
    const thermalMonitor = findThermalMonitor.data;
    const pagingPolicies = listThermalMonitorPagingPolicies.data ?? [];
    return {
      name: thermalMonitor?.name,
      lowerThresholdTemperature: thermalMonitor?.lowerThresholdTemperature,
      upperThresholdTemperature: thermalMonitor?.upperThresholdTemperature,
      thermometerIds: thermalMonitor?.thermometerIds ?? [],
      type: thermalMonitor?.monitorType ?? ThermalMonitorType.OneOff,
      activeFrom: thermalMonitor?.activeFrom,
      activeTo: thermalMonitor?.activeTo,
      schedule: thermalMonitor?.schedule,
      pagingPolicies: pagingPolicies.map((policy) => ({
        // biome-ignore lint/style/noNonNullAssertion: API entity must have ID.
        id: policy.id!,
        contactId: policy.contactId,
        escalationDelaySeconds: policy.escalationDelaySeconds,
      })),
    };
  }, [findThermalMonitor.data, listThermalMonitorPagingPolicies.data]);

  return (
    <ThermalMonitorFormDialog
      existingThermalMonitorFormValues={existingThermalMonitorFormValues}
      onClose={handleClose}
      onSave={updateThermalMonitorMutation.mutateAsync}
    />
  );
}
