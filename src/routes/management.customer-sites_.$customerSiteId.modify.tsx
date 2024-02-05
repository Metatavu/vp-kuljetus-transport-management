import { createFileRoute } from "@tanstack/react-router";
import CustomerSiteComponent from "components/management/customer-site";
import { RouterContext } from "src/routes/__root";

export const Route = createFileRoute("/management/customer-sites/$customerSiteId/modify")({
  component: () => <CustomerSiteComponent />,
  beforeLoad: ({ params: { customerSiteId } }): RouterContext => ({
    breadcrumb: "customerSites.modify",
  }),
});
