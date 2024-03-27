import { Site, Task, TaskType } from "generated/client";
import { useMemo } from "react";
import TasksTableRow from "./tasks-table-row";
import { useSortable } from "@dnd-kit/sortable";
import { DraggableType, DraggedTaskData } from "../../../types";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  tasks: Task[];
  groupNumber: number;
  taskType: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
};

const DraggableTasksTableRow = ({ tasks, taskType, site, groupNumber, groupedTasksKey, routeId }: Props) => {
  const draggableData: DraggedTaskData = useMemo(
    () => ({
      draggableType: DraggableType.GROUPED_TASK,
      draggedTasks: tasks,
      routeId: routeId,
      key: groupedTasksKey,
    }),
    [tasks, routeId, groupedTasksKey],
  );

  const { listeners, attributes, isDragging, transform, transition, setNodeRef } = useSortable({
    id: groupedTasksKey,
    data: draggableData,
  });

  const style: React.CSSProperties = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging],
  );

  return (
    <TasksTableRow
      ref={setNodeRef}
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

export default DraggableTasksTableRow;
