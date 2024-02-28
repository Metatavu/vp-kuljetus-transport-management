import { useState } from "react";
import { Paper, Tabs, Tab } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "src/types";
import { Menu } from "@mui/icons-material";

type Props = {
  navigationItems: readonly NavigationItem[];
};

const SideNavigation = ({ navigationItems }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const [collapsed, setCollapsed] = useState(false);

  const selectedRouteIndex = navigationItems.findIndex(([route]) => location.pathname.startsWith(route));

  return (
    <Paper sx={{ width: collapsed ? "52px" : "248px", position: "sticky", borderRadius: 0, transition: "width 0.3s" }}>
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
          label={"Valikko"}
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            fontSize: collapsed ? 0 : "inherit",
            justifyContent: "space-between",
            minHeight: "42px",
          }}
        />
        {navigationItems.map(([path, title, Icon], index) => (
          <Tab
            key={path}
            icon={Icon && <Icon />}
            label={t(title)}
            value={index}
            onClick={() => navigate({ to: path, params: {}, search: {} })}
            iconPosition="start"
            sx={{
              fontSize: collapsed ? 0 : "inherit",
              justifyContent: "flex-start",
              minHeight: "42px",
              backgroundColor: selectedRouteIndex === index ? "rgba(0, 65, 79, 0.1)" : "transparent",
            }}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default SideNavigation;
