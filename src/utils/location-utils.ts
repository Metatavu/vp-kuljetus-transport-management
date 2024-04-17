import { latLng } from "leaflet";
import { GeoJSONPoint, parse } from "wellknown";

namespace LocationUtils {
  export const geoJsonPointToLatLng = ({ coordinates }: GeoJSONPoint) => latLng(coordinates);

  export const wellKnownPointToLatLng = (wellKnownPoint: string) => geoJsonPointToLatLng(parse(wellKnownPoint) as GeoJSONPoint);
}

export default LocationUtils;