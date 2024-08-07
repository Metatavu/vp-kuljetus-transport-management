import { Route as rootRoute } from "./../../routes/__root"
import { Route as VehicleListImport } from "./../../routes/vehicle-list"
import { Route as ManagementImport } from "./../../routes/management"
import { Route as DrivePlanningImport } from "./../../routes/drive-planning"
import { Route as IndexImport } from "./../../routes/index"
import { Route as WorkingTimeIndexImport } from "./../../routes/working-time.index"
import { Route as VehicleInfoIndexImport } from "./../../routes/vehicle-info.index"
import { Route as VehicleListVehiclesImport } from "./../../routes/vehicle-list.vehicles"
import { Route as VehicleListMapViewImport } from "./../../routes/vehicle-list.map-view"
import { Route as ManagementVehiclesImport } from "./../../routes/management.vehicles"
import { Route as ManagementEquipmentImport } from "./../../routes/management.equipment"
import { Route as ManagementEmployeesImport } from "./../../routes/management.employees"
import { Route as ManagementCustomerSitesImport } from "./../../routes/management.customer-sites"
import { Route as DrivePlanningRoutesImport } from "./../../routes/drive-planning.routes"
import { Route as DrivePlanningFreightsImport } from "./../../routes/drive-planning.freights"
import { Route as ManagementEquipmentAddEquipmentImport } from "./../../routes/management.equipment_.add-equipment"
import { Route as ManagementEmployeesAddEmployeeImport } from "./../../routes/management.employees_.add-employee"
import { Route as ManagementCustomerSitesAddCustomerSiteImport } from "./../../routes/management.customer-sites_.add-customer-site_"
import { Route as DrivePlanningRoutesAddRouteImport } from "./../../routes/drive-planning.routes.add-route"
import { Route as DrivePlanningFreightsAddFreightImport } from "./../../routes/drive-planning.freights.add-freight"
import { Route as VehicleListVehiclesVehicleIdInfoImport } from "./../../routes/vehicle-list_.vehicles.$vehicleId.info"
import { Route as ManagementEquipmentEquipmentIdModifyImport } from "./../../routes/management.equipment_.$equipmentId.modify"
import { Route as ManagementEmployeesEmployeeIdModifyImport } from "./../../routes/management.employees_.$employeeId.modify"
import { Route as ManagementCustomerSitesCustomerSiteIdModifyImport } from "./../../routes/management.customer-sites_.$customerSiteId.modify"

const VehicleListRoute = VehicleListImport.update({
  path: "/vehicle-list",
  getParentRoute: () => rootRoute,
} as any)

const ManagementRoute = ManagementImport.update({
  path: "/management",
  getParentRoute: () => rootRoute,
} as any)

const DrivePlanningRoute = DrivePlanningImport.update({
  path: "/drive-planning",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const WorkingTimeIndexRoute = WorkingTimeIndexImport.update({
  path: "/working-time/",
  getParentRoute: () => rootRoute,
} as any)

const VehicleInfoIndexRoute = VehicleInfoIndexImport.update({
  path: "/vehicle-info/",
  getParentRoute: () => rootRoute,
} as any)

const VehicleListVehiclesRoute = VehicleListVehiclesImport.update({
  path: "/vehicles",
  getParentRoute: () => VehicleListRoute,
} as any)

const VehicleListMapViewRoute = VehicleListMapViewImport.update({
  path: "/map-view",
  getParentRoute: () => VehicleListRoute,
} as any)

const ManagementVehiclesRoute = ManagementVehiclesImport.update({
  path: "/vehicles",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementEquipmentRoute = ManagementEquipmentImport.update({
  path: "/equipment",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementEmployeesRoute = ManagementEmployeesImport.update({
  path: "/employees",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementCustomerSitesRoute = ManagementCustomerSitesImport.update({
  path: "/customer-sites",
  getParentRoute: () => ManagementRoute,
} as any)

const DrivePlanningRoutesRoute = DrivePlanningRoutesImport.update({
  path: "/routes",
  getParentRoute: () => DrivePlanningRoute,
} as any)

const DrivePlanningFreightsRoute = DrivePlanningFreightsImport.update({
  path: "/freights",
  getParentRoute: () => DrivePlanningRoute,
} as any)

const ManagementEquipmentAddEquipmentRoute =
  ManagementEquipmentAddEquipmentImport.update({
    path: "/equipment/add-equipment",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementEmployeesAddEmployeeRoute =
  ManagementEmployeesAddEmployeeImport.update({
    path: "/employees/add-employee",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementCustomerSitesAddCustomerSiteRoute =
  ManagementCustomerSitesAddCustomerSiteImport.update({
    path: "/customer-sites/add-customer-site",
    getParentRoute: () => ManagementRoute,
  } as any)

const DrivePlanningRoutesAddRouteRoute =
  DrivePlanningRoutesAddRouteImport.update({
    path: "/add-route",
    getParentRoute: () => DrivePlanningRoutesRoute,
  } as any)

const DrivePlanningFreightsAddFreightRoute =
  DrivePlanningFreightsAddFreightImport.update({
    path: "/add-freight",
    getParentRoute: () => DrivePlanningFreightsRoute,
  } as any)

const VehicleListVehiclesVehicleIdInfoRoute =
  VehicleListVehiclesVehicleIdInfoImport.update({
    path: "/vehicle-list/vehicles/$vehicleId/info",
    getParentRoute: () => rootRoute,
  } as any)

const ManagementEquipmentEquipmentIdModifyRoute =
  ManagementEquipmentEquipmentIdModifyImport.update({
    path: "/equipment/$equipmentId/modify",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementEmployeesEmployeeIdModifyRoute =
  ManagementEmployeesEmployeeIdModifyImport.update({
    path: "/employees/$employeeId/modify",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementCustomerSitesCustomerSiteIdModifyRoute =
  ManagementCustomerSitesCustomerSiteIdModifyImport.update({
    path: "/customer-sites/$customerSiteId/modify",
    getParentRoute: () => ManagementRoute,
  } as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/drive-planning": {
      preLoaderRoute: typeof DrivePlanningImport
      parentRoute: typeof rootRoute
    }
    "/management": {
      preLoaderRoute: typeof ManagementImport
      parentRoute: typeof rootRoute
    }
    "/vehicle-list": {
      preLoaderRoute: typeof VehicleListImport
      parentRoute: typeof rootRoute
    }
    "/drive-planning/freights": {
      preLoaderRoute: typeof DrivePlanningFreightsImport
      parentRoute: typeof DrivePlanningImport
    }
    "/drive-planning/routes": {
      preLoaderRoute: typeof DrivePlanningRoutesImport
      parentRoute: typeof DrivePlanningImport
    }
    "/management/customer-sites": {
      preLoaderRoute: typeof ManagementCustomerSitesImport
      parentRoute: typeof ManagementImport
    }
    "/management/employees": {
      preLoaderRoute: typeof ManagementEmployeesImport
      parentRoute: typeof ManagementImport
    }
    "/management/equipment": {
      preLoaderRoute: typeof ManagementEquipmentImport
      parentRoute: typeof ManagementImport
    }
    "/management/vehicles": {
      preLoaderRoute: typeof ManagementVehiclesImport
      parentRoute: typeof ManagementImport
    }
    "/vehicle-list/map-view": {
      preLoaderRoute: typeof VehicleListMapViewImport
      parentRoute: typeof VehicleListImport
    }
    "/vehicle-list/vehicles": {
      preLoaderRoute: typeof VehicleListVehiclesImport
      parentRoute: typeof VehicleListImport
    }
    "/vehicle-info/": {
      preLoaderRoute: typeof VehicleInfoIndexImport
      parentRoute: typeof rootRoute
    }
    "/working-time/": {
      preLoaderRoute: typeof WorkingTimeIndexImport
      parentRoute: typeof rootRoute
    }
    "/drive-planning/freights/add-freight": {
      preLoaderRoute: typeof DrivePlanningFreightsAddFreightImport
      parentRoute: typeof DrivePlanningFreightsImport
    }
    "/drive-planning/routes/add-route": {
      preLoaderRoute: typeof DrivePlanningRoutesAddRouteImport
      parentRoute: typeof DrivePlanningRoutesImport
    }
    "/management/customer-sites/add-customer-site": {
      preLoaderRoute: typeof ManagementCustomerSitesAddCustomerSiteImport
      parentRoute: typeof ManagementImport
    }
    "/management/employees/add-employee": {
      preLoaderRoute: typeof ManagementEmployeesAddEmployeeImport
      parentRoute: typeof ManagementImport
    }
    "/management/equipment/add-equipment": {
      preLoaderRoute: typeof ManagementEquipmentAddEquipmentImport
      parentRoute: typeof ManagementImport
    }
    "/management/customer-sites/$customerSiteId/modify": {
      preLoaderRoute: typeof ManagementCustomerSitesCustomerSiteIdModifyImport
      parentRoute: typeof ManagementImport
    }
    "/management/employees/$employeeId/modify": {
      preLoaderRoute: typeof ManagementEmployeesEmployeeIdModifyImport
      parentRoute: typeof ManagementImport
    }
    "/management/equipment/$equipmentId/modify": {
      preLoaderRoute: typeof ManagementEquipmentEquipmentIdModifyImport
      parentRoute: typeof ManagementImport
    }
    "/vehicle-list/vehicles/$vehicleId/info": {
      preLoaderRoute: typeof VehicleListVehiclesVehicleIdInfoImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  DrivePlanningRoute.addChildren([
    DrivePlanningFreightsRoute.addChildren([
      DrivePlanningFreightsAddFreightRoute,
    ]),
    DrivePlanningRoutesRoute.addChildren([DrivePlanningRoutesAddRouteRoute]),
  ]),
  ManagementRoute.addChildren([
    ManagementCustomerSitesRoute,
    ManagementEmployeesRoute,
    ManagementEquipmentRoute,
    ManagementVehiclesRoute,
    ManagementCustomerSitesAddCustomerSiteRoute,
    ManagementEmployeesAddEmployeeRoute,
    ManagementEquipmentAddEquipmentRoute,
    ManagementCustomerSitesCustomerSiteIdModifyRoute,
    ManagementEmployeesEmployeeIdModifyRoute,
    ManagementEquipmentEquipmentIdModifyRoute,
  ]),
  VehicleListRoute.addChildren([
    VehicleListMapViewRoute,
    VehicleListVehiclesRoute,
  ]),
  VehicleInfoIndexRoute,
  WorkingTimeIndexRoute,
  VehicleListVehiclesVehicleIdInfoRoute,
])
