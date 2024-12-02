import { SessionToken } from "@mapbox/search-js-core";
import config from "../app/config";

/**
 * Mapbox API wrapper
 *
 * @see https://docs.mapbox.com/api/search/
 */
namespace Mapbox {
  const {
    mapbox: { baseUrl, publicApiKey },
  } = config;
  const DEFAULT_COUNTRY = "fi";
  const DEFAULT_LIMIT = 10;

  /**
   * Retrieves Mapbox suggestions based on the query
   *
   * Suggestions doesn't contain location data, but they contain mapbox_id which can be used to retrieve the location data with {@link retrieveSuggestion}
   *
   * @see https://docs.mapbox.com/api/search/search-box/#get-suggested-results
   * @param query Search query
   * @param sessionToken Session token
   * @returns Array of {@link MapboxFeatureProperties}
   */
  export const getSuggestions = async (query: string, sessionToken: SessionToken) => {
    const suggestions = await doRequest<MapboxSuggestionResponse>(
      `/search/searchbox/v1/suggest?q=${query}&types=street,address&country=FI&session_token=${sessionToken}&language=${DEFAULT_COUNTRY}&limit=${DEFAULT_LIMIT}`,
    );

    return suggestions?.suggestions ?? [];
  };

  /**
   * Retrieves location data based on the mapbox_id
   *
   * @see https://docs.mapbox.com/api/search/search-box/#retrieve-a-suggested-feature
   * @param id Mapbox id
   * @param sessionToken Session token
   * @returns Location data {@link MapBoxFeature} or null if not found
   */
  export const retrieveSuggestion = async (id: string, sessionToken: SessionToken) => {
    const feature = await doRequest<MapboxFeatureResponse>(
      `/search/searchbox/v1/retrieve/${id}?session_token=${sessionToken}`,
    );

    return feature?.features.at(0) ?? null;
  };

  const doRequest = async <T>(path: string): Promise<T | null> => {
    try {
      const response = await fetch(`${baseUrl}/${path}&access_token=${publicApiKey}`);
      const data = await response.json();

      return data;
    } catch (e) {
      console.error("Error while requesting Mapbox API", e);
      return null;
    }
  };
}

export default Mapbox;

type MapboxSuggestionResponse = {
  suggestions: MapboxFeatureProperties[];
  attribution: string;
};

type MapboxFeatureResponse = {
  features: MapBoxFeature[];
  attribution: string;
};

type MapBoxFeature = MapboxFeatureGeometry & {
  properties: MapboxFeatureProperties;
};

type MapboxFeatureGeometry = {
  geometry: {
    coordinates: number[];
    type: string;
  };
};

type MapboxFeatureProperties = {
  name: string;
  mapbox_id: string;
  feature_type: MapboxFeatureType;
  address: string;
  full_address: string;
  place_formatted: string;
  context: {
    country: {
      name: string;
      country_code: string;
      country_code_alpha_3: string;
    };
    region: {
      name: string;
      region_code: string;
      region_code_full: string;
    };
    postcode: {
      name: string;
    };
    place: {
      name: string;
    };
    neighborhood: {
      name: string;
    };
    street: {
      name: string;
    };
  };
  language: string;
  maki: string;
  poi_category: string[];
  poi_category_ids: string[];
};

type MapboxFeatureType = "address" | "street" | "poi";
