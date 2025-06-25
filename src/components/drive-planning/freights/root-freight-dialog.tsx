import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deepEqual, useNavigate, useSearch } from "@tanstack/react-router";
import { api } from "api/index";
import type { Freight } from "generated/client";
import { QUERY_KEYS, getFindFreightQueryOptions } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FreightDialog from "./freight-dialog";

const RootFreightDialog = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const { freightId } = searchParams;
  const freightQuery = useQuery(getFindFreightQueryOptions(freightId as string, !!freightId));
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const onClose = () => navigate({ to: ".", search: { ...searchParams, freightId: undefined } });

  const updateFreight = useMutation({
    mutationFn: async (freight: Freight) => {
      if (!freightId) return Promise.reject();
      const initialFreight = freightQuery.data;
      if (deepEqual(initialFreight, freight)) return undefined;
      return await api.freights.updateFreight({ freightId, freight });
    },
    onSuccess: () => {
      toast.success(t("drivePlanning.freights.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS, { freightId }] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, { freightId }] });
      onClose();
    },
    onError: () => toast.error(t("drivePlanning.freights.errorToast")),
  });

  if (!freightId || freightQuery.isLoading) return null;

  return <FreightDialog freight={freightQuery.data} onSave={updateFreight} onClose={onClose} />;
};

export default RootFreightDialog;
