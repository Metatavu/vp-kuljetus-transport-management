import { Paper, Tabs, Tab } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "src/types";

type Props = {
  navigationItems: readonly NavigationItem[];
};

const SideNavigation = ({ navigationItems }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const selectedRouteIndex = navigationItems.findIndex(([route]) => location.pathname.startsWith(route));

  return (
    <Paper sx={{ width: "248px", position: "sticky", borderRadius: 0 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedRouteIndex}
        sx={{
          justifyContent: "flex-start",
          alignContent: "flex-start",
        }}
      >
        {navigationItems.map(([path, title, Icon], index) => (
          <Tab
            key={path}
            icon={Icon && <Icon />}
            label={t(title)}
            value={index}
            onClick={() => navigate({ to: path, params: {} })}
            iconPosition="start"
            sx={{
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
