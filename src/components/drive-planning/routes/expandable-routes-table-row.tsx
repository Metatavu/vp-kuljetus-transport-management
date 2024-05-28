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
    staleTime: 10_000,
    queryFn: () => tasksApi.listTasks({ routeId: routeId }),
    select: (tasks) =>
      tasks.reduce<Record<string, GroupedTask>>((groupedTasks, task) => {
        const key = `${task.groupNumber}-${task.customerSiteId}-${task.type}`;
        const site = sites.find((site) => site.id === task.customerSiteId);

        if (!site) return groupedTasks;

        groupedTasks[key] = {
          ...groupedTasks[key],
          tasks: [...(groupedTasks[key]?.tasks ?? []), task],
          groupNumber: task.groupNumber,
          type: task.type,
          site: site,
          taskCount: (groupedTasks[key]?.taskCount ?? 0) + 1,
        };

        return groupedTasks;
      }, {}),
  });

  return (
    <>
      <GridRow {...props} />
      <Collapse in={expanded}>
        <RoutesTasksTable groupedTasks={tasksQuery.data ?? {}} />
      </Collapse>
    </>
  );
};

export default ExpandableRoutesTableRow;
