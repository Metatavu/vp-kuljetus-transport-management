import PrintIcon from "@mui/icons-material/Print";
import { Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { BlobProvider } from "@react-pdf/renderer";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import DialogHeader from "components/generic/dialog-header";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Freight, FreightUnit, Task } from "generated/client";
import { useCreateFreight, useCreateFreightUnit } from "hooks/use-mutations";
import {
  QUERY_KEYS,
  getListFreightUnitsQueryOptions,
  getListSitesQueryOptions,
  getListTasksQueryOptions,
} from "hooks/use-queries";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FreightCustomerSitesForm from "./freight-customer-sites-form";
import FreightTasks from "./freight-tasks";
import FreightUnits from "./freight-units";
import FreightWaybill from "./freight-waybill";

type Props = {
  freight?: Freight;
  onSave?: UseMutationResult<Freight | undefined, Error, Freight, unknown>;
  onClose: () => void;
};

const FreightDialog = ({ freight, onSave, onClose }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const customerSitesQuery = useQuery(getListSitesQueryOptions());
  const tasksQuery = useQuery(getListTasksQueryOptions({ freightId: freight?.id }, !!freight));
  const freightUnitsQuery = useQuery(getListFreightUnitsQueryOptions({ freightId: freight?.id }, !!freight));

  const [pendingFreightUnits, setPendingFreightUnits] = useState<FreightUnit[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const form = useForm<Freight>({ mode: "onChange", defaultValues: freight });

  const createFreight = useCreateFreight();
  const createFreightUnit = useCreateFreightUnit();

  const saveFreightUnits = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingFreightUnits.map((freightUnit) => {
          if (!freightUnit.id) return Promise.reject();
          return api.freightUnits.updateFreightUnit({
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
          return api.tasks.updateTask({ taskId: task.id, task: task });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
      setPendingTasks([]);
    },
  });

  const copyFreight = async () => {
    if (!freight?.id) return;

    try {
      const createdFreight = await createFreight.mutateAsync({ ...freight, id: undefined });
      if (!createdFreight?.id) return;
      for (const freightUnit of freightUnitsQuery.data?.freightUnits ?? []) {
        await createFreightUnit.mutateAsync({ ...freightUnit, id: undefined, freightId: createdFreight.id });
      }
      navigate({ to: "/drive-planning/freights", search: { freightId: createdFreight.id } });
    } catch (error) {
      toast.error(t("drivePlanning.freights.copyErrorToast"));
    }
  };

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
              <Button variant="contained" onClick={copyFreight} disabled={!freight?.id}>
                {t("drivePlanning.freights.dialog.copyAsNew")}
              </Button>
              <BlobProvider
                document={
                  <FreightWaybill
                    freight={freight}
                    sites={customerSitesQuery.data?.sites ?? []}
                    tasks={tasksQuery.data?.tasks ?? []}
                    freightUnits={freightUnitsQuery.data?.freightUnits ?? []}
                  />
                }
              >
                {({ loading, url }) => (
                  <Button
                    variant="contained"
                    href={url || ""}
                    target="_blank"
                    disabled={!form.formState.isValid || !freight?.id || loading}
                    startIcon={<PrintIcon />}
                  >
                    {t("drivePlanning.freights.dialog.printAndSave")}
                  </Button>
                )}
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
