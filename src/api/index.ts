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
  DriversApi
} from "../generated/client";

type ConfigConstructor<T> = new (_params: ConfigurationParameters) => T;

const getConfigurationFactory =
  <T>(ConfigConstructor: ConfigConstructor<T>, basePath: string, accessToken?: string) =>
  () => {
    return new ConfigConstructor({
      basePath: basePath,
      accessToken: accessToken
    });
  };

export const getApiClient = (accessToken?: string) => {
  const getConfiguration = getConfigurationFactory(Configuration, config.api.baseUrl, accessToken);

  return {
    vehiclesApi: new VehiclesApi(getConfiguration()),
    trucksApi: new TrucksApi(getConfiguration()),
    towablesApi: new TowablesApi(getConfiguration()),
    sitesApi: new SitesApi(getConfiguration()),
    freightsApi: new FreightsApi(getConfiguration()),
    freightUnitsApi: new FreightUnitsApi(getConfiguration()),
    tasksApi: new TasksApi(getConfiguration()),
    routesApi: new RoutesApi(getConfiguration()),
    driversApi: new DriversApi(getConfiguration())
  };
};
