import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import EquipmentComponent from "components/management/equipments/equipment";
import { Towable } from "generated/client";
import { QUERY_KEYS, getFindTowableQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { toast } from "react-toastify";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";
import { getEquipmentDisplayName } from "src/utils/format-utils";

export const Route = createFileRoute("/management/equipment_/towable/$towableId/modify")({
  component: TowableModify,
  loader: async ({ params: { towableId } }) => {
    const towable = await queryClient.ensureQueryData(getFindTowableQueryOptions({ towableId }));
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      { label: t("management.equipment.title"), route: "/management/equipment" },
      { label: t("management.equipment.modify", { equipmentName: getEquipmentDisplayName(towable) }) },
    ];
    return { breadcrumbs, towable };
  },
});

function TowableModify() {
  const { towable } = Route.useLoaderData();
  const { towableId } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const updateTowable = useMutation({
    mutationFn: (towable: Towable) => api.towables.updateTowable({ towableId, towable }),
    onSuccess: () => {
      toast.success("management.equipment.successToast");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOWABLES] });
      navigate({ to: "/management/equipment" });
    },
    onError: () => toast.error("management.equipment.errorToast"),
  });

  return (
    <EquipmentComponent
      formType="MODIFY"
      initialData={towable}
      onSave={(towable) => updateTowable.mutateAsync(towable as Towable)}
    />
  );
}
