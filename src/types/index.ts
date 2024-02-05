import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { DefaultNamespace, ParseKeys } from "i18next";

export type LocalizedLabelKey = ParseKeys<DefaultNamespace> | TemplateStringsArray;

export type NavigationItem = [RoutePaths<RegisteredRouter["routeTree"]>, LocalizedLabelKey, typeof SvgIcon | undefined];