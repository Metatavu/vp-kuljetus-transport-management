import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import FreightDialog from "components/drive-planning/freights/freight-dialog";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Freight } from "generated/client";

export const Route = createFileRoute("/drive-planning/freights/$freightId/modify")({
  component: ModifyFreight,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "edit",
  }),
});

function ModifyFreight() {
  const { freightsApi } = useApi();
  const { freightId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateFreight = useMutation({
    mutationFn: async (freight: Freight) => {
      await freightsApi.updateFreight({ freightId, freight });
      navigate({ to: "/drive-planning/freights" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freights", freightId] });
      queryClient.invalidateQueries({ queryKey: ["freights"] });
    },
  });

  return <FreightDialog freightId={freightId} onSave={updateFreight} />;
}
