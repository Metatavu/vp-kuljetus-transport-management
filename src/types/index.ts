import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";

export type SideNavigationItem = {
  title: string;
  path: RoutePaths<RegisteredRouter["routeTree"]>,
  Icon: typeof SvgIcon;
}