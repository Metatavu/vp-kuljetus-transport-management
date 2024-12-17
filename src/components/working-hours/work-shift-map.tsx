import config from "app/config";
import { TruckLocation } from "generated/client";
import { LatLng, LatLngBounds, LatLngTuple, Map as LeafletMap, latLng } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

type Props = {
  truckLocations: TruckLocation[][];
};

const WorkShiftMap = ({ truckLocations }: Props) => {
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
      <Polyline key={truckLocations[0].id} positions={getTruckPoints(truckLocations)} />
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

  return (
    <MapContainer ref={mapRef} style={{ height: 600, display: "flex", flex: 1 }} center={DEFAULT_MAP_CENTER} zoom={13}>
      <TileLayer
        attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
        url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
      />
      {renderTruckLines()}
    </MapContainer>
  );
};

export default WorkShiftMap;
