import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "@tanstack/react-router";
import { Task } from "generated/client";
import { useTranslation } from "react-i18next";
import { DraggableType } from "../../../types";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import LocalizationUtils from "utils/localization-utils";
import { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { theme } from "../../../theme";

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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id ?? "",
    data: {
      draggableType: DraggableType.UNALLOCATED_TASK,
      task: task,
      index: -1,
    },
  });
  // const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
  //   id: task.id ?? "",
  //   data: {
  //     draggableType: DraggableType.UNALLOCATED_TASK,
  //     task: task,
  //     index: -1,
  //   },
  // });

  const rowStyle = useMemo(
    () => ({
      cursor: "grab",
      transform: CSS.Translate.toString(transform),
      zIndex: theme.zIndex.modal + 1000,
    }),
    [transform],
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
