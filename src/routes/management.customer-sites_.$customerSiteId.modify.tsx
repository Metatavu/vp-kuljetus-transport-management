import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import LoaderWrapper from "components/generic/loader-wrapper";
import CustomerSiteComponent from "components/management/customer-sites/customer-site";
import { Site } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS, useSite } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/management/customer-sites/$customerSiteId/modify")({
  component: () => <CustomerSiteModify />,
  staticData: { breadcrumbs: ["management.customerSites.title", "management.customerSites.modify"] },
});

const CustomerSiteModify = () => {
  const { sitesApi } = useApi();
  const { customerSiteId } = Route.useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const siteQuery = useSite(customerSiteId);

  const updateSite = useMutation({
    mutationFn: (site: Site) => sitesApi.updateSite({ siteId: customerSiteId, site }),
    onSuccess: () => {
      toast.success(t("management.customerSites.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
    onError: () => toast.error(t("management.customerSites.errorToast")),
  });

  return (
    <LoaderWrapper loading={siteQuery.isLoading}>
      <CustomerSiteComponent formType="MODIFY" site={siteQuery.data} onSave={updateSite} />
    </LoaderWrapper>
  );
};
