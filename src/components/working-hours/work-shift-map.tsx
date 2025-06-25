import { Stack, Typography, styled } from "@mui/material";
import config from "app/config";
import type { TruckLocation, TruckOdometerReading, TruckSpeed } from "generated/client";
import { LatLng, LatLngBounds, type LatLngTuple, type Map as LeafletMap, latLng } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

const StyledPopup = styled(Popup)(({ theme }) => ({
  ".leaflet-popup-content-wrapper": {
    borderRadius: 0,
    padding: theme.spacing(1),
    width: 300,
    height: 100,
  },
}));

type Props = {
  truckLocations: TruckLocation[][];
  selectedWorkEventTelematics?: {
    truckLocation?: TruckLocation;
    truckSpeed?: TruckSpeed;
    truckOdometerReading?: TruckOdometerReading;
  };
};

const WorkShiftMap = ({ truckLocations, selectedWorkEventTelematics }: Props) => {
  const { t } = useTranslation();
  const {
    mapbox: { baseUrl, publicApiKey },
  } = config;

  const mapRef = useRef<LeafletMap>(null);

  const getTruckPoints = useCallback(
    (truckLocations: TruckLocation[]) =>
      truckLocations.map(({ latitude, longitude }) => new LatLng(latitude, longitude)),
    [],
  );

  const renderTruckLine = useCallback(
    (truckLocations: TruckLocation[]) => (
      <Polyline key={truckLocations[0]?.id} positions={getTruckPoints(truckLocations)} />
    ),
    [getTruckPoints],
  );

  const renderTruckLines = useCallback(() => truckLocations.map(renderTruckLine), [truckLocations, renderTruckLine]);

  useEffect(() => {
    if (!mapRef.current || !truckLocations.length) return;

    const allPoints = truckLocations.flat().map(({ latitude, longitude }) => [latitude, longitude]) as LatLngTuple[];
    if (!allPoints.length) return;

    const bounds = new LatLngBounds(allPoints);
    mapRef.current.fitBounds(bounds, { padding: [10, 10] });
  }, [truckLocations]);

  const renderSelectedWorkEventTelematicsMarker = useCallback(() => {
    if (!selectedWorkEventTelematics) return null;

    const { truckLocation } = selectedWorkEventTelematics;
    if (!truckLocation) return null;
    const truckSpeed = selectedWorkEventTelematics.truckSpeed?.speed;
    const truckOdometerReading = selectedWorkEventTelematics.truckOdometerReading?.odometerReading;

    const hasTelematics = !truckSpeed === undefined && !truckOdometerReading === undefined;

    return (
      <Marker position={new LatLng(truckLocation.latitude, truckLocation.longitude)}>
        {hasTelematics && (
          <StyledPopup>
            <Stack direction="column">
              {truckSpeed !== undefined && (
                <Typography variant="caption">
                  {t("workingHours.workingDays.workShiftDialog.telematicsPopup.speed", { speed: truckSpeed })}
                </Typography>
              )}
              {truckOdometerReading !== undefined && (
                <Typography variant="caption">
                  {t("workingHours.workingDays.workShiftDialog.telematicsPopup.odometer", {
                    odometer: Intl.NumberFormat("fi-FI").format(truckOdometerReading / 1000),
                  })}
                </Typography>
              )}
            </Stack>
          </StyledPopup>
        )}
      </Marker>
    );
  }, [selectedWorkEventTelematics, t]);

  return (
    <MapContainer ref={mapRef} style={{ height: 600, display: "flex", flex: 1 }} center={DEFAULT_MAP_CENTER} zoom={13}>
      <TileLayer
        attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
        url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
      />
      {renderTruckLines()}
      {renderSelectedWorkEventTelematicsMarker()}
    </MapContainer>
  );
};

export default WorkShiftMap;
