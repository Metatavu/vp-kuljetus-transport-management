import { createFileRoute } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import FreightDialog from "components/drive-planning/freights/freight-dialog";

export const Route = createFileRoute("/drive-planning/freights/add-freight")({
  component: AddFreight,
  beforeLoad: (): RouterContext => ({
    breadcrumb: "drivePlanning.freights.new",
  }),
});

function AddFreight() {
  return <FreightDialog type="ADD" />;
}
