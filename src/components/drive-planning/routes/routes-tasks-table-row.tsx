import { ArrowForward, DragHandle, Remove } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  styled,
  TableCell,
  TableRow,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { api } from "api/index";
import type { Site, Task, TaskType } from "generated/client";
import { getListFreightsQueryOptions, QUERY_KEYS } from "hooks/use-queries";
import { type ForwardedRef, forwardRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";

const HandleCell = styled(TableCell, {
  label: "styled-empty-cell",
})(({ theme }) => ({
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius,
}));

type Props = {
  tasks: Task[];
  taskType: TaskType;
  groupNumber: number;
  site: Site;
  isDragging?: boolean;
  isOverlay?: boolean;
  style?: React.CSSProperties;
  setActivatorNodeRef?: (node: HTMLElement | null) => void;
};

const RoutesTasksTableRow = forwardRef(
  (
    {
      tasks,
      taskType,
      groupNumber,
      site,
      isDragging = false,
      isOverlay = false,
      style,
      setActivatorNodeRef,
      ...rest
    }: Props,
    ref: ForwardedRef<HTMLTableRowElement>,
  ) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate({ from: "/drive-planning/routes" });
    const freightsQuery = useQuery(getListFreightsQueryOptions({ max: 100 }));

    const { date: currentDate } = useSearch({ from: "/drive-planning/routes" });

    const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number }>();

    const { name, address, postalCode, locality } = site;

    const renderPopoverContent = useCallback(() => {
      return tasks.map((task) => {
        if (!task.freightId) return null;
        const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === task.freightId);

        if (!foundFreight?.id) return null;

        return (
          <ListItemButton
            key={task.id}
            onClick={() => navigate({ search: { freightId: foundFreight.id, date: undefined } })}
            title="Freight"
            divider
          >
            <ListItemText
              primary={t("drivePlanning.freights.dialog.title", { freightNumber: foundFreight.freightNumber })}
            />
            <ArrowForward fontSize="small" />
          </ListItemButton>
        );
      });
    }, [freightsQuery.data, navigate, t, tasks]);

    const handleTableRowClick = useCallback(
      ({ clientX, clientY, target }: React.MouseEvent<HTMLTableRowElement>) => {
        if ((target as HTMLElement).closest("button")) return;
        if (tasks.length === 1) {
          const { freightId } = tasks[0];
          const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === freightId);
          if (!foundFreight?.id) return;
          return navigate({ search: { freightId: freightId, date: currentDate } });
        }

        if (tasks.length > 1) {
          setMenuCoordinates({ clientX: clientX, clientY: clientY });
        }
      },
      [freightsQuery.data, navigate, tasks, currentDate],
    );

    const saveTask = useMutation({
      mutationFn: (task: Task) => (task.id ? api.tasks.updateTask({ taskId: task.id, task: task }) : Promise.reject()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, tasks[0].routeId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, { assignedToRoute: false }] });
      },
    });

    const unAllocateTasks = useCallback(async () => {
      for (const task of tasks) {
        await saveTask.mutateAsync({ ...task, routeId: undefined, orderNumber: undefined });
      }
    }, [tasks, saveTask]);

    return (
      <>
        <TableRow ref={ref} sx={{ ...style }} onClick={handleTableRowClick}>
          <HandleCell>
            <IconButton
              color="primary"
              ref={setActivatorNodeRef}
              sx={{ cursor: "grab" }}
              {...rest}
              size="small"
              title={t("drivePlanning.routes.unallocatedTasksTable.taskRowTooltip")}
            >
              <DragHandle />
            </IconButton>
          </HandleCell>
          <TableCell>{LocalizationUtils.getLocalizedTaskType(taskType, t)}</TableCell>
          <TableCell>{groupNumber}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell>
            {address}, {postalCode} {locality}
          </TableCell>
          <TableCell>{tasks.length}</TableCell>
          <TableCell align="center">
            <IconButton
              title={t("drivePlanning.routes.tasksTable.removeTask")}
              size="small"
              disabled={isOverlay || isDragging}
              onClick={unAllocateTasks}
            >
              <Remove color="error" />
            </IconButton>
          </TableCell>
        </TableRow>
        <Popover
          open={!!menuCoordinates}
          onClose={() => setMenuCoordinates(undefined)}
          anchorReference="anchorPosition"
          anchorPosition={{ top: menuCoordinates?.clientY ?? 0, left: menuCoordinates?.clientX ?? 0 }}
        >
          <List
            dense
            subheader={<ListSubheader component="div">{t("drivePlanning.routes.tasksTable.removeTask")}</ListSubheader>}
          >
            {renderPopoverContent()}
          </List>
        </Popover>
      </>
    );
  },
);

export default RoutesTasksTableRow;
