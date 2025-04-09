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
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "api/index";
import ToolbarRow from "components/generic/toolbar-row";
import { Site } from "generated/client";
import { QUERY_KEYS, getListTerminalThermometersQueryOptions } from "hooks/use-queries";
import { forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { queryClient } from "src/main";
import ThermometersTable from "./thermometers-table";

type Props = {
  site: Site;
  setChangedTerminalThermometerNames: React.Dispatch<
    React.SetStateAction<{ newName: string; thermometerId: string }[]>
  >;
};

const Thermometers = forwardRef(({ site, setChangedTerminalThermometerNames }: Props, ref) => {
  const { t } = useTranslation();
  const [openCreateNewDevice, setOpenCreateNewDevice] = useState(false);
  const [newDeviceIdentifier, setNewDeviceIdentifier] = useState<string>("");

  const handleClickOpen = () => {
    setOpenCreateNewDevice(true);
  };

  const handleClose = () => {
    setOpenCreateNewDevice(false);
  };

  const updateSite = useMutation({
    mutationFn: () => {
      if (!site?.id) return Promise.reject(new Error("Site ID is undefined"));
      return api.sites.updateSite({
        siteId: site.id,
        site: { ...site, deviceIds: [...site.deviceIds, newDeviceIdentifier] },
      });
    },
    onSuccess: () => {
      toast.success(t("management.terminals.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITE_TEMPERATURES] });
      handleClose();
      setNewDeviceIdentifier("");
    },
    onError: () => toast.error(t("management.terminals.errorToast")),
  });

  const handleDeleteDevice = (deviceIdentifier: string) => {
    if (!site?.id) return;
    const updatedDeviceIds = site.deviceIds.filter((id) => id !== deviceIdentifier);
    api.sites
      .updateSite({
        siteId: site.id,
        site: { ...site, deviceIds: updatedDeviceIds },
      })
      .then(() => {
        toast.success(t("management.terminals.successToast"));
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
      })
      .catch(() => {
        toast.error(t("management.terminals.errorToast"));
      });
  };

  const listThermometersQuery = useQuery(getListTerminalThermometersQueryOptions({ siteId: site.id, max: 100 }));

  const thermometersByDeviceIdentifier = useMemo(() => {
    return (site?.deviceIds ?? []).map((deviceId) => ({
      deviceIdentifier: deviceId,
      thermometers: (listThermometersQuery.data ?? []).filter(
        (thermometer) => thermometer.deviceIdentifier === deviceId,
      ),
    }));
  }, [site?.deviceIds, listThermometersQuery.data]);

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
          value={newDeviceIdentifier}
          onChange={(e) => setNewDeviceIdentifier(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button onClick={() => updateSite.mutate()}>{t("save")}</Button>
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
          <ThermometersTable
            key={deviceIdentifier}
            thermometers={thermometers}
            name={deviceIdentifier}
            ref={ref}
            onDeleteDevice={handleDeleteDevice}
            setChangedTerminalThermometerNames={setChangedTerminalThermometerNames}
          />
        ))}
      </Stack>
      {renderCreateNewDeviceDialog()}
    </Paper>
  );
});

export default Thermometers;
