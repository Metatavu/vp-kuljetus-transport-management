import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import ModifyAlarmContactFormDialog from "components/management/alarm-contacts/modify-alarm-contact-dialog";
import { PagingPolicyContact } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute(
  "/management/alarm-contacts_$contactId/modify",
)({
  component: ModifyAlarmContact,
  validateSearch: ({ date }: Record<string, unknown>) => ({
    date: date ? DateTime.fromISO(date as string) : DateTime.now(),
  }),
});

function ModifyAlarmContact() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const updatePagingPolicyContact = useMutation({
    mutationFn: async (pagingPolicyContact: PagingPolicyContact) => {
      if (!pagingPolicyContact.id) return Promise.reject();
      await api.pagingPolicyContacts.updatePagingPolicyContact({
        pagingPolicyContactId: pagingPolicyContact.id,
        pagingPolicyContact: pagingPolicyContact,
      });
    },
    onSuccess: () => {
      toast.success(t("management.alarmContacts.editSuccessToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ALARM_CONTACTS] });
    },
    onError: () => toast.error(t("management.alarmContacts.editErrorToast")),
  });

  return (
    <ModifyAlarmContactFormDialog
      onModify={updatePagingPolicyContact}
      onClose={() => navigate({ to: ".." })}
    />
  );
}
