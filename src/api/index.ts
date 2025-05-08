import config from "app/config";
import { authAtom } from "atoms/auth";
import {
  ClientAppsApi,
  Configuration,
  DriversApi,
  EmployeeWorkShiftsApi,
  EmployeesApi,
  FreightUnitsApi,
  FreightsApi,
  HolidaysApi,
  PagingPolicyContactsApi,
  RoutesApi,
  SitesApi,
  TasksApi,
  ThermometersApi,
  TowablesApi,
  TrucksApi,
  VehiclesApi,
  WorkEventsApi,
  WorkShiftChangeSetsApi,
  WorkShiftHoursApi,
} from "generated/client";
import { getDefaultStore } from "jotai";

const configuration = new Configuration({
  basePath: config.api.baseUrl,
  accessToken: () => {
    const accessToken = getDefaultStore().get(authAtom)?.tokenRaw;
    return accessToken ? Promise.resolve(accessToken) : Promise.reject("Not authenticated");
  },
});

export const api = {
  vehicles: new VehiclesApi(configuration),
  trucks: new TrucksApi(configuration),
  towables: new TowablesApi(configuration),
  sites: new SitesApi(configuration),
  freights: new FreightsApi(configuration),
  freightUnits: new FreightUnitsApi(configuration),
  tasks: new TasksApi(configuration),
  routes: new RoutesApi(configuration),
  drivers: new DriversApi(configuration),
  employees: new EmployeesApi(configuration),
  workShiftHours: new WorkShiftHoursApi(configuration),
  holidays: new HolidaysApi(configuration),
  clientApps: new ClientAppsApi(configuration),
  employeeWorkShifts: new EmployeeWorkShiftsApi(configuration),
  workEvents: new WorkEventsApi(configuration),
  thermometers: new ThermometersApi(configuration),
  pagingPolicyContacts: new PagingPolicyContactsApi(configuration),
  workShiftChangeSets: new WorkShiftChangeSetsApi(configuration),
};
