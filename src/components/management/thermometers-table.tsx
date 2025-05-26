import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { TerminalTemperature, TerminalThermometer, TruckOrTowableThermometer } from "generated/client";
import { Temperature } from "generated/client/models/Temperature";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TimeUtils from "src/utils/time-utils";
import { useInterval } from "usehooks-ts";

type Props = {
  name?: string;
  thermometers: (TruckOrTowableThermometer | TerminalThermometer)[];
  onDeleteDevice?: (deviceIdentifier: string) => void;
  setChangedTerminalThermometerNames: React.Dispatch<
    React.SetStateAction<{ newName: string; thermometerId: string }[]>
  >;
};

const ThermometersTable = forwardRef(
  ({ name, thermometers, onDeleteDevice, setChangedTerminalThermometerNames }: Props, ref) => {
    const { t } = useTranslation();
    const firstThermometer = useMemo(() => thermometers.at(0), [thermometers]);
    const apiRef = useGridApiRef();

    const type = useMemo(() => {
      if (!firstThermometer) return undefined;
      if ("siteId" in firstThermometer) return "terminal";
      if (firstThermometer.entityType === "truck") return "truck";
      if (firstThermometer.entityType === "towable") return "towable";
      return undefined;
    }, [firstThermometer]);

    const [openDeleteDeviceConfirmationDialog, setOpenDeleteDeviceConfirmationDialog] = useState(false);
    const [temperatures, setTemperatures] = useState(new Map<string, TerminalTemperature>());

    const handleClickOpen = () => setOpenDeleteDeviceConfirmationDialog(true);

    const handleClose = () => setOpenDeleteDeviceConfirmationDialog(false);

    const handleDeleteDevice = () => {
      if (!name) return;
      onDeleteDevice?.(name);
      handleClose();
    };

    // Reset grid row values to original values
    useImperativeHandle(ref, () => ({
      reset: () => {
        setChangedTerminalThermometerNames([]);
        apiRef.current.forceUpdate();
      },
    }));

    const handleThermometerNameChange = ({
      newName,
      thermometerId,
    }: {
      newName: string;
      thermometerId: string;
    }) => {
      // Find the original name for this thermometer
      const originalThermometer = thermometers.find((t) => t.id === thermometerId);
      const originalName = originalThermometer?.name ?? "";

      setChangedTerminalThermometerNames((prev) => {
        const index = prev.findIndex((item) => item.thermometerId === thermometerId);

        // If new name is the same as original name, remove it from the list if it exists
        if (newName === originalName) {
          if (index === -1) return prev;
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        }

        // Name has changed → add or update
        if (index === -1) return [...prev, { newName, thermometerId }];
        const updated = [...prev];
        updated[index] = { newName, thermometerId };
        return updated;
      });
    };

    const fetchTemperatures = useCallback(async () => {
      if (!firstThermometer || !type) return;

      const temperatures: Temperature[] = [];
      const temperatureMap = new Map<string, TerminalTemperature>();

      if (type === "terminal") {
        temperatures.push(
          ...(await api.sites.listSiteTemperatures({
            siteId: (firstThermometer as TerminalThermometer).siteId,
            first: 0,
            max: 10,
          })),
        );
      } else if (type === "truck") {
        temperatures.push(
          ...(await api.trucks.listTruckTemperatures({
            truckId: (firstThermometer as TruckOrTowableThermometer).entityId,
            first: 0,
            max: 10,
          })),
        );
      } else if (type === "towable") {
        temperatures.push(
          ...(await api.towables.listTowableTemperatures({
            towableId: (firstThermometer as TruckOrTowableThermometer).entityId,
            first: 0,
            max: 10,
          })),
        );
      }

      for (const temperature of temperatures) {
        const previousTemperature = temperatureMap.get(temperature.thermometerId);
        if (!previousTemperature || previousTemperature.timestamp < temperature.timestamp) {
          temperatureMap.set(temperature.thermometerId, temperature);
        }
      }

      setTemperatures(temperatureMap);
    }, [firstThermometer, type]);

    useEffect(() => {
      fetchTemperatures();
    }, [fetchTemperatures]);

    useInterval(fetchTemperatures, 10_000);

    const columns = useMemo<GridColDef<TerminalThermometer | TruckOrTowableThermometer>[]>(
      () => [
        {
          field: "name",
          headerName: t("management.terminals.thermometers.name"),
          flex: 1,
          cellClassName: "clickable",
          editable: true,
          valueGetter: ({ row }) => (row.id ? row.name : ""),
          renderEditCell: ({ id, field, value, api, row }) => (
            <TextField
              autoFocus
              value={value}
              onChange={(event) => {
                api.setEditCellValue({ id, field, value: event.target.value });
                handleThermometerNameChange({ newName: event.target.value, thermometerId: row.id ?? "" });
              }}
            />
          ),
        },
        {
          field: "hardwareSensorId",
          headerName: t("management.terminals.thermometers.hardwareSensorId"),
          width: 150,
          valueGetter: ({ row }) => ("siteId" in row ? row.hardwareSensorId : row.macAddress),
        },
        {
          field: "temperature",
          headerName: t("management.terminals.thermometers.temperature"),
          width: 100,
          align: "right",
          valueGetter: ({ row }) => (row.id ? temperatures.get(row.id)?.value.toFixed(1) : ""),
        },
        {
          field: "timestamp",
          headerName: t("management.terminals.thermometers.lastUpdate"),
          width: 200,
          valueGetter: ({ row }) => (row.id ? TimeUtils.displayAsDateTime(temperatures.get(row.id)?.timestamp) : ""),
        },
        {
          field: "lastAlarmTime",
          headerName: t("management.terminals.thermometers.lastAlarm"),
          width: 200,
          valueFormatter: ({ value }) => (value ? TimeUtils.displayAsDateTime(value) : "-"),
        },
        {
          field: "activeMonitors",
          headerName: t("management.terminals.thermometers.activeMonitors"),
          flex: 1,
          cellClassName: "clickable",
          valueFormatter: () => "-",
        },
      ],
      [t, temperatures, handleThermometerNameChange],
    );

    const renderDeleteDeviceConfirmationDialog = () => (
      <Dialog open={openDeleteDeviceConfirmationDialog} onClose={handleClose}>
        <DialogTitle>{t("management.terminals.deleteDevice")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("management.terminals.deleteDeviceDescription")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleDeleteDevice}>{t("delete")}</Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <>
        <Card>
          <Box bgcolor="#EDF3F5">
            <ToolbarRow
              title={name}
              toolbarButtons={
                onDeleteDevice ? (
                  <Button color="error" onClick={handleClickOpen}>
                    {t("delete")}
                  </Button>
                ) : undefined
              }
            />
          </Box>
          <GenericDataGrid
            apiRef={apiRef}
            editMode="cell"
            sx={{ borderWidth: 0, borderRadius: 0 }}
            hideFooter
            rows={thermometers}
            columns={columns}
            disableRowSelectionOnClick
          />
        </Card>
        {onDeleteDevice ? renderDeleteDeviceConfirmationDialog() : null}
      </>
    );
  },
);

export default ThermometersTable;
