import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RouterContext } from "./__root";
import { useApi } from "hooks/use-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Holiday as THoliday } from "generated/client";
import { DateTime } from "luxon";
import { QUERY_KEYS } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AddHolidayDialog from "components/management/holidays/add-holiday-dialog";

export const Route = createFileRoute("/management/holidays/add-holiday")({
  component: AddHoliday,
  beforeLoad: (): RouterContext => ({
    breadcrumbs: ["management.holidays.addHoliday"],
  }),
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : DateTime.now(),
  }),
});

function AddHoliday() {
  const { holidaysApi } = useApi();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createHoliday = useMutation({
    mutationFn: async (holiday: THoliday) => {
      const { date, name, compensationType } = holiday;
      await holidaysApi.createHoliday({
        holiday: {
          ...holiday,
          date: date,
          name: name,
          compensationType: compensationType,
        },
      });
      navigate({ to: "/management/holidays" });
    },
    onSuccess: () => {
      toast.success(t("management.holidays.successToast", { count: 1 }));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOLIDAYS] });
    },
    onError: () => toast.error(t("management.holidays.errorToast", { count: 1 })),
  });

  return <AddHolidayDialog onSave={createHoliday} onClose={() => navigate({ to: "/management/holidays" })} />;
}
