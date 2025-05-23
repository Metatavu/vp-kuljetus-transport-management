import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import LoaderWrapper from "components/generic/loader-wrapper";
import ModifyAlarmContactFormDialog from "components/management/alarm-contacts/modify-alarm-contact-dialog";
import { PagingPolicyContact } from "generated/client";
import { QUERY_KEYS, getFindPagingPolicyContactQueryOptions } from "hooks/use-queries";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const Route = createFileRoute("/management/paging-policy-contacts/$contactId/modify")({
  component: ModifyAlarmContact,
});

function ModifyAlarmContact() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { contactId } = Route.useParams();

  if (!contactId) {
    return null;
  }
  const pagingPolicyContactQuery = useQuery(
    getFindPagingPolicyContactQueryOptions({
      pagingPolicyContactId: contactId,
    }),
  );

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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGING_POLICY_CONTACTS] });
      navigate({ to: "/management/paging-policy-contacts" });
    },
    onError: () => toast.error(t("management.alarmContacts.editErrorToast")),
  });

  return (
    <LoaderWrapper loading={pagingPolicyContactQuery.isLoading}>
      <ModifyAlarmContactFormDialog
        pagingPolicyContact={pagingPolicyContactQuery.data}
        onModify={updatePagingPolicyContact}
        onClose={() => navigate({ to: "/management/paging-policy-contacts" })}
      />
    </LoaderWrapper>
  );
}
