import { Collapse } from "@mui/material";
import DialogHeader from "components/generic/dialog-header";
import { useTranslation } from "react-i18next";
import { AssignmentSharp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Site, Task } from "generated/client";
import UnallocatedTasksTable from "./unallocated-tasks-table";

type Props = {
  open: boolean;
  sites: Site[];
  allocatedTasks: Task[];
  onClose: () => void;
};

const UnallocatedTasksDrawer = ({ open, sites, allocatedTasks, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Collapse
      in={open}
      collapsedSize={42}
      sx={{ maxHeight: "30%", overflowY: "scroll", scrollbarWidth: 0, "::-webkit-scrollbar": { display: "none" } }}
    >
      <DialogHeader
        title={t("drivePlanning.routes.unallocatedTasksTable.title")}
        StartIcon={AssignmentSharp}
        CloseIcon={open ? ExpandMore : ExpandLess}
        onClose={onClose}
      />
      <UnallocatedTasksTable sites={sites} allocatedTasks={allocatedTasks} />
    </Collapse>
  );
};

export default UnallocatedTasksDrawer;
