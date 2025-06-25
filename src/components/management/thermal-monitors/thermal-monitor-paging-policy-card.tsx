import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";
import { Box, Button, IconButton, MenuItem } from "@mui/material";
import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { withForm } from "hooks/form";
import { getListPagingPolicyContactsQueryOptions } from "hooks/use-queries";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";
import type { ThermalMonitorFormValues } from "./thermal-monitor-form-dialog";

const DELAY_OPTIONS = [0, 60, 120, 300, 600, 900, 1800, 3600, 7200, 14400, 28800, 86400] as const;

type ThermalMonitorPagingPolicyCardProps = {
  index: number;
  onDelete: () => void;
};

const ThermalMonitorPagingPolicyCard = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  props: {} as ThermalMonitorPagingPolicyCardProps,
  render: function Render({ form, index, onDelete }) {
    const policy = useStore(form.store, (state) => state.values.pagingPolicies[index]);
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({
      id: policy.id,
    });

    const style = useMemo(
      () => ({
        transform: CSS.Transform.toString(transform),
        transition,
      }),
      [transform, transition],
    );

    const listPagingPolicyContacts = useQuery(getListPagingPolicyContactsQueryOptions({ first: 0, max: 1000 }));
    const pagingPolicyContacts = useMemo(
      () => listPagingPolicyContacts.data?.pagingPolicyContacts ?? [],
      [listPagingPolicyContacts.data],
    );

    return (
      <Box ref={setNodeRef} style={style} {...attributes}>
        <Box display="flex" alignItems="center" gap={2} p={2} bgcolor={index % 2 === 0 ? "white" : "grey.100"}>
          <IconButton ref={setActivatorNodeRef} {...listeners} style={{ cursor: "grab" }}>
            <DragIndicatorIcon color="action" />
          </IconButton>
          <Box width={200}>{index + 1}.</Box>
          <Box width="100%" display="flex" alignItems="flex-end" gap={2}>
            <form.AppField
              name={`pagingPolicies[${index}].escalationDelaySeconds`}
              validators={{ onChange: z.number().min(0) }}
            >
              {(field) => (
                <field.FormTextField
                  select
                  label={
                    index === 0
                      ? t("management.thermalMonitors.timeAfterAlarmActivation")
                      : t("management.thermalMonitors.timeAfterPreviousAction")
                  }
                >
                  {DELAY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {t(`management.thermalMonitors.notificationDelay.${option}`)}
                    </MenuItem>
                  ))}
                </field.FormTextField>
              )}
            </form.AppField>
            <form.AppField name={`pagingPolicies[${index}].contactId`}>
              {(field) => (
                <field.FormTextField select label={t("management.thermalMonitors.notification")}>
                  {pagingPolicyContacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </MenuItem>
                  ))}
                </field.FormTextField>
              )}
            </form.AppField>
            <Button color="error" onClick={onDelete}>
              {t("delete")}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  },
});

export default ThermalMonitorPagingPolicyCard;
