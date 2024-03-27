import { useDraggable } from "@dnd-kit/core";
import { Tooltip } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { Task } from "generated/client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DraggableType } from "../../../types";

const DraggableUnallocatedTasksDataGridRow = ({ ...params }: GridRowProps) => {
  const { t } = useTranslation();

  const draggableData = useMemo(
    () => ({
      draggableType: DraggableType.UNALLOCATED_TASK,
      draggedTasks: [params.row as Task],
    }),
    [params.row],
  );

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: params.rowId,
    data: draggableData,
  });

  const rowStyle = useMemo(
    () => ({
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [isDragging],
  );

  return (
    <Tooltip title={t("drivePlanning.routes.unallocatedTasksTable.taskRowTooltip")} followCursor>
      <div {...attributes} {...listeners} ref={setNodeRef}>
        <GridRow {...params} style={{ ...rowStyle }} />
      </div>
    </Tooltip>
  );
};

export default DraggableUnallocatedTasksDataGridRow;
