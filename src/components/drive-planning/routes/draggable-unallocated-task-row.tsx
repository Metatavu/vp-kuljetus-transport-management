import { useDraggable } from "@dnd-kit/core";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { CSS } from "@dnd-kit/utilities";

const DraggableUnallocatedTaskRow = (props: GridRowProps) => {
  const { row } = props;
  if (!row) return null;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${row.id}-draggable-unallocated-task-row`,
    data: {
      task: row,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return <GridRow {...props} focusedCell={null} sx={{ ...style }} {...listeners} ref={setNodeRef} {...attributes} />;
};

export default DraggableUnallocatedTaskRow;
