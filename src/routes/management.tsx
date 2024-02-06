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
    breadcrumb: "management.title",
  }),
});

function ManagementLayoutComponent() {
  const sideNavigationItems: readonly NavigationItem[] = [
    ["/management/customer-sites", "management.customerSites.title", TodayRounded],
    ["/management/equipment", "management.equipment.title", ListAltRounded],
    ["/management/vehicles", "management.vehicles.title", EventNoteRounded],
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
