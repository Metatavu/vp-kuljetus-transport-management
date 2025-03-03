import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ToolbarRow from "components/generic/toolbar-row";
import { TerminalThermometer } from "generated/client";
import { getListTerminalThermometersQueryOptions } from "hooks/use-queries";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ThermometersTable from "./thermometers-table";

type Props = {
  siteId: string | undefined;
};

const Thermometers = ({ siteId }: Props) => {
  const { t } = useTranslation();
  const [openCreateNewDevice, setOpenCreateNewDevice] = useState(false);

  const handleClickOpen = () => {
    setOpenCreateNewDevice(true);
  };

  const handleClose = () => {
    setOpenCreateNewDevice(false);
  };

  const listThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({ siteId, max: 100 }));
  const thermometersByDeviceIdentifier = useMemo(() => {
    return (listThermometersQuery.data ?? []).reduce(
      (list, thermometer) => {
        const indexOfMatchingIdentifier = list.findIndex(
          (item) => item.deviceIdentifier === thermometer.deviceIdentifier,
        );

        if (indexOfMatchingIdentifier > -1) {
          list[indexOfMatchingIdentifier].thermometers.push(thermometer);
        } else {
          list.push({ deviceIdentifier: thermometer.deviceIdentifier, thermometers: [thermometer] });
        }

        return list;
      },
      [] as { deviceIdentifier: string; thermometers: TerminalThermometer[] }[],
    );
  }, [listThermometersQuery.data]);

  const renderCreateNewDeviceDialog = () => (
    <Dialog
      open={openCreateNewDevice}
      onClose={handleClose}
      PaperProps={{
        component: "form",
      }}
    >
      <DialogTitle>{t("management.terminals.configureNewDevice")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("management.terminals.configureNewDeviceDescription")}</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="deviceIdentifier"
          name="deviceIdentifier"
          label="MAC-osoite"
          type="text"
          fullWidth
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("save")}</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Paper>
      <ToolbarRow
        title={t("management.terminals.thermometers.thermometers")}
        toolbarButtons={
          <Button startIcon={<Add />} onClick={handleClickOpen}>
            {t("management.terminals.configureNewDevice")}
          </Button>
        }
      />
      <Stack p={2}>
        {thermometersByDeviceIdentifier.map(({ deviceIdentifier, thermometers }) => (
          <ThermometersTable key={deviceIdentifier} thermometers={thermometers} name={deviceIdentifier} />
        ))}
      </Stack>
      {renderCreateNewDeviceDialog()}
    </Paper>
  );
};

export default Thermometers;
