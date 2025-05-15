import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/management/thermal-monitors/$thermalMonitorId/modify",
)({
  component: () => (
    <div>Hello /management/thermal-monitors/$thermalMonitorId/modify!</div>
  ),
});
