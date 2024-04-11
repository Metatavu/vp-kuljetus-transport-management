import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "src/routes/__root";
import { Stack, List, ListItemText, Typography, ListItemButton, Chip } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { Map as LeafletMap, latLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import config from "../app/config";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/use-api";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Truck, TruckLocation, TruckSpeed } from "generated/client";

export const Route = createFileRoute("/vehicle-list/map-view")({
  component: () => <VehicleListMapView />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.vehicles.title",
  }),
});

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

const VehicleListMapView = () => {
  const { trucksApi } = useApi();
  const { t } = useTranslation();
  const [selectedTruck, setSelectedTruck] = useState<Truck>();
  const [truckSpeed, setTruckSpeed] = useState<TruckSpeed>();
  const [truckLocation, setTruckLocation] = useState<TruckLocation>();

  const {
    mapbox: { baseUrl, publicApiKey },
  } = config;

  const mapRef = useRef<LeafletMap>(null);

  const trucks = useQuery({
    queryKey: ["trucks"],
    queryFn: async () => {
      const trucks = await trucksApi.listTrucks({});
      return trucks;
    },
  });

  const getTruckSpeed = async () => {
    if (!selectedTruck || !selectedTruck.id) {
      return;
    }

    const truckSpeed = await trucksApi.listTruckSpeeds({ truckId: selectedTruck.id });
    setTruckSpeed(truckSpeed[0]);
  };

  const getTruckLocation = async () => {
    if (!selectedTruck || !selectedTruck.id) {
      return;
    }

    const truckLocation = await trucksApi.listTruckLocations({ truckId: selectedTruck.id });
    setTruckLocation(truckLocation[0]);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getTruckSpeed();
    getTruckLocation();
  }, [selectedTruck]);

  return (
    <LoaderWrapper loading={trucks.isLoading}>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        style={{ height: "58px", backgroundColor: "white", padding: "0 20px" }}
      >
        <Typography
          style={{ width: "250px", margin: 0, padding: 0, borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}
          variant="h5"
        >
          {t("management.vehicles.title")}
        </Typography>
        <Typography variant="h5">
          {selectedTruck?.name} / {selectedTruck?.plateNumber}
        </Typography>
        <Typography variant="body2">
          {t("vehicleList.mapView.speed")}
          {truckSpeed?.speed ?? "-"}{" "}
        </Typography>
        <Typography variant="body2">
          {t("vehicleList.mapView.heading")} {truckLocation?.heading ?? "-"}
        </Typography>
        <Typography variant="body2">{truckLocation?.heading ?? "-"}</Typography>
        <Chip style={{ backgroundColor: "#B9F6CA" }} icon={<GpsFixedIcon />} label={t("vehicleList.mapView.gps")} />
        <Typography variant="body2">
          {t("vehicleList.mapView.lastUpdated")}
          {truckLocation?.timestamp ?? "-"}{" "}
        </Typography>
        <Chip
          style={{ backgroundColor: "#B9F6CA" }}
          icon={<SignalCellularAltIcon />}
          label={t("vehicleList.mapView.connection")}
        />
      </Stack>
      <Stack direction="row" sx={{ width: "100%", height: "100vh" }}>
        <Stack sx={{ backgroundColor: "white", width: "300px" }}>
          <List>
            {trucks.data
              ? trucks.data.map((truck) => (
                  <ListItemButton onClick={() => setSelectedTruck(truck)} key={truck.id}>
                    <ListItemText primary={truck.name} />
                    <ListItemText primary={truck.plateNumber} />
                  </ListItemButton>
                ))
              : null}
          </List>
        </Stack>

        <Stack sx={{ width: "100%", height: "100%" }}>
          <MapContainer ref={mapRef} style={{ height: "80%" }} center={DEFAULT_MAP_CENTER} zoom={13}>
            <TileLayer
              attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
              url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
            />
          </MapContainer>
        </Stack>
      </Stack>
    </LoaderWrapper>
  );
};
