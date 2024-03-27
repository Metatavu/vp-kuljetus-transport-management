import { Site, Task, TaskType } from "generated/client";
import { useMemo } from "react";
import TasksTableRow from "./tasks-table-row";
import { useSortable } from "@dnd-kit/sortable";
import { DraggableType, GroupedTaskSortableData } from "../../../types";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  tasks: Task[];
  groupNumber: number;
  taskType: TaskType;
  site: Site;
  taskCount: number;
  groupedTasksKey: string;
  routeId: string;
  allTasks: Task[];
};

const DraggableTasksTableRow = ({ tasks, taskType, site, groupNumber, groupedTasksKey, routeId, allTasks }: Props) => {
  const draggableData: GroupedTaskSortableData = useMemo(
    () => ({
      draggableType: DraggableType.GROUPED_TASK,
      draggedTasks: tasks,
      routeId: routeId,
      allTasks: allTasks,
      key: groupedTasksKey,
    }),
    [tasks, routeId, allTasks, groupedTasksKey],
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
