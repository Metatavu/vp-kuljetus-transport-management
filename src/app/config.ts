import { cleanEnv, str, url } from "envalid";

type Config = {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  api: {
    baseUrl: string;
  };
};

const env = cleanEnv(import.meta.env, {
/*   VITE_KEYCLOAK_URL: url(undefined),
  VITE_KEYCLOAK_REALM: str(undefined),
  VITE_KEYCLOAK_CLIENT_ID: str(undefined),
  VITE_API_BASE_URL: url(undefined), */
});

const config: Config = {
  auth: {
    url: "env.VITE_KEYCLOAK_URL",
    realm: "env.VITE_KEYCLOAK_REALM",
    clientId: "env.VITE_KEYCLOAK_CLIENT_ID"
  },
  api: {
    baseUrl: "env.VITE_API_BASE_URL"
  },
};

export default config;
