import { useDroppable } from "@dnd-kit/core";
import { AssignmentSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, Stack } from "@mui/material";
import DialogHeader from "components/generic/dialog-header";
import { Site } from "generated/client";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { theme } from "src/theme";
import { DraggableType, DroppableType } from "src/types";
import UnallocatedTasksTable from "./unallocated-tasks-table";

type Props = {
  open: boolean;
  sites: Site[];
  onClose: () => void;
};

const UnallocatedTasksDrawer = ({ open, sites, onClose }: Props) => {
  const { t } = useTranslation();
  const { setNodeRef, active, isOver } = useDroppable({
    id: DroppableType.UNALLOCATED_TASKS_DROPPABLE,
  });

  const { draggableType } = active?.data.current ?? {};

  const dataGridStyle = useMemo(
    () =>
      isOver && draggableType === DraggableType.GROUPED_TASK
        ? {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: "-5px",
          }
        : {},
    [draggableType, isOver],
  );

  return (
    <Collapse ref={setNodeRef} sx={{ ...dataGridStyle }} in={open} collapsedSize={42}>
      <Stack height={360}>
        <DialogHeader
          title={t("drivePlanning.routes.unallocatedTasksTable.title")}
          closeTooltip={t(`drivePlanning.routes.unallocatedTasksTable.${open ? "minify" : "expand"}TasksDrawer`)}
          StartIcon={AssignmentSharp}
          CloseIcon={open ? ExpandMore : ExpandLess}
          onClose={onClose}
        />
        <UnallocatedTasksTable sites={sites} />
      </Stack>
    </Collapse>
  );
};

export default UnallocatedTasksDrawer;
