import { Box } from "@mui/material";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import BreadcrumbsBar from "components/layout/breadcrumbs-bar";
import TopNavigation from "components/layout/top-navigation";
import * as luxon from "luxon";

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: () => <div>Root error</div>,
});

function RootLayout() {
  luxon.Settings.defaultLocale = "fi";

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <TopNavigation />
      <BreadcrumbsBar />
      <Box component="main" sx={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
