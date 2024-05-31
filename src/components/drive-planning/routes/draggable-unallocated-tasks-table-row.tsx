import { useDraggable } from "@dnd-kit/core";
import { Tooltip } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { Task } from "generated/client";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DraggableType, UnallocatedTasksRowDragHandles } from "../../../types";
import { useNavigate } from "@tanstack/react-router";

const DraggableUnallocatedTasksTableRow = ({
  setRowDragHandles,
  ...params
}: GridRowProps & {
  setRowDragHandles: Dispatch<SetStateAction<UnallocatedTasksRowDragHandles>>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/drive-planning/routes" });

  const draggableKey = useMemo(() => {
    const { groupNumber, customerSiteId, type, id } = params.row as Task;
    return `${groupNumber}-${customerSiteId}-${type}-${id}`;
  }, [params.row]);

  const draggableData = useMemo(
    () => ({
      draggableType: DraggableType.UNALLOCATED_TASK,
      tasks: [params.row as Task],
    }),
    [params.row],
  );

  const { attributes, listeners, setNodeRef, setActivatorNodeRef } = useDraggable({
    id: `unallocated-${draggableKey}`,
    data: draggableData,
  });

  useEffect(() => {
    setRowDragHandles((previousRowDragHandles) => ({
      ...previousRowDragHandles,
      [params.rowId]: { setActivatorNodeRef: setActivatorNodeRef, attributes: attributes, listeners: listeners },
    }));
    return () =>
      setRowDragHandles((previousRowDragHandles) => ({
        ...previousRowDragHandles,
        [params.rowId]: undefined,
      }));
  }, [attributes, params.rowId, setRowDragHandles, listeners, setActivatorNodeRef]);

  return (
    <Tooltip title={t("drivePlanning.routes.unallocatedTasksTable.taskRowTooltip")} followCursor>
      <div ref={setNodeRef}>
        <GridRow
          {...params}
          onClick={() => navigate({ search: { freightId: params.row?.freightId, date: undefined } })}
        />
      </div>
    </Tooltip>
  );
};

export default DraggableUnallocatedTasksTableRow;
