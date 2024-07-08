import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-sites/customer-site";
import { Site } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/customer-sites/add-customer-site")({
  component: () => <CustomerSiteAdd />,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.customerSites.new"],
  }),
});

const CustomerSiteAdd = () => {
  const { sitesApi } = useApi();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createSite = useMutation({
    mutationFn: (site: Site) => sitesApi.createSite({ site }),
    onSuccess: () => {
      toast.success(t("management.customerSites.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
    onError: () => toast.error(t("management.customerSites.errorToast")),
  });

  return <CustomerSiteComponent formType="ADD" onSave={createSite} />;
};
