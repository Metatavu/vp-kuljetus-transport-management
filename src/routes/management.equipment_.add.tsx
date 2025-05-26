import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import Equipment from "components/management/equipment/equipment";
import { Towable, TowableTypeEnum, Truck } from "generated/client";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/equipment_/add")({
  component: () => <EquipmentAdd />,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.equipment.title"),
        route: "/management/equipment",
      },
      { label: t("management.equipment.new") },
    ];
    return { breadcrumbs };
  },
});

const EquipmentAdd = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onEquipmentSave = async (equipment: Truck | Towable) => {
    if (Object.values(TowableTypeEnum).includes(equipment.type as TowableTypeEnum)) {
      await createTowableEquipment.mutateAsync(equipment as Towable);
    } else {
      await createTruckEquipment.mutateAsync(equipment as Truck);
    }
  };

  const createTruckEquipment = useMutation({
    mutationFn: (truck: Truck) => api.trucks.createTruck({ truck }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"));
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  });

  const createTowableEquipment = useMutation({
    mutationFn: (towable: Towable) => api.towables.createTowable({ towable }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"));
      queryClient.invalidateQueries({ queryKey: ["towables"] });
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  });

  return <Equipment formType="ADD" onSave={onEquipmentSave} />;
};
