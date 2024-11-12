import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "api/index"
import CustomerSiteComponent from "components/management/customer-sites/customer-site"
import { Site } from "generated/client"
import { QUERY_KEYS } from "hooks/use-queries"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { Breadcrumb } from "src/types"

export const Route = createFileRoute(
  "/management/customer-sites_/add-customer-site_",
)({
  component: CustomerSiteAdd,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.customerSites.title"),
        route: "/management/customer-sites",
      },
      { label: t("management.customerSites.new") },
    ]
    return { breadcrumbs }
  },
})

function CustomerSiteAdd() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const createSite = useMutation({
    mutationFn: (site: Site) => api.sites.createSite({ site }),
    onSuccess: () => {
      toast.success(t("management.customerSites.successToast"))
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] })
    },
    onError: () => toast.error(t("management.customerSites.errorToast")),
  })

  return <CustomerSiteComponent formType="ADD" onSave={createSite} />
}
