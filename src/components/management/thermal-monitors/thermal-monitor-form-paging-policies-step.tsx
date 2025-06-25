import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button, Card, CardActions, CardContent } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { withForm } from "hooks/form";
import { getListPagingPolicyContactsQueryOptions } from "hooks/use-queries";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import type { ThermalMonitorFormValues } from "./thermal-monitor-form-dialog";
import ThermalMonitorPagingPolicyCard from "./thermal-monitor-paging-policy-card";

const ThermalMonitorFormPagingPoliciesStep = withForm({
  defaultValues: {} as ThermalMonitorFormValues,
  render: function Render({ form }) {
    const { t } = useTranslation();
    const sensors = useSensors(useSensor(PointerSensor));
    const listPagingPolicyContacts = useQuery(getListPagingPolicyContactsQueryOptions({ first: 0, max: 1000 }));
    const pagingPolicyContacts = useMemo(
      () => listPagingPolicyContacts.data?.pagingPolicyContacts ?? [],
      [listPagingPolicyContacts.data],
    );

    return (
      <form.AppField name="pagingPolicies" mode="array">
        {(listField) => (
          <Card variant="outlined" sx={{ mt: 2, flex: 1 }}>
            <CardContent sx={{ p: 0 }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;

                  if (!active || !over || active.id === over.id) return;

                  const prevIndex = listField.state.value.findIndex((policy) => policy.id === active.id);
                  const nextIndex = listField.state.value.findIndex((policy) => policy.id === over.id);

                  if (prevIndex === -1 || nextIndex === -1 || prevIndex === nextIndex) return;

                  listField.setValue(arrayMove(listField.state.value, prevIndex, nextIndex));
                }}
              >
                <SortableContext items={listField.state.value} strategy={verticalListSortingStrategy}>
                  {listField.state.value.map((policy, index) => (
                    <ThermalMonitorPagingPolicyCard
                      key={policy.id}
                      form={form}
                      index={index}
                      onDelete={() => listField.removeValue(index)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
              <Button
                onClick={() =>
                  listField.pushValue({
                    id: uuid(),
                    contactId: pagingPolicyContacts.at(0)?.id ?? "",
                    escalationDelaySeconds: 0,
                  })
                }
              >
                {t("management.thermalMonitors.addPolicy")}
              </Button>
            </CardActions>
          </Card>
        )}
      </form.AppField>
    );
  },
});

export default ThermalMonitorFormPagingPoliciesStep;
