import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "api/index";
import { Freight, FreightUnit } from "generated/client";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "./use-queries";

type OnMutationSuccess<T> = (data?: T) => void;

export const useCreateFreight = (onSuccess?: OnMutationSuccess<Freight>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (freight: Freight) => {
      const createdFreight = await api.freights.createFreight({ freight });

      if (!createdFreight.id) return;

      await api.tasks.createTask({
        task: {
          freightId: createdFreight.id,
          type: "LOAD",
          groupNumber: 0,
          customerSiteId: createdFreight.pointOfDepartureSiteId,
          status: "TODO",
        },
      });
      await api.tasks.createTask({
        task: {
          freightId: createdFreight.id,
          type: "UNLOAD",
          groupNumber: 0,
          customerSiteId: createdFreight.destinationSiteId,
          status: "TODO",
        },
      });

      return createdFreight;
    },
    onSuccess: (freight) => {
      toast.success(t("drivePlanning.freights.successToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHTS] });
      onSuccess?.(freight);
    },
    onError: () => toast.error(t("drivePlanning.freights.errorToast")),
  });
};

export const useCreateFreightUnit = (onSuccess?: OnMutationSuccess<FreightUnit>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (freightUnit: FreightUnit) => api.freightUnits.createFreightUnit({ freightUnit }),
    onSuccess: (freightUnit) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FREIGHT_UNITS, { freightId: freightUnit.freightId }] });
      onSuccess?.(freightUnit);
    },
  });
};
