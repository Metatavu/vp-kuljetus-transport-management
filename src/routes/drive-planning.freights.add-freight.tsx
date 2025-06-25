import { createFileRoute, useNavigate } from "@tanstack/react-router";
import FreightDialog from "components/drive-planning/freights/freight-dialog";
import type { Freight } from "generated/client";
import { useCreateFreight } from "hooks/use-mutations";

export const Route = createFileRoute("/drive-planning/freights/add-freight")({
  component: AddFreight,
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
