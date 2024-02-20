import { SessionToken } from "@mapbox/search-js-core";
import config from "../../app/config";

namespace Mapbox {
  const { mapbox: { baseUrl, publicApiKey }} = config;
  const DEFAULT_COUNTRY = "fi";
  const DEFAULT_LIMIT = 10;

  export const getSuggestions = async (query: string, sessionToken: SessionToken) => {
    const suggestions = await doRequest<MapboxSuggestionResponse>(`suggest?q=${query}&session_token=${sessionToken}&language=${DEFAULT_COUNTRY}&limit=${DEFAULT_LIMIT}`);
    console.log(suggestions?.suggestions);
    return suggestions?.suggestions ?? [];
  };

  export const retrieveSuggestion = async (id: string, sessionToken: SessionToken) => {
    const feature = await doRequest<MapboxFeatureResponse>(`retrieve/${id}?session_token=${sessionToken}`);
    console.log(feature);
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

export type MapBoxFeature = MapboxFeatureGeometry & {
  properties: MapboxFeatureProperties;
};

export type MapboxFeatureGeometry = {
  geometry: {
    coordinates: number[];
    type: string;
  };
};

export type MapboxFeatureProperties = {
  name: string,
  mapbox_id: string,
  feature_type: string,
  address: string,
  full_address: string,
  place_formatted: string,
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
  },
  language: string;
  maki: string;
  poi_category: string[];
  poi_category_ids: string[];
}