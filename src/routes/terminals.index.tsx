import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useMatches } from "@tanstack/react-router";
import ViewContainer from "components/layout/view-container";
import TerminalItem from "components/terminals/terminal-item";
import { SiteType } from "generated/client";
import { getListSitesQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useMemo } from "react";
import type { Breadcrumb } from "src/types";

export const Route = createFileRoute("/terminals/")({
  component: TerminalsListLayoutComponent,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("terminals.title") }];
    return { breadcrumbs };
  },
});

function TerminalsListLayoutComponent() {
  useMatches();

  const sitesQuery = useQuery(getListSitesQueryOptions({ max: 100 }));

  const terminals = useMemo(
    () => sitesQuery.data?.sites?.filter((site) => site.siteType === SiteType.Terminal) ?? [],
    [sitesQuery.data],
  );

  return (
    <Stack direction="column" flex={1} padding={2}>
      <ViewContainer>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {terminals.map((terminal) => (
            <Grid xs={3} key={terminal.id}>
              <TerminalItem title={terminal.name} siteId={terminal.id} />
            </Grid>
          ))}
        </Grid>
      </ViewContainer>
    </Stack>
  );
}
