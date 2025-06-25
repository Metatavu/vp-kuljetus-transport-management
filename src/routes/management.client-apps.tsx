import { Button, Stack, styled } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { ApproveClientAppDialog } from "components/management/client-apps/approve-client-app-dialog";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { type ClientApp, ClientAppStatus } from "generated/client";
import { QUERY_KEYS, getListClientAppsQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Breadcrumb } from "src/types";
import { getClientAppTag } from "src/utils/format-utils";

export const Route = createFileRoute("/management/client-apps")({
  component: ManagementClientApps,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [{ label: t("management.title") }, { label: t("management.clientApps.title") }];
    return { breadcrumbs };
  },
});

// Styled root component
const Root = styled(Stack, {
  label: "management-devices-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

function ManagementClientApps() {
  const navigate = Route.useNavigate();
  const { t } = useTranslation();
  const confirm = useConfirmDialog();
  const queryClient = useQueryClient();
  const [selectedClientApp, setSelectedClientApp] = useState<ClientApp>();
  const clientAppsQuery = useQuery({ ...getListClientAppsQueryOptions(), refetchInterval: 10_000 });
  const clientApps = useMemo(() => clientAppsQuery.data?.clientApps ?? [], [clientAppsQuery.data]);

  const deleteClientApp = useMutation({
    // biome-ignore lint/style/noNonNullAssertion: API resource
    mutationFn: (clientApp: ClientApp) => api.clientApps.deleteClientApp({ clientAppId: clientApp.id! }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_APPS] }),
    onError: (error) => console.error(error),
  });

  const onDeleteClick = useCallback(
    (clientApp: ClientApp) => {
      confirm({
        title: t("delete"),
        description: t("management.clientApps.confirmDeleteDevice", {
          name: clientApp.name ?? clientApp.deviceId,
        }),
        positiveButtonText: t("delete"),
        positiveButtonColor: "error",
        onPositiveClick: async () => await deleteClientApp.mutateAsync(clientApp),
      });
    },
    [confirm, t, deleteClientApp],
  );

  const columns = useMemo<GridColDef<ClientApp>[]>(
    () => [
      {
        field: "name",
        headerName: t("management.clientApps.name"),
        flex: 1,
      },
      {
        field: "tag",
        headerName: t("management.clientApps.tag"),
        flex: 1,
        valueGetter: ({ row: clientApp }) => getClientAppTag(clientApp),
      },
      {
        field: "deviceId",
        headerName: t("management.clientApps.deviceId"),
        flex: 1,
      },
      {
        field: "status",
        headerName: t("management.clientApps.status"),
        flex: 1,
        valueFormatter: ({ value }) => t(`management.clientApps.statuses.${value as ClientAppStatus}`),
        cellClassName: ({ value }) => `status-${value}`,
      },
      {
        field: "lastLoginAt",
        type: "dateTime",
        headerName: t("management.clientApps.lastLoginAt"),
        flex: 1,
      },
      {
        field: "actions",
        headerName: "",
        flex: 1,
        renderCell: ({ row: clientApp }) => {
          const clientAppId = clientApp.id;
          if (!clientAppId) return null;

          return (
            <Stack width="100%" direction="row" gap={1} justifyContent="flex-end">
              {clientApp.status === ClientAppStatus.WaitingForApproval && (
                <>
                  <Button fullWidth variant="text" color="error" onClick={() => onDeleteClick(clientApp)}>
                    {t("delete")}
                  </Button>
                  <Button fullWidth onClick={() => setSelectedClientApp(clientApp)}>
                    {t("approve")}
                  </Button>
                </>
              )}
              {clientApp.status === ClientAppStatus.Approved && (
                <Button onClick={() => navigate({ to: "$clientAppId", params: { clientAppId } })}>{t("open")}</Button>
              )}
            </Stack>
          );
        },
      },
    ],
    [t, onDeleteClick, navigate],
  );

  return (
    <Root>
      <ToolbarRow title={t("management.clientApps.title")} />
      <Stack flex={1} sx={{ height: "100%", overflowY: "auto" }}>
        <GenericDataGrid
          fullScreen
          autoHeight={false}
          columns={columns}
          rows={clientApps}
          disableRowSelectionOnClick
          sx={{
            "& .status-APPROVED": { color: "success.main" },
            "& .status-WAITING_FOR_APPROVAL": { color: "error.main" },
          }}
        />
      </Stack>
      <ApproveClientAppDialog clientApp={selectedClientApp} onClose={() => setSelectedClientApp(undefined)} />
    </Root>
  );
}
