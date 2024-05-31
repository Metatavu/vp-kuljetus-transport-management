import { useDraggable } from "@dnd-kit/core";
import { DragHandle } from "@mui/icons-material";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { useQueries } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Site, Task } from "generated/client";
import { useApi } from "hooks/use-api";
import { QUERY_KEYS } from "hooks/use-queries";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DraggableType } from "src/types";
import DataValidation from "src/utils/data-validation-utils";
import LocalizationUtils from "src/utils/localization-utils";

type Props = {
  tasks: Task[];
  sites: Site[];
  task: Task;
};

const DraggableUnallocatedTasksTableRow2 = ({ tasks, sites, task }: Props) => {
  const { t } = useTranslation();
  const { freightsApi, freightUnitsApi } = useApi();

  const { id, type, groupNumber, freightId, customerSiteId } = task;

  const draggableKey = useMemo(() => {
    return `${groupNumber}-${customerSiteId}-${type}`;
  }, [groupNumber, customerSiteId, type]);

  const draggableData = useMemo(
    () => ({
      draggableType: DraggableType.UNALLOCATED_TASK,
      draggedTasks: [task],
    }),
    [task],
  );

  const { attributes, listeners, setNodeRef, setActivatorNodeRef } = useDraggable({
    id: `unallocated-${draggableKey}-${id}`,
    data: draggableData,
  });

  const getDistinctFreights = () => [...new Set(tasks.map((task) => task.freightId))];

  const freightsQueries = useQueries({
    queries:
      getDistinctFreights().map((freightId) => ({
        queryKey: [QUERY_KEYS.FREIGHTS, freightId],
        queryFn: () => freightsApi.findFreight({ freightId: freightId }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const freightUnitsQueries = useQueries({
    queries:
      freightsQueries.data?.map((freight) => ({
        queryKey: [QUERY_KEYS.FREIGHT_UNITS_BY_FREIGHT, freight.id],
        queryFn: () => freightUnitsApi.listFreightUnits({ freightId: freight.id }),
      })) ?? [],
    combine: (results) => ({
      data: results.flatMap((result) => result.data).filter(DataValidation.validateValueIsNotUndefinedNorNull),
    }),
  });

  const renderFreightUnits = (freightId: string) => {
    const freightUnits = freightUnitsQueries.data?.filter((freightUnit) => freightUnit.freightId === freightId);

    return freightUnits
      ?.map((freightUnit) => freightUnit.contents)
      .filter((content) => content)
      .join(", ");
  };
  const navigate = useNavigate({ from: "/drive-planning/routes" });

  const onCellClick = (freightId: string) => navigate({ search: { freightId, date: undefined } });
  return (
    <Tooltip title={t("drivePlanning.routes.unallocatedTasksTable.taskRowTooltip")} followCursor>
      <TableRow
        ref={setNodeRef}
        sx={{
          "&:hover": {
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
          },
        }}
        onClick={() => onCellClick(freightId)}
      >
        <TableCell sx={{ minWidth: 50, maxWidth: 50 }}>
          <IconButton ref={setActivatorNodeRef} size="small" sx={{ cursor: "grab" }} {...attributes} {...listeners}>
            <DragHandle />
          </IconButton>
        </TableCell>
        <TableCell>{LocalizationUtils.getLocalizedTaskType(type, t)}</TableCell>
        <TableCell>{groupNumber}</TableCell>
        <TableCell>{freightsQueries.data?.find((freight) => freight.id === freightId)?.freightNumber}</TableCell>
        <TableCell>{sites.find((site) => site.id === customerSiteId)?.name}</TableCell>
        <TableCell>{sites.find((site) => site.id === customerSiteId)?.address}</TableCell>
        <TableCell sx={{ maxWidth: 332, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          {renderFreightUnits(freightId)}
        </TableCell>
      </TableRow>
    </Tooltip>
  );
};

export default DraggableUnallocatedTasksTableRow2;
