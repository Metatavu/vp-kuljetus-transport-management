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
import { VehicleInfoBar } from "components/vehicles/vehicle-info-bar";
import { TruckLocation } from "generated/client";
import { Map as LeafletMap, divIcon, latLng } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import { RouterContext } from "src/routes/__root";
import config from "../app/config";
import { useApi } from "../hooks/use-api";
import { DateTime } from "luxon";

export const Route = createFileRoute("/vehicle-list/map-view")({
  component: () => <VehicleListMapView />,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: "management.vehicles.title",
  }),
});

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

const VehicleListMapView = () => {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const { trucksApi } = useApi();
  const [selectedTruckId, setSelectedTruckId] = useState<string>();

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
      if (!selectedTruckId) throw new Error("Truck must be selected to fetch truck speed");

      const truckSpeeds = await trucksApi.listTruckSpeeds({ truckId: selectedTruckId, max: 1, first: 0 });
      return truckSpeeds[0];
    },
    refetchInterval: 10_000,
    enabled: !!selectedTruckId,
  });

  const truckLocations = useQueries({
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
    combine: (results) => {
      const truckLocationsMap = new Map<string, TruckLocation>();

      results.reduce((map, result) => {
        const { truckId, location } = result.data ?? {};
        if (truckId && location) map.set(truckId, location);
        return map;
      }, truckLocationsMap);

      return truckLocationsMap;
    },
  });

  useEffect(() => {
    if (!mapRef.current || !selectedTruckId) return;
    const truckLocation = truckLocations.get(selectedTruckId);
    if (!truckLocation) return;
    mapRef.current.setView(latLng(truckLocation.latitude, truckLocation.longitude));
  }, [selectedTruckId, truckLocations]);

  const renderTruckMarkers = () => {
    return (trucks.data ?? []).map((truck) => {
      if (!truck.id) return null;
      const truckLocation = truckLocations.get(truck.id);

      // Define the CSS styles for the custom marker icon
      const customMarkerIcon = divIcon({
        html: `
          <div
              style="
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-bottom: 30px solid ${selectedTruckId === truck.id ? "blue" : "red"};
              transform: rotate(${truckLocation?.heading ?? 0}deg);"
          />
        `,
        className: "custom-marker-icon",
      });

      return (
        <Marker
          key={truck.id}
          title="Truck location"
          icon={customMarkerIcon}
          position={latLng(
            truckLocation?.latitude ?? DEFAULT_MAP_CENTER.lat,
            truckLocation?.longitude ?? DEFAULT_MAP_CENTER.lng,
          )}
          eventHandlers={{ click: () => setSelectedTruckId(truck.id) }}
        >
          <Tooltip>
            <Typography variant="body1">{truck.plateNumber}</Typography>
          </Tooltip>
        </Marker>
      );
    });
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
        selectedTruck={trucks.data?.find((truck) => truck.id === selectedTruckId)}
        truckSpeed={truckSpeed.data}
        selectedTruckLocation={selectedTruckId ? truckLocations.get(selectedTruckId) : undefined}
        title
      />
      <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
        <Stack sx={{ backgroundColor: "white", width: 300, overflow: "auto" }}>
          <List>
            {(trucks.data ?? []).map((truck) => (
              <ListItemButton
                onClick={() => setSelectedTruckId(truck.id)}
                key={truck.id}
                selected={selectedTruckId === truck.id}
                divider
                dense
              >
                <ListItemAvatar>
                  <Typography variant="h6">{truck.name}</Typography>
                </ListItemAvatar>
                <ListItemText primary={truck.plateNumber} />
                {selectedTruckId === truck.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="info"
                      title={t("vehicleList.mapView.showVehicleInfo")}
                      onClick={() =>
                        truck.id &&
                        navigate({
                          to: "/vehicle-list/vehicles/$vehicleId/info",
                          params: { vehicleId: truck.id },
                          search: { date: DateTime.now() },
                        })
                      }
                    >
                      <InfoOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            ))}
          </List>
        </Stack>
        <Stack sx={{ width: "100%", height: "100%" }}>{renderMap()}</Stack>
      </Stack>
    </>
  );
};
