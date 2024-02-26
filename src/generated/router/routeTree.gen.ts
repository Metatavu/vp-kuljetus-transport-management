import { Route as rootRoute } from "./../../routes/__root"
import { Route as ManagementImport } from "./../../routes/management"
import { Route as DrivePlanningImport } from "./../../routes/drive-planning"
import { Route as IndexImport } from "./../../routes/index"
import { Route as WorkingTimeIndexImport } from "./../../routes/working-time.index"
import { Route as VehicleListIndexImport } from "./../../routes/vehicle-list.index"
import { Route as VehicleInfoIndexImport } from "./../../routes/vehicle-info.index"
import { Route as ManagementVehiclesImport } from "./../../routes/management.vehicles"
import { Route as ManagementEquipmentImport } from "./../../routes/management.equipment"
import { Route as ManagementCustomerSitesImport } from "./../../routes/management.customer-sites"
import { Route as DrivePlanningRoutesImport } from "./../../routes/drive-planning.routes"
import { Route as DrivePlanningFreightsImport } from "./../../routes/drive-planning.freights"
import { Route as ManagementCustomerSitesAddCustomerSiteImport } from "./../../routes/management.customer-sites_.add-customer-site_"
import { Route as ManagementCustomerSitesCustomerSiteIdModifyImport } from "./../../routes/management.customer-sites_.$customerSiteId.modify"

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

const VehicleListIndexRoute = VehicleListIndexImport.update({
  path: "/vehicle-list/",
  getParentRoute: () => rootRoute,
} as any)

const VehicleInfoIndexRoute = VehicleInfoIndexImport.update({
  path: "/vehicle-info/",
  getParentRoute: () => rootRoute,
} as any)

const ManagementVehiclesRoute = ManagementVehiclesImport.update({
  path: "/vehicles",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementEquipmentRoute = ManagementEquipmentImport.update({
  path: "/equipment",
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

const ManagementCustomerSitesAddCustomerSiteRoute =
  ManagementCustomerSitesAddCustomerSiteImport.update({
    path: "/customer-sites/add-customer-site",
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
    "/management/equipment": {
      preLoaderRoute: typeof ManagementEquipmentImport
      parentRoute: typeof ManagementImport
    }
    "/management/vehicles": {
      preLoaderRoute: typeof ManagementVehiclesImport
      parentRoute: typeof ManagementImport
    }
    "/vehicle-info/": {
      preLoaderRoute: typeof VehicleInfoIndexImport
      parentRoute: typeof rootRoute
    }
    "/vehicle-list/": {
      preLoaderRoute: typeof VehicleListIndexImport
      parentRoute: typeof rootRoute
    }
    "/working-time/": {
      preLoaderRoute: typeof WorkingTimeIndexImport
      parentRoute: typeof rootRoute
    }
    "/management/customer-sites/add-customer-site": {
      preLoaderRoute: typeof ManagementCustomerSitesAddCustomerSiteImport
      parentRoute: typeof ManagementImport
    }
    "/management/customer-sites/$customerSiteId/modify": {
      preLoaderRoute: typeof ManagementCustomerSitesCustomerSiteIdModifyImport
      parentRoute: typeof ManagementImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  DrivePlanningRoute.addChildren([
    DrivePlanningFreightsRoute,
    DrivePlanningRoutesRoute,
  ]),
  ManagementRoute.addChildren([
    ManagementCustomerSitesRoute,
    ManagementEquipmentRoute,
    ManagementVehiclesRoute,
    ManagementCustomerSitesAddCustomerSiteRoute,
    ManagementCustomerSitesCustomerSiteIdModifyRoute,
  ]),
  VehicleInfoIndexRoute,
  VehicleListIndexRoute,
  WorkingTimeIndexRoute,
])
