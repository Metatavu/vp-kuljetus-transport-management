import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import FreightDialog from "components/drive-planning/freights/freight-dialog";
import { useCreateFreight } from "hooks/use-mutations";
import { Freight } from "generated/client";

export const Route = createFileRoute("/drive-planning/freights/add-freight")({
  component: AddFreight,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["drivePlanning.freights.title", "drivePlanning.freights.new"],
  }),
});

function AddFreight() {
  const navigate = useNavigate();

  const onCreateFreight = (freight?: Freight) => {
    const { id } = freight ?? {};
    navigate({ to: "/drive-planning/freights", search: { freightId: id } });
  };

  const createFreight = useCreateFreight(onCreateFreight);

  return <FreightDialog onSave={createFreight} onClose={() => navigate({ to: "/drive-planning/freights" })} />;
}
