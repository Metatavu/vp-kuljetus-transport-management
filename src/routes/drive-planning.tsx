import { LibraryBooksRounded, LocalShipping } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";
import { NavigationItem } from "src/types";

export const Route = createFileRoute("/drive-planning")({ component: DrivePlanningLayoutComponent });

function DrivePlanningLayoutComponent() {
  const sideNavigationItems: NavigationItem[] = [
    { route: "/drive-planning/routes", label: "drivePlanning.routes.title", Icon: LocalShipping },
    { route: "/drive-planning/freights", label: "drivePlanning.freights.title", Icon: LibraryBooksRounded },
  ];

  return (
    <Stack direction="row" height="100%" width="100%">
      <SideNavigation navigationItems={sideNavigationItems} />
      <ViewContainer>
        <Outlet />
      </ViewContainer>
    </Stack>
  );
}
