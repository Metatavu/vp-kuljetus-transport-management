import { Route as rootRoute } from "./../../routes/__root"
import { Route as WorkingTimeIndexImport } from "./../../routes/working-time.index"
import { Route as VehicleListIndexImport } from "./../../routes/vehicle-list.index"
import { Route as VehicleInfoIndexImport } from "./../../routes/vehicle-info.index"
import { Route as ManagementIndexImport } from "./../../routes/management.index"
import { Route as DrivePlanningIndexImport } from "./../../routes/drive-planning.index"

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

const ManagementIndexRoute = ManagementIndexImport.update({
  path: "/management/",
  getParentRoute: () => rootRoute,
} as any)

const DrivePlanningIndexRoute = DrivePlanningIndexImport.update({
  path: "/drive-planning/",
  getParentRoute: () => rootRoute,
} as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/drive-planning/": {
      preLoaderRoute: typeof DrivePlanningIndexImport
      parentRoute: typeof rootRoute
    }
    "/management/": {
      preLoaderRoute: typeof ManagementIndexImport
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
  }
}
export const routeTree = rootRoute.addChildren([
  DrivePlanningIndexRoute,
  ManagementIndexRoute,
  VehicleInfoIndexRoute,
  VehicleListIndexRoute,
  WorkingTimeIndexRoute,
])
