import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VehicleInfoBar } from "components/vehicles/vehicleInfoBar";
import { Truck, TruckLocation } from "generated/client";
import { Map as LeafletMap, divIcon, latLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { RouterContext } from "src/routes/__root";
import config from "../app/config";
import { useApi } from "../hooks/use-api";

export const Route = createFileRoute("/vehicle-list/map-view")({
  component: () => <VehicleListMapView />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.vehicles.title",
  }),
});

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

const VehicleListMapView = () => {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const { trucksApi } = useApi();
  const [selectedTruck, setSelectedTruck] = useState<Truck>();
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

  const truckSpeed = useQuery({
    queryKey: ["truckSpeed"],
    queryFn: async () => {
      // biome-ignore lint/style/noNonNullAssertion: id must exist in trucks from API
      const truckSpeed = await trucksApi.listTruckSpeeds({ truckId: selectedTruck?.id!, max: 1, first: 0 });

      return truckSpeed[0] ?? {};
    },
    refetchInterval: 10_000,
  });

  const trucksLocations = useQueries({
    queries: (trucks.data ?? []).map((truck) => ({
      queryKey: ["trucksLocations", truck.id],
      queryFn: async () => ({
        // biome-ignore lint/style/noNonNullAssertion: id must exist in trucks from API
        truckId: truck.id!,
        // biome-ignore lint/style/noNonNullAssertion: id must exist in trucks from API
        location: (await trucksApi.listTruckLocations({ truckId: truck.id!, max: 1, first: 0 })).at(0),
      }),
      refetchInterval: 10_000,
      enabled: trucks.isSuccess,
    })),
    combine: (results) => results.map((result) => result.data),
  });

  const handleTruckSelection = (truck: Truck) => {
    setSelectedTruck(truck);
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

  const renderMap = () => {
    if (trucks.isLoading) {
      return (
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <MapContainer ref={mapRef} style={{ height: "100%" }} center={DEFAULT_MAP_CENTER} zoom={13}>
        <TileLayer
          attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
          url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
        />
        {renderTruckMarkers()}
      </MapContainer>
    );
  };

  return (
    <>
      <VehicleInfoBar
        selectedTruck={selectedTruck}
        truckSpeed={truckSpeed.data}
        selectedTruckLocation={selectedTruckLocation}
        title
      />
      <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
        <Stack sx={{ backgroundColor: "white", width: 300, overflow: "auto" }}>
          <List>
            {trucks.data
              ? trucks.data.map((truck) => (
                  <ListItemButton
                    onClick={() => handleTruckSelection(truck)}
                    key={truck.id}
                    selected={selectedTruck?.id === truck.id}
                    divider
                    dense
                  >
                    <ListItemAvatar>
                      <Typography variant="h6">{truck.name}</Typography>
                    </ListItemAvatar>
                    <ListItemText primary={truck.plateNumber} />
                    {selectedTruck?.id === truck.id && (
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          edge="end"
                          aria-label="info"
                          title={t("vehicleList.mapView.showVehicleInfo")}
                          onClick={() =>
                            navigate({
                              to: "/vehicle-list/vehicles/$vehicleId/info",
                              params: { vehicleId: truck.id as string },
                            })
                          }
                        >
                          <InfoOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItemButton>
                ))
              : null}
          </List>
        </Stack>
        <Stack sx={{ width: "100%", height: "100%" }}>{renderMap()}</Stack>
      </Stack>
    </>
  );
};
