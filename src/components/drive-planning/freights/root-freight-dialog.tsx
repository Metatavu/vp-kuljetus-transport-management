import { useNavigate, useSearch } from "@tanstack/react-router";
import { QUERY_KEYS, useFreight } from "hooks/use-queries";
import FreightDialog from "./freight-dialog";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Freight } from "generated/client";

const RootFreightDialog = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const { freightId } = searchParams;
  const freightQuery = useFreight(freightId as string | undefined);
  const { freightsApi } = useApi();
  const queryClient = useQueryClient();

  const onClose = () => navigate({ params: {}, search: { ...searchParams, freightId: undefined } });

  const updateFreight = useMutation({
    mutationFn: async (freight: Freight) => {
      if (!freightId) return Promise.reject();
      await freightsApi.updateFreight({ freightId, freight });
      onClose();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS, freightId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, freightId] });
    },
  });

  if (!freightId || freightQuery.isLoading) return null;

  return <FreightDialog freight={freightQuery.data} onSave={updateFreight} onClose={onClose} />;
};

export default RootFreightDialog;
