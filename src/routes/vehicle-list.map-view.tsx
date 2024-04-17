import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "src/routes/__root";
import { Stack, List, ListItemText, Typography, ListItemButton, Chip } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Map as LeafletMap, divIcon, latLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import config from "../app/config";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/use-api";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Truck, TruckLocation, TruckSpeed } from "generated/client";
import { DateTime } from "luxon";

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
  const [selectedTruckLocation, setSelectedTruckLocation] = useState<TruckLocation>();

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

  const trucksLocations = useQueries({
    queries: (trucks.data ?? []).map((truck) => ({
      queryKey: ["trucksLocations", truck.id],
      queryFn: async () => ({
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        truckId: truck.id!,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        location: (await trucksApi.listTruckLocations({ truckId: truck.id!, max: 1, first: 0 })).at(0),
      }),
      refetchInterval: 10_000,
      enabled: trucks.isSuccess,
    })),
    combine: (results) => results.map((result) => result.data),
  });

  const getTruckSpeed = async (truckId: string) => {
    if (!truckId) {
      return;
    }

    const truckSpeed = await trucksApi.listTruckSpeeds({ truckId: truckId, max: 1, first: 0 });
    setTruckSpeed(truckSpeed[0]);
  };

  const getLocationTimestampAsDatetime = (location: TruckLocation | undefined) => {
    if (!location || !location.timestamp) {
      return "-";
    }
    return DateTime.fromSeconds(location.timestamp).toFormat("dd.MM.yyyy HH:mm:ss");
  };

  const handleTruckSelection = (truck: Truck) => {
    setSelectedTruck(truck);
    getTruckSpeed(truck.id ?? "");
    setSelectedTruckLocation(trucksLocations.find((truckLocation) => truckLocation?.truckId === truck.id)?.location);
  };

  useEffect(() => {
    if (mapRef.current && selectedTruckLocation) {
      mapRef.current.setView(latLng(selectedTruckLocation.latitude, selectedTruckLocation.longitude));
    }
  }, [selectedTruckLocation]);

  const renderTruckMarkers = () => {
    const markers = trucks.data?.map((truck) => {
      const truckIsSelected = selectedTruck?.id === truck.id;

      const truckLocation = trucksLocations.find((truckLocation) => truckLocation?.truckId === truck.id)?.location;

      // Define the CSS styles for the custom marker icon
      const customMarkerIcon = divIcon({
        html: `
      '<div
          style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 30px solid ${truckIsSelected ? "blue" : "red"};
          transform: rotate(${truckLocation?.heading ?? 0}deg);"
          position="relative"
          top="-80px"
          left="-8px"
      >
      </div>'
    `,
      });

      return (
        <Marker
          title="Truck location"
          key={truck.id}
          position={latLng(
            truckLocation?.latitude ?? DEFAULT_MAP_CENTER.lat,
            truckLocation?.longitude ?? DEFAULT_MAP_CENTER.lng,
          )}
          icon={customMarkerIcon}
        >
          <Popup>
            <Typography variant="body1">{truck.plateNumber}</Typography>
          </Popup>
        </Marker>
      );
    });
    return markers;
  };

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
          {getLocationTimestampAsDatetime(selectedTruckLocation ?? undefined)}
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
                  <ListItemButton
                    onClick={() => handleTruckSelection(truck)}
                    key={truck.id}
                    style={{ backgroundColor: selectedTruck?.id === truck.id ? "rgba(0, 0, 0, 0.1)" : "transparent" }}
                  >
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
            {renderTruckMarkers()}
          </MapContainer>
        </Stack>
      </Stack>
    </LoaderWrapper>
  );
};
