import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import EquipmentComponent from "components/management/equipment";
import { Towable, TowableTypeEnum, Truck } from "generated/client";
import { useApi } from "hooks/use-api";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/equipment/add-equipment")({
  component: () => <EquipmentAdd />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.new",
  }),
});

const EquipmentAdd = () => {
  const { trucksApi, towablesApi } = useApi();
  const queryClient = useQueryClient();

  const onEquipmentSave = async (equipment: Truck | Towable) => {
    if (Object.values(TowableTypeEnum).includes(equipment.type as TowableTypeEnum)) {
      createTowableEquipment.mutate(equipment as Towable);
    } else {
      createTruckEquipment.mutate(equipment as Truck);
    }
  };

  const createTruckEquipment = useMutation({
    mutationFn: async (truck: Truck) => trucksApi.createTruck({ truck }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trucks"] }),
  });

  const createTowableEquipment = useMutation({
    mutationFn: async (towable: Towable) => towablesApi.createTowable({ towable }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["towables"] }),
  });

  return (
    <EquipmentComponent
      formType="ADD"
      onSave={onEquipmentSave}
    />
  );
};