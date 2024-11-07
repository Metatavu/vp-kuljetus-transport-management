import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { AppBar, IconButton, Menu, MenuItem, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import logo from "assets/vp-kuljetus-logo.jpeg";
import { authAtom } from "atoms/auth";
import { useAtomValue } from "jotai";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useTranslation } from "react-i18next";
import { NavigationItem } from "src/types";

const TopNavigation = () => {
  const auth = useAtomValue(authAtom);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const accountMenuState = usePopupState({ variant: "popover", popupId: "accountMenu" });

  const routeLinks: readonly NavigationItem[] = [
    { route: "/vehicles/list", label: "vehicles.title" },
    { route: "/drive-planning/routes", label: "drivePlanning.title" },
    { route: "/working-hours", label: "workingHours.title" },
    { route: "/management/customer-sites", label: "management.title" },
  ];

  const selectedRouteIndex = routeLinks.findIndex(({ route }) =>
    route?.split("/")[1].startsWith(location.pathname.split("/")[1]),
  );

  return (
    <AppBar position="static" sx={{ height: "54px", pl: 2 }}>
      <Toolbar variant="dense" disableGutters>
        <img src={logo} alt="VP-Kuljetus logo" height={42} />

        <Stack direction="row" gap={3} sx={{ ml: 8, flexGrow: 1 }}>
          <Tabs value={selectedRouteIndex}>
            {routeLinks.map(({ route: path, label }, routeIndex) => (
              <Tab
                key={path}
                label={t(label)}
                value={routeIndex}
                onClick={() => navigate({ to: path, params: {}, search: {} })}
              />
            ))}
          </Tabs>
        </Stack>

        <div>
          <IconButton {...bindTrigger(accountMenuState)}>
            <AccountCircleIcon />
          </IconButton>
          <Menu {...bindMenu(accountMenuState)}>
            <MenuItem onClick={auth?.logout}>
              <Typography textAlign="center">{t("logout")}</Typography>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;
