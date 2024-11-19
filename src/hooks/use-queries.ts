import { queryOptions } from "@tanstack/react-query";
import { api } from "api/index";
import {
  FindTowableRequest,
  FindTruckRequest,
  ListClientAppsRequest,
  ListEmployeesRequest,
  ListFreightUnitsRequest,
  ListHolidaysRequest,
  ListRoutesRequest,
  ListSitesRequest,
  ListTasksRequest,
  ListTrucksRequest,
  ListWorkShiftHoursRequest,
  SalaryGroup,
} from "generated/client";
import { DateTime } from "luxon";

const WORKING_TIME_PERIOD_START_DATE = DateTime.now().set({ day: 7, month: 1, year: 2024 });

export const QUERY_KEYS = {
  SITES: "sites",
  ROUTES: "routes",
  TRUCKS: "trucks",
  TOWABLES: "towables",
  DRIVERS: "drivers",
  TASKS: "tasks",
  TASKS_BY_ROUTE: "tasks-by-route",
  FREIGHT_UNITS: "freightUnits",
  FREIGHTS: "freights",
  FREIGHT_UNITS_BY_FREIGHT: "freight-units-by-freight",
  EMPLOYEES: "employees",
  WORK_SHIFT_HOURS: "work-shift-hours",
  HOLIDAYS: "holidays",
  CLIENT_APPS: "clientApps",
} as const;

export const getListSitesQueryOptions = (requestParams: ListSitesRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.SITES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [sites, headers] = await api.sites.listSitesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { sites, totalResults };
    },
  });

export const getFindSiteQueryOptions = (siteId: string, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.SITES, siteId],
    enabled: enabled,
    queryFn: () => api.sites.findSite({ siteId }),
  });

export const getListRoutesQueryOptions = (
  requestParams: ListRoutesRequest = {},
  enabled = true,
  refetchInterval?: number,
  onSuccess?: () => void,
) =>
  queryOptions({
    queryKey: [QUERY_KEYS.ROUTES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [routes, headers] = await api.routes.listRoutesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);
      onSuccess?.();

      return { routes, totalResults };
    },
    refetchInterval: refetchInterval,
  });

export const getListTrucksQueryOptions = (requestParams: ListTrucksRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TRUCKS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [trucks, headers] = await api.trucks.listTrucksWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { trucks, totalResults };
    },
  });

export const getFindTruckQueryOptions = ({ truckId }: FindTruckRequest, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TRUCKS, truckId],
    enabled: enabled,
    queryFn: () => api.trucks.findTruck({ truckId }),
  });

export const getFindTowableQueryOptions = ({ towableId }: FindTowableRequest, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TOWABLES, towableId],
    enabled: enabled,
    queryFn: () => api.towables.findTowable({ towableId }),
  });

export const getListDriversQueryOptions = (requestParams: ListTrucksRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.DRIVERS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [drivers, headers] = await api.drivers.listDriversWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { drivers, totalResults };
    },
  });

export const getListTasksQueryOptions = (requestParams: ListTasksRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TASKS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [tasks, headers] = await api.tasks.listTasksWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { tasks, totalResults };
    },
  });

export const getListFreightUnitsQueryOptions = (requestParams: ListFreightUnitsRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.FREIGHT_UNITS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [freightUnits, headers] = await api.freightUnits.listFreightUnitsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { freightUnits, totalResults };
    },
  });

export const getListFreightsQueryOptions = (requestParams: ListFreightUnitsRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.FREIGHTS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [freights, headers] = await api.freights.listFreightsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { freights, totalResults };
    },
  });

export const getFindFreightQueryOptions = (freightId: string, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.FREIGHTS, freightId],
    enabled: enabled,
    queryFn: () => api.freights.findFreight({ freightId: freightId }),
  });

export const getListEmployeesQueryOptions = (requestParams: ListEmployeesRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.EMPLOYEES, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [employees, headers] = await api.employees.listEmployeesWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { employees, totalResults };
    },
  });

export const getFindEmployeeQueryOptions = (employeeId: string, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.EMPLOYEES, employeeId],
    enabled: enabled,
    queryFn: () => api.employees.findEmployee({ employeeId }),
  });

export const getListTimeEntriesQueryOptions = (
  requestParams: ListWorkShiftHoursRequest,
  useWorkingPeriod: boolean,
  salaryGroup: SalaryGroup,
  selectedDate?: Date,
  enabled = true,
) => {
  if (useWorkingPeriod && selectedDate) {
    const workingPeriodDates = getWorkingPeriodDates(salaryGroup, selectedDate);
    requestParams.employeeWorkShiftStartedAfter = workingPeriodDates.start;
    requestParams.employeeWorkShiftStartedBefore = workingPeriodDates.end;
  }

  return queryOptions({
    queryKey: [QUERY_KEYS.WORK_SHIFT_HOURS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [timeEntries, headers] = await api.workShiftHours.listWorkShiftHoursWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { timeEntries, totalResults };
    },
  });
};

export const getListHolidaysQueryOptions = (requestParams: ListHolidaysRequest = {}, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.HOLIDAYS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [holidays, headers] = await api.holidays.listHolidaysWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);
      holidays.sort((a, b) => b.date.getTime() - a.date.getTime());
      return { holidays, totalResults };
    },
  });

export const getFindHolidayQueryOptions = (holidayId: string, enabled = true) =>
  queryOptions({
    queryKey: [QUERY_KEYS.HOLIDAYS, holidayId],
    enabled: enabled,
    queryFn: () => api.holidays.findHoliday({ holidayId }),
  });

export const getListClientAppsQueryOptions = (params: ListClientAppsRequest = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.CLIENT_APPS, params],
    queryFn: async () => {
      const [clientApps, headers] = await api.clientApps.listClientAppsWithHeaders(params);
      const totalResults = getTotalResultsFromHeaders(headers);
      return { clientApps, totalResults };
    },
  });

export const getFindClientAppQueryOptions = (clientAppId: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.CLIENT_APPS, clientAppId],
    queryFn: () => api.clientApps.findClientApp({ clientAppId }),
  });

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
