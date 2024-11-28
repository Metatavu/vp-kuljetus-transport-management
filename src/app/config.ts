import { url, cleanEnv, str } from "envalid";

const env = cleanEnv(import.meta.env, {
  VITE_KEYCLOAK_URL: url(),
  VITE_KEYCLOAK_REALM: str(),
  VITE_KEYCLOAK_CLIENT_ID: str(),
  VITE_API_BASE_URL: url(),
  VITE_MAPBOX_API_BASE_URL: url(),
  VITE_MAPBOX_PUBLIC_API_KEY: str(),
});

const config = {
  auth: {
    url: env.VITE_KEYCLOAK_URL,
    realm: env.VITE_KEYCLOAK_REALM,
    clientId: env.VITE_KEYCLOAK_CLIENT_ID,
  },
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
  mapbox: {
    baseUrl: env.VITE_MAPBOX_API_BASE_URL,
    publicApiKey: env.VITE_MAPBOX_PUBLIC_API_KEY,
  },
} as const;

export default config;
