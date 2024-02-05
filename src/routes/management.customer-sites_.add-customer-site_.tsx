import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-site";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/customer-sites/add-customer-site")({
  component: () => <CustomerSiteComponent />,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "customerSites.new",
  }),
});
