import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "api/index"
import EquipmentComponent from "components/management/equipments/equipment"
import { Towable, TowableTypeEnum, Truck } from "generated/client"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { Breadcrumb } from "src/types"

export const Route = createFileRoute("/management/equipment/add-equipment")({
  component: () => <EquipmentAdd />,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.equipment.title"),
        route: "/management/equipment",
      },
      { label: t("management.equipment.new") },
    ]
    return { breadcrumbs }
  },
})

const EquipmentAdd = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const onEquipmentSave = async (equipment: Truck | Towable) => {
    if (
      Object.values(TowableTypeEnum).includes(equipment.type as TowableTypeEnum)
    ) {
      createTowableEquipment.mutate(equipment as Towable)
    } else {
      createTruckEquipment.mutate(equipment as Truck)
    }
  }

  const createTruckEquipment = useMutation({
    mutationFn: async (truck: Truck) => api.trucks.createTruck({ truck }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"))
      queryClient.invalidateQueries({ queryKey: ["trucks"] })
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  })

  const createTowableEquipment = useMutation({
    mutationFn: async (towable: Towable) =>
      api.towables.createTowable({ towable }),
    onSuccess: () => {
      toast.success(t("management.equipment.successToast"))
      queryClient.invalidateQueries({ queryKey: ["towables"] })
    },
    onError: () => toast.error(t("management.equipment.errorToast")),
  })

  return <EquipmentComponent formType="ADD" onSave={onEquipmentSave} />
}
