import { useQuery } from "@tanstack/react-query";
import { ListFreightUnitsRequest, ListRoutesRequest, ListSitesRequest, ListTasksRequest, ListTrucksRequest } from "generated/client";
import { useApi } from "./use-api";

export const useSites = (requestParams: ListSitesRequest = {}, enabled = true) => {
  const { sitesApi } = useApi();;

  return useQuery({
    queryKey: ["sites", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [sites, headers] = await sitesApi.listSitesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { sites, totalResults };
    },
  });
};

export const useSite = (siteId: string, enabled = true) => {
  const { sitesApi }  = useApi();

  return useQuery({
    queryKey: ["site", siteId],
    enabled: enabled,
    queryFn: async () => sitesApi.findSite({ siteId }),
  });
};

export const useRoutes = (requestParams: ListRoutesRequest = {}, enabled = true) => {
  const { routesApi } = useApi();

  return useQuery({
    queryKey: ["routes", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [routes, headers] = await routesApi.listRoutesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { routes, totalResults };
    },
  });
}

export const useTrucks = (requestParams: ListTrucksRequest = {}, enabled = true) => {
  const { trucksApi } = useApi();

  return useQuery({
    queryKey: ["trucks", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [trucks, headers] = await trucksApi.listTrucksWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { trucks, totalResults };
    },
  });
};

export const useDrivers = (requestParams: ListTrucksRequest = {}, enabled = true) => {
  const { driversApi } = useApi();

  return useQuery({
    queryKey: ["drivers", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [drivers, headers] = await driversApi.listDriversWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { drivers, totalResults };
    },
  });
};

export const useTasks = (requestParams: ListTasksRequest = {}, enabled = true) => {
  const { tasksApi } = useApi();

  return useQuery({
    queryKey: ["tasks", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [tasks, headers] = await tasksApi.listTasksWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { tasks, totalResults };
    },
  });
};

export const useFreightUnits = (requestParams: ListFreightUnitsRequest = {}, enabled = true) => {
  const { freightUnitsApi } = useApi();

  return useQuery({
    queryKey: ["freightUnits", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [freightUnits, headers] = await freightUnitsApi.listFreightUnitsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { freightUnits, totalResults };
    },
  });
};

export const useFreights = (requestParams: ListFreightUnitsRequest = {}, enabled = true) => {
  const { freightsApi } = useApi();

  return useQuery({
    queryKey: ["freights", requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [freights, headers] = await freightsApi.listFreightsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { freights, totalResults };
    },
  });
};

export const useFreight = (freightId?: string, enabled = true) => {
  const { freightsApi } = useApi();

  return useQuery({
    queryKey: ["freights", freightId],
    enabled: enabled,
    queryFn: async () => (freightId ? freightsApi.findFreight({ freightId: freightId }) : undefined),
  });
};

/**
 * Gets total results from headers
 *
 * @param headers Response headers
 * @returns Total results from headers or 0 if x-total-count header is not present
 */
const getTotalResultsFromHeaders = (headers: Headers) => parseInt(headers.get("x-total-count") ?? "0");