import { Outlet, createFileRoute, useMatches, useNavigate } from "@tanstack/react-router";
import { Stack, Tab, Tabs, styled } from "@mui/material";
import { NavigationItem } from "src/types";
import ViewContainer from "components/layout/view-container";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/vehicle-list")({
  component: VehicleListLayoutComponent,
});

const navigationItems: readonly NavigationItem[] = [
  ["/vehicle-list/vehicles", "vehicleList.title", undefined],
  ["/vehicle-list/map-view", "vehicleList.mapView.title", undefined],
] as const;

const ViewNavigationLayout = styled(Stack, {
  label: "styled-view-navigation-layout",
})(() => ({
  position: "sticky",
  width: "100%"
}));

function VehicleListLayoutComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const selectedRouteIndex = navigationItems.findIndex(([route]) => location.pathname.startsWith(route));

  return (
    <Stack direction="column" flex={1} padding={2}>
      <ViewNavigationLayout>
        <Tabs
          orientation="horizontal"
          value={selectedRouteIndex}
        >
          {navigationItems.map(([path, title], index) => (
            <Tab
              key={path}
              label={t(title)}
              value={index}
              onClick={() => navigate({ to: path, params: {}, search: {} })}
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
