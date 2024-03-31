import { ArrowForward, DragHandle, Remove } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  TableCell,
  TableRow,
} from "@mui/material";
import { Site, Task, TaskType } from "generated/client";
import { ForwardedRef, forwardRef, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "hooks/use-api";
import LocalizationUtils from "utils/localization-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, useFreights } from "hooks/use-queries";
import { useNavigate } from "@tanstack/react-router";

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
    const { tasksApi } = useApi();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate({ from: "/drive-planning/routes" });
    const freightsQuery = useFreights();

    const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number } | undefined>();

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
          return navigate({ search: { freightId: freightId, date: undefined } });
        }

        if (tasks.length > 1) {
          setMenuCoordinates({ clientX: clientX, clientY: clientY });
        }
      },
      [freightsQuery.data, navigate, tasks],
    );

    const saveTask = useMutation({
      mutationFn: (task: Task) => (task.id ? tasksApi.updateTask({ taskId: task.id, task: task }) : Promise.reject()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS_BY_ROUTE, tasks[0].routeId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, { assignedToRoute: false }] });
      },
    });

    const unAllocateTasks = () => {
      for (const task of tasks) {
        saveTask.mutate({ ...task, routeId: undefined, orderNumber: undefined });
      }
    };

    return (
      <>
        <TableRow ref={ref} sx={{ ...style }} onClick={handleTableRowClick}>
          <TableCell width={15} ref={setActivatorNodeRef} sx={{ cursor: "grab" }} {...rest}>
            <DragHandle />
          </TableCell>
          <TableCell>{LocalizationUtils.getLocalizedTaskType(taskType, t)}</TableCell>
          <TableCell>{groupNumber}</TableCell>
          <TableCell>{name}</TableCell>
          <TableCell>
            {address}, {postalCode} {locality}
          </TableCell>
          <TableCell>{tasks.length}</TableCell>
          <TableCell align="right">
            <IconButton sx={{ padding: 0 }} disabled={isOverlay || isDragging} onClick={unAllocateTasks}>
              <Remove />
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
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                {t("drivePlanning.routes.tasksTable.selectWaybill")}
              </ListSubheader>
            }
          >
            {renderPopoverContent()}
          </List>
        </Popover>
      </>
    );
  },
);

export default RoutesTasksTableRow;
