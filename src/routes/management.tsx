import {
  AlarmRounded,
  AnnouncementSharp,
  CommuteRounded,
  Devices,
  HailRounded,
  PlaceRounded,
  TodayRounded,
  WarehouseRounded,
} from "@mui/icons-material";
import { Stack } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";
import type { NavigationItem } from "src/types";

export const Route = createFileRoute("/management")({ component: ManagementLayoutComponent });

function ManagementLayoutComponent() {
  const sideNavigationItems: NavigationItem[] = [
    { route: "/management/terminals", label: "management.terminals.title", Icon: WarehouseRounded },
    { route: "/management/customer-sites", label: "management.customerSites.title", Icon: PlaceRounded },
    { route: "/management/equipment", label: "management.equipment.title", Icon: CommuteRounded },
    { route: "/management/employees", label: "management.employees.title", Icon: HailRounded },
    { route: "/management/client-apps", label: "management.clientApps.title", Icon: Devices },
    { route: "/management/holidays", label: "management.holidays.title", Icon: TodayRounded },
    { route: "/management/paging-policy-contacts", label: "management.alarmContacts.title", Icon: AnnouncementSharp },
    { route: "/management/thermal-monitors", label: "management.thermalMonitors.title", Icon: AlarmRounded },
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
