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
import { GridColDef } from "@mui/x-data-grid";
import { useQueries } from "@tanstack/react-query";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { TerminalTemperature, TerminalThermometer } from "generated/client";
import { getListTerminalTemperaturesQueryOptions } from "hooks/use-queries";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TimeUtils from "src/utils/time-utils";

type Props = {
  name: string;
  thermometers: TerminalThermometer[];
  onDeleteDevice: (deviceIdentifier: string) => void;
  setChangedTerminalThermometerNames: React.Dispatch<
    React.SetStateAction<{ newName: string; thermometerId: string }[]>
  >;
};

const ThermometersTable = forwardRef(
  ({ name, thermometers, onDeleteDevice, setChangedTerminalThermometerNames }: Props, ref) => {
    const { t } = useTranslation();
    const [openDeleteDeviceConfirmationDialog, setOpenDeleteDeviceConfirmationDialog] = useState(false);
    const [rows, setRows] = useState<TerminalThermometer[]>(thermometers);
    const [gridKey, setGridKey] = useState(0);

    const handleClickOpen = () => {
      setOpenDeleteDeviceConfirmationDialog(true);
    };

    const handleClose = () => {
      setOpenDeleteDeviceConfirmationDialog(false);
    };

    const handleDeleteDevice = () => {
      onDeleteDevice(name);
      handleClose();
    };

    // Reset grid row values to original values
    useImperativeHandle(ref, () => ({
      reset: () => {
        setChangedTerminalThermometerNames([]);
        setRows(thermometers);
        setGridKey((prev) => prev + 1); // This forces a re-render of the grid
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

    const temperatures = useQueries({
      queries: thermometers.map((thermometer) => ({
        ...getListTerminalTemperaturesQueryOptions({ siteId: thermometer.siteId, first: 0, max: thermometers.length }),
        refetchInterval: 10_000,
      })),
      combine: (results) =>
        results.reduce((map, result, currentIndex) => {
          const temperature = result.data?.at(currentIndex);
          if (temperature) map.set(temperature.thermometerId, temperature);
          return map;
        }, new Map<string, TerminalTemperature>()),
    });

    const columns = useMemo<GridColDef<TerminalThermometer>[]>(
      (): GridColDef<TerminalThermometer>[] => [
        {
          field: "name",
          headerName: t("management.terminals.thermometers.name"),
          flex: 1,
          cellClassName: "clickable",
          editable: true,
          valueGetter: ({ row }) => (row.id ? row.name : ""),
          renderEditCell: ({ id, field, value, api, row }) => (
            <TextField
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
        },
        {
          field: "activeMonitors",
          headerName: t("management.terminals.thermometers.activeMonitors"),
          flex: 1,
          cellClassName: "clickable",
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
                <Button color="error" onClick={handleClickOpen}>
                  {t("delete")}
                </Button>
              }
            />
          </Box>
          <GenericDataGrid
            editMode="cell"
            sx={{ borderWidth: 0, borderRadius: 0 }}
            hideFooter
            rows={rows.length ? rows : thermometers}
            columns={columns}
            disableRowSelectionOnClick
            key={gridKey}
          />
        </Card>
        {renderDeleteDeviceConfirmationDialog()}
      </>
    );
  },
);

export default ThermometersTable;
