import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReactSwc from "@vitejs/plugin-react-swc";
import Vault from "node-vault";
import { UserConfig, defineConfig, loadEnv } from "vite";

/**
 * Fetch secrets from Hashicorp Vault
 *
 * @param param.token - Vault token
 * @param param.endpoint - Vault endpoint
 * @param param.path - Path to the secrets
 * @returns map of secrets
 */
const fetchSecrets = async ({ token, endpoint, path }) => {
  const vault = Vault({
    apiVersion: "v1",
    endpoint: endpoint,
    token: token,
  });

  const { data } = await vault.read(path);
  return data.data;
};

/**
 * Returns define object for Vite
 *
 * @param userConfig user configuration
 * @returns define object
 */
const getDefine = async ({ mode }: UserConfig) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VAULT_TOKEN, VAULT_ADDR, VAULT_PATH } = env;

  if (!VAULT_PATH) {
    throw new Error("VAULT_PATH is required. Please check your .env file.");
  }

  if (!VAULT_ADDR || !VAULT_TOKEN) {
    throw new Error(
      "You must be logged in to the HCV (use withhcv -command). See https://github.com/Metatavu/development-scripts/blob/master/hcv/withhcv.sh for more information.",
    );
  }

  const secrets = await fetchSecrets({
    token: VAULT_TOKEN,
    endpoint: VAULT_ADDR,
    path: VAULT_PATH,
  });

  return Object.entries(secrets).reduce((acc, [key, value]) => {
    acc[`import.meta.env.${key}`] = JSON.stringify(value);
    return acc;
  }, {});
};

// https://vitejs.dev/config/
export default defineConfig(async (userConfig: UserConfig) => {
  return {
    define: await getDefine(userConfig),
    plugins: [TanStackRouterVite(), viteReactSwc()],
    resolve: {
      alias: {
        api: "/src/api",
        app: "/src/app",
        assets: "/src/assets",
        atoms: "/src/atoms",
        components: "/src/components",
        generated: "/src/generated",
        hooks: "/src/hooks",
        localization: "/src/localization",
        mapbox: "/src/mapbox",
        routes: "/src/routes",
        src: "/src",
        theme: "/src/theme",
        types: "/src/types",
        utils: "/src/utils",
      },
    },
    optimizeDeps: {
      exclude: ["@mapbox/search-js-core", "@dnd-kit/sortable"],
    },
  };
});
