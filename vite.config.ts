import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
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
});
