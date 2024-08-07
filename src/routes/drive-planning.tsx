import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { NavigationItem } from "src/types";
import { LibraryBooksRounded, LocalShipping } from "@mui/icons-material";
import { Stack } from "@mui/material";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";

export const Route = createFileRoute("/drive-planning")({
  component: DrivePlanningLayoutComponent,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["drivePlanning.title"],
  }),
});

function DrivePlanningLayoutComponent() {
  const sideNavigationItems: readonly NavigationItem[] = [
    ["/drive-planning/routes", "drivePlanning.routes.title", LocalShipping],
    ["/drive-planning/freights", "drivePlanning.freights.title", LibraryBooksRounded],
  ] as const;

  return (
    <Stack direction="row" height="100%" width="100%">
      <SideNavigation navigationItems={sideNavigationItems} />
      <ViewContainer>
        <Outlet />
      </ViewContainer>
    </Stack>
  );
}
