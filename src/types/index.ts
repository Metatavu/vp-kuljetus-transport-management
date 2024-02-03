import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { ReactNode } from "react";

export type SideNavigationItem = {
  title: string;
  path: RoutePaths<RegisteredRouter["routeTree"]>,
  icon: ReactNode,
}