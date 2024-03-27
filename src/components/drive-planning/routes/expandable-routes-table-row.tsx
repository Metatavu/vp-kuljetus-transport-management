import { Collapse } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import RoutesTasksTable from "./routes-tasks-table";
import { Site, Task } from "generated/client";
import { DroppableData, DroppableType, GroupedTask } from "../../../types";
import { useCallback, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = GridRowProps & {
  expanded: boolean;
  routeId: string;
  tasks: Task[];
  sites: Site[];
};

const ExpandableRoutesTableRow = ({ expanded, routeId, tasks, sites, ...props }: Props) => {
  const groupedTasks = useMemo(
    () =>
      tasks.reduce(
        (groupedTasks, task) => {
          const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
          const site = sites.find((site) => site.id === task.customerSiteId);

          if (!site) return groupedTasks;

          const groupedTask = {
            ...groupedTasks[key],
            tasks: [...(groupedTasks[key]?.tasks ?? []), task],
            groupNumber: task.groupNumber,
            taskType: task.type,
            site: site,
            taskCount: (groupedTasks[key]?.taskCount ?? 0) + 1,
            groupedTasksKey: key,
            routeId: routeId,
          };
          groupedTasks[key] = groupedTask;

          return groupedTasks;
        },
        {} as Record<string, GroupedTask>,
      ),
    [tasks, sites, routeId],
  );

  const getAllTasks = useCallback(() => {
    const tasks: Task[] = [];
    for (const key of Object.keys(groupedTasks)) {
      tasks.push(...groupedTasks[key].tasks);
    }
    return tasks;
  }, [groupedTasks]);

  const droppableData: DroppableData = useMemo(
    () => ({
      routeId: routeId,
      allTasks: getAllTasks(),
    }),
    [routeId, getAllTasks],
  );

  const { isOver, setNodeRef } = useDroppable({
    id: `${DroppableType.ROUTES_TASKS_DROPPABLE}-${routeId}`,
    data: droppableData,
  });

  const droppableStyle = useMemo(
    () => ({
      outline: isOver ? "2px solid #4E8A9C" : "none",
      outlineOffset: "-2px",
    }),
    [isOver],
  );

  const { row } = props;
  if (!row) return null;

  return (
    <div ref={setNodeRef} style={{ ...droppableStyle }}>
      <GridRow {...props} />
      <Collapse in={expanded}>
        <RoutesTasksTable groupedTasks={groupedTasks} routeId={row.id} />
      </Collapse>
    </div>
  );
};

export default ExpandableRoutesTableRow;
