import { Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { Freight, FreightUnit, Task } from "generated/client";
import FreightCustomerSitesForm from "./freight-customer-sites-form";
import FreightUnits from "./freight-units";
import FreightTasks from "./freight-tasks";
import { useCallback, useState } from "react";
import LoaderWrapper from "components/generic/loader-wrapper";
import { FormProvider, useForm } from "react-hook-form";
import DialogHeader from "components/generic/dialog-header";
import { QUERY_KEYS, useFreight, useFreightUnits, useSites, useTasks } from "hooks/use-queries";

type Props = {
  freightId?: string;
  onSave?: UseMutationResult<void, Error, Freight, unknown>;
};

const FreightDialog = ({ freightId, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { freightUnitsApi, tasksApi } = useApi();

  const freightQuery = useFreight(freightId, !!freightId);
  const customerSitesQuery = useSites(undefined, !freightQuery.isLoading);
  const tasksQuery = useTasks({ freightId: freightId }, !!freightId);
  const freightUnitsQuery = useFreightUnits({ freightId: freightId }, !!freightId);

  const [pendingFreightUnits, setPendingFreightUnits] = useState<FreightUnit[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const form = useForm<Freight>({ mode: "onChange", defaultValues: freightQuery.data });

  const saveFreightUnits = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingFreightUnits.map((freightUnit) => {
          if (!freightUnit.id) return Promise.reject();
          freightUnitsApi.updateFreightUnit({
            freightUnitId: freightUnit.id,
            freightUnit: { ...freightUnit, quantity: freightUnit.quantity || undefined },
          });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS, freightId] });
    },
  });

  const saveTasks = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingTasks.map((task) => {
          if (!task.id) return Promise.reject();
          tasksApi.updateTask({ taskId: task.id, task: task });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, freightId] });
    },
  });

  const onEditFreightUnit = (updatedFreightUnit: FreightUnit) => {
    const filteredTempFreightUnits = pendingFreightUnits.filter(
      (freightUnit) => freightUnit.id !== updatedFreightUnit.id,
    );
    setPendingFreightUnits([...filteredTempFreightUnits, updatedFreightUnit]);
  };

  const onEditTask = (updatedTask: Task) => {
    const filteredTempTasks = pendingTasks.filter((task) => task.id !== updatedTask.id);
    setPendingTasks([...filteredTempTasks, updatedTask]);
  };

  const onSaveClick = async (freight: Freight) => {
    if (!onSave) return;
    if (freightId) {
      await saveFreightUnits.mutateAsync();
      await saveTasks.mutateAsync();
    }
    await onSave.mutateAsync(freight);
  };

  const handleClose = () => navigate({ to: "/drive-planning/freights" });

  const renderFreightContent = useCallback(() => {
    if (!freightId || !freightUnitsQuery.data || !tasksQuery.data || !customerSitesQuery.data) return null;

    return (
      <>
        <FreightUnits
          freightUnits={freightUnitsQuery.data.freightUnits}
          freightId={freightId}
          onEditFreightUnit={onEditFreightUnit}
        />
        <FreightTasks
          customerSites={customerSitesQuery.data.sites}
          tasks={tasksQuery.data.tasks}
          onEditTask={onEditTask}
        />
      </>
    );
  }, [freightId, freightUnitsQuery.data, tasksQuery.data, customerSitesQuery.data, onEditFreightUnit, onEditTask]);

  return (
    <Dialog open={true} onClose={handleClose} PaperProps={{ sx: { minWidth: "50%", borderRadius: 0 } }}>
      <LoaderWrapper
        loading={
          freightQuery?.isLoading || customerSitesQuery.isLoading || tasksQuery.isLoading || freightUnitsQuery.isLoading
        }
      >
        <DialogHeader
          title={
            freightId
              ? t("drivePlanning.freights.dialog.title", { freightNumber: freightQuery?.data?.freightNumber })
              : t("drivePlanning.freights.new")
          }
          onClose={handleClose}
        />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSaveClick)}>
            <DialogContent sx={{ padding: 0 }}>
              <Stack spacing={2}>
                <FreightCustomerSitesForm
                  freight={freightQuery.data}
                  customerSites={customerSitesQuery.data?.sites ?? []}
                />
                {renderFreightContent()}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button variant="contained" disabled={!!Object.keys(form.formState.errors).length} type="submit">
                {t("drivePlanning.freights.dialog.save")}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </LoaderWrapper>
    </Dialog>
  );
};

export default FreightDialog;
