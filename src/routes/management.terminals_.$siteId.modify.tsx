import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import LoaderWrapper from "components/generic/loader-wrapper";
import Terminal from "components/management/terminals/terminal";
import { Site } from "generated/client";
import { QUERY_KEYS, getFindSiteQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/terminals_/$siteId/modify")({
  component: TerminalSiteModify,
  loader: async ({ params: { siteId } }) => {
    const site = await queryClient.ensureQueryData(getFindSiteQueryOptions(siteId));
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.terminals.title"),
        route: "/management/terminals",
      },
      { label: t("management.terminals.modify", { name: site.name }) },
    ];
    return { breadcrumbs, site };
  },
});

function TerminalSiteModify() {
  const { site } = Route.useLoaderData();
  const { siteId } = Route.useParams();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const siteQuery = useQuery(getFindSiteQueryOptions(siteId));

  const updateSite = useMutation({
    mutationFn: (site: Site) => api.sites.updateSite({ siteId: siteId, site }),
    onSuccess: () => {
      toast.success(t("management.terminals.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
    onError: () => toast.error(t("management.terminals.errorToast")),
  });

  return (
    <LoaderWrapper loading={siteQuery.isLoading}>
      <Terminal formType="MODIFY" site={site} onSave={updateSite} />
    </LoaderWrapper>
  );
}
