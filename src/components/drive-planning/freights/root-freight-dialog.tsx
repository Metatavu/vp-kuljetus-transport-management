import { deepEqual, useNavigate, useSearch } from "@tanstack/react-router";
import { QUERY_KEYS, useFreight } from "hooks/use-queries";
import FreightDialog from "./freight-dialog";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Freight } from "generated/client";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const RootFreightDialog = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const { freightId } = searchParams;
  const freightQuery = useFreight(freightId as string, !!freightId);
  const { freightsApi } = useApi();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onClose = () => navigate({ params: {}, search: { ...searchParams, freightId: undefined } });

  const updateFreight = useMutation({
    mutationFn: async (freight: Freight) => {
      if (!freightId) return Promise.reject();
      const initialFreight = freightQuery.data;
      if (deepEqual(initialFreight, freight)) return Promise.resolve();
      await freightsApi.updateFreight({ freightId, freight });
      onClose();
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.freights.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS, { freightId }] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, { freightId }] });
    },
    onError: () => toast.error(t("drivePlanning.freights.errorToast")),
  });

  if (!freightId || freightQuery.isLoading) return null;

  return <FreightDialog freight={freightQuery.data} onSave={updateFreight} onClose={onClose} />;
};

export default RootFreightDialog;
