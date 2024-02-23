import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Close } from "@mui/icons-material";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Freight, FreightUnit, Task } from "generated/client";
import FreightCustomerSitesForm from "./freight-customer-sites-form";
import { useForm } from "react-hook-form";
import FreightUnits from "./freight-units";
import FreightTasks from "./freight-tasks";
import { useState } from "react";

type Props = {
  type: "ADD" | "MODIFY";
  initialData?: Freight;
  onSave?: UseMutationResult<void, Error, Freight, unknown>;
};

const FreightDialog = ({ type, initialData, onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sitesApi, freightUnitsApi, tasksApi } = useApi();
  const { freightId } = useParams({ from: "/drive-planning/freights/$freightId/modify" });

  const [tempFreightUnits, setTempFreightUnits] = useState<FreightUnit[]>([]);
  const [tempTasks, setTemptTasks] = useState<Task[]>([]);

  const customerSites = useQuery({
    queryKey: ["customerSites"],
    queryFn: async () => await sitesApi.listSites(),
  });

  const tasks = useQuery({
    queryKey: ["tasks, freightId"],
    queryFn: async () => await tasksApi.listTasks({ freightId: freightId }),
  });

  const freightUnits = useQuery({
    queryKey: ["freightUnits", freightId],
    queryFn: async () => await freightUnitsApi.listFreightUnits({ freightId }),
  });

  const saveFreightUnits = useMutation({
    mutationFn: async () =>
      await Promise.all(
        tempFreightUnits.map((freightUnit) => {
          if (!freightUnit.id) return Promise.reject();
          freightUnitsApi.updateFreightUnit({ freightUnitId: freightUnit.id, freightUnit: freightUnit });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freightUnits", freightId] });
    },
  });

  const saveTasks = useMutation({
    mutationFn: async () =>
      await Promise.all(
        tempTasks.map((task) => {
          if (!task.id) return Promise.reject();
          tasksApi.updateTask({ taskId: task.id, task: task });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", freightId] });
    },
  });

  const onEditFreightUnit = (updatedFreightUnit: FreightUnit) => {
    const filteredTempFreightUnits = tempFreightUnits.filter((freightUnit) => freightUnit.id !== updatedFreightUnit.id);
    setTempFreightUnits([...filteredTempFreightUnits, updatedFreightUnit]);
  };

  const onEditTask = (updatedTask: Task) => {
    const filteredTempTasks = tempTasks.filter((task) => task.id !== updatedTask.id);
    setTemptTasks([...filteredTempTasks, updatedTask]);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Freight>({
    mode: "onChange",
    defaultValues: initialData,
  });

  const onSaveClick = async (freight: Freight) => {
    if (!onSave) return;
    await saveFreightUnits.mutateAsync();
    await saveTasks.mutateAsync();
    await onSave.mutateAsync(freight);
  };

  const handleClose = () => navigate({ to: "/drive-planning/freights" });

  const renderFreightUnitsTable = () => {
    if (type === "ADD" || !freightUnits.data) return null;
    return (
      <FreightUnits freightUnits={freightUnits.data} freightId={freightId} onEditFreightUnit={onEditFreightUnit} />
    );
  };

  const renderFreightTasksTable = () => {
    if (type === "ADD" || !tasks.data) return null;

    return <FreightTasks customerSites={customerSites.data ?? []} tasks={tasks.data} onEditTask={onEditTask} />;
  };

  const isSaveEnabled = !Object.keys(errors).length;

  return (
    <Dialog open={true} onClose={handleClose} PaperProps={{ sx: { minWidth: "50%", borderRadius: 0 } }}>
      <Stack padding="0px 8px 0px 16px" direction="row" height="42px" bgcolor="#4E8A9C" justifyContent="space-between">
        <Typography alignSelf="center" variant="h6" sx={{ color: "#ffffff" }}>
          {type === "ADD"
            ? t("drivePlanning.freights.new")
            : t("drivePlanning.freights.dialog.title", { freightNumber: initialData?.freightNumber })}
        </Typography>
        <IconButton onClick={handleClose}>
          <Close htmlColor="#ffffff" />
        </IconButton>
      </Stack>
      <DialogContent sx={{ padding: 0 }}>
        <Stack spacing={2}>
          <FreightCustomerSitesForm
            customerSites={customerSites.data ?? []}
            errors={errors}
            register={register}
            watch={watch}
          />
          {renderFreightUnitsTable()}
          {renderFreightTasksTable()}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="contained" disabled={!isSaveEnabled} onClick={handleSubmit(onSaveClick)}>
          {t("drivePlanning.freights.dialog.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FreightDialog;
