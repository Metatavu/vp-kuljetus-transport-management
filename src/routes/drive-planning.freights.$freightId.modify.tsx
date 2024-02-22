import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import FreightDialog from "components/drive-planning/freights/freight-dialog";

export const Route = createFileRoute("/drive-planning/freights/$freightId/modify")({
  component: ModifyFreight,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "edit",
  }),
});

function ModifyFreight() {
  return <FreightDialog type="MODIFY" />;
}
