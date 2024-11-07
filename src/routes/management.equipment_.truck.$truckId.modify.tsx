import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "api/index"
import LoaderWrapper from "components/generic/loader-wrapper"
import EquipmentComponent from "components/management/equipments/equipment"
import { Truck } from "generated/client"
import { getFindTruckQueryOptions } from "hooks/use-queries"
import { t } from "i18next"
import { toast } from "react-toastify"
import { queryClient } from "src/main"
import { Breadcrumb } from "src/types"
import { getEquipmentDisplayName } from "src/utils/format-utils"

export const Route = createFileRoute(
  "/management/equipment/truck/$truckId/modify",
)({
  component: TruckModify,
  loader: async ({ params: { truckId } }) => {
    const truck = await queryClient.ensureQueryData(
      getFindTruckQueryOptions({ truckId }),
    )
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.equipment.title"),
        route: "/management/equipment",
      },
      {
        label: t("management.equipment.modify", {
          equipmentName: getEquipmentDisplayName(truck),
        }),
      },
    ]
    return { breadcrumbs, truck }
  },
})

function TruckModify() {
  const { truckId } = Route.useParams()
  const queryClient = useQueryClient()

  const truckQuery = useQuery(getFindTruckQueryOptions({ truckId }))

  const updateTruck = useMutation({
    mutationFn: (truck: Truck) => api.trucks.updateTruck({ truckId, truck }),
    onSuccess: () => {
      toast.success("management.equipment.successToast")
      queryClient.invalidateQueries({ queryKey: ["trucks"] })
    },
    onError: () => toast.error("management.equipment.errorToast"),
  })

  return (
    <LoaderWrapper loading={truckQuery.isFetching}>
      <EquipmentComponent
        formType="MODIFY"
        initialData={truckQuery.data}
        onSave={(truck) => updateTruck.mutateAsync(truck as Truck)}
      />
    </LoaderWrapper>
  )
}
