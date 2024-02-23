import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-site";
import { useApi } from "../hooks/use-api";
import { RouterContext } from "src/routes/__root";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Site } from "generated/client";

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
  const useCustomerSite = () =>
    useQuery({
      queryKey: ["site", customerSiteId],
      queryFn: async () => await sitesApi.findSite({ siteId: customerSiteId }),
    });

  const updateSite = useMutation({
    mutationFn: (site: Site) => sitesApi.updateSite({ siteId: customerSiteId, site }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["site", customerSiteId] });
    },
  });

  const { data, isLoading } = useCustomerSite();

  return (
    <LoaderWrapper loading={isLoading}>
      <CustomerSiteComponent formType="MODIFY" initialData={data} onSave={updateSite} />
    </LoaderWrapper>
  );
};
