import { Add } from "@mui/icons-material";
import { Button, Stack, styled } from "@mui/material";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import GenericDataGrid from "components/generic/generic-data-grid";
import LoaderWrapper from "components/generic/loader-wrapper";
import ToolbarRow from "components/generic/toolbar-row";
import { useConfirmDialog } from "components/providers/confirm-dialog-provider";
import type { PagingPolicyContact, PagingPolicyType } from "generated/client";
import { getListPagingPolicyContactsQueryOptions, QUERY_KEYS } from "hooks/use-queries";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Breadcrumb } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

// Styled root component
const Root = styled(Stack, {
  label: "management-equipment-root",
})(({ theme }) => ({
  height: "100%",
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  flexDirection: "column",
}));

export const Route = createFileRoute("/management/paging-policy-contacts")({
  component: ManagementAlarmContacts,
  loader: () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: t("management.title") },
      { label: t("management.alarmContacts.title") },
    ];
    return { breadcrumbs };
  },
});

function ManagementAlarmContacts() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const showConfirmDialog = useConfirmDialog();

  const alarmContactsQuery = useQuery(
    getListPagingPolicyContactsQueryOptions({
      first: paginationModel.pageSize * paginationModel.page,
      max: paginationModel.pageSize * paginationModel.page + paginationModel.pageSize,
    }),
  );

  const deletePagingPolicyContact = useMutation({
    mutationFn: (pagingPolicyContact: PagingPolicyContact) => {
      if (!pagingPolicyContact.id) return Promise.reject(new Error("PagingPolicyContact ID is missing"));
      return api.pagingPolicyContacts.deletePagingPolicyContact({ pagingPolicyContactId: pagingPolicyContact.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGING_POLICY_CONTACTS] }),
  });

  const columns: GridColDef<PagingPolicyContact>[] = useMemo(
    () => [
      {
        field: "name",
        headerAlign: "left",
        headerName: t("management.alarmContacts.name"),
        sortable: false,
        flex: 1,
      },
      {
        field: "type",
        headerName: t("management.alarmContacts.type"),
        headerAlign: "left",
        flex: 1,
        sortable: false,
        valueFormatter: ({ value }) => LocalizationUtils.getLocalizedPagingPolicyType(value as PagingPolicyType, t),
      },
      {
        field: "contact",
        headerAlign: "left",
        headerName: t("management.alarmContacts.contact"),
        sortable: false,
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        flex: 0.8,
        renderHeader: () => null,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button
              title={t("management.alarmContacts.editAlarmContact")}
              size="small"
              variant="outlined"
              onClick={() =>
                navigate({
                  to: `/management/paging-policy-contacts/${row.id}/modify`,
                  params: { contactId: row.id },
                })
              }
            >
              {t("edit")}
            </Button>
            <Button
              title={t("management.alarmContacts.deletePagingPolicyContact")}
              size="small"
              color="error"
              variant="outlined"
              onClick={() =>
                showConfirmDialog({
                  title: t("management.alarmContacts.deletePagingPolicyContact"),
                  description: t("management.alarmContacts.deleteConfirmationDescription", {
                    name: row.name,
                  }),
                  positiveButtonColor: "error",
                  positiveButtonText: t("delete"),
                  onPositiveClick: () => deletePagingPolicyContact.mutate(row),
                })
              }
            >
              {t("delete")}
            </Button>
          </Stack>
        ),
      },
    ],
    [t, deletePagingPolicyContact, navigate, showConfirmDialog],
  );

  return (
    <LoaderWrapper loading={alarmContactsQuery.isLoading}>
      <Root>
        <ToolbarRow
          title={t("management.alarmContacts.title")}
          toolbarButtons={
            <Stack direction="row" gap={1}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Add />}
                onClick={() =>
                  navigate({
                    to: "/management/paging-policy-contacts/add",
                    search: { date: DateTime.now() },
                  })
                }
              >
                {t("management.alarmContacts.addContact")}
              </Button>
            </Stack>
          }
        />
        <Stack flex={1} height="100%" overflow="auto">
          <GenericDataGrid
            editMode="cell"
            fullScreen
            autoHeight={false}
            rows={alarmContactsQuery.data?.pagingPolicyContacts ?? []}
            columns={columns}
            rowCount={alarmContactsQuery.data?.totalResults}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            initialState={{
              sorting: {
                sortModel: [{ field: "name", sort: "desc" }],
              },
            }}
          />
        </Stack>
      </Root>
      <Outlet />
    </LoaderWrapper>
  );
}
export default ManagementAlarmContacts;
