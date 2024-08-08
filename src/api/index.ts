import config from "../app/config";
import {
  Configuration,
  ConfigurationParameters,
  VehiclesApi,
  TrucksApi,
  TowablesApi,
  SitesApi,
  FreightsApi,
  FreightUnitsApi,
  TasksApi,
  RoutesApi,
  DriversApi,
  EmployeesApi,
  TimeEntriesApi,
} from "../generated/client";

type ConfigConstructor<T> = new (_params: ConfigurationParameters) => T;

const getConfigurationFactory =
  <T>(ConfigConstructor: ConfigConstructor<T>, basePath: string, getAccessToken?: () => Promise<string>) =>
  () => {
    return new ConfigConstructor({
      basePath: basePath,
      accessToken: getAccessToken,
    });
  };

export const getApiClient = (getAccessToken?: () => Promise<string>) => {
  const getConfiguration = getConfigurationFactory(Configuration, config.api.baseUrl, getAccessToken);

  return {
    vehiclesApi: new VehiclesApi(getConfiguration()),
    trucksApi: new TrucksApi(getConfiguration()),
    towablesApi: new TowablesApi(getConfiguration()),
    sitesApi: new SitesApi(getConfiguration()),
    freightsApi: new FreightsApi(getConfiguration()),
    freightUnitsApi: new FreightUnitsApi(getConfiguration()),
    tasksApi: new TasksApi(getConfiguration()),
    routesApi: new RoutesApi(getConfiguration()),
    driversApi: new DriversApi(getConfiguration()),
    employeesApi: new EmployeesApi(getConfiguration()),
    timeEntriesApi: new TimeEntriesApi(getConfiguration())
  };
};
