import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import Terminal from "components/management/terminals/terminal";
import type { Site } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type { Breadcrumb } from "src/types";

export const Route = createFileRoute("/management/terminals_/add")({
  component: TerminalSiteAdd,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      {
        label: t("management.terminals.title"),
        route: "/management/terminals",
      },
      { label: t("management.terminals.new") },
    ];
    return { breadcrumbs };
  },
});

function TerminalSiteAdd() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createSite = useMutation({
    mutationFn: (site: Site) => api.sites.createSite({ site }),
    onSuccess: () => {
      toast.success(t("management.terminals.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITES] });
    },
    onError: () => toast.error(t("management.terminals.errorToast")),
  });

  return <Terminal formType="ADD" onSave={createSite} />;
}
