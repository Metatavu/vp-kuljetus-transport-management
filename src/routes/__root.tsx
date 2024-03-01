import { Box } from "@mui/material";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import BreadcrumbsBar from "components/layout/breadcrumbs-bar";
import TopNavigation from "components/layout/top-navigation";
import * as luxon from "luxon";
import { LocalizedLabelKey } from "src/types";

export type RouterContext = {
  breadcrumb?: LocalizedLabelKey;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  luxon.Settings.defaultLocale = "fi";

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <TopNavigation />
      <BreadcrumbsBar />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
