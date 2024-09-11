import { CommuteRounded, HailRounded, PlaceRounded, TodayRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";
import { NavigationItem } from "src/types";
import { RouterContext } from "./__root";

export const Route = createFileRoute("/management")({
  component: ManagementLayoutComponent,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.title"],
  }),
});

function ManagementLayoutComponent() {
  const sideNavigationItems: readonly NavigationItem[] = [
    ["/management/customer-sites", "management.customerSites.title", PlaceRounded],
    ["/management/equipment", "management.equipment.title", CommuteRounded],
    ["/management/employees", "management.employees.title", HailRounded],
    ["/management/holidays", "management.holidays.title", TodayRounded],
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
