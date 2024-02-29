import { Collapse } from "@mui/material";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import RoutesTasksTable from "./routes-tasks-table";
import { Site, Task } from "generated/client";

type Props = GridRowProps & {
  expanded: boolean;
  tasks: Task[];
  sites: Site[];
};

const ExpandableRoutesTableRow = ({ expanded, tasks, sites, ...props }: Props) => {
  const { row } = props;
  if (!row) return null;

  const getFilteredTasks = () => tasks.filter((task) => task.routeId === row.id);

  return (
    <>
      <GridRow {...props} />
      <Collapse in={expanded}>
        <RoutesTasksTable tasks={getFilteredTasks()} sites={sites} routeId={row.id} />
      </Collapse>
    </>
  );
};

export default ExpandableRoutesTableRow;
