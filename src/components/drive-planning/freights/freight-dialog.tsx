import { Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
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
import { QUERY_KEYS, useFreightUnits, useSites, useTasks } from "hooks/use-queries";
import { BlobProvider } from "@react-pdf/renderer";
import FreightWaybill from "./freight-waybill";
import PrintIcon from "@mui/icons-material/Print";

type Props = {
  freight?: Freight;
  onSave?: UseMutationResult<void, Error, Freight, unknown>;
  onClose: () => void;
};

const FreightDialog = ({ freight, onSave, onClose }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { freightUnitsApi, tasksApi } = useApi();

  const customerSitesQuery = useSites();
  const tasksQuery = useTasks({ freightId: freight?.id }, !!freight);
  const freightUnitsQuery = useFreightUnits({ freightId: freight?.id }, !!freight);

  const [pendingFreightUnits, setPendingFreightUnits] = useState<FreightUnit[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const form = useForm<Freight>({ mode: "onChange", defaultValues: freight });

  const saveFreightUnits = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingFreightUnits.map((freightUnit) => {
          if (!freightUnit.id) return Promise.reject();
          return freightUnitsApi.updateFreightUnit({
            freightUnitId: freightUnit.id,
            freightUnit: freightUnit,
          });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS, { freightId: freight?.id }] });
    },
  });

  const saveTasks = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingTasks.map((task) => {
          if (!task.id) throw Error("Task id is missing");
          return tasksApi.updateTask({ taskId: task.id, task: task });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
      setPendingTasks([]);
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
    if (freight.id) {
      await saveFreightUnits.mutateAsync();
      await saveTasks.mutateAsync();
    }
    await onSave.mutateAsync(freight);
  };

  const renderFreightContent = useCallback(() => {
    if (!freight?.id || !freightUnitsQuery.data || !tasksQuery.data || !customerSitesQuery.data) return null;

    return (
      <>
        <FreightUnits
          freightUnits={freightUnitsQuery.data.freightUnits}
          freightId={freight.id}
          onEditFreightUnit={onEditFreightUnit}
        />
        <FreightTasks
          customerSites={customerSitesQuery.data.sites}
          tasks={tasksQuery.data.tasks}
          onEditTask={onEditTask}
        />
      </>
    );
  }, [freight?.id, freightUnitsQuery.data, tasksQuery.data, customerSitesQuery.data, onEditFreightUnit, onEditTask]);

  return (
    <Dialog open onClose={onClose} PaperProps={{ sx: { minWidth: "50%", borderRadius: 0 } }}>
      <LoaderWrapper loading={customerSitesQuery.isLoading || tasksQuery.isLoading || freightUnitsQuery.isLoading}>
        <DialogHeader
          closeTooltip={t("tooltips.closeDialog")}
          title={
            freight?.id
              ? t("drivePlanning.freights.dialog.title", { freightNumber: freight.freightNumber })
              : t("drivePlanning.freights.new")
          }
          onClose={onClose}
        />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSaveClick)}>
            <DialogContent sx={{ padding: 0 }}>
              <Stack spacing={2}>
                <FreightCustomerSitesForm freight={freight} customerSites={customerSitesQuery.data?.sites ?? []} />
                {renderFreightContent()}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={onClose}>
                {t("cancel")}
              </Button>
              <BlobProvider document={<FreightWaybill freight={freight} />}>
                {({ loading, url }) => {
                  if (!url) return null;
                  return (
                    <Button
                      variant="contained"
                      disabled={!form.formState.isValid || !freight?.id || loading}
                      onClick={() => window.open(url, "_blank")}
                      startIcon={<PrintIcon />}
                    >
                      {t("drivePlanning.freights.dialog.printAndSave")}
                    </Button>
                  );
                }}
              </BlobProvider>
              <Button variant="contained" disabled={!form.formState.isValid} type="submit">
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
