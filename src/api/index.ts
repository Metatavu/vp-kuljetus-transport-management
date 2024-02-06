import config from "../app/config";
import {
  Configuration,
  ConfigurationParameters,
  VehiclesApi,
  TrucksApi,
  TrailersApi
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
    trailersApi: new TrailersApi(getConfiguration())
  };
};
