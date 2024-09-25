import { useQuery } from "@tanstack/react-query";
import {
  ListEmployeesRequest,
  ListEmployeeDailyTimeEntriesRequest,
  ListFreightUnitsRequest,
  ListHolidaysRequest,
  ListRoutesRequest,
  ListSitesRequest,
  ListTasksRequest,
  ListTrucksRequest,
  SalaryGroup,
} from "generated/client";
import { useApi } from "./use-api";
import { DateTime } from "luxon";

const WORKING_TIME_PERIOD_START_DATE = DateTime.now().set({ day: 7, month: 1, year: 2024 });

export const QUERY_KEYS = {
  SITES: "sites",
  ROUTES: "routes",
  TRUCKS: "trucks",
  DRIVERS: "drivers",
  TASKS: "tasks",
  TASKS_BY_ROUTE: "tasks-by-route",
  FREIGHT_UNITS: "freightUnits",
  FREIGHTS: "freights",
  FREIGHT_UNITS_BY_FREIGHT: "freight-units-by-freight",
  EMPLOYEES: "employees",
  TIME_ENTRIES: "time-entries",
  HOLIDAYS: "holidays",
} as const;

export const useSites = (requestParams: ListSitesRequest = {}, enabled = true) => {
  const { sitesApi } = useApi();

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
  const { sitesApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.SITES, siteId],
    enabled: enabled,
    queryFn: async () => sitesApi.findSite({ siteId }),
  });
};

export const useRoutes = (
  requestParams: ListRoutesRequest = {},
  enabled = true,
  refetchInterval?: number,
  onSuccess?: () => void,
) => {
  const { routesApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.ROUTES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [routes, headers] = await routesApi.listRoutesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);
      onSuccess?.();

      return { routes, totalResults };
    },
    refetchInterval: refetchInterval,
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

export const useFreight = (freightId: string, enabled = true) => {
  const { freightsApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.FREIGHTS, freightId],
    enabled: enabled,
    queryFn: () => freightsApi.findFreight({ freightId: freightId }),
  });
};

export const useListEmployees = (requestParams: ListEmployeesRequest = {}, enabled = true) => {
  const { employeesApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [employees, headers] = await employeesApi.listEmployeesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { employees, totalResults };
    },
  });
};

export const useEmployee = (employeeId: string, enabled = true) => {
  const { employeesApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, employeeId],
    enabled: enabled,
    queryFn: async () => employeesApi.findEmployee({ employeeId }),
  });
};

export const useTimeEntries = (
  requestParams: ListEmployeeDailyTimeEntriesRequest,
  useWorkingPeriod: boolean,
  salaryGroup: SalaryGroup,
  selectedDate?: Date,
  enabled = true,
) => {
  const { dailyTimeEntriesApi } = useApi();

  if (useWorkingPeriod && selectedDate) {
    const workingPeriodDates = getWorkingPeriodDates(salaryGroup, selectedDate);
    requestParams.start = workingPeriodDates.start;
    requestParams.end = workingPeriodDates.end;
  }

  return useQuery({
    queryKey: [QUERY_KEYS.TIME_ENTRIES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [timeEntries, headers] = await dailyTimeEntriesApi.listEmployeeDailyTimeEntriesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { timeEntries, totalResults };
    },
  });
};

export const useHolidays = (requestParams: ListHolidaysRequest = {}, enabled = true) => {
  const { holidaysApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.HOLIDAYS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [holidays, headers] = await holidaysApi.listHolidaysWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);
      holidays.sort((a, b) => b.date.getTime() - a.date.getTime());
      return { holidays, totalResults };
    },
  });
};

export const useHoliday = (holidayId: string, enabled = true) => {
  const { holidaysApi } = useApi();

  return useQuery({
    queryKey: [QUERY_KEYS.HOLIDAYS, holidayId],
    enabled: enabled,
    queryFn: async () => holidaysApi.findHoliday({ holidayId }),
  });
};

/**
 * Gets working period start and end datetime according to salary group and selected date
 *
 * @param salaryGroup Salary group of the employee
 * @param selectedDate Selected date
 * @returns Start and end date of the working period
 */
export const getWorkingPeriodDates = (salaryGroup: SalaryGroup, selectedDate: Date) => {
  const selectedDateTime = DateTime.fromJSDate(selectedDate);

  return isOfficeOrTerminalGroup(salaryGroup)
    ? getOfficeOrTerminalPeriod(selectedDateTime)
    : getDriverPeriod(selectedDateTime);
};

const isOfficeOrTerminalGroup = (salaryGroup: string) => {
  return salaryGroup === SalaryGroup.Office || salaryGroup === SalaryGroup.Terminal;
};

const getOfficeOrTerminalPeriod = (selectedDateTime: DateTime) => {
  const midMonth = 16;

  if (selectedDateTime.day < midMonth) {
    const start = selectedDateTime.startOf("month").toJSDate();
    const end = selectedDateTime.set({ day: 15 }).endOf("day").toJSDate();
    return { start, end };
  }

  const start = selectedDateTime.set({ day: 16 }).startOf("day").toJSDate();
  const end = selectedDateTime.endOf("month").endOf("day").toJSDate();
  return { start, end };
};

const getDriverPeriod = (selectedDateTime: DateTime) => {
  const fullWeeksFromStartDate = calculateFullWeeksFromStartDate(selectedDateTime);
  const remainderRoundedUp = Math.ceil(fullWeeksFromStartDate % 2);
  return calculatePeriod(fullWeeksFromStartDate - remainderRoundedUp);
};

const calculateFullWeeksFromStartDate = (selectedDateTime: DateTime) => {
  return Math.floor(selectedDateTime.diff(WORKING_TIME_PERIOD_START_DATE, "weeks").weeks);
};

const calculatePeriod = (startWeekOffset: number) => {
  const start = WORKING_TIME_PERIOD_START_DATE.plus({ weeks: startWeekOffset })
    .set({ weekday: 7 })
    .startOf("day")
    .toJSDate();
  const end = WORKING_TIME_PERIOD_START_DATE.plus({ weeks: startWeekOffset + 2 })
    .set({ weekday: 6 })
    .endOf("day")
    .toJSDate();
  return { start, end };
};

/**
 * Gets total results from headers
 *
 * @param headers Response headers
 * @returns Total results from headers or 0 if x-total-count header is not present
 */
const getTotalResultsFromHeaders = (headers: Headers) => parseInt(headers.get("x-total-count") ?? "0");
