import { Box } from "@mui/material";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import RootFreightDialog from "components/drive-planning/freights/root-freight-dialog";
import BreadcrumbsBar from "components/layout/breadcrumbs-bar";
import TopNavigation from "components/layout/top-navigation";
import * as luxon from "luxon";
import { LocalizedLabelKey } from "src/types";

export type RouterContext = {
  breadcrumb?: LocalizedLabelKey;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  validateSearch: ({ freightId }: Record<string, unknown>) => ({
    freightId: freightId ? String(freightId) : undefined,
  }),
});

function RootLayout() {
  luxon.Settings.defaultLocale = "fi";

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <RootFreightDialog />
      <TopNavigation />
      <BreadcrumbsBar />
      <Box component="main" sx={{ display: "flex", flex: 1, maxHeight: "100%", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
