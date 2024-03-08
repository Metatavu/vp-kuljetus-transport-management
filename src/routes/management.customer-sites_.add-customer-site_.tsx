import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-site";
import { Site } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS } from "hooks/use-queries";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/customer-sites/add-customer-site")({
  component: () => <CustomerSiteAdd />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "management.customerSites.new",
  }),
});

const CustomerSiteAdd = () => {
  const { sitesApi } = useApi();
  const queryClient = useQueryClient();

  const createSite = useMutation({
    mutationFn: (site: Site) => sitesApi.createSite({ site }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] }),
  });

  return <CustomerSiteComponent formType="ADD" onSave={createSite} />;
};
