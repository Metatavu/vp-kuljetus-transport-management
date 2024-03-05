import { Button, Dialog, DialogActions, DialogContent, MenuItem, Stack, TextField } from "@mui/material";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Driver, Route, Truck } from "generated/client";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import DialogHeader from "components/generic/dialog-header";
import { QUERY_KEYS } from "hooks/use-queries";

type Props = {
  initialDate: DateTime;
  routeId?: string;
  onSave?: UseMutationResult<void, Error, Route, unknown>;
};

const RouteDialog = ({ initialDate, routeId, onSave }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { routesApi, trucksApi, driversApi } = useApi();

  const routeQuery = useQuery({
    queryKey: [QUERY_KEYS.ROUTES, routeId],
    queryFn: () => (routeId ? routesApi.findRoute({ routeId: routeId }) : undefined),
    enabled: !!routeId,
  });

  const { truckId, driverId, departureTime } = routeQuery.data ?? {};

  const {
    handleSubmit,
    register,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<Route>({
    mode: "onChange",
    defaultValues: {
      ...routeQuery.data,
      departureTime: departureTime ?? initialDate.toJSDate(),
    },
  });

  const trucksQuery = useQuery({
    queryKey: [QUERY_KEYS.TRUCKS],
    queryFn: () => trucksApi.listTrucks(),
  });

  const driversQuery = useQuery({
    queryKey: [QUERY_KEYS.DRIVERS],
    queryFn: () => driversApi.listDrivers(),
  });

  const onSaveClick = (route: Route) => onSave?.mutateAsync(route);

  const handleClose = () => navigate({ to: "/drive-planning/routes", search: { date: initialDate } });

  const setSingleSelectValue = (value: string) => (value === "EMPTY" ? undefined : value);

  const renderTruck = (truck: Truck) => (
    <MenuItem key={truck.id} value={truck.id}>
      {truck.name}
    </MenuItem>
  );

  const renderDriver = (driver: Driver) => (
    <MenuItem key={driver.id} value={driver.id}>
      {driver.displayName}
    </MenuItem>
  );

  const renderTrucks = () => [
    <MenuItem key="EMPTY" value="EMPTY">
      {t("noSelection")}
    </MenuItem>,
    (trucksQuery.data ?? []).map(renderTruck),
  ];

  const renderDrivers = () => [
    <MenuItem key="EMPTY" value="EMPTY">
      {t("noSelection")}
    </MenuItem>,
    (driversQuery.data ?? []).map(renderDriver),
  ];

  return (
    <Dialog
      open
      onClose={handleClose}
      PaperProps={{ sx: { minWidth: "326px", minHeight: "348px", margin: 0, borderRadius: 0 } }}
    >
      <LoaderWrapper loading={routeQuery.isLoading || trucksQuery.isLoading || driversQuery.isLoading}>
        <DialogHeader
          title={routeId ? t("drivePlanning.routes.dialog.title") : t("drivePlanning.routes.newRoute")}
          onClose={handleClose}
        />
        <form onSubmit={handleSubmit(onSaveClick)}>
          <DialogContent sx={{ padding: "16px" }}>
            <Stack spacing={2}>
              <DatePicker
                label={t("drivePlanning.routes.date")}
                value={initialDate}
                onChange={(value: DateTime | null) =>
                  value ? setValue("departureTime", value.toJSDate()) : resetField("departureTime")
                }
              />
              <TextField {...register("name", { required: true })} label={t("drivePlanning.routes.name")} />
              <TextField
                {...register("truckId", { setValueAs: setSingleSelectValue })}
                select
                defaultValue={truckId ?? "EMPTY"}
                label={t("drivePlanning.routes.truck")}
                helperText={t("drivePlanning.routes.helperText")}
              >
                {renderTrucks()}
              </TextField>
              <TextField
                {...register("driverId", { setValueAs: setSingleSelectValue })}
                select
                defaultValue={driverId ?? "EMPTY"}
                label={t("drivePlanning.routes.driver")}
                helperText={t("drivePlanning.routes.helperText")}
              >
                {renderDrivers()}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleClose}>
              {t("cancel")}
            </Button>
            <Button variant="contained" disabled={!!Object.keys(errors).length} type="submit">
              {routeId
                ? t("drivePlanning.routes.dialog.saveExistingRoute")
                : t("drivePlanning.routes.dialog.saveNewRoute")}
            </Button>
          </DialogActions>
        </form>
      </LoaderWrapper>
    </Dialog>
  );
};

export default RouteDialog;
