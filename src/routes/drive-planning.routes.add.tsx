import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import RouteDialog from "components/drive-planning/routes/route-dialog";
import { Route as TRoute } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DataValidation from "src/utils/data-validation-utils";

export const Route = createFileRoute("/drive-planning/routes/add")({
  component: AddRoute,
});

function AddRoute() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const initialDate = Route.useSearch({
    select: ({ date }) => date ?? DateTime.now(),
  });
  const navigate = Route.useNavigate();

  const createRoute = useMutation({
    mutationFn: async (route: TRoute) => {
      const { departureTime, truckId, driverId } = route;
      await api.routes.createRoute({
        route: {
          ...route,
          truckId: truckId === "EMPTY" ? undefined : truckId,
          driverId: driverId === "EMPTY" ? undefined : driverId,
        },
      });
      navigate({
        to: "..",
        search: { date: DataValidation.parseValidDateTime(departureTime) },
      });
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.routes.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
    },
    onError: () => toast.error(t("drivePlanning.routes.errorToast")),
  });

  return <RouteDialog onSave={createRoute} initialDate={initialDate} />;
}
