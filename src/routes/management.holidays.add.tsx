import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import AddHolidayDialog from "components/management/holidays/add-holiday-dialog";
import { Holiday as THoliday } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/management/holidays/add")({
  component: AddHoliday,
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : DateTime.now(),
  }),
});

function AddHoliday() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createHoliday = useMutation({
    mutationFn: async (holiday: THoliday) => {
      const { date, name, compensationType } = holiday;
      await api.holidays.createHoliday({
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
    onError: () =>
      toast.error(t("management.holidays.errorToast", { count: 1 })),
  });

  return (
    <AddHolidayDialog
      onSave={createHoliday}
      onClose={() => navigate({ to: ".." })}
    />
  );
}
