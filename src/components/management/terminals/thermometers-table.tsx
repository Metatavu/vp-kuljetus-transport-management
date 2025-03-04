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
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import TimeUtils from "src/utils/time-utils";

type Props = {
  name: string;
  thermometers: TerminalThermometer[];
};

const ThermometersTable = ({ thermometers, name }: Props) => {
  const { t } = useTranslation();
  const [openDeleteDeviceConfirmationDialog, setOpenDeleteDeviceConfirmationDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDeleteDeviceConfirmationDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDeviceConfirmationDialog(false);
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
        renderEditCell: ({ id, field, value, api }) => (
          <TextField
            value={value}
            onChange={(event) => api.setEditCellValue({ id, field, value: event.target.value })}
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
    [t, temperatures],
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
        <Button type="submit">{t("delete")}</Button>
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
          rows={thermometers}
          columns={columns}
          disableRowSelectionOnClick
        />
      </Card>
      {renderDeleteDeviceConfirmationDialog()}
    </>
  );
};

export default ThermometersTable;
