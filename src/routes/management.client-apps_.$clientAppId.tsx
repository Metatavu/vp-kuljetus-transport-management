import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { LoadingButton } from "@mui/lab";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "api/index";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import { ClientApp } from "generated/client";
import { QUERY_KEYS, getFindClientAppQueryOptions } from "hooks/use-queries";
import { t } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { queryClient } from "src/main";
import { Breadcrumb } from "src/types";
import { getClientAppTag } from "src/utils/format-utils";

export const Route = createFileRoute("/management/client-apps_/$clientAppId")({
  component: ManagementDevices,
  loader: async ({ params: { clientAppId } }) => {
    const clientApp = await queryClient.ensureQueryData(getFindClientAppQueryOptions(clientAppId));
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      { label: t("management.clientApps.title"), route: "/management/client-apps" },
      { label: clientApp.name ?? clientApp.deviceId.slice(-4).toUpperCase() },
    ];
    return { clientApp, breadcrumbs };
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

const StyledTable = styled(Table, {
  label: "management-devices-table",
})(() => ({
  borderRadius: 4,
  border: "1px solid rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  borderCollapse: "separate",
  "& .MuiTableCell-head": { backgroundColor: "rgba(0, 0, 0, 0.06)", fontWeight: 600 },
  "& .MuiTableCell-root": {
    borderLeft: "none",
    "&:last-child": { borderRightWidth: 0 },
  },
  "& .MuiTableRow-root:last-child > .MuiTableCell-root": { borderBottomWidth: 0 },
}));

function ManagementDevices() {
  const { clientApp } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const confirm = useConfirmDialog();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState(clientApp.name);

  const updateClientAppMutation = useMutation({
    // biome-ignore lint/style/noNonNullAssertion: API resource
    mutationFn: (clientApp: ClientApp) => api.clientApps.updateClientApp({ clientAppId: clientApp.id!, clientApp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_APPS] });
      navigate({ to: ".." });
    },
    onError: (error) => console.error(error),
  });

  const deleteClientAppMutation = useMutation({
    // biome-ignore lint/style/noNonNullAssertion: API resource
    mutationFn: (clientApp: ClientApp) => api.clientApps.deleteClientApp({ clientAppId: clientApp.id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_APPS] });
      navigate({ to: ".." });
    },
    onError: (error) => console.error(error),
  });

  return (
    <Root>
      <Paper sx={{ height: "100%", bgcolor: "background.default" }}>
        <Toolbar
          disableGutters
          variant="dense"
          sx={{
            px: 2,
            gap: 1,
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderLeft: "1px solid",
            borderColor: (theme) => theme.palette.grey[200],
          }}
        >
          <IconButton size="small" onClick={() => navigate({ to: ".." })}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography>{clientApp.name || getClientAppTag(clientApp)}</Typography>
          <LoadingButton
            variant="outlined"
            color="error"
            loading={deleteClientAppMutation.isPending}
            sx={{ ml: "auto" }}
            startIcon={<ClearIcon />}
            onClick={() =>
              confirm({
                title: t("management.clientApps.confirmDeleteDevice", { name: clientApp.name || clientApp.deviceId }),
                positiveButtonColor: "error",
                positiveButtonText: t("delete"),
                onPositiveClick: () => deleteClientAppMutation.mutate(clientApp),
              })
            }
          >
            {t("delete")}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            disabled={name === clientApp.name}
            loading={deleteClientAppMutation.isPending}
            startIcon={<SaveAltIcon />}
            onClick={() => updateClientAppMutation.mutate({ ...clientApp, name })}
          >
            {t("save")}
          </LoadingButton>
        </Toolbar>
        <Stack flex={1} gap={2} height="100%" width={356} p={2} bgcolor="background.paper">
          <TextField
            size="small"
            label={t("management.clientApps.name")}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <StyledTable>
            <TableBody>
              <TableRow>
                <TableCell variant="head">{t("management.clientApps.tag")}</TableCell>
                <TableCell>{clientApp.deviceId.slice(-4).toUpperCase()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t("management.clientApps.deviceId")}</TableCell>
                <TableCell>{clientApp.deviceId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t("management.clientApps.deviceOs")}</TableCell>
                <TableCell>
                  <span style={{ textTransform: "capitalize", marginRight: 4 }}>
                    {clientApp.metadata.deviceOS?.toLowerCase()}
                  </span>
                  {clientApp.metadata.deviceOSVersion}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t("management.clientApps.appVersion")}</TableCell>
                <TableCell>{clientApp.metadata.appVersion}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">{t("management.clientApps.createdAt")}</TableCell>
                <TableCell>{clientApp.createdAt?.toLocaleDateString("fi")}</TableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </Stack>
      </Paper>
    </Root>
  );
}
