import { SvgIcon } from "@mui/material";
import { RegisteredRouter, RoutePaths } from "@tanstack/react-router";
import { DefaultNamespace, ParseKeys } from "i18next";

export type LocalizedLabelKey = ParseKeys<DefaultNamespace> | TemplateStringsArray;

export type NavigationItem = readonly [RoutePaths<RegisteredRouter["routeTree"]>, LocalizedLabelKey, typeof SvgIcon | undefined];

/**
 * Enum for vehicle list columns
 */
export enum VehicleListColumns {
  Type = "type",
  Name = "name",
  PlateNumber = "plateNumber",
  Temperature = "temperature",
  Address = "address",
  Location = "location",
  Status = "status",
  Maintenance = "maintenance",
  TrailerTemperature = "trailer_temperature",
  Driver = "driver"
}