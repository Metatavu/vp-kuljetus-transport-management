/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./../../routes/__root";
import { Route as VehiclesImport } from "./../../routes/vehicles";
import { Route as ManagementImport } from "./../../routes/management";
import { Route as DrivePlanningImport } from "./../../routes/drive-planning";
import { Route as IndexImport } from "./../../routes/index";
import { Route as WorkingHoursIndexImport } from "./../../routes/working-hours.index";
import { Route as VehiclesMapImport } from "./../../routes/vehicles.map";
import { Route as VehiclesListImport } from "./../../routes/vehicles.list";
import { Route as ManagementVehiclesImport } from "./../../routes/management.vehicles";
import { Route as ManagementHolidaysImport } from "./../../routes/management.holidays";
import { Route as ManagementEquipmentImport } from "./../../routes/management.equipment";
import { Route as ManagementEmployeesImport } from "./../../routes/management.employees";
import { Route as ManagementCustomerSitesImport } from "./../../routes/management.customer-sites";
import { Route as ManagementClientAppsImport } from "./../../routes/management.client-apps";
import { Route as DrivePlanningRoutesImport } from "./../../routes/drive-planning.routes";
import { Route as DrivePlanningFreightsImport } from "./../../routes/drive-planning.freights";
import { Route as WorkingHoursEmployeeIdWorkShiftsImport } from "./../../routes/working-hours_.$employeeId.work-shifts";
import { Route as VehiclesTruckIdDetailsImport } from "./../../routes/vehicles_.$truckId.details";
import { Route as ManagementHolidaysAddHolidayImport } from "./../../routes/management.holidays.add-holiday";
import { Route as ManagementEquipmentAddEquipmentImport } from "./../../routes/management.equipment_.add-equipment";
import { Route as ManagementEmployeesAddEmployeeImport } from "./../../routes/management.employees_.add-employee";
import { Route as ManagementCustomerSitesAddCustomerSiteImport } from "./../../routes/management.customer-sites_.add-customer-site_";
import { Route as ManagementClientAppsClientAppIdImport } from "./../../routes/management.client-apps_.$clientAppId";
import { Route as DrivePlanningRoutesAddRouteImport } from "./../../routes/drive-planning.routes.add-route";
import { Route as DrivePlanningFreightsAddFreightImport } from "./../../routes/drive-planning.freights.add-freight";
import { Route as ManagementEmployeesEmployeeIdModifyImport } from "./../../routes/management.employees_.$employeeId.modify";
import { Route as ManagementCustomerSitesCustomerSiteIdModifyImport } from "./../../routes/management.customer-sites_.$customerSiteId.modify";
import { Route as WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsImport } from "./../../routes/working-hours_.$employeeId.work-shifts.$workShiftId.details";
import { Route as ManagementEquipmentTruckTruckIdModifyImport } from "./../../routes/management.equipment_.truck.$truckId.modify";
import { Route as ManagementEquipmentTowableTowableIdModifyImport } from "./../../routes/management.equipment_.towable.$towableId.modify";

// Create/Update Routes

const VehiclesRoute = VehiclesImport.update({
  id: "/vehicles",
  path: "/vehicles",
  getParentRoute: () => rootRoute,
} as any);

const ManagementRoute = ManagementImport.update({
  id: "/management",
  path: "/management",
  getParentRoute: () => rootRoute,
} as any);

const DrivePlanningRoute = DrivePlanningImport.update({
  id: "/drive-planning",
  path: "/drive-planning",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const WorkingHoursIndexRoute = WorkingHoursIndexImport.update({
  id: "/working-hours/",
  path: "/working-hours/",
  getParentRoute: () => rootRoute,
} as any);

const VehiclesMapRoute = VehiclesMapImport.update({
  id: "/map",
  path: "/map",
  getParentRoute: () => VehiclesRoute,
} as any);

const VehiclesListRoute = VehiclesListImport.update({
  id: "/list",
  path: "/list",
  getParentRoute: () => VehiclesRoute,
} as any);

const ManagementVehiclesRoute = ManagementVehiclesImport.update({
  id: "/vehicles",
  path: "/vehicles",
  getParentRoute: () => ManagementRoute,
} as any);

const ManagementHolidaysRoute = ManagementHolidaysImport.update({
  id: "/holidays",
  path: "/holidays",
  getParentRoute: () => ManagementRoute,
} as any);

const ManagementEquipmentRoute = ManagementEquipmentImport.update({
  id: "/equipment",
  path: "/equipment",
  getParentRoute: () => ManagementRoute,
} as any);

const ManagementEmployeesRoute = ManagementEmployeesImport.update({
  id: "/employees",
  path: "/employees",
  getParentRoute: () => ManagementRoute,
} as any);

const ManagementCustomerSitesRoute = ManagementCustomerSitesImport.update({
  id: "/customer-sites",
  path: "/customer-sites",
  getParentRoute: () => ManagementRoute,
} as any);

const ManagementClientAppsRoute = ManagementClientAppsImport.update({
  id: "/client-apps",
  path: "/client-apps",
  getParentRoute: () => ManagementRoute,
} as any);

const DrivePlanningRoutesRoute = DrivePlanningRoutesImport.update({
  id: "/routes",
  path: "/routes",
  getParentRoute: () => DrivePlanningRoute,
} as any);

const DrivePlanningFreightsRoute = DrivePlanningFreightsImport.update({
  id: "/freights",
  path: "/freights",
  getParentRoute: () => DrivePlanningRoute,
} as any);

const WorkingHoursEmployeeIdWorkShiftsRoute =
  WorkingHoursEmployeeIdWorkShiftsImport.update({
    id: "/working-hours_/$employeeId/work-shifts",
    path: "/working-hours/$employeeId/work-shifts",
    getParentRoute: () => rootRoute,
  } as any);

const VehiclesTruckIdDetailsRoute = VehiclesTruckIdDetailsImport.update({
  id: "/vehicles_/$truckId/details",
  path: "/vehicles/$truckId/details",
  getParentRoute: () => rootRoute,
} as any);

const ManagementHolidaysAddHolidayRoute =
  ManagementHolidaysAddHolidayImport.update({
    id: "/add-holiday",
    path: "/add-holiday",
    getParentRoute: () => ManagementHolidaysRoute,
  } as any);

const ManagementEquipmentAddEquipmentRoute =
  ManagementEquipmentAddEquipmentImport.update({
    id: "/equipment_/add-equipment",
    path: "/equipment/add-equipment",
    getParentRoute: () => ManagementRoute,
  } as any);

const ManagementEmployeesAddEmployeeRoute =
  ManagementEmployeesAddEmployeeImport.update({
    id: "/employees_/add-employee",
    path: "/employees/add-employee",
    getParentRoute: () => ManagementRoute,
  } as any);

const ManagementCustomerSitesAddCustomerSiteRoute =
  ManagementCustomerSitesAddCustomerSiteImport.update({
    id: "/customer-sites_/add-customer-site_",
    path: "/customer-sites/add-customer-site",
    getParentRoute: () => ManagementRoute,
  } as any);

const ManagementClientAppsClientAppIdRoute =
  ManagementClientAppsClientAppIdImport.update({
    id: "/client-apps_/$clientAppId",
    path: "/client-apps/$clientAppId",
    getParentRoute: () => ManagementRoute,
  } as any);

const DrivePlanningRoutesAddRouteRoute =
  DrivePlanningRoutesAddRouteImport.update({
    id: "/add-route",
    path: "/add-route",
    getParentRoute: () => DrivePlanningRoutesRoute,
  } as any);

const DrivePlanningFreightsAddFreightRoute =
  DrivePlanningFreightsAddFreightImport.update({
    id: "/add-freight",
    path: "/add-freight",
    getParentRoute: () => DrivePlanningFreightsRoute,
  } as any);

const ManagementEmployeesEmployeeIdModifyRoute =
  ManagementEmployeesEmployeeIdModifyImport.update({
    id: "/employees_/$employeeId/modify",
    path: "/employees/$employeeId/modify",
    getParentRoute: () => ManagementRoute,
  } as any);

const ManagementCustomerSitesCustomerSiteIdModifyRoute =
  ManagementCustomerSitesCustomerSiteIdModifyImport.update({
    id: "/customer-sites_/$customerSiteId/modify",
    path: "/customer-sites/$customerSiteId/modify",
    getParentRoute: () => ManagementRoute,
  } as any);

const WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute =
  WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsImport.update({
    id: "/$workShiftId/details",
    path: "/$workShiftId/details",
    getParentRoute: () => WorkingHoursEmployeeIdWorkShiftsRoute,
  } as any);

const ManagementEquipmentTruckTruckIdModifyRoute =
  ManagementEquipmentTruckTruckIdModifyImport.update({
    id: "/equipment_/truck/$truckId/modify",
    path: "/equipment/truck/$truckId/modify",
    getParentRoute: () => ManagementRoute,
  } as any);

const ManagementEquipmentTowableTowableIdModifyRoute =
  ManagementEquipmentTowableTowableIdModifyImport.update({
    id: "/equipment_/towable/$towableId/modify",
    path: "/equipment/towable/$towableId/modify",
    getParentRoute: () => ManagementRoute,
  } as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/drive-planning": {
      id: "/drive-planning";
      path: "/drive-planning";
      fullPath: "/drive-planning";
      preLoaderRoute: typeof DrivePlanningImport;
      parentRoute: typeof rootRoute;
    };
    "/management": {
      id: "/management";
      path: "/management";
      fullPath: "/management";
      preLoaderRoute: typeof ManagementImport;
      parentRoute: typeof rootRoute;
    };
    "/vehicles": {
      id: "/vehicles";
      path: "/vehicles";
      fullPath: "/vehicles";
      preLoaderRoute: typeof VehiclesImport;
      parentRoute: typeof rootRoute;
    };
    "/drive-planning/freights": {
      id: "/drive-planning/freights";
      path: "/freights";
      fullPath: "/drive-planning/freights";
      preLoaderRoute: typeof DrivePlanningFreightsImport;
      parentRoute: typeof DrivePlanningImport;
    };
    "/drive-planning/routes": {
      id: "/drive-planning/routes";
      path: "/routes";
      fullPath: "/drive-planning/routes";
      preLoaderRoute: typeof DrivePlanningRoutesImport;
      parentRoute: typeof DrivePlanningImport;
    };
    "/management/client-apps": {
      id: "/management/client-apps";
      path: "/client-apps";
      fullPath: "/management/client-apps";
      preLoaderRoute: typeof ManagementClientAppsImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/customer-sites": {
      id: "/management/customer-sites";
      path: "/customer-sites";
      fullPath: "/management/customer-sites";
      preLoaderRoute: typeof ManagementCustomerSitesImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/employees": {
      id: "/management/employees";
      path: "/employees";
      fullPath: "/management/employees";
      preLoaderRoute: typeof ManagementEmployeesImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/equipment": {
      id: "/management/equipment";
      path: "/equipment";
      fullPath: "/management/equipment";
      preLoaderRoute: typeof ManagementEquipmentImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/holidays": {
      id: "/management/holidays";
      path: "/holidays";
      fullPath: "/management/holidays";
      preLoaderRoute: typeof ManagementHolidaysImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/vehicles": {
      id: "/management/vehicles";
      path: "/vehicles";
      fullPath: "/management/vehicles";
      preLoaderRoute: typeof ManagementVehiclesImport;
      parentRoute: typeof ManagementImport;
    };
    "/vehicles/list": {
      id: "/vehicles/list";
      path: "/list";
      fullPath: "/vehicles/list";
      preLoaderRoute: typeof VehiclesListImport;
      parentRoute: typeof VehiclesImport;
    };
    "/vehicles/map": {
      id: "/vehicles/map";
      path: "/map";
      fullPath: "/vehicles/map";
      preLoaderRoute: typeof VehiclesMapImport;
      parentRoute: typeof VehiclesImport;
    };
    "/working-hours/": {
      id: "/working-hours/";
      path: "/working-hours";
      fullPath: "/working-hours";
      preLoaderRoute: typeof WorkingHoursIndexImport;
      parentRoute: typeof rootRoute;
    };
    "/drive-planning/freights/add-freight": {
      id: "/drive-planning/freights/add-freight";
      path: "/add-freight";
      fullPath: "/drive-planning/freights/add-freight";
      preLoaderRoute: typeof DrivePlanningFreightsAddFreightImport;
      parentRoute: typeof DrivePlanningFreightsImport;
    };
    "/drive-planning/routes/add-route": {
      id: "/drive-planning/routes/add-route";
      path: "/add-route";
      fullPath: "/drive-planning/routes/add-route";
      preLoaderRoute: typeof DrivePlanningRoutesAddRouteImport;
      parentRoute: typeof DrivePlanningRoutesImport;
    };
    "/management/client-apps_/$clientAppId": {
      id: "/management/client-apps_/$clientAppId";
      path: "/client-apps/$clientAppId";
      fullPath: "/management/client-apps/$clientAppId";
      preLoaderRoute: typeof ManagementClientAppsClientAppIdImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/customer-sites_/add-customer-site_": {
      id: "/management/customer-sites_/add-customer-site_";
      path: "/customer-sites/add-customer-site";
      fullPath: "/management/customer-sites/add-customer-site";
      preLoaderRoute: typeof ManagementCustomerSitesAddCustomerSiteImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/employees_/add-employee": {
      id: "/management/employees_/add-employee";
      path: "/employees/add-employee";
      fullPath: "/management/employees/add-employee";
      preLoaderRoute: typeof ManagementEmployeesAddEmployeeImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/equipment_/add-equipment": {
      id: "/management/equipment_/add-equipment";
      path: "/equipment/add-equipment";
      fullPath: "/management/equipment/add-equipment";
      preLoaderRoute: typeof ManagementEquipmentAddEquipmentImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/holidays/add-holiday": {
      id: "/management/holidays/add-holiday";
      path: "/add-holiday";
      fullPath: "/management/holidays/add-holiday";
      preLoaderRoute: typeof ManagementHolidaysAddHolidayImport;
      parentRoute: typeof ManagementHolidaysImport;
    };
    "/vehicles_/$truckId/details": {
      id: "/vehicles_/$truckId/details";
      path: "/vehicles/$truckId/details";
      fullPath: "/vehicles/$truckId/details";
      preLoaderRoute: typeof VehiclesTruckIdDetailsImport;
      parentRoute: typeof rootRoute;
    };
    "/working-hours_/$employeeId/work-shifts": {
      id: "/working-hours_/$employeeId/work-shifts";
      path: "/working-hours/$employeeId/work-shifts";
      fullPath: "/working-hours/$employeeId/work-shifts";
      preLoaderRoute: typeof WorkingHoursEmployeeIdWorkShiftsImport;
      parentRoute: typeof rootRoute;
    };
    "/management/customer-sites_/$customerSiteId/modify": {
      id: "/management/customer-sites_/$customerSiteId/modify";
      path: "/customer-sites/$customerSiteId/modify";
      fullPath: "/management/customer-sites/$customerSiteId/modify";
      preLoaderRoute: typeof ManagementCustomerSitesCustomerSiteIdModifyImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/employees_/$employeeId/modify": {
      id: "/management/employees_/$employeeId/modify";
      path: "/employees/$employeeId/modify";
      fullPath: "/management/employees/$employeeId/modify";
      preLoaderRoute: typeof ManagementEmployeesEmployeeIdModifyImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/equipment_/towable/$towableId/modify": {
      id: "/management/equipment_/towable/$towableId/modify";
      path: "/equipment/towable/$towableId/modify";
      fullPath: "/management/equipment/towable/$towableId/modify";
      preLoaderRoute: typeof ManagementEquipmentTowableTowableIdModifyImport;
      parentRoute: typeof ManagementImport;
    };
    "/management/equipment_/truck/$truckId/modify": {
      id: "/management/equipment_/truck/$truckId/modify";
      path: "/equipment/truck/$truckId/modify";
      fullPath: "/management/equipment/truck/$truckId/modify";
      preLoaderRoute: typeof ManagementEquipmentTruckTruckIdModifyImport;
      parentRoute: typeof ManagementImport;
    };
    "/working-hours_/$employeeId/work-shifts/$workShiftId/details": {
      id: "/working-hours_/$employeeId/work-shifts/$workShiftId/details";
      path: "/$workShiftId/details";
      fullPath: "/working-hours/$employeeId/work-shifts/$workShiftId/details";
      preLoaderRoute: typeof WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsImport;
      parentRoute: typeof WorkingHoursEmployeeIdWorkShiftsImport;
    };
  }
}

// Create and export the route tree

interface DrivePlanningFreightsRouteChildren {
  DrivePlanningFreightsAddFreightRoute: typeof DrivePlanningFreightsAddFreightRoute;
}

const DrivePlanningFreightsRouteChildren: DrivePlanningFreightsRouteChildren = {
  DrivePlanningFreightsAddFreightRoute: DrivePlanningFreightsAddFreightRoute,
};

const DrivePlanningFreightsRouteWithChildren =
  DrivePlanningFreightsRoute._addFileChildren(
    DrivePlanningFreightsRouteChildren,
  );

interface DrivePlanningRoutesRouteChildren {
  DrivePlanningRoutesAddRouteRoute: typeof DrivePlanningRoutesAddRouteRoute;
}

const DrivePlanningRoutesRouteChildren: DrivePlanningRoutesRouteChildren = {
  DrivePlanningRoutesAddRouteRoute: DrivePlanningRoutesAddRouteRoute,
};

const DrivePlanningRoutesRouteWithChildren =
  DrivePlanningRoutesRoute._addFileChildren(DrivePlanningRoutesRouteChildren);

interface DrivePlanningRouteChildren {
  DrivePlanningFreightsRoute: typeof DrivePlanningFreightsRouteWithChildren;
  DrivePlanningRoutesRoute: typeof DrivePlanningRoutesRouteWithChildren;
}

const DrivePlanningRouteChildren: DrivePlanningRouteChildren = {
  DrivePlanningFreightsRoute: DrivePlanningFreightsRouteWithChildren,
  DrivePlanningRoutesRoute: DrivePlanningRoutesRouteWithChildren,
};

const DrivePlanningRouteWithChildren = DrivePlanningRoute._addFileChildren(
  DrivePlanningRouteChildren,
);

interface ManagementHolidaysRouteChildren {
  ManagementHolidaysAddHolidayRoute: typeof ManagementHolidaysAddHolidayRoute;
}

const ManagementHolidaysRouteChildren: ManagementHolidaysRouteChildren = {
  ManagementHolidaysAddHolidayRoute: ManagementHolidaysAddHolidayRoute,
};

const ManagementHolidaysRouteWithChildren =
  ManagementHolidaysRoute._addFileChildren(ManagementHolidaysRouteChildren);

interface ManagementRouteChildren {
  ManagementClientAppsRoute: typeof ManagementClientAppsRoute;
  ManagementCustomerSitesRoute: typeof ManagementCustomerSitesRoute;
  ManagementEmployeesRoute: typeof ManagementEmployeesRoute;
  ManagementEquipmentRoute: typeof ManagementEquipmentRoute;
  ManagementHolidaysRoute: typeof ManagementHolidaysRouteWithChildren;
  ManagementVehiclesRoute: typeof ManagementVehiclesRoute;
  ManagementClientAppsClientAppIdRoute: typeof ManagementClientAppsClientAppIdRoute;
  ManagementCustomerSitesAddCustomerSiteRoute: typeof ManagementCustomerSitesAddCustomerSiteRoute;
  ManagementEmployeesAddEmployeeRoute: typeof ManagementEmployeesAddEmployeeRoute;
  ManagementEquipmentAddEquipmentRoute: typeof ManagementEquipmentAddEquipmentRoute;
  ManagementCustomerSitesCustomerSiteIdModifyRoute: typeof ManagementCustomerSitesCustomerSiteIdModifyRoute;
  ManagementEmployeesEmployeeIdModifyRoute: typeof ManagementEmployeesEmployeeIdModifyRoute;
  ManagementEquipmentTowableTowableIdModifyRoute: typeof ManagementEquipmentTowableTowableIdModifyRoute;
  ManagementEquipmentTruckTruckIdModifyRoute: typeof ManagementEquipmentTruckTruckIdModifyRoute;
}

const ManagementRouteChildren: ManagementRouteChildren = {
  ManagementClientAppsRoute: ManagementClientAppsRoute,
  ManagementCustomerSitesRoute: ManagementCustomerSitesRoute,
  ManagementEmployeesRoute: ManagementEmployeesRoute,
  ManagementEquipmentRoute: ManagementEquipmentRoute,
  ManagementHolidaysRoute: ManagementHolidaysRouteWithChildren,
  ManagementVehiclesRoute: ManagementVehiclesRoute,
  ManagementClientAppsClientAppIdRoute: ManagementClientAppsClientAppIdRoute,
  ManagementCustomerSitesAddCustomerSiteRoute:
    ManagementCustomerSitesAddCustomerSiteRoute,
  ManagementEmployeesAddEmployeeRoute: ManagementEmployeesAddEmployeeRoute,
  ManagementEquipmentAddEquipmentRoute: ManagementEquipmentAddEquipmentRoute,
  ManagementCustomerSitesCustomerSiteIdModifyRoute:
    ManagementCustomerSitesCustomerSiteIdModifyRoute,
  ManagementEmployeesEmployeeIdModifyRoute:
    ManagementEmployeesEmployeeIdModifyRoute,
  ManagementEquipmentTowableTowableIdModifyRoute:
    ManagementEquipmentTowableTowableIdModifyRoute,
  ManagementEquipmentTruckTruckIdModifyRoute:
    ManagementEquipmentTruckTruckIdModifyRoute,
};

const ManagementRouteWithChildren = ManagementRoute._addFileChildren(
  ManagementRouteChildren,
);

interface VehiclesRouteChildren {
  VehiclesListRoute: typeof VehiclesListRoute;
  VehiclesMapRoute: typeof VehiclesMapRoute;
}

const VehiclesRouteChildren: VehiclesRouteChildren = {
  VehiclesListRoute: VehiclesListRoute,
  VehiclesMapRoute: VehiclesMapRoute,
};

const VehiclesRouteWithChildren = VehiclesRoute._addFileChildren(
  VehiclesRouteChildren,
);

interface WorkingHoursEmployeeIdWorkShiftsRouteChildren {
  WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute: typeof WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute;
}

const WorkingHoursEmployeeIdWorkShiftsRouteChildren: WorkingHoursEmployeeIdWorkShiftsRouteChildren =
  {
    WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute:
      WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute,
  };

const WorkingHoursEmployeeIdWorkShiftsRouteWithChildren =
  WorkingHoursEmployeeIdWorkShiftsRoute._addFileChildren(
    WorkingHoursEmployeeIdWorkShiftsRouteChildren,
  );

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/drive-planning": typeof DrivePlanningRouteWithChildren;
  "/management": typeof ManagementRouteWithChildren;
  "/vehicles": typeof VehiclesRouteWithChildren;
  "/drive-planning/freights": typeof DrivePlanningFreightsRouteWithChildren;
  "/drive-planning/routes": typeof DrivePlanningRoutesRouteWithChildren;
  "/management/client-apps": typeof ManagementClientAppsRoute;
  "/management/customer-sites": typeof ManagementCustomerSitesRoute;
  "/management/employees": typeof ManagementEmployeesRoute;
  "/management/equipment": typeof ManagementEquipmentRoute;
  "/management/holidays": typeof ManagementHolidaysRouteWithChildren;
  "/management/vehicles": typeof ManagementVehiclesRoute;
  "/vehicles/list": typeof VehiclesListRoute;
  "/vehicles/map": typeof VehiclesMapRoute;
  "/working-hours": typeof WorkingHoursIndexRoute;
  "/drive-planning/freights/add-freight": typeof DrivePlanningFreightsAddFreightRoute;
  "/drive-planning/routes/add-route": typeof DrivePlanningRoutesAddRouteRoute;
  "/management/client-apps/$clientAppId": typeof ManagementClientAppsClientAppIdRoute;
  "/management/customer-sites/add-customer-site": typeof ManagementCustomerSitesAddCustomerSiteRoute;
  "/management/employees/add-employee": typeof ManagementEmployeesAddEmployeeRoute;
  "/management/equipment/add-equipment": typeof ManagementEquipmentAddEquipmentRoute;
  "/management/holidays/add-holiday": typeof ManagementHolidaysAddHolidayRoute;
  "/vehicles/$truckId/details": typeof VehiclesTruckIdDetailsRoute;
  "/working-hours/$employeeId/work-shifts": typeof WorkingHoursEmployeeIdWorkShiftsRouteWithChildren;
  "/management/customer-sites/$customerSiteId/modify": typeof ManagementCustomerSitesCustomerSiteIdModifyRoute;
  "/management/employees/$employeeId/modify": typeof ManagementEmployeesEmployeeIdModifyRoute;
  "/management/equipment/towable/$towableId/modify": typeof ManagementEquipmentTowableTowableIdModifyRoute;
  "/management/equipment/truck/$truckId/modify": typeof ManagementEquipmentTruckTruckIdModifyRoute;
  "/working-hours/$employeeId/work-shifts/$workShiftId/details": typeof WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/drive-planning": typeof DrivePlanningRouteWithChildren;
  "/management": typeof ManagementRouteWithChildren;
  "/vehicles": typeof VehiclesRouteWithChildren;
  "/drive-planning/freights": typeof DrivePlanningFreightsRouteWithChildren;
  "/drive-planning/routes": typeof DrivePlanningRoutesRouteWithChildren;
  "/management/client-apps": typeof ManagementClientAppsRoute;
  "/management/customer-sites": typeof ManagementCustomerSitesRoute;
  "/management/employees": typeof ManagementEmployeesRoute;
  "/management/equipment": typeof ManagementEquipmentRoute;
  "/management/holidays": typeof ManagementHolidaysRouteWithChildren;
  "/management/vehicles": typeof ManagementVehiclesRoute;
  "/vehicles/list": typeof VehiclesListRoute;
  "/vehicles/map": typeof VehiclesMapRoute;
  "/working-hours": typeof WorkingHoursIndexRoute;
  "/drive-planning/freights/add-freight": typeof DrivePlanningFreightsAddFreightRoute;
  "/drive-planning/routes/add-route": typeof DrivePlanningRoutesAddRouteRoute;
  "/management/client-apps/$clientAppId": typeof ManagementClientAppsClientAppIdRoute;
  "/management/customer-sites/add-customer-site": typeof ManagementCustomerSitesAddCustomerSiteRoute;
  "/management/employees/add-employee": typeof ManagementEmployeesAddEmployeeRoute;
  "/management/equipment/add-equipment": typeof ManagementEquipmentAddEquipmentRoute;
  "/management/holidays/add-holiday": typeof ManagementHolidaysAddHolidayRoute;
  "/vehicles/$truckId/details": typeof VehiclesTruckIdDetailsRoute;
  "/working-hours/$employeeId/work-shifts": typeof WorkingHoursEmployeeIdWorkShiftsRouteWithChildren;
  "/management/customer-sites/$customerSiteId/modify": typeof ManagementCustomerSitesCustomerSiteIdModifyRoute;
  "/management/employees/$employeeId/modify": typeof ManagementEmployeesEmployeeIdModifyRoute;
  "/management/equipment/towable/$towableId/modify": typeof ManagementEquipmentTowableTowableIdModifyRoute;
  "/management/equipment/truck/$truckId/modify": typeof ManagementEquipmentTruckTruckIdModifyRoute;
  "/working-hours/$employeeId/work-shifts/$workShiftId/details": typeof WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/drive-planning": typeof DrivePlanningRouteWithChildren;
  "/management": typeof ManagementRouteWithChildren;
  "/vehicles": typeof VehiclesRouteWithChildren;
  "/drive-planning/freights": typeof DrivePlanningFreightsRouteWithChildren;
  "/drive-planning/routes": typeof DrivePlanningRoutesRouteWithChildren;
  "/management/client-apps": typeof ManagementClientAppsRoute;
  "/management/customer-sites": typeof ManagementCustomerSitesRoute;
  "/management/employees": typeof ManagementEmployeesRoute;
  "/management/equipment": typeof ManagementEquipmentRoute;
  "/management/holidays": typeof ManagementHolidaysRouteWithChildren;
  "/management/vehicles": typeof ManagementVehiclesRoute;
  "/vehicles/list": typeof VehiclesListRoute;
  "/vehicles/map": typeof VehiclesMapRoute;
  "/working-hours/": typeof WorkingHoursIndexRoute;
  "/drive-planning/freights/add-freight": typeof DrivePlanningFreightsAddFreightRoute;
  "/drive-planning/routes/add-route": typeof DrivePlanningRoutesAddRouteRoute;
  "/management/client-apps_/$clientAppId": typeof ManagementClientAppsClientAppIdRoute;
  "/management/customer-sites_/add-customer-site_": typeof ManagementCustomerSitesAddCustomerSiteRoute;
  "/management/employees_/add-employee": typeof ManagementEmployeesAddEmployeeRoute;
  "/management/equipment_/add-equipment": typeof ManagementEquipmentAddEquipmentRoute;
  "/management/holidays/add-holiday": typeof ManagementHolidaysAddHolidayRoute;
  "/vehicles_/$truckId/details": typeof VehiclesTruckIdDetailsRoute;
  "/working-hours_/$employeeId/work-shifts": typeof WorkingHoursEmployeeIdWorkShiftsRouteWithChildren;
  "/management/customer-sites_/$customerSiteId/modify": typeof ManagementCustomerSitesCustomerSiteIdModifyRoute;
  "/management/employees_/$employeeId/modify": typeof ManagementEmployeesEmployeeIdModifyRoute;
  "/management/equipment_/towable/$towableId/modify": typeof ManagementEquipmentTowableTowableIdModifyRoute;
  "/management/equipment_/truck/$truckId/modify": typeof ManagementEquipmentTruckTruckIdModifyRoute;
  "/working-hours_/$employeeId/work-shifts/$workShiftId/details": typeof WorkingHoursEmployeeIdWorkShiftsWorkShiftIdDetailsRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/drive-planning"
    | "/management"
    | "/vehicles"
    | "/drive-planning/freights"
    | "/drive-planning/routes"
    | "/management/client-apps"
    | "/management/customer-sites"
    | "/management/employees"
    | "/management/equipment"
    | "/management/holidays"
    | "/management/vehicles"
    | "/vehicles/list"
    | "/vehicles/map"
    | "/working-hours"
    | "/drive-planning/freights/add-freight"
    | "/drive-planning/routes/add-route"
    | "/management/client-apps/$clientAppId"
    | "/management/customer-sites/add-customer-site"
    | "/management/employees/add-employee"
    | "/management/equipment/add-equipment"
    | "/management/holidays/add-holiday"
    | "/vehicles/$truckId/details"
    | "/working-hours/$employeeId/work-shifts"
    | "/management/customer-sites/$customerSiteId/modify"
    | "/management/employees/$employeeId/modify"
    | "/management/equipment/towable/$towableId/modify"
    | "/management/equipment/truck/$truckId/modify"
    | "/working-hours/$employeeId/work-shifts/$workShiftId/details";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | "/drive-planning"
    | "/management"
    | "/vehicles"
    | "/drive-planning/freights"
    | "/drive-planning/routes"
    | "/management/client-apps"
    | "/management/customer-sites"
    | "/management/employees"
    | "/management/equipment"
    | "/management/holidays"
    | "/management/vehicles"
    | "/vehicles/list"
    | "/vehicles/map"
    | "/working-hours"
    | "/drive-planning/freights/add-freight"
    | "/drive-planning/routes/add-route"
    | "/management/client-apps/$clientAppId"
    | "/management/customer-sites/add-customer-site"
    | "/management/employees/add-employee"
    | "/management/equipment/add-equipment"
    | "/management/holidays/add-holiday"
    | "/vehicles/$truckId/details"
    | "/working-hours/$employeeId/work-shifts"
    | "/management/customer-sites/$customerSiteId/modify"
    | "/management/employees/$employeeId/modify"
    | "/management/equipment/towable/$towableId/modify"
    | "/management/equipment/truck/$truckId/modify"
    | "/working-hours/$employeeId/work-shifts/$workShiftId/details";
  id:
    | "__root__"
    | "/"
    | "/drive-planning"
    | "/management"
    | "/vehicles"
    | "/drive-planning/freights"
    | "/drive-planning/routes"
    | "/management/client-apps"
    | "/management/customer-sites"
    | "/management/employees"
    | "/management/equipment"
    | "/management/holidays"
    | "/management/vehicles"
    | "/vehicles/list"
    | "/vehicles/map"
    | "/working-hours/"
    | "/drive-planning/freights/add-freight"
    | "/drive-planning/routes/add-route"
    | "/management/client-apps_/$clientAppId"
    | "/management/customer-sites_/add-customer-site_"
    | "/management/employees_/add-employee"
    | "/management/equipment_/add-equipment"
    | "/management/holidays/add-holiday"
    | "/vehicles_/$truckId/details"
    | "/working-hours_/$employeeId/work-shifts"
    | "/management/customer-sites_/$customerSiteId/modify"
    | "/management/employees_/$employeeId/modify"
    | "/management/equipment_/towable/$towableId/modify"
    | "/management/equipment_/truck/$truckId/modify"
    | "/working-hours_/$employeeId/work-shifts/$workShiftId/details";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  DrivePlanningRoute: typeof DrivePlanningRouteWithChildren;
  ManagementRoute: typeof ManagementRouteWithChildren;
  VehiclesRoute: typeof VehiclesRouteWithChildren;
  WorkingHoursIndexRoute: typeof WorkingHoursIndexRoute;
  VehiclesTruckIdDetailsRoute: typeof VehiclesTruckIdDetailsRoute;
  WorkingHoursEmployeeIdWorkShiftsRoute: typeof WorkingHoursEmployeeIdWorkShiftsRouteWithChildren;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DrivePlanningRoute: DrivePlanningRouteWithChildren,
  ManagementRoute: ManagementRouteWithChildren,
  VehiclesRoute: VehiclesRouteWithChildren,
  WorkingHoursIndexRoute: WorkingHoursIndexRoute,
  VehiclesTruckIdDetailsRoute: VehiclesTruckIdDetailsRoute,
  WorkingHoursEmployeeIdWorkShiftsRoute:
    WorkingHoursEmployeeIdWorkShiftsRouteWithChildren,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/drive-planning",
        "/management",
        "/vehicles",
        "/working-hours/",
        "/vehicles_/$truckId/details",
        "/working-hours_/$employeeId/work-shifts"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/drive-planning": {
      "filePath": "drive-planning.tsx",
      "children": [
        "/drive-planning/freights",
        "/drive-planning/routes"
      ]
    },
    "/management": {
      "filePath": "management.tsx",
      "children": [
        "/management/client-apps",
        "/management/customer-sites",
        "/management/employees",
        "/management/equipment",
        "/management/holidays",
        "/management/vehicles",
        "/management/client-apps_/$clientAppId",
        "/management/customer-sites_/add-customer-site_",
        "/management/employees_/add-employee",
        "/management/equipment_/add-equipment",
        "/management/customer-sites_/$customerSiteId/modify",
        "/management/employees_/$employeeId/modify",
        "/management/equipment_/towable/$towableId/modify",
        "/management/equipment_/truck/$truckId/modify"
      ]
    },
    "/vehicles": {
      "filePath": "vehicles.tsx",
      "children": [
        "/vehicles/list",
        "/vehicles/map"
      ]
    },
    "/drive-planning/freights": {
      "filePath": "drive-planning.freights.tsx",
      "parent": "/drive-planning",
      "children": [
        "/drive-planning/freights/add-freight"
      ]
    },
    "/drive-planning/routes": {
      "filePath": "drive-planning.routes.tsx",
      "parent": "/drive-planning",
      "children": [
        "/drive-planning/routes/add-route"
      ]
    },
    "/management/client-apps": {
      "filePath": "management.client-apps.tsx",
      "parent": "/management"
    },
    "/management/customer-sites": {
      "filePath": "management.customer-sites.tsx",
      "parent": "/management"
    },
    "/management/employees": {
      "filePath": "management.employees.tsx",
      "parent": "/management"
    },
    "/management/equipment": {
      "filePath": "management.equipment.tsx",
      "parent": "/management"
    },
    "/management/holidays": {
      "filePath": "management.holidays.tsx",
      "parent": "/management",
      "children": [
        "/management/holidays/add-holiday"
      ]
    },
    "/management/vehicles": {
      "filePath": "management.vehicles.tsx",
      "parent": "/management"
    },
    "/vehicles/list": {
      "filePath": "vehicles.list.tsx",
      "parent": "/vehicles"
    },
    "/vehicles/map": {
      "filePath": "vehicles.map.tsx",
      "parent": "/vehicles"
    },
    "/working-hours/": {
      "filePath": "working-hours.index.tsx"
    },
    "/drive-planning/freights/add-freight": {
      "filePath": "drive-planning.freights.add-freight.tsx",
      "parent": "/drive-planning/freights"
    },
    "/drive-planning/routes/add-route": {
      "filePath": "drive-planning.routes.add-route.tsx",
      "parent": "/drive-planning/routes"
    },
    "/management/client-apps_/$clientAppId": {
      "filePath": "management.client-apps_.$clientAppId.tsx",
      "parent": "/management"
    },
    "/management/customer-sites_/add-customer-site_": {
      "filePath": "management.customer-sites_.add-customer-site_.tsx",
      "parent": "/management"
    },
    "/management/employees_/add-employee": {
      "filePath": "management.employees_.add-employee.tsx",
      "parent": "/management"
    },
    "/management/equipment_/add-equipment": {
      "filePath": "management.equipment_.add-equipment.tsx",
      "parent": "/management"
    },
    "/management/holidays/add-holiday": {
      "filePath": "management.holidays.add-holiday.tsx",
      "parent": "/management/holidays"
    },
    "/vehicles_/$truckId/details": {
      "filePath": "vehicles_.$truckId.details.tsx"
    },
    "/working-hours_/$employeeId/work-shifts": {
      "filePath": "working-hours_.$employeeId.work-shifts.tsx",
      "children": [
        "/working-hours_/$employeeId/work-shifts/$workShiftId/details"
      ]
    },
    "/management/customer-sites_/$customerSiteId/modify": {
      "filePath": "management.customer-sites_.$customerSiteId.modify.tsx",
      "parent": "/management"
    },
    "/management/employees_/$employeeId/modify": {
      "filePath": "management.employees_.$employeeId.modify.tsx",
      "parent": "/management"
    },
    "/management/equipment_/towable/$towableId/modify": {
      "filePath": "management.equipment_.towable.$towableId.modify.tsx",
      "parent": "/management"
    },
    "/management/equipment_/truck/$truckId/modify": {
      "filePath": "management.equipment_.truck.$truckId.modify.tsx",
      "parent": "/management"
    },
    "/working-hours_/$employeeId/work-shifts/$workShiftId/details": {
      "filePath": "working-hours_.$employeeId.work-shifts.$workShiftId.details.tsx",
      "parent": "/working-hours_/$employeeId/work-shifts"
    }
  }
}
ROUTE_MANIFEST_END */
