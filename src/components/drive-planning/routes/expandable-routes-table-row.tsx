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

  const [firstColumn, _, __, fourthColumn] = props.renderedColumns;

  const getFilteredTasks = () => tasks.filter((task) => task.routeId === row.id);

  return (
    <>
      <GridRow {...props} />
      <Collapse in={expanded} sx={{ marginLeft: `${firstColumn.computedWidth}px` }}>
        <RoutesTasksTable
          tasks={getFilteredTasks()}
          sites={sites}
          smallColumnWidth={firstColumn.computedWidth}
          columnWidth={fourthColumn.computedWidth / 2}
        />
      </Collapse>
    </>
  );
};

export default ExpandableRoutesTableRow;
