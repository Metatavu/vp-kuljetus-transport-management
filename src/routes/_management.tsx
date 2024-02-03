import { EventNoteRounded, ListAltRounded, TodayRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { FileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SideNavigationItem } from "../types";
import SideNavigation from "components/layout/side-navigation";
import ViewContainer from "components/layout/view-container";

export const Route = new FileRoute("/_management").createRoute({
  component: ManagementLayoutComponent,
  beforeLoad() {
    redirect({ to: "/management/customer-sites" });
  },
});

function ManagementLayoutComponent() {
  const { t } = useTranslation();

  const sideNavigationItems: SideNavigationItem[] = [
    {
      title: t("managementLinks.customerSites"),
      path: "/management/customer-sites",
      Icon: TodayRounded,
    },
    {
      title: t("managementLinks.towables"),
      path: "/management/towables",
      Icon: ListAltRounded,
    },
    {
      title: t("managementLinks.vehicles"),
      path: "/management/vehicles",
      Icon: EventNoteRounded,
    },
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
