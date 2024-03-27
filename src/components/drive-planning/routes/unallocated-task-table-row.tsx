import { useNavigate } from "@tanstack/react-router";
import { Task } from "generated/client";
import { useTranslation } from "react-i18next";
import { DraggableType } from "../../../types";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import LocalizationUtils from "utils/localization-utils";
import { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  task: Task;
  freightNumber: number;
  name: string;
  address: string;
  freightUnitsContents: string;
};

const UnallocatedTaskTableRow = ({ task, freightNumber, name, address, freightUnitsContents }: Props) => {
  const navigate = useNavigate({ from: "/drive-planning/routes" });
  const { t } = useTranslation();

  const draggableData = useMemo(
    () => ({
      draggableType: DraggableType.UNALLOCATED_TASK,
      draggedTasks: [task],
    }),
    [task],
  );

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id ?? "",
    data: draggableData,
  });

  const rowStyle = useMemo(
    () => ({
      cursor: "grab",
    }),
    [],
  );

  return (
    <Tooltip title="Raahaa tehtävä reitille" followCursor>
      <TableRow
        key={task.id}
        onClick={() => navigate({ search: { freightId: task.freightId, date: undefined } })}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        sx={{ ...rowStyle }}
      >
        <TableCell>{LocalizationUtils.getLocalizedTaskType(task.type, t)}</TableCell>
        <TableCell>{task.groupNumber}</TableCell>
        <TableCell>{freightNumber}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{freightUnitsContents}</TableCell>
      </TableRow>
    </Tooltip>
  );
};

export default UnallocatedTaskTableRow;
