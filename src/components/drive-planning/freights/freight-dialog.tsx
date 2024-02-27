import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Freight, FreightUnit, Task } from "generated/client";
import FreightCustomerSitesForm from "./freight-customer-sites-form";
import FreightUnits from "./freight-units";
import FreightTasks from "./freight-tasks";
import { useCallback, useState } from "react";
import LoaderWrapper from "components/generic/loader-wrapper";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  freightId?: string;
  onSave?: UseMutationResult<void, Error, Freight, unknown>;
};

const FreightDialog = ({ freightId, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { freightsApi, sitesApi, freightUnitsApi, tasksApi } = useApi();

  const [pendingFreightUnits, setPendingFreightUnits] = useState<FreightUnit[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  const freightQuery = useQuery({
    queryKey: ["freights", freightId],
    // biome-ignore lint/style/noNonNullAssertion: <This query isn't enabled unless freightId is defined>
    queryFn: () => freightsApi.findFreight({ freightId: freightId! }),
    enabled: !!freightId,
  });

  const customerSitesQuery = useQuery({
    queryKey: ["customerSites"],
    queryFn: () => sitesApi.listSites(),
    enabled: !freightQuery?.isLoading,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks, freightId"],
    queryFn: () => tasksApi.listTasks({ freightId: freightId }),
    enabled: !!freightId,
  });

  const freightUnitsQuery = useQuery({
    queryKey: ["freightUnits", freightId],
    queryFn: () => freightUnitsApi.listFreightUnits({ freightId }),
    enabled: !!freightId,
  });

  const saveFreightUnits = useMutation({
    mutationFn: () =>
      Promise.all(
        pendingFreightUnits.map((freightUnit) => {
          if (!freightUnit.id) return Promise.reject();
          freightUnitsApi.updateFreightUnit({ freightUnitId: freightUnit.id, freightUnit: freightUnit });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freightUnits", freightId] });
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
      queryClient.invalidateQueries({ queryKey: ["tasks", freightId] });
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

  const renderFreightContent =
    // biome-ignore lint/correctness/useExhaustiveDependencies: <Biome seems to in-correctly think that no other than type is required as a dependency for this hook.>
    useCallback(() => {
      if (!freightId || !freightUnitsQuery.data || !tasksQuery.data || !customerSitesQuery.data) return null;
      return (
        <>
          <FreightUnits
            freightUnits={freightUnitsQuery.data}
            freightId={freightId}
            onEditFreightUnit={onEditFreightUnit}
          />
          <FreightTasks customerSites={customerSitesQuery.data} tasks={tasksQuery.data} onEditTask={onEditTask} />
        </>
      );
    }, [freightId, freightUnitsQuery.data, tasksQuery.data, customerSitesQuery.data]);

  const form = useForm<Freight>({ mode: "onChange", defaultValues: freightQuery.data });
  const isSaveEnabled = !Object.keys(form.formState.errors).length;

  return (
    <Dialog open={true} onClose={handleClose} PaperProps={{ sx: { minWidth: "50%", borderRadius: 0 } }}>
      <LoaderWrapper
        loading={
          freightQuery?.isLoading || customerSitesQuery.isLoading || tasksQuery.isLoading || freightUnitsQuery.isLoading
        }
      >
        <Stack
          padding="0px 8px 0px 16px"
          direction="row"
          height="42px"
          bgcolor="#4E8A9C"
          justifyContent="space-between"
        >
          <Typography alignSelf="center" variant="h6" sx={{ color: "#ffffff" }}>
            {freightId
              ? t("drivePlanning.freights.dialog.title", { freightNumber: freightQuery?.data?.freightNumber })
              : t("drivePlanning.freights.new")}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close htmlColor="#ffffff" />
          </IconButton>
        </Stack>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSaveClick)}>
            <DialogContent sx={{ padding: 0 }}>
              <Stack spacing={2}>
                <FreightCustomerSitesForm freight={freightQuery.data} customerSites={customerSitesQuery.data ?? []} />
                {renderFreightContent()}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button variant="contained" disabled={!isSaveEnabled} type="submit">
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
