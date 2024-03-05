import { Collapse } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import RoutesTasksTable from "./routes-tasks-table";
import { Site } from "generated/client";
import { QUERY_KEYS } from "hooks/use-queries";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "hooks/use-api";
import { GroupedTask } from "src/types";

type Props = GridRowProps & {
  expanded: boolean;
  routeId: string;
  sites: Site[];
};

const ExpandableRoutesTableRow = ({ expanded, routeId, sites, ...props }: Props) => {
  const { tasksApi } = useApi();
  const tasksQuery = useQuery({
    queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, routeId],
    queryFn: () => tasksApi.listTasks({ routeId: routeId }),
    select: (tasks) =>
      tasks.reduce(
        (groupedTasks, task) => {
          const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
          const site = sites.find((site) => site.id === task.customerSiteId);

          if (!site) return groupedTasks;

          const groupedTask = {
            ...groupedTasks[key],
            tasks: [...(groupedTasks[key]?.tasks ?? []), task],
            groupNumber: task.groupNumber,
            type: task.type,
            site: site,
            taskCount: (groupedTasks[key]?.taskCount ?? 0) + 1,
          };
          groupedTasks[key] = groupedTask;

          return groupedTasks;
        },
        {} as Record<string, GroupedTask>,
      ),
  });

  const { row } = props;
  if (!row) return null;

  return (
    <>
      <GridRow {...props} />
      <Collapse in={expanded}>
        <RoutesTasksTable groupedTasks={tasksQuery.data ?? {}} routeId={row.id} />
      </Collapse>
    </>
  );
};

export default ExpandableRoutesTableRow;
