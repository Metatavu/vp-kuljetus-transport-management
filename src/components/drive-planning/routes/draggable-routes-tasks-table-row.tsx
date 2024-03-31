import { Site, Task, TaskType } from "generated/client";
import { useMemo } from "react";
import RoutesTasksTableRow from "./routes-tasks-table-row";
import { useSortable } from "@dnd-kit/sortable";
import { DraggableType, DraggedTaskData } from "../../../types";
import { CSS } from "@dnd-kit/utilities";
import { theme } from "../../../theme";

type Props = {
  tasks: Task[];
  groupNumber: number;
  taskType: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
};

const DraggableRoutesTasksTableRow = ({ tasks, taskType, site, groupNumber, groupedTasksKey, routeId }: Props) => {
  const draggableData: DraggedTaskData = useMemo(
    () => ({
      draggableType: DraggableType.GROUPED_TASK,
      draggedTasks: tasks,
      routeId: routeId,
      key: groupedTasksKey,
    }),
    [tasks, routeId, groupedTasksKey],
  );

  const { listeners, attributes, isDragging, transform, transition, setNodeRef, setActivatorNodeRef, active } =
    useSortable({
      id: groupedTasksKey,
      data: draggableData,
    });

  const outline = useMemo(() => {
    if (isDragging || active?.id.toString().includes(groupedTasksKey)) {
      return `2px solid ${theme.palette.primary.main}`;
    }
  }, [isDragging, active, groupedTasksKey]);

  const style: React.CSSProperties = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition,
      opacity: isDragging ? 0.5 : 1,
      outline: outline,
      outlineOffset: "-2px",
    }),
    [transform, transition, isDragging, outline],
  );

  return (
    <RoutesTasksTableRow
      ref={setNodeRef}
      setActivatorNodeRef={setActivatorNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
      tasks={tasks}
      taskType={taskType}
      groupNumber={groupNumber}
      site={site}
      isDragging={isDragging}
    />
  );
};

export default DraggableRoutesTasksTableRow;
