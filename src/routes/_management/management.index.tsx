import { FileRoute, Navigate } from "@tanstack/react-router";

export const Route = new FileRoute("/_management/management/").createRoute({
  component: () => <Navigate to="/management/customer-sites" />,
});
