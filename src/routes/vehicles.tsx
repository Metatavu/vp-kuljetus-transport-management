import { Stack, Tab, Tabs, styled } from "@mui/material";
import { Outlet, createFileRoute, useMatches, useNavigate } from "@tanstack/react-router";
import ViewContainer from "components/layout/view-container";
import { useTranslation } from "react-i18next";
import type { NavigationItem } from "src/types";

export const Route = createFileRoute("/vehicles")({ component: VehicleListLayoutComponent });

const navigationItems: NavigationItem[] = [
  { route: "/vehicles/list", label: "vehicles.list.title" },
  { route: "/vehicles/map", label: "vehicles.map.title" },
];

const ViewNavigationLayout = styled(Stack, {
  label: "styled-view-navigation-layout",
})(() => ({
  position: "sticky",
  width: "100%",
}));

function VehicleListLayoutComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const selectedRouteIndex = navigationItems.findIndex(({ route }) => route && location.pathname.startsWith(route));

  return (
    <Stack direction="column" flex={1} padding={2}>
      <ViewNavigationLayout>
        <Tabs orientation="horizontal" value={selectedRouteIndex}>
          {navigationItems.map(({ route, label }, index) => (
            <Tab
              key={route}
              label={t(label)}
              value={index}
              onClick={() => navigate({ to: route, params: {}, search: {} })}
            />
          ))}
        </Tabs>
      </ViewNavigationLayout>
      <ViewContainer>
        <Outlet />
      </ViewContainer>
    </Stack>
  );
}
