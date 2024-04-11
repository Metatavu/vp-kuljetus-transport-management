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
  borderRadius: 0,
  backgroundColor: "transparent",
  width: "100%",
  minHeight: "42px",
  marginTop: "10px",
}));

function VehicleListLayoutComponent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const selectedRouteIndex = navigationItems.findIndex(([route]) => location.pathname.startsWith(route));

  return (
    <Stack direction="column" height="100%" padding={2}>
      <Stack direction="row" minHeight="42px">
        <ViewNavigationLayout>
          <Tabs
            orientation="horizontal"
            value={selectedRouteIndex}
            sx={{
              justifyContent: "flex-start",
              alignContent: "flex-start",
            }}
          >
            {navigationItems.map(([path, title], index) => (
              <Tab
                key={path}
                label={t(title)}
                value={index}
                onClick={() => navigate({ to: path, params: {}, search: {} })}
                sx={{
                  justifyContent: "flex-start",
                  minHeight: "42px",
                  backgroundColor: selectedRouteIndex === index ? "rgba(0, 65, 79, 0.1)" : "transparent",
                }}
              />
            ))}
          </Tabs>
        </ViewNavigationLayout>
      </Stack>
      <ViewContainer>
        <Outlet />
      </ViewContainer>
    </Stack>
  );
}
