import { queryOptions } from "@tanstack/react-query";
import { api } from "api/index";
import {
  FindEmployeeWorkShiftRequest,
  FindPagingPolicyContactRequest,
  FindTowableRequest,
  FindTruckRequest,
  ListClientAppsRequest,
  ListEmployeeWorkEventsRequest,
  ListEmployeeWorkShiftsRequest,
  ListEmployeesRequest,
  ListFreightUnitsRequest,
  ListHolidaysRequest,
  ListPagingPolicyContactsRequest,
  ListPayrollExportsRequest,
  ListRoutesRequest,
  ListSiteTemperaturesRequest,
  ListSitesRequest,
  ListTasksRequest,
  ListTerminalThermometersRequest,
  ListTowableTemperaturesRequest,
  ListTruckOrTowableThermometersRequest,
  ListTruckTemperaturesRequest,
  ListTrucksRequest,
  ListWorkShiftChangeSetsRequest,
  ListWorkShiftHoursRequest,
} from "generated/client";

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
  WORK_SHIFTS: "work-shifts",
  EMPLOYEE_WORK_EVENTS: "employee-work-events",
  TRUCK_OR_TOWABLE_THERMOMETERS: "truck-or-towable-thermometers",
  TERMINAL_THERMOMETERS: "terminal-thermometers",
  TRUCK_TEMPERATURES: "truck-temperatures",
  TOWABLE_TEMPERATURES: "towable-temperatures",
  SITE_TEMPERATURES: "site-temperatures",
  TRUCK_LOCATIONS: "truck-locations",
  TRUCK_ODOMETER_READINGS: "truck-odometer-readings",
  TRUCK_SPEEDS: "truck-speeds",
  ALARM_CONTACTS: "alarm-contacts",
  WORK_SHIFT_CHANGE_SETS: "work-shift-change-sets",
  PAYROLL_EXPORTS: "payroll-exports",
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

export const getEmployeeWorkShiftsQueryOptions = (requestParams: ListEmployeeWorkShiftsRequest, enabled = true) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.WORK_SHIFTS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [employeeWorkShifts, headers] =
        await api.employeeWorkShifts.listEmployeeWorkShiftsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { employeeWorkShifts, totalResults };
    },
  });
};

export const getListWorkShiftChangeSetsQueryOptions = (
  requestParams: ListWorkShiftChangeSetsRequest,
  enabled = true,
) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.WORK_SHIFT_CHANGE_SETS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [workShiftChangeSets, headers] =
        await api.workShiftChangeSets.listWorkShiftChangeSetsWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { workShiftChangeSets, totalResults };
    },
  });
};

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

export const getListWorkShiftHoursQueryOptions = (requestParams: ListWorkShiftHoursRequest, enabled = true) => {
  return queryOptions({
    queryKey: [QUERY_KEYS.WORK_SHIFT_HOURS, requestParams],
    enabled: enabled,
    queryFn: async () => {
      const [employeeWorkShiftHours, headers] = await api.workShiftHours.listWorkShiftHoursWithHeaders(requestParams);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { employeeWorkShiftHours, totalResults };
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

export const getListEmployeeWorkEventsQueryOptions = (params: ListEmployeeWorkEventsRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.EMPLOYEE_WORK_EVENTS, params],
    queryFn: async () => {
      const [workEvents, headers] = await api.workEvents.listEmployeeWorkEventsWithHeaders(params);
      const totalResults = getTotalResultsFromHeaders(headers);

      return { workEvents, totalResults };
    },
  });

export const getFindEmployeeWorkShiftQueryOptions = (params: FindEmployeeWorkShiftRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.WORK_SHIFTS, params],
    queryFn: () => api.employeeWorkShifts.findEmployeeWorkShift(params),
  });

export const getListTerminalThermometersQueryOptions = (params: ListTerminalThermometersRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TERMINAL_THERMOMETERS, params],
    queryFn: () => api.thermometers.listTerminalThermometers(params),
  });

export const getListTruckOrTowableThermometersQueryOptions = (params: ListTruckOrTowableThermometersRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TRUCK_OR_TOWABLE_THERMOMETERS, params],
    queryFn: () => api.thermometers.listTruckOrTowableThermometers(params),
  });

export const getListTruckTemperaturesQueryOptions = (params: ListTruckTemperaturesRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TRUCK_TEMPERATURES, params],
    queryFn: () => api.trucks.listTruckTemperatures(params),
  });

export const getListTowableTemperaturesQueryOptions = (params: ListTowableTemperaturesRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.TOWABLE_TEMPERATURES, params],
    queryFn: () => api.towables.listTowableTemperatures(params),
  });

export const getListTerminalTemperaturesQueryOptions = (params: ListSiteTemperaturesRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.SITE_TEMPERATURES, params],
    queryFn: () => api.sites.listSiteTemperatures(params),
  });

export const getListPagingPolicyContactsQueryOptions = (params: ListPagingPolicyContactsRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.ALARM_CONTACTS, params],
    queryFn: async () => {
      const [alarmContacts, headers] = await api.pagingPolicyContacts.listPagingPolicyContactsWithHeaders(params);
      const totalResults = getTotalResultsFromHeaders(headers);
      return { alarmContacts, totalResults };
    },
  });

export const getFindPagingPolicyContactQueryOptions = (params: FindPagingPolicyContactRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.ALARM_CONTACTS, params.pagingPolicyContactId],
    queryFn: () =>
      api.pagingPolicyContacts.findPagingPolicyContact({ pagingPolicyContactId: params.pagingPolicyContactId }),
  });

export const getListPayrollExportsQueryOptions = (params: ListPayrollExportsRequest) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PAYROLL_EXPORTS, params],
    queryFn: async () => {
      const [payrollExports, headers] = await api.payrollExports.listPayrollExportsWithHeaders(params);
      const totalResults = getTotalResultsFromHeaders(headers);
      return { payrollExports, totalResults };
    },
  });
export const getFindPayrollExportQueryOptions = (payrollExportId: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.PAYROLL_EXPORTS, payrollExportId],
    queryFn: () => api.payrollExports.findPayrollExport({ payrollExportId }),
    enabled: !!payrollExportId,
  });
/**
 * Gets total results from headers
 *
 * @param headers Response headers
 * @returns Total results from headers or 0 if x-total-count header is not present
 */
const getTotalResultsFromHeaders = (headers: Headers) => parseInt(headers.get("x-total-count") ?? "0");
