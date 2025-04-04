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

  const updateSiteAndThermometers = useMutation({
    mutationFn: async ({
      site,
      originalSite,
      changedThermometers,
    }: {
      site: Site;
      originalSite: Site;
      changedThermometers: { newName: string; thermometerId: string }[];
    }) => {
      const siteHasChanges = JSON.stringify(site) !== JSON.stringify(originalSite);

      // Update the Site if there are changes
      if (siteHasChanges) {
        await api.sites.updateSite({ siteId: siteId, site });
      }

      // If there are changed thermometers, update them as well
      if (changedThermometers.length > 0) {
        await Promise.all(
          changedThermometers.map(({ newName, thermometerId }) =>
            api.thermometers.updateTerminalThermometer({
              thermometerId,
              updateTruckOrTowableThermometerRequest: { name: newName },
            }),
          ),
        );
      }
    },
    onSuccess: () => {
      toast.success(t("management.terminals.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITE_TEMPERATURES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TERMINAL_THERMOMETERS] });
    },
    onError: () => toast.error(t("management.terminals.errorToast")),
  });

  return (
    <LoaderWrapper loading={siteQuery.isLoading}>
      <Terminal formType="MODIFY" site={site} onUpdate={updateSiteAndThermometers} />
    </LoaderWrapper>
  );
}
