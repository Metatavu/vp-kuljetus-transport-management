import { CommuteRounded, Devices, HailRounded, PlaceRounded, TodayRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";
import { NavigationItem } from "src/types";

export const Route = createFileRoute("/management")({ component: ManagementLayoutComponent });

function ManagementLayoutComponent() {
  const sideNavigationItems: NavigationItem[] = [
    { route: "/management/customer-sites", label: "management.customerSites.title", Icon: PlaceRounded },
    { route: "/management/equipment", label: "management.equipment.title", Icon: CommuteRounded },
    { route: "/management/employees", label: "management.employees.title", Icon: HailRounded },
    { route: "/management/client-apps", label: "management.clientApps.title", Icon: Devices },
    { route: "/management/holidays", label: "management.holidays.title", Icon: TodayRounded },
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
