import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Stack, Tabs, Tab } from "@mui/material";
import { useMatches, useNavigate } from "@tanstack/react-router";
import logo from "assets/vp-kuljetus-logo.jpeg";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useTranslation } from "react-i18next";

const TopNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useMatches();

  const accountMenuState = usePopupState({ variant: "popover", popupId: "accountMenu" });

  const routeLinks = [
    ["/vehicle-list", t("vehicleList")],
    ["/vehicle-info", t("vehicleInfo")],
    ["/drive-planning", t("drivePlanning")],
    ["/working-time", t("workingTime")],
    ["/management", t("management")],
  ] as const;

  const selectedRouteIndex = routeLinks.findIndex(([route]) => location.pathname.startsWith(route));

  return (
    <AppBar position="static" sx={{ height: "54px" }}>
      <Toolbar variant="dense">
        <img src={logo} alt="VP-Kuljetus logo" height={42} />

        <Stack direction="row" gap={3} sx={{ ml: 3, flexGrow: 1 }}>
          <Tabs value={selectedRouteIndex}>
            {routeLinks.map(([route, label], routeIndex) => (
              <Tab key={route} label={label} value={routeIndex} onClick={() => navigate({ to: route })} />
            ))}
          </Tabs>
        </Stack>

        <div>
          <IconButton {...bindTrigger(accountMenuState)}>
            <AccountCircleIcon />
          </IconButton>
          <Menu {...bindMenu(accountMenuState)}>
            <MenuItem onClick={accountMenuState.close}>
              <Typography textAlign="center">{t("logout")}</Typography>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;
