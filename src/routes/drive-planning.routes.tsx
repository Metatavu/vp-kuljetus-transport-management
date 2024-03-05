import { Button, Paper, Stack, Typography } from "@mui/material";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import ToolbarRow from "components/generic/toolbar-row";
import { RouterContext } from "./__root";
import { Add } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LoaderWrapper from "components/generic/loader-wrapper";
import { Route as TRoute } from "generated/client";
import UnallocatedTasksDrawer from "components/drive-planning/routes/unallotaced-tasks-drawer";
import RoutesTable from "components/drive-planning/routes/routes-table";
import { QUERY_KEYS, useSites } from "hooks/use-queries";
import DatePickerWithArrows from "components/generic/date-picker-with-arrows";

export const Route = createFileRoute("/drive-planning/routes")({
  component: DrivePlanningRoutes,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.routes.title",
  }),
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : undefined,
  }),
});

function DrivePlanningRoutes() {
  const { routesApi } = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sitesQuery = useSites();

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(DateTime.now());
  const [unallocatedDrawerOpen, setUnallocatedDrawerOpen] = useState(true);

  const initialDate = Route.useSearch({
    select: ({ date }) => date,
  });

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  const updateRoute = useMutation({
    mutationFn: (route: TRoute) => {
      if (!route.id) return Promise.reject();
      return routesApi.updateRoute({ routeId: route.id, route });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES, selectedDate] }),
  });

  const renderLeftToolbar = useCallback(
    () => (
      <Stack direction="row">
        <Typography variant="h6" sx={{ opacity: 0.6 }} alignSelf="center">
          {t("drivePlanning.routes.date")}
        </Typography>
        <DatePickerWithArrows labelVisible={false} date={selectedDate} setDate={setSelectedDate} />
      </Stack>
    ),
    [selectedDate, t],
  );

  const renderRightToolbar = useCallback(
    () => (
      <Button
        size="small"
        variant="text"
        startIcon={<Add />}
        onClick={() =>
          navigate({
            to: "/drive-planning/routes/add-route",
            search: { date: selectedDate ?? DateTime.now() },
          })
        }
      >
        {t("drivePlanning.routes.newRoute")}
      </Button>
    ),
    [navigate, selectedDate, t],
  );

  return (
    <>
      <Outlet />
      <Paper sx={{ minHeight: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
        <ToolbarRow leftToolbar={renderLeftToolbar()} toolbarButtons={renderRightToolbar()} />
        <LoaderWrapper loading={sitesQuery.isLoading}>
          <RoutesTable
            selectedDate={selectedDate ?? DateTime.now()}
            sites={sitesQuery.data?.sites ?? []}
            onUpdateRoute={updateRoute.mutateAsync}
          />
          <UnallocatedTasksDrawer
            open={unallocatedDrawerOpen}
            sites={sitesQuery.data?.sites ?? []}
            onClose={() => setUnallocatedDrawerOpen(!unallocatedDrawerOpen)}
          />
        </LoaderWrapper>
      </Paper>
    </>
  );
}
