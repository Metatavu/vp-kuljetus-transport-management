import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, Stack, TextField, Typography, styled } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "api/index";
import DialogHeader from "components/generic/dialog-header";
import { ClientApp, ClientAppStatus } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getClientAppTag } from "utils/format-utils";

type Props = {
  clientApp?: ClientApp;
  onClose: () => void;
};

const ClientAppTagContainer = styled(Stack, {
  label: "client-app-tag-container",
})(() => ({
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid",
  borderColor: "grey.300",
  borderRadius: 2,
  bgcolor: "grey.100",
  p: 2,
}));

export const ApproveClientAppDialog = ({ clientApp, onClose }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState(clientApp?.name ?? "");

  useEffect(() => setName(clientApp?.name ?? ""), [clientApp]);

  const updateClientApp = useMutation({
    // biome-ignore lint/style/noNonNullAssertion: API resource
    mutationFn: (clientApp: ClientApp) => api.clientApps.updateClientApp({ clientAppId: clientApp.id!, clientApp }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_APPS] });
      onClose();
    },
    onError: (error) => console.error(error),
  });

  return (
    <Dialog open={!!clientApp} onClose={onClose} PaperProps={{ sx: { width: 350 } }}>
      <DialogHeader title={t("management.clientApps.confirmApproveDeviceTitle")} onClose={onClose} />
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <ClientAppTagContainer>
          <Typography variant="h3" fontWeight={400}>
            {getClientAppTag(clientApp)}
          </Typography>
        </ClientAppTagContainer>
        <Typography>{t("management.clientApps.approveDeviceInstructions")}</Typography>
        <TextField
          size="small"
          label={t("management.clientApps.name")}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          {t("cancel")}
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={updateClientApp.isPending}
          onClick={() =>
            clientApp &&
            updateClientApp.mutate({
              ...clientApp,
              status: ClientAppStatus.Approved,
              name: name,
            })
          }
        >
          {t("approve")}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
