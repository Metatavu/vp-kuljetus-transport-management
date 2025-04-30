import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import AddAlarmContactFormDialog from "components/management/alarm-contacts/add-alarm-contact-dialog";
import { PagingPolicyContact } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/management/alarm-contacts/add")({
  component: AddAlarmContact,
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : DateTime.now(),
  }),
});

function AddAlarmContact() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createPagingPolicyContact = useMutation({
    mutationFn: async (pagingPolicyContact: PagingPolicyContact) => {
      const { name, contact, type } = pagingPolicyContact;
      await api.pagingPolicyContacts.createPagingPolicyContact({
        pagingPolicyContact: {
          name,
          contact,
          type,
        },
      });
      navigate({ to: "/management/alarm-contacts" });
    },
    onSuccess: () => {
      toast.success(t("management.alarmContacts.successToast", { count: 1 }));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALARM_CONTACTS] });
    },
    onError: () => toast.error(t("management.alarmContacts.errorToast", { count: 1 })),
  });

  return <AddAlarmContactFormDialog onSave={createPagingPolicyContact} onClose={() => navigate({ to: ".." })} />;
}
