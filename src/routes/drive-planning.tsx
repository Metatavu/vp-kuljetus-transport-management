import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { NavigationItem } from "src/types";
import { LibraryBooksRounded, LocalShipping } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import SideNavigation from "components/layout/side-navigation";

export const Route = createFileRoute("/drive-planning")({
  component: DrivePlanningLayoutComponent,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.title",
  }),
});

function DrivePlanningLayoutComponent() {
  const sideNavigationItems: readonly NavigationItem[] = [
    ["/drive-planning/routes", "drivePlanning.routes.title", LocalShipping],
    ["/drive-planning/freights", "drivePlanning.freights.title", LibraryBooksRounded],
  ] as const;

  return (
    <Stack direction="row" height="100%">
      <SideNavigation navigationItems={sideNavigationItems} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Stack>
  );
}
