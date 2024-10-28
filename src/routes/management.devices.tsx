import { Stack, styled } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import GenericDataGrid from "components/generic/generic-data-grid";
import ToolbarRow from "components/generic/toolbar-row";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/management/devices")({
  component: ManagementDevices,
  staticData: { breadcrumbs: ["management.devices.title"] },
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

function ManagementDevices() {
  const { t } = useTranslation();

  return (
    <Root>
      <ToolbarRow title={t("management.devices.title")} />
      <Stack flex={1} sx={{ height: "100%", overflowY: "auto" }}>
        <GenericDataGrid fullScreen autoHeight={false} rows={[]} columns={[]} disableRowSelectionOnClick />
      </Stack>
    </Root>
  );
}
