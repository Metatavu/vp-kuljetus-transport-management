import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Route as TRoute } from "generated/client";
import RouteDialog from "components/drive-planning/routes/route-dialog";
import { DateTime } from "luxon";
import { QUERY_KEYS } from "hooks/use-queries";

export const Route = createFileRoute("/drive-planning/routes/add-route")({
  component: AddRoute,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.newRoute",
  }),
  validateSearch: (params: { date: string | null }) => ({
    date: params.date,
  }),
});

function AddRoute() {
  const { routesApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialDate = Route.useSearch({
    select: ({ date }) => (date ? DateTime.fromISO(date) : DateTime.now()),
  });

  const createRoute = useMutation({
    mutationFn: async (route: TRoute) => {
      const { departureTime } = route;
      await routesApi.createRoute({ route: route });
      navigate({ to: "/drive-planning/routes", search: { date: departureTime.toISOString() } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS] }),
  });

  return <RouteDialog onSave={createRoute} initialDate={initialDate?.toJSDate()} />;
}
