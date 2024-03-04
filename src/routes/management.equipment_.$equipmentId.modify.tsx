import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { RouterContext } from "src/routes/__root";
import LoaderWrapper from "components/generic/loader-wrapper";
import EquipmentComponent from "components/management/equipment";
import { Truck } from "generated/client";

export const Route = createFileRoute("/management/equipment/$equipmentId/modify")({
  component: () => <EquipmentModify />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.modify",
  }),
});

const EquipmentModify = () => {
  const { trucksApi } = useApi();
  const { equipmentId } = Route.useParams();
  const queryClient = useQueryClient();
  const useEquipment = () =>
    useQuery({
      queryKey: ["equipment", equipmentId],
      queryFn: async () => await trucksApi.findTruck({ truckId: equipmentId }),
    });

  const updateEquipment = useMutation({
    mutationFn: (truck: Truck) => trucksApi.updateTruck({ truckId: equipmentId, truck }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
      queryClient.invalidateQueries({ queryKey: ["trucks", equipmentId] });
    },
  });

  const { data, isLoading } = useEquipment();

  return (
    <LoaderWrapper loading={isLoading}>
      <EquipmentComponent formType="MODIFY" initialData={data} onSave={updateEquipment} />
    </LoaderWrapper>
  );
};
