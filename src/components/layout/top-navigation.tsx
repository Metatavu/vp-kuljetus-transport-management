import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Stack, Tabs, Tab } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import logo from "assets/vp-kuljetus-logo.jpeg";
import { useAtomValue } from "jotai";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useTranslation } from "react-i18next";
import { authAtom } from "../../atoms/auth";
import { NavigationItem } from "src/types";

const TopNavigation = () => {
  const auth = useAtomValue(authAtom);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const accountMenuState = usePopupState({ variant: "popover", popupId: "accountMenu" });

  const routeLinks: readonly NavigationItem[] = [
    ["/vehicle-list/vehicles", "vehicleList.title", undefined],
    ["/drive-planning/routes", "drivePlanning.title", undefined],
    ["/working-time", "workingTime", undefined],
    ["/management/customer-sites", "management.title", undefined],
  ] as const;

  const selectedRouteIndex = routeLinks.findIndex(([route]) =>
    route.split("/")[1].startsWith(location.pathname.split("/")[1]),
  );

  return (
    <AppBar position="static" sx={{ height: "54px" }}>
      <Toolbar variant="dense">
        <img src={logo} alt="VP-Kuljetus logo" height={42} />

        <Stack direction="row" gap={3} sx={{ ml: 3, flexGrow: 1 }}>
          <Tabs value={selectedRouteIndex}>
            {routeLinks.map(([route, label], routeIndex) => (
              <Tab
                key={route}
                label={t(label)}
                value={routeIndex}
                onClick={() => navigate({ to: route, params: {}, search: {} })}
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
