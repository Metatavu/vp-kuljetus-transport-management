import { Menu } from "@mui/icons-material";
import { Paper, Tab, Tabs, styled } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "src/types";

type Props = {
  navigationItems: NavigationItem[];
};

const SideDrawer = styled(Paper, {
  label: "styled-side-drawer",
})(() => ({
  position: "sticky",
  borderRadius: 0,
  transition: "width 0.3s ease-out",
}));

const SideNavigation = ({ navigationItems }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const [collapsed, setCollapsed] = useState(false);

  const selectedRouteIndex = navigationItems.findIndex(({ route }) => !!route && location.pathname.startsWith(route));

  return (
    <SideDrawer sx={{ width: collapsed ? 46 : 248 }}>
      <Tabs
        TabScrollButtonProps={{ sx: { display: "none" } }}
        orientation="vertical"
        variant="scrollable"
        value={selectedRouteIndex}
        sx={{
          justifyContent: "flex-start",
          alignContent: "flex-start",
        }}
      >
        <Tab
          iconPosition={collapsed ? "start" : "end"}
          icon={<Menu />}
          label={collapsed ? "" : t("menu")}
          title={collapsed ? t("showMenu") : t("hideMenu")}
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            justifyContent: "space-between",
            minHeight: 46,
          }}
        />
        {navigationItems.map(({ route, label, Icon }, index) => (
          <Tab
            key={route}
            icon={Icon && <Icon />}
            label={collapsed ? "" : t(label)}
            value={index}
            onClick={() => navigate({ to: route, params: {}, search: {} })}
            iconPosition="start"
            sx={{
              justifyContent: "flex-start",
              minHeight: 42,
              backgroundColor: selectedRouteIndex === index ? "rgba(0, 65, 79, 0.1)" : "transparent",
            }}
          />
        ))}
      </Tabs>
    </SideDrawer>
  );
};

export default SideNavigation;
