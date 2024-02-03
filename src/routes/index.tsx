import { FileRoute, Navigate } from "@tanstack/react-router";

export const Route = new FileRoute("/").createRoute({
  component: () => <Navigate to="/vehicle-list" />,
});
