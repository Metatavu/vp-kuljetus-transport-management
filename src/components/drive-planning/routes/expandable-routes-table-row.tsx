import { Collapse } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import RoutesTasksTable from "./routes-tasks-table";
import { Site, Task } from "generated/client";
import { DroppableType, GroupedTask } from "../../../types";
import { useMemo } from "react";
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
      tasks.reduce<Record<string, GroupedTask>>(
        (groupedTasks, task) => {
          const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
          const site = sites.find((site) => site.id === task.customerSiteId);

          if (!site) return groupedTasks;

          groupedTasks[key] = {
            ...groupedTasks[key],
            tasks: [...(groupedTasks[key]?.tasks ?? []), task],
            groupNumber: task.groupNumber,
            taskType: task.type,
            site: site,
            taskCount: (groupedTasks[key]?.taskCount ?? 0) + 1,
            groupedTasksKey: key,
            routeId: routeId,
          };

          return groupedTasks;
        },
        {} as Record<string, GroupedTask>,
      ),
    [tasks, sites, routeId],
  );

  const { isOver, setNodeRef } = useDroppable({
    id: `${DroppableType.ROUTES_TASKS_DROPPABLE}-${routeId}`,
    data: { routeId: routeId },
  });

  const droppableStyle = useMemo<React.CSSProperties>(
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
