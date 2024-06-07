import { useDraggable } from "@dnd-kit/core";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { Task } from "generated/client";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { DraggableType, UnallocatedTasksRowDragHandles } from "../../../types";
import { useNavigate, useSearch } from "@tanstack/react-router";

type Props = GridRowProps & {
  setRowDragHandles: Dispatch<SetStateAction<UnallocatedTasksRowDragHandles>>;
};

const DraggableUnallocatedTasksTableRow = ({ setRowDragHandles, ...params }: Props) => {
  const navigate = useNavigate({ from: "/drive-planning/routes" });

  const { date: currentDate } = useSearch({ from: "/drive-planning/routes" });

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
    <div ref={setNodeRef}>
      <GridRow
        {...params}
        onClick={() => navigate({ search: { freightId: params.row?.freightId, date: currentDate } })}
      />
    </div>
  );
};

export default DraggableUnallocatedTasksTableRow;
