import { Route as rootRoute } from "./../../routes/__root"
import { Route as ManagementImport } from "./../../routes/_management"
import { Route as IndexImport } from "./../../routes/index"
import { Route as WorkingTimeIndexImport } from "./../../routes/working-time.index"
import { Route as VehicleListIndexImport } from "./../../routes/vehicle-list.index"
import { Route as VehicleInfoIndexImport } from "./../../routes/vehicle-info.index"
import { Route as DrivePlanningIndexImport } from "./../../routes/drive-planning.index"
import { Route as ManagementManagementIndexImport } from "./../../routes/_management/management.index"
import { Route as ManagementManagementVehiclesImport } from "./../../routes/_management/management.vehicles"
import { Route as ManagementManagementTowablesImport } from "./../../routes/_management/management.towables"
import { Route as ManagementManagementCustomerSitesImport } from "./../../routes/_management/management.customer-sites"

const ManagementRoute = ManagementImport.update({
  id: "/_management",
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

const ManagementManagementIndexRoute = ManagementManagementIndexImport.update({
  path: "/management/",
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementManagementVehiclesRoute =
  ManagementManagementVehiclesImport.update({
    path: "/management/vehicles",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementManagementTowablesRoute =
  ManagementManagementTowablesImport.update({
    path: "/management/towables",
    getParentRoute: () => ManagementRoute,
  } as any)

const ManagementManagementCustomerSitesRoute =
  ManagementManagementCustomerSitesImport.update({
    path: "/management/customer-sites",
    getParentRoute: () => ManagementRoute,
  } as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/_management": {
      preLoaderRoute: typeof ManagementImport
      parentRoute: typeof rootRoute
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
    "/_management/management/customer-sites": {
      preLoaderRoute: typeof ManagementManagementCustomerSitesImport
      parentRoute: typeof ManagementImport
    }
    "/_management/management/towables": {
      preLoaderRoute: typeof ManagementManagementTowablesImport
      parentRoute: typeof ManagementImport
    }
    "/_management/management/vehicles": {
      preLoaderRoute: typeof ManagementManagementVehiclesImport
      parentRoute: typeof ManagementImport
    }
    "/_management/management/": {
      preLoaderRoute: typeof ManagementManagementIndexImport
      parentRoute: typeof ManagementImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  ManagementRoute.addChildren([
    ManagementManagementCustomerSitesRoute,
    ManagementManagementTowablesRoute,
    ManagementManagementVehiclesRoute,
    ManagementManagementIndexRoute,
  ]),
  DrivePlanningIndexRoute,
  VehicleInfoIndexRoute,
  VehicleListIndexRoute,
  WorkingTimeIndexRoute,
])
