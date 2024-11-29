import config from "app/config";
import { Map as LeafletMap, latLng } from "leaflet";
import { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const DEFAULT_MAP_CENTER = latLng(61.1621924, 28.65865865);

const WorkShiftMap = () => {
  const {
    mapbox: { baseUrl, publicApiKey },
  } = config;

  const mapRef = useRef<LeafletMap>(null);

  return (
    <MapContainer ref={mapRef} style={{ height: 600, display: "flex", flex: 1 }} center={DEFAULT_MAP_CENTER} zoom={13}>
      <TileLayer
        attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>'
        url={`${baseUrl}/styles/v1/metatavu/clsszigf302jx01qy0e4q0c7e/tiles/{z}/{x}/{y}?access_token=${publicApiKey}`}
      />
    </MapContainer>
  );
};

export default WorkShiftMap;
