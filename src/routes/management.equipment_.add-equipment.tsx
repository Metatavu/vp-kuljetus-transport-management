import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import EquipmentComponent from "components/management/equipment";
import { Truck } from "generated/client";
import { useApi } from "hooks/use-api";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/equipment/add-equipment")({
  component: () => <EquipmentAdd />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.new",
  }),
});

const EquipmentAdd = () => {
  const { trucksApi } = useApi();
  const queryClient = useQueryClient();

  const createEquipment = useMutation({
    mutationFn: (equipment: Truck) => trucksApi.createTruck({ truck: equipment }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trucks"] }),
  });

  return <EquipmentComponent formType="ADD" onSave={createEquipment} />;
};
