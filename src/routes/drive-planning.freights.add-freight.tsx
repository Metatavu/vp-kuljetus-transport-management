import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import FreightDialog from "components/drive-planning/freights/freight-dialog";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Freight } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/drive-planning/freights/add-freight")({
  component: AddFreight,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.freights.new",
  }),
});

function AddFreight() {
  const { freightsApi, tasksApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createFreight = useMutation({
    mutationFn: async (freight: Freight) => {
      const createdFreight = await freightsApi.createFreight({ freight });
      if (!createdFreight.id) return;

      await tasksApi.createTask({
        task: {
          freightId: createdFreight.id,
          type: "LOAD",
          groupNumber: 0,
          customerSiteId: createdFreight.pointOfDepartureSiteId,
          status: "TODO",
        },
      });

      await tasksApi.createTask({
        task: {
          freightId: createdFreight.id,
          type: "UNLOAD",
          groupNumber: 0,
          customerSiteId: createdFreight.destinationSiteId,
          status: "TODO",
        },
      });
      navigate({ to: "/drive-planning/freights", search: { freightId: createdFreight.id } });
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.freights.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS] });
    },
    onError: () => toast.error(t("drivePlanning.freights.errorToast")),
  });

  return <FreightDialog onSave={createFreight} onClose={() => navigate({ to: "/drive-planning/freights" })} />;
}
