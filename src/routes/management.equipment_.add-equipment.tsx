import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import EquipmentComponent from "components/management/equipments/equipment";
import { Towable, TowableTypeEnum, Truck } from "generated/client";
import { useApi } from "hooks/use-api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/equipment/add-equipment")({
  component: () => <EquipmentAdd />,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.equipment.new"],
  }),
});

const EquipmentAdd = () => {
  const { trucksApi, towablesApi } = useApi();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onEquipmentSave = async (equipment: Truck | Towable) => {
    if (Object.values(TowableTypeEnum).includes(equipment.type as TowableTypeEnum)) {
      createTowableEquipment.mutate(equipment as Towable);
    } else {
      createTruckEquipment.mutate(equipment as Truck);
    }
  };

  const createTruckEquipment = useMutation({
    mutationFn: async (truck: Truck) => trucksApi.createTruck({ truck }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"));
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  });

  const createTowableEquipment = useMutation({
    mutationFn: async (towable: Towable) => towablesApi.createTowable({ towable }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"));
      queryClient.invalidateQueries({ queryKey: ["towables"] });
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  });

  return <EquipmentComponent formType="ADD" onSave={onEquipmentSave} />;
};
