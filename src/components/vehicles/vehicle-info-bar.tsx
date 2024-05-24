import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Truck, TruckLocation, TruckSpeed } from "generated/client";
import { t } from "i18next";
import TimeUtils from "../../utils/time-utils";

type Props = {
  selectedTruck: Truck | undefined;
  truckSpeed: TruckSpeed | undefined;
  selectedTruckLocation: TruckLocation | undefined;
  title: boolean;
  navigateBack?: () => void;
};

export const VehicleInfoBar = ({ selectedTruck, truckSpeed, selectedTruckLocation, title, navigateBack }: Props) => {
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      style={{ height: "58px", backgroundColor: "white", padding: "0 20px" }}
    >
      {navigateBack && (
        <IconButton sx={{ padding: "5px" }} onClick={navigateBack}>
          <Tooltip title={t("tooltips.backToVehicles")} placement="bottom">
            <ArrowBackIcon />
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
      <Typography variant="h5">
        {selectedTruck?.name} / {selectedTruck?.plateNumber}
      </Typography>
      <Typography variant="body2">
        {t("vehicleList.mapView.speed")}
        {truckSpeed?.speed ?? "-"}
      </Typography>
      <Typography variant="body2">
        {t("vehicleList.mapView.heading")} {selectedTruckLocation?.heading ?? "-"}
      </Typography>
      <Typography variant="body2">
        {`${selectedTruckLocation?.latitude} : ${selectedTruckLocation?.longitude}`}
      </Typography>
      <Chip style={{ backgroundColor: "#B9F6CA" }} icon={<GpsFixedIcon />} label={t("vehicleList.mapView.gps")} />
      <Typography variant="body2">
        {t("vehicleList.mapView.lastUpdated")}
        {TimeUtils.displayAsDateTime(selectedTruckLocation?.timestamp, "-")}
      </Typography>
      <Chip
        style={{ backgroundColor: "#B9F6CA" }}
        icon={<SignalCellularAltIcon />}
        label={t("vehicleList.mapView.connection")}
      />
    </Stack>
  );
};
