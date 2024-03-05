import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useApi } from "hooks/use-api";
import { RouterContext } from "src/routes/__root";
import LoaderWrapper from "components/generic/loader-wrapper";
import EquipmentComponent from "components/management/equipment";
import { Towable, Truck, TruckTypeEnum } from "generated/client";

export const Route = createFileRoute("/management/equipment/$equipmentId/modify")({
  component: () => <EquipmentModify />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.equipment.modify",
  }),
});

const EquipmentModify = () => {
  const { trucksApi, towablesApi } = useApi();
  const { equipmentId } = Route.useParams();
  const queryClient = useQueryClient();
  // Get equipment type from equipmentId
  const equipmentType = equipmentId.slice(equipmentId.lastIndexOf("-") + 1);
  // Get truck or towable id from equipmentId
  const id = equipmentId.slice(0, equipmentId.lastIndexOf("-"));

  if (Object.keys(TruckTypeEnum).includes(equipmentType)) {
    const useEquipment = () =>
      useQuery({
        queryKey: ["truckId", id],
        queryFn: async () => await trucksApi.findTruck({ truckId: id }),
      });

    const updateEquipment = useMutation({
      mutationFn: (truck: Truck) => trucksApi.updateTruck({ truckId: id, truck }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["trucks"] });
        queryClient.invalidateQueries({ queryKey: ["trucks", id] });
      },
    });

    const { data, isLoading } = useEquipment();

    return (
      <LoaderWrapper loading={isLoading}>
        <EquipmentComponent formType="MODIFY" initialData={data} onSave={updateEquipment} />
      </LoaderWrapper>
    );
  } else {
    const useEquipment = () =>
      useQuery({
        queryKey: ["towableId", id],
        queryFn: async () => await towablesApi.findTowable({ towableId: id }),
      });

    const updateEquipment = useMutation({
      mutationFn: (towable: Towable) => towablesApi.updateTowable({ towableId: id, towable }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["towables"] });
        queryClient.invalidateQueries({ queryKey: ["towables", id] });
      },
    });

    const { data, isLoading } = useEquipment();

    return (
      <LoaderWrapper loading={isLoading}>
        <EquipmentComponent formType="MODIFY" initialData={data} onSave={updateEquipment} />
      </LoaderWrapper>
    );
  }


};
