import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import codegen from "vite-plugin-graphql-codegen";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), codegen(), TanStackRouterVite()],
  resolve: {
    alias: {
      assets: "/src/assets",
      components: "/src/components",
      generated: "/src/generated",
      layouts: "/src/layouts",
      localization: "/src/localization",
      pages: "/src/pages",
      theme: "/src/theme",
      types: "/src/types",
    },
  },
});
