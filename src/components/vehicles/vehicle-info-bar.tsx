import { ChevronLeft, GpsOff, SignalCellularConnectedNoInternet0Bar } from "@mui/icons-material";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { Truck, TruckLocation, TruckSpeed } from "generated/client";
import { useTranslation } from "react-i18next";
import TimeUtils from "../../utils/time-utils";

type Props = {
  selectedTruck: Truck | undefined;
  truckSpeed: TruckSpeed | undefined;
  selectedTruckLocation: TruckLocation | undefined;
  title: boolean;
  navigateBack?: () => void;
};

export const VehicleInfoBar = ({ selectedTruck, truckSpeed, selectedTruckLocation, title, navigateBack }: Props) => {
  const { t } = useTranslation();

  const renderLocation = (selectedTruckLocation: TruckLocation | undefined) => {
    if (
      selectedTruckLocation &&
      selectedTruckLocation.latitude !== undefined &&
      selectedTruckLocation.longitude !== undefined
    ) {
      return (
        <>
          <Typography>{`${selectedTruckLocation.latitude} : ${selectedTruckLocation.longitude}`}</Typography>
          <Chip style={{ backgroundColor: "#B9F6CA" }} icon={<GpsFixedIcon />} label={t("vehicles.map.gps")} />
        </>
      );
    }

    return (
      <>
        <Typography>{t("vehicles.details.noLocationAvailable")}</Typography>
        <Chip style={{ backgroundColor: "#ffb6b6" }} icon={<GpsOff />} label={t("vehicles.map.gps")} />
      </>
    );
  };

  const renderLastUpdatedDate = (selectedTruckLocation: TruckLocation | undefined) => {
    if (selectedTruckLocation && selectedTruckLocation.timestamp !== undefined) {
      return (
        <>
          <Stack width="300px" justifyContent="center" alignItems="center" direction="row" gap={1}>
            <Typography>{t("vehicles.map.lastUpdated")}</Typography>
            <Typography>{TimeUtils.displayAsDateTime(selectedTruckLocation.timestamp)}</Typography>
          </Stack>
        </>
      );
    }

    return (
      <Box width="300px" justifyContent="center" alignItems="center" display="flex">
        <Typography>{t("vehicles.details.noUpdateInformation")}</Typography>
      </Box>
    );
  };

  // TODO: Get the data connection status from the vehicle, check issue #113 from GitHub
  const renderDataConnection = (truck: Truck | undefined) => {
    if (truck) {
      return (
        <Chip
          title={t("vehicles.tooltips.dataConnection.disconnected")}
          style={{ backgroundColor: "#ffb6b6" }}
          icon={<SignalCellularConnectedNoInternet0Bar />}
          label={t("vehicles.map.connection")}
        />
      );
    }
    return (
      <Chip
        title={t("vehicles.tooltips.dataConnection.connected")}
        style={{ backgroundColor: "#B9F6CA" }}
        icon={<SignalCellularAltIcon />}
        label={t("vehicles.map.connection")}
      />
    );
  };

  return (
    <Stack justifyContent="space-between" alignItems="center" direction="row" sx={{ bgcolor: "white", py: 1, px: 2 }}>
      <Stack alignItems="center" direction="row" gap={2}>
        {navigateBack && (
          <IconButton onClick={navigateBack}>
            <Tooltip title={t("tooltips.backToVehicles")} placement="bottom">
              <ChevronLeft fontSize="large" />
            </Tooltip>
          </IconButton>
        )}
        {title && (
          <Typography
            style={{ width: "250px", margin: 0, padding: 0, borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}
            variant="h5"
          >
            {t("management.vehicles.title")}
          </Typography>
        )}
        <Typography variant="h1">
          {selectedTruck?.name} ({selectedTruck?.plateNumber})
        </Typography>
        <Box width="160px">
          <Typography sx={{ textTransform: "uppercase" }}>
            {t("vehicles.map.speed")} {`${truckSpeed?.speed ?? "-"} km/h`}
          </Typography>
        </Box>
        <Box width="160px">
          <Typography sx={{ textTransform: "uppercase" }}>
            {t("vehicles.map.heading")} {`${selectedTruckLocation?.heading ?? "-"}°`}
          </Typography>
        </Box>
      </Stack>
      <Stack alignItems="center" direction="row" gap={2}>
        {renderLocation(selectedTruckLocation)}
        {renderLastUpdatedDate(selectedTruckLocation)}
        {renderDataConnection(selectedTruck)}
      </Stack>
    </Stack>
  );
};
