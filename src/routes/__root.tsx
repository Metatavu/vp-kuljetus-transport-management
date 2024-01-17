import { Box } from "@mui/material";
import { Outlet, RootRoute } from "@tanstack/react-router";
import TopNavigation from "components/top-navigation";

export const Route = new RootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <TopNavigation />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
