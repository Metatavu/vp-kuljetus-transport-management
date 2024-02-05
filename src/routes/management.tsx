import { EventNoteRounded, ListAltRounded, TodayRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";
import { RouterContext } from "./__root";
import { NavigationItem } from "src/types";

export const Route = createFileRoute("/management")({
  component: ManagementLayoutComponent,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management",
  }),
});

function ManagementLayoutComponent() {
  const sideNavigationItems: readonly NavigationItem[] = [
    ["/management/customer-sites", "customerSites.title", TodayRounded],
    ["/management/towables", "towables", ListAltRounded],
    ["/management/vehicles", "vehicles", EventNoteRounded],
  ] as const;

  return (
    <Stack direction="row" height="100%">
      <SideNavigation navigationItems={sideNavigationItems} />
      <ViewContainer>
        <Outlet />
      </ViewContainer>
    </Stack>
  );
}
