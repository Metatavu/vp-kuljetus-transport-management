import { ArrowForward, Remove } from "@mui/icons-material";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "api/index";
import { Site, Task, TaskType } from "generated/client";
import { QUERY_KEYS, getListFreightsQueryOptions } from "hooks/use-queries";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import LocalizationUtils from "utils/localization-utils";

type Props = {
  tasks: Task[];
  groupNumber: number;
  type: TaskType;
  site: Site;
  taskCount: number;
};

const TaskTableRow = ({ tasks, type, site, groupNumber, taskCount }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/drive-planning/routes" });
  const freightsQuery = useQuery(getListFreightsQueryOptions({ max: 100 }));
  const [menuCoordinates, setMenuCoordinates] = useState<{ clientX: number; clientY: number } | undefined>();

  const { name, address, postalCode, locality } = site;

  const saveTask = useMutation({
    mutationFn: () =>
      Promise.all(
        tasks.map((task) => {
          if (!task.id) return Promise.reject();
          return api.tasks.updateTask({ taskId: task.id, task: { ...task, routeId: undefined } });
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROUTES] });
    },
  });

  const openFreightDialog = useCallback(
    (freightId: string) => navigate({ search: (prev) => ({ ...prev, freightId: freightId }) }),
    [navigate],
  );

  const renderPopoverContent = useCallback(() => {
    return tasks.map((task) => {
      if (!task.freightId) return null;
      const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === task.freightId);

      if (!foundFreight?.id) return null;

      return (
        <ListItemButton
          key={task.id}
          onClick={() => foundFreight.id && openFreightDialog(foundFreight.id)}
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
  }, [freightsQuery.data, t, tasks, openFreightDialog]);

  const handleTableRowClick = ({ clientX, clientY }: React.MouseEvent<HTMLTableRowElement>) => {
    if (taskCount === 1) {
      const { freightId } = tasks[0];
      const foundFreight = freightsQuery.data?.freights.find((freight) => freight.id === freightId);
      if (foundFreight?.id) openFreightDialog(foundFreight.id);
    }

    if (taskCount > 1) {
      setMenuCoordinates({ clientX: clientX, clientY: clientY });
    }
  };

  return (
    <>
      <TableRow
        sx={{ "&:hover": { backgroundColor: (theme) => theme.palette.action.hover, cursor: "pointer" } }}
        onClick={handleTableRowClick}
      >
        <TableCell>{LocalizationUtils.getLocalizedTaskType(type, t)}</TableCell>
        <TableCell>{groupNumber}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          {address}, {postalCode} {locality}
        </TableCell>
        <TableCell>{taskCount}</TableCell>
        <TableCell>
          <IconButton onClick={() => saveTask.mutate()}>
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
};

export default TaskTableRow;
