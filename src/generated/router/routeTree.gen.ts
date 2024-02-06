import { Route as rootRoute } from "./../../routes/__root"
import { Route as ManagementImport } from "./../../routes/management"
import { Route as IndexImport } from "./../../routes/index"
import { Route as WorkingTimeIndexImport } from "./../../routes/working-time.index"
import { Route as VehicleListIndexImport } from "./../../routes/vehicle-list.index"
import { Route as VehicleInfoIndexImport } from "./../../routes/vehicle-info.index"
import { Route as DrivePlanningIndexImport } from "./../../routes/drive-planning.index"
import { Route as ManagementVehiclesImport } from "./../../routes/management.vehicles"
import { Route as ManagementTowablesImport } from "./../../routes/management.towables"
import { Route as ManagementCustomerSitesImport } from "./../../routes/management.customer-sites"
import { Route as ManagementCustomerSitesAddCustomerSiteImport } from "./../../routes/management.customer-sites_.add-customer-site_"
import { Route as ManagementCustomerSitesCustomerSiteIdModifyImport } from "./../../routes/management.customer-sites_.$customerSiteId.modify"

const ManagementRoute = ManagementImport.update({
  path: "/management",
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

const DrivePlanningIndexRoute = DrivePlanningIndexImport.update({
  path: "/drive-planning/",
  getParentRoute: () => rootRoute,
} as any)

const ManagementVehiclesRoute = ManagementVehiclesImport.update({
  path: "/vehicles",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementTowablesRoute = ManagementTowablesImport.update({
  path: "/towables",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementCustomerSitesRoute = ManagementCustomerSitesImport.update({
  path: "/customer-sites",
  getParentRoute: () => ManagementRoute,
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
    "/management": {
      preLoaderRoute: typeof ManagementImport
      parentRoute: typeof rootRoute
    }
    "/management/customer-sites": {
      preLoaderRoute: typeof ManagementCustomerSitesImport
      parentRoute: typeof ManagementImport
    }
    "/management/towables": {
      preLoaderRoute: typeof ManagementTowablesImport
      parentRoute: typeof ManagementImport
    }
    "/management/vehicles": {
      preLoaderRoute: typeof ManagementVehiclesImport
      parentRoute: typeof ManagementImport
    }
    "/drive-planning/": {
      preLoaderRoute: typeof DrivePlanningIndexImport
      parentRoute: typeof rootRoute
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
  ManagementRoute.addChildren([
    ManagementCustomerSitesRoute,
    ManagementTowablesRoute,
    ManagementVehiclesRoute,
    ManagementCustomerSitesAddCustomerSiteRoute,
    ManagementCustomerSitesCustomerSiteIdModifyRoute,
  ]),
  DrivePlanningIndexRoute,
  VehicleInfoIndexRoute,
  VehicleListIndexRoute,
  WorkingTimeIndexRoute,
])
