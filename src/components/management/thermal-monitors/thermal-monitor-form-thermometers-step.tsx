import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { withForm } from "hooks/form";
import {
  getListSitesQueryOptions,
  getListTerminalThermometersQueryOptions,
  getListTowablesQueryOptions,
  getListTruckOrTowableThermometersQueryOptions,
  getListTrucksQueryOptions,
} from "hooks/use-queries";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThermalMonitorFormValues } from "./thermal-monitor-form-dialog";

type ThermometerWithRelatedEntityName = {
  id: string;
  name: string;
  entityName?: string;
  plateNumber?: string;
};

const ThermalMonitorFormThermometersStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();

    const listTerminalThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({ max: 10000 }));
    const listTruckOrTowableThermometersQuery = useQuery(getListTruckOrTowableThermometersQueryOptions({ max: 10000 }));
    const listTrucksQuery = useQuery(getListTrucksQueryOptions({ max: 10000 }));
    const listTowablesQuery = useQuery(getListTowablesQueryOptions({ max: 10000 }));
    const listSitesQuery = useQuery(getListSitesQueryOptions({ max: 10000 }));

    const [searchValue, setSearchValue] = useState("");

    const thermometersWithRelatedEntityNames = useMemo(() => {
      const list: ThermometerWithRelatedEntityName[] = [];

      for (const thermometer of listTerminalThermometersQuery.data ?? []) {
        if (!thermometer.id) continue;

        const site = listSitesQuery.data?.sites.find((site) => site.id === thermometer.siteId);
        if (!site) continue;

        list.push({
          id: thermometer.id,
          name: thermometer.name ?? thermometer.hardwareSensorId,
          entityName: site.name,
        });
      }

      for (const thermometer of listTruckOrTowableThermometersQuery.data ?? []) {
        if (!thermometer.id) continue;

        const entity =
          thermometer.entityType === "truck"
            ? listTrucksQuery.data?.trucks.find((truck) => truck.id === thermometer.entityId)
            : listTowablesQuery.data?.towables.find((towable) => towable.id === thermometer.entityId);

        if (!entity) continue;

        list.push({
          id: thermometer.id,
          name: thermometer.name ?? thermometer.macAddress,
          entityName: entity.name,
          plateNumber: entity.plateNumber,
        });
      }

      return list;
    }, [
      listTrucksQuery.data,
      listTowablesQuery.data,
      listSitesQuery.data,
      listTerminalThermometersQuery.data,
      listTruckOrTowableThermometersQuery.data,
    ]);

    const filteredThermometers = useMemo(() => {
      if (!searchValue) return thermometersWithRelatedEntityNames;
      const fuse = new Fuse(thermometersWithRelatedEntityNames, {
        keys: ["name", "entityName", "plateNumber"],
      });
      return fuse.search(searchValue).map((result) => result.item);
    }, [thermometersWithRelatedEntityNames, searchValue]);

    if (listTerminalThermometersQuery.isLoading || listTruckOrTowableThermometersQuery.isLoading) {
      return (
        <Box height={500} justifyContent="center" alignItems="center" display="flex">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Stack direction="column" spacing={1} flex={1} maxHeight={500}>
          <Typography variant="h6">{t("management.thermalMonitors.selectMonitoredThermometers")}</Typography>
          <TextField
            label={t("search")}
            helperText={t("management.thermalMonitors.searchHelperText")}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Box flex={1} overflow="auto" border={1} borderColor="divider" borderRadius={1} bgcolor="background.default">
            {filteredThermometers.map((thermometer) => (
              <ListItem
                key={thermometer.id}
                disablePadding
                divider
                sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
              >
                <ListItemButton
                  sx={{ py: 1 }}
                  onClick={() =>
                    form.setFieldValue("thermometerIds", (values) =>
                      values.includes(thermometer.id)
                        ? values.filter((id) => id !== thermometer.id)
                        : [...values, thermometer.id],
                    )
                  }
                >
                  <ListItemIcon>
                    <form.Subscribe
                      selector={(state) => state.values.thermometerIds}
                      children={(thermometerIds) => (
                        <Checkbox
                          edge="start"
                          checked={thermometerIds.includes(thermometer.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      )}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={thermometer.name}
                    secondary={`${thermometer.entityName}${
                      thermometer.plateNumber ? ` / ${thermometer.plateNumber}` : ""
                    }`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </Stack>
        <Stack direction="column" spacing={1} flex={1} maxHeight={500}>
          <Typography variant="h6">{t("management.thermalMonitors.monitoredThermometers")}</Typography>
          <Box flex={1} overflow="auto" border={1} borderColor="divider" borderRadius={1} bgcolor="background.default">
            <form.Subscribe selector={(state) => state.values.thermometerIds}>
              {(thermometerIds) => (
                <>
                  {thermometerIds.map((id) => {
                    const thermometer = thermometersWithRelatedEntityNames.find((thermometer) => thermometer.id === id);
                    if (!thermometer) return null;

                    return (
                      <ListItem
                        key={id}
                        divider
                        sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
                        secondaryAction={
                          <IconButton
                            color="error"
                            onClick={() =>
                              form.setFieldValue("thermometerIds", (values) => values.filter((value) => value !== id))
                            }
                          >
                            <CancelIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={thermometer?.name}
                          secondary={`${thermometer?.entityName}${
                            thermometer?.plateNumber ? ` / ${thermometer.plateNumber}` : ""
                          }`}
                        />
                      </ListItem>
                    );
                  })}
                </>
              )}
            </form.Subscribe>
          </Box>
        </Stack>
      </Stack>
    );
  },
});

export default ThermalMonitorFormThermometersStep;
