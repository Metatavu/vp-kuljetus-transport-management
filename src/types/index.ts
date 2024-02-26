import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { DefaultNamespace, KeyPrefix, ParseKeys, TOptions } from "i18next";

export type LocalizedLabelKey<KPrefix extends KeyPrefix<DefaultNamespace> = KeyPrefix<DefaultNamespace>> = ParseKeys<DefaultNamespace, TOptions, KPrefix> | TemplateStringsArray;

export type NavigationItem = readonly [RoutePaths<RegisteredRouter["routeTree"]>, LocalizedLabelKey, typeof SvgIcon | undefined];

/**
 * Enum for vehicle list columns
 */
export enum VehicleListColumns {
  Name = "name",
  Number = "number",
  Address = "address",
  Location = "location",
  Status = "status",
  Trailer = "trailer",
  Driver = "driver"
}