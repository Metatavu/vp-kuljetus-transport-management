import { useQuery } from "@tanstack/react-query";
import { ListFreightUnitsRequest, ListRoutesRequest, ListSitesRequest, ListTasksRequest, ListTrucksRequest } from "generated/client";
import { useApi } from "./use-api";

export const QUERY_KEYS = {
  SITES: "sites",
  ROUTES: "routes",
  TRUCKS: "trucks",
  DRIVERS: "drivers",
  TASKS: "tasks",
  FREIGHT_UNITS: "freightUnits",
  FREIGHTS: "freights",
  FREIGHT_UNITS_BY_FREIGHT: "freight-units-by-freight",
} as const;

export const useSites = (requestParams: ListSitesRequest = {}, enabled = true) => {
  const { sitesApi } = useApi();;

  return useQuery({
    queryKey: [QUERY_KEYS.SITES, requestParams],
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
    queryKey: [QUERY_KEYS.SITES, siteId],
    enabled: enabled,
    queryFn: async () => sitesApi.findSite({ siteId }),
  });
};

export const useRoutes = (requestParams: ListRoutesRequest = {}, enabled = true) => {
  const { routesApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.ROUTES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [routes, headers] = await routesApi.listRoutesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { routes, totalResults };
    },
  });
};

export const useTrucks = (requestParams: ListTrucksRequest = {}, enabled = true) => {
  const { trucksApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.TRUCKS, requestParams],
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
    queryKey: [QUERY_KEYS.DRIVERS, requestParams],
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
    queryKey: [QUERY_KEYS.TASKS, requestParams],
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
    queryKey: [QUERY_KEYS.FREIGHT_UNITS, requestParams],
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
    queryKey: [QUERY_KEYS.FREIGHTS, requestParams],
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
    queryKey: [QUERY_KEYS.FREIGHTS, freightId],
    enabled: enabled,
    queryFn: () => {
      if (!freightId) return Promise.reject();
      return freightsApi.findFreight({ freightId: freightId });
    },
  });
};

/**
 * Gets total results from headers
 *
 * @param headers Response headers
 * @returns Total results from headers or 0 if x-total-count header is not present
 */
const getTotalResultsFromHeaders = (headers: Headers) => parseInt(headers.get("x-total-count") ?? "0");