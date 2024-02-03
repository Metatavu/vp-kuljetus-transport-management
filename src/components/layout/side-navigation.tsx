import { Paper, Tabs, Tab } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { SideNavigationItem } from "src/types";

type Props = {
  navigationItems: SideNavigationItem[];
};

const SideNavigation = ({ navigationItems }: Props) => {
  const navigate = useNavigate();
  useMatches();

  const selectedRouteIndex = navigationItems.findIndex((navigtionItem) =>
    location.pathname.startsWith(navigtionItem.path),
  );

  return (
    <Paper sx={{ width: "248px", position: "sticky", borderRadius: 0 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedRouteIndex}
        sx={{ justifyContent: "flex-start", alignContent: "flex-start" }}
      >
        {navigationItems.map(({ title, path, Icon }, index) => (
          <Tab
            icon={<Icon />}
            label={title}
            value={index}
            onClick={() => navigate({ to: path })}
            iconPosition="start"
            sx={{ justifyContent: "flex-start", minHeight: "42px" }}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default SideNavigation;
