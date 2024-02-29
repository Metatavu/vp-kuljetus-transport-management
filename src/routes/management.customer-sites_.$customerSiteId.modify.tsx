import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-site";
import { useApi } from "hooks/use-api";
import { RouterContext } from "src/routes/__root";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Site } from "generated/client";
import { QUERY_KEYS, useSite } from "hooks/use-queries";

export const Route = createFileRoute("/management/customer-sites/$customerSiteId/modify")({
  component: () => <CustomerSiteModify />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.customerSites.modify",
  }),
});

const CustomerSiteModify = () => {
  const { sitesApi } = useApi();
  const { customerSiteId } = Route.useParams();
  const queryClient = useQueryClient();

  const siteQuery = useSite(customerSiteId);

  const updateSite = useMutation({
    mutationFn: (site: Site) => sitesApi.updateSite({ siteId: customerSiteId, site }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
  });

  return (
    <LoaderWrapper loading={siteQuery.isLoading}>
      <CustomerSiteComponent formType="MODIFY" site={siteQuery.data} onSave={updateSite} />
    </LoaderWrapper>
  );
};
