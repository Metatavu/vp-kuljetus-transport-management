import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import LoaderWrapper from "components/generic/loader-wrapper";
import CustomerSiteComponent from "components/management/customer-sites/customer-site";
import { Site } from "generated/client";
import { QUERY_KEYS, getFindSiteQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/customer-sites_/$siteId/modify")({
  component: CustomerSiteModify,
  loader: async ({ params: { siteId } }) => {
    const site = await queryClient.ensureQueryData(getFindSiteQueryOptions(siteId));
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.customerSites.title"),
        route: "/management/customer-sites",
      },
      { label: t("management.customerSites.modify", { name: site.name }) },
    ];
    return { breadcrumbs, site };
  },
});

function CustomerSiteModify() {
  const { site } = Route.useLoaderData();
  const { siteId } = Route.useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const siteQuery = useQuery(getFindSiteQueryOptions(siteId));

  const updateSite = useMutation({
    mutationFn: (site: Site) => api.sites.updateSite({ siteId: siteId, site }),
    onSuccess: () => {
      toast.success(t("management.customerSites.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
    onError: () => toast.error(t("management.customerSites.errorToast")),
  });

  return (
    <LoaderWrapper loading={siteQuery.isLoading}>
      <CustomerSiteComponent formType="MODIFY" site={site} onSave={updateSite} />
    </LoaderWrapper>
  );
}
