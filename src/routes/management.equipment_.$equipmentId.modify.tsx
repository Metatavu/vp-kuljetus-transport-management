import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderWrapper from "components/generic/loader-wrapper";
import EquipmentComponent from "components/management/equipments/equipment";
import { Towable, TowableTypeEnum, Truck } from "generated/client";
import { useApi } from "hooks/use-api";
import { toast } from "react-toastify";

export const Route = createFileRoute("/management/equipment/$equipmentId/modify")({
  component: () => <EquipmentModify />,
  staticData: { breadcrumbs: ["management.equipment.title", "management.equipment.modify"] },
});

const EquipmentModify = () => {
  const { trucksApi, towablesApi } = useApi();
  const { equipmentId } = Route.useParams();
  const queryClient = useQueryClient();

  // Get equipment type from equipmentId
  const equipmentType = equipmentId.slice(equipmentId.lastIndexOf("-") + 1);

  const isTowable = Object.values(TowableTypeEnum).includes(equipmentType as TowableTypeEnum);

  // Get truck or towable id from equipmentId
  const id = equipmentId.slice(0, equipmentId.lastIndexOf("-"));

  const onEquipmentModify = async (equipment: Truck | Towable) => {
    if (isTowable) {
      updateTowable.mutate(equipment as Towable);
    } else {
      updateTruck.mutate(equipment as Truck);
    }
  };

  const truckQuery = useQuery({
    enabled: !isTowable,
    queryKey: ["trucks", id],
    queryFn: async () => await trucksApi.findTruck({ truckId: id }),
  });

  const updateTruck = useMutation({
    mutationFn: (truck: Truck) => trucksApi.updateTruck({ truckId: id, truck }),
    onSuccess: () => {
      toast.success("management.equipment.successToast");
      queryClient.invalidateQueries({ queryKey: ["trucks"] });
    },
    onError: () => toast.error("management.equipment.errorToast"),
  });

  const towableQuery = useQuery({
    enabled: isTowable,
    queryKey: ["towables", id],
    queryFn: async () => await towablesApi.findTowable({ towableId: id }),
  });

  const updateTowable = useMutation({
    mutationFn: (towable: Towable) => towablesApi.updateTowable({ towableId: id, towable }),
    onSuccess: () => {
      toast.success("management.equipment.successToast");
      queryClient.invalidateQueries({ queryKey: ["towables"] });
      queryClient.invalidateQueries({ queryKey: ["towables", id] });
    },
    onError: () => toast.error("management.equipment.errorToast"),
  });

  return (
    <LoaderWrapper loading={isTowable ? towableQuery.isFetching : truckQuery.isFetching}>
      <EquipmentComponent
        formType="MODIFY"
        initialData={isTowable ? towableQuery.data : truckQuery.data}
        onSave={onEquipmentModify}
      />
    </LoaderWrapper>
  );
};
