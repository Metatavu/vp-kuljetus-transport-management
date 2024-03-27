import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as TRoute } from "generated/client";
import RouteDialog from "components/drive-planning/routes/route-dialog";
import { DateTime } from "luxon";
import { QUERY_KEYS } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/drive-planning/routes/add-route")({
  component: AddRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.newRoute",
  }),
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : DateTime.now(),
  }),
});

function AddRoute() {
  const { routesApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const initialDate = Route.useSearch({
    select: ({ date }) => date,
  });

  const createRoute = useMutation({
    mutationFn: async (route: TRoute) => {
      const { departureTime, truckId, driverId } = route;
      await routesApi.createRoute({
        route: {
          ...route,
          truckId: truckId === "EMPTY" ? undefined : truckId,
          driverId: driverId === "EMPTY" ? undefined : driverId,
        },
      });
      navigate({ to: "/drive-planning/routes", search: { date: DateTime.fromJSDate(departureTime) } });
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.routes.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS] });
    },
    onError: () => toast.error(t("drivePlanning.routes.errorToast")),
  });

  return <RouteDialog onSave={createRoute} initialDate={initialDate} />;
}
